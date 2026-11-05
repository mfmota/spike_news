import requests
import time
import random

# Ajuste a porta se necessário
BACKEND_URL = "http://localhost:8080/api/matches/internal/update"
INTERNAL_KEY = "spike-news-internal-scraper-key-2026"

def simular_jogo():
    print("🎮 Iniciando simulação de jogo AO VIVO para a apresentação...")
    
    score_casa = 0
    score_fora = 0
    
    # Simula até alguém fazer 5 pontos (para não durar muito na apresentação)
    while score_casa <= 5 and score_fora <= 5:
        payload = {
            "idExterno": "vct-apresentacao-2026",
            "timeCasa": "LOUD",
            "logoTimeCasa": "https://upload.wikimedia.org/wikipedia/commons/1/17/LOUD_LOGO.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
            "timeFora": "Sentinels",
            "logoTimeFora": "https://owcdn.net/img/62875027c8e06.png",
            "pontuacaoCasa": score_casa,
            "pontuacaoFora": score_fora,
            "status": "AO_VIVO",
            "evento": "VCT Américas - Grande Final"
        }
        
        headers = {
            "Content-Type": "application/json",
            "X-Internal-Token": INTERNAL_KEY
        }
        
        try:
            response = requests.post(BACKEND_URL, json=payload, headers=headers)
            if response.status_code == 200:
                print(f"✅ Placar enviado: LOUD {score_casa} x {score_fora} Sentinels")
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
        except Exception as e:
            print("❌ Erro ao conectar com o backend:", e)
            
        # Decide aleatoriamente quem ganha o round
        if random.choice([True, False]):
            score_casa += 1
        else:
            score_fora += 1
            
        # Pausa de 3 segundos entre os envios para você conseguir explicar o que está acontecendo
        time.sleep(3)
        
    print("🏁 Simulação finalizada!")

if __name__ == "__main__":
    simular_jogo()