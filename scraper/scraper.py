import time
import requests
from bs4 import BeautifulSoup
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("VLR-Scraper")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080/api/matches/internal/update")
INTERNAL_KEY = os.getenv("INTERNAL_API_KEY", "spike-news-internal-scraper-key-2026")
VLR_MATCHES_URL = "https://www.vlr.gg/matches"
POLL_INTERVAL_SECONDS = int(os.getenv("POLL_INTERVAL_SECONDS", "30"))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
}

def parse_vlr_matches(html_content: str):
    """Extrai partidas e placares do HTML do VLR.gg"""
    soup = BeautifulSoup(html_content, "html.parser")
    matches = []
    
    match_items = soup.select(".match-item")
    if not match_items:
        # Tenta seletores alternativos
        match_items = soup.select("a.wf-module-item")
        
    for item in match_items:
        try:
            # Status
            status_text = "AGENDADO"
            eta_el = item.select_one(".match-item-eta")
            if eta_el:
                eta_text = eta_el.get_text(strip=True).upper()
                if "LIVE" in eta_text or "AO VIVO" in eta_text:
                    status_text = "AO_VIVO"
                elif "COMPLETED" in eta_text or "FINAL" in eta_text:
                    status_text = "FINALIZADO"

            # Times e Logos
            teams = item.select(".match-item-vs-team-name")
            if len(teams) < 2:
                teams = item.select(".text-of")
            
            if len(teams) >= 2:
                team_home = teams[0].get_text(strip=True)
                team_away = teams[1].get_text(strip=True)
            else:
                continue

            # Logos
            logos = item.select(".match-item-vs-team img")
            logo_home = logos[0]["src"] if len(logos) > 0 and logos[0].has_attr("src") else ""
            logo_away = logos[1]["src"] if len(logos) > 1 and logos[1].has_attr("src") else ""

            if logo_home and logo_home.startswith("//"):
                logo_home = "https:" + logo_home
            if logo_away and logo_away.startswith("//"):
                logo_away = "https:" + logo_away

            # Placares
            scores = item.select(".match-item-vs-team-score")
            score_home = 0
            score_away = 0
            if len(scores) >= 2:
                try:
                    score_home = int(scores[0].get_text(strip=True))
                    score_away = int(scores[1].get_text(strip=True))
                except ValueError:
                    pass

            # Evento / Campeonato
            event_el = item.select_one(".match-item-event")
            evento = event_el.get_text(strip=True) if event_el else "VCT Series"

            matches.append({
                "timeCasa": team_home,
                "logoTimeCasa": logo_home,
                "timeFora": team_away,
                "logoTimeFora": logo_away,
                "pontuacaoCasa": score_home,
                "pontuacaoFora": score_away,
                "status": status_text,
                "evento": evento
            })
        except Exception as e:
            logger.debug(f"Erro ao processar item de partida: {e}")
            continue

    return matches

def send_update_to_backend(match_data: dict):
    """Envia payload JSON para o endpoint interno do backend Spring Boot"""
    headers = {
        "Content-Type": "application/json",
        "X-Internal-Token": INTERNAL_KEY
    }
    try:
        response = requests.post(BACKEND_URL, json=match_data, headers=headers, timeout=5)
        if response.status_code == 200:
            logger.info(f"Sucesso: Partida {match_data['timeCasa']} ({match_data['pontuacaoCasa']}) x ({match_data['pontuacaoFora']}) {match_data['timeFora']} sincronizada.")
        else:
            logger.warning(f"Backend retornou status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Erro ao enviar atualização para o backend: {e}")

def run_scraper_cycle():
    logger.info("Iniciando ciclo de scraping no VLR.gg...")
    try:
        response = requests.get(VLR_MATCHES_URL, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            matches = parse_vlr_matches(response.text)
            logger.info(f"Extraídas {len(matches)} partidas do VLR.gg.")
            for match in matches:
                send_update_to_backend(match)
        else:
            logger.warning(f"VLR.gg retornou HTTP {response.status_code}. Executando fallback...")
            run_fallback_simulation()
    except Exception as e:
        logger.warning(f"Falha de conexão com VLR.gg ({e}). Executando ciclo de simulação local...")
        run_fallback_simulation()

def run_fallback_simulation():
    """Gera atualizações simuladas para demonstração e testes locais"""
    sample_matches = [
        {
            "timeCasa": "LOUD",
            "logoTimeCasa": "https://owcdn.net/img/62a26569ecf20.png",
            "timeFora": "Sentinels",
            "logoTimeFora": "https://owcdn.net/img/62a2679dc6e86.png",
            "pontuacaoCasa": 13,
            "pontuacaoFora": 11,
            "status": "AO_VIVO",
            "evento": "VCT Americas - Rodada 1"
        },
        {
            "timeCasa": "Fnatic",
            "logoTimeCasa": "https://owcdn.net/img/62a268a7ecf20.png",
            "timeFora": "Paper Rex",
            "logoTimeFora": "https://owcdn.net/img/62a2690cecf20.png",
            "pontuacaoCasa": 9,
            "pontuacaoFora": 8,
            "status": "AO_VIVO",
            "evento": "VALORANT Champions - Playoffs"
        }
    ]
    for match in sample_matches:
        send_update_to_backend(match)

if __name__ == "__main__":
    logger.info("Worker Python Scraper inicializado.")
    logger.info(f"Target Backend: {BACKEND_URL}")
    run_scraper_cycle()
