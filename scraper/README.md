# Worker de Scraping de Partidas (RF02) - Spike News

Worker em Python desenvolvido para coletar placares e status de partidas de Valorant no portal [VLR.gg](https://www.vlr.gg/matches) e sincronizar em tempo real com o backend Spring Boot.

## 🚀 Como Executar

### 1. Criar e ativar o ambiente virtual (Recomendado)
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / MacOS
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

### 3. Configuração (.env)
Copie o arquivo `.env.example` para `.env` se desejar customizar os parâmetros:
```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `BACKEND_URL` | `http://localhost:8080` | URL base do backend Spring Boot |
| `POLL_INTERVAL_SECONDS` | `15` | Intervalo em segundos entre cada varredura no portal |
| `ONLY_LIVE_MATCHES` | `false` | Se `true`, sincroniza apenas partidas `LIVE` |

### 4. Executar o worker
```bash
python vlr_live_worker.py
```

