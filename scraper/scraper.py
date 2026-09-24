import requests
from bs4 import BeautifulSoup
import json
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080/api/matches/internal/update")
INTERNAL_KEY = os.getenv("INTERNAL_API_KEY", "spike-news-internal-scraper-key-2026")

def send_update_to_backend(item_partida: dict):
    """Sincroniza a partida individual no backend Spring Boot do Spike News"""
    try:
        # Mapeamento do tipo para o enum de status do backend
        tipo = item_partida.get("tipo", "UPCOMING")
        if tipo == "LIVE":
            status_enum = "AO_VIVO"
        elif tipo == "RECENT":
            status_enum = "FINALIZADO"
        else:
            status_enum = "AGENDADO"

        placar_casa = item_partida["placarCasa"]
        placar_fora = item_partida["placarFora"]

        score_home = int(placar_casa) if str(placar_casa).isdigit() else 0
        score_away = int(placar_fora) if str(placar_fora).isdigit() else 0

        payload = {
            "timeCasa": item_partida["timeCasa"],
            "logoTimeCasa": "",
            "timeFora": item_partida["timeFora"],
            "logoTimeFora": "",
            "pontuacaoCasa": score_home,
            "pontuacaoFora": score_away,
            "status": status_enum,
            "evento": item_partida.get("campeonato", "VCT")
        }

        headers = {
            "Content-Type": "application/json",
            "X-Internal-Token": INTERNAL_KEY
        }
        requests.post(BACKEND_URL, json=payload, headers=headers, timeout=3)
    except Exception:
        # Se o backend estiver offline em teste local, ignora silenciosamente
        pass

def extrair_todas_partidas_vlr():
    url = "https://www.vlr.gg/matches"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        matches = soup.find_all('a', class_='match-item')
        
        jogos_ao_vivo = []
        proximos_jogos = []
        resultados_recentes = []

        for match in matches:
            teams = match.find_all('div', class_='match-item-vs-team-name')
            scores = match.find_all('div', class_='match-item-vs-team-score')
            eta = match.find('div', class_='match-item-eta')
            event = match.find('div', class_='match-item-event')

            if len(teams) >= 2 and len(scores) >= 2:
                time_casa = teams[0].get_text(strip=True)
                time_fora = teams[1].get_text(strip=True)
                placar_casa = scores[0].get_text(strip=True)
                placar_fora = scores[1].get_text(strip=True)
                status_tempo = eta.get_text(strip=True) if eta else "N/A"
                campeonato = event.get_text(strip=True) if event else "N/A"

                # 1. Checa se o jogo está AO VIVO (classe 'mod-live' ou texto 'LIVE')
                classes_match = match.get('class', [])
                eh_ao_vivo = 'mod-live' in classes_match or 'LIVE' in status_tempo.upper()

                # 2. Checa se é resultado finalizado
                eh_resultado = placar_casa.isdigit() and placar_fora.isdigit() and not eh_ao_vivo

                item_partida = {
                    "campeonato": campeonato,
                    "timeCasa": time_casa,
                    "placarCasa": placar_casa if (eh_resultado or eh_ao_vivo) else "-",
                    "timeFora": time_fora,
                    "placarFora": placar_fora if (eh_resultado or eh_ao_vivo) else "-",
                    "statusTempo": status_tempo
                }

                if eh_ao_vivo:
                    item_partida["tipo"] = "LIVE"
                    jogos_ao_vivo.append(item_partida)
                elif eh_resultado:
                    item_partida["tipo"] = "RECENT"
                    resultados_recentes.append(item_partida)
                else:
                    item_partida["tipo"] = "UPCOMING"
                    proximos_jogos.append(item_partida)

                # Dispara sincronização com o backend
                send_update_to_backend(item_partida)

        dados_finais = {
            "jogosAoVivo": jogos_ao_vivo,
            "proximosJogos": proximos_jogos,
            "resultadosRecentes": resultados_recentes
        }

        print(json.dumps(dados_finais, indent=4, ensure_ascii=False))
        return dados_finais

    except Exception as e:
        print(f"Erro ao realizar raspagem: {e}")

if __name__ == "__main__":
    extrair_todas_partidas_vlr()
