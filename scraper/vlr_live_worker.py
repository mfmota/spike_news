"""
Worker RF02 - Monitor de Placares ao Vivo (VLR.gg)
Responsável por coletar periodicamente o status e placar de partidas do portal VLR.gg
e notificar o backend Spring Boot via webhook interno sempre que houver atualizações.
"""

import os
import re
import sys
import time
import signal
import logging
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Carrega variáveis de ambiente de um arquivo .env se presente
load_dotenv()

# ==============================================================================
# CONFIGURAÇÃO DE LOGGING
# ==============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("VLRWorker")

# ==============================================================================
# MODELO DE DADOS (DTO)
# ==============================================================================
@dataclass
class MatchDTO:
    match_id: str
    match_url: str
    team_home: str
    team_away: str
    score_home: Optional[int]
    score_away: Optional[int]
    status: str  # ex: "LIVE", "UPCOMING", "COMPLETED"
    eta_or_time: str
    tournament_name: str
    tournament_stage: str

    def get_state_key(self) -> str:
        """Gera uma chave única de estado para identificar mudanças no placar ou status."""
        return f"{self.status}|{self.score_home}|{self.score_away}"


# ==============================================================================
# PARSER & SCRAPER VLR.GG
# ==============================================================================
class VLRScraper:
    BASE_URL = "https://www.vlr.gg"
    MATCHES_URL = f"{BASE_URL}/matches"

    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    def __init__(self, session: requests.Session):
        self.session = session

    def fetch_matches(self) -> List[MatchDTO]:
        """Realiza a raspagem da listagem de partidas do VLR.gg."""
        try:
            response = self.session.get(
                self.MATCHES_URL,
                headers=self.HEADERS,
                timeout=12
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.error("Falha ao consultar VLR.gg: %s", exc)
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        match_items = soup.find_all("a", class_="match-item")

        parsed_matches: List[MatchDTO] = []
        for item in match_items:
            try:
                match_dto = self._parse_match_element(item)
                if match_dto:
                    parsed_matches.append(match_dto)
            except Exception as parse_err:
                logger.debug("Erro ao fazer parse de item individual: %s", parse_err)
                continue

        return parsed_matches

    def _parse_match_element(self, element) -> Optional[MatchDTO]:
        href = element.get("href", "")
        # Extrai o ID da partida da URL (ex: /12345/loud-vs-fnatic -> '12345')
        match_id_match = re.search(r"^/(\d+)/?", href)
        match_id = match_id_match.group(1) if match_id_match else href.strip("/")

        if not match_id:
            return None

        # Nomes das equipes
        teams = element.find_all("div", class_="match-item-vs-team-name")
        if len(teams) < 2:
            return None

        team_home = teams[0].get_text(strip=True)
        team_away = teams[1].get_text(strip=True)

        # Placares das equipes
        scores = element.find_all("div", class_="match-item-vs-team-score")
        score_home = self._safe_int(scores[0].get_text(strip=True)) if len(scores) > 0 else None
        score_away = self._safe_int(scores[1].get_text(strip=True)) if len(scores) > 1 else None

        # Status / ETA
        eta_elem = element.find("div", class_="match-item-eta")
        raw_eta = eta_elem.get_text(strip=True) if eta_elem else ""

        # Detecção de status
        is_live = bool(element.find("div", class_="mod-live")) or "LIVE" in raw_eta.upper()
        if is_live:
            status = "LIVE"
        elif "ago" in raw_eta.lower() or "final" in raw_eta.lower():
            status = "COMPLETED"
        else:
            status = "UPCOMING"

        # Torneio e Etapa
        event_elem = element.find("div", class_="match-item-event")
        tournament_name = ""
        tournament_stage = ""
        if event_elem:
            series_elem = event_elem.find("div", class_="match-item-event-series")
            tournament_stage = series_elem.get_text(strip=True) if series_elem else ""

            if series_elem:
                series_elem.decompose()
            tournament_name = event_elem.get_text(strip=True)

        return MatchDTO(
            match_id=match_id,
            match_url=f"{self.BASE_URL}{href}",
            team_home=team_home,
            team_away=team_away,
            score_home=score_home,
            score_away=score_away,
            status=status,
            eta_or_time=raw_eta,
            tournament_name=tournament_name,
            tournament_stage=tournament_stage,
        )

    @staticmethod
    def _safe_int(value: str) -> Optional[int]:
        val_clean = re.sub(r"[^\d]", "", value)
        return int(val_clean) if val_clean.isdigit() else None


# ==============================================================================
# CLIENTE DE INTEGRAÇÃO COM O BACKEND SPRING BOOT
# ==============================================================================
class BackendIntegrationClient:
    def __init__(self, base_url: str, session: requests.Session):
        self.endpoint_url = f"{base_url.rstrip('/')}/api/internal/matches/update"
        self.session = session

    def notify_match_update(self, match: MatchDTO) -> bool:
        """Envia o payload da partida atualizada para a API interna do Spring Boot."""
        payload = asdict(match)
        try:
            response = self.session.post(
                self.endpoint_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            if response.status_code in (200, 201, 204):
                logger.info(
                    "✅ [SYNC SPRING BOOT] ID: %s | %s [%s] x [%s] %s | Status: %s",
                    match.match_id,
                    match.team_home,
                    match.score_home if match.score_home is not None else "-",
                    match.score_away if match.score_away is not None else "-",
                    match.team_away,
                    match.status
                )
                return True
            else:
                logger.warning(
                    "⚠️ Falha na resposta do Spring Boot. HTTP %d: %s",
                    response.status_code,
                    response.text[:200]
                )
                return False
        except requests.RequestException as err:
            logger.error("❌ Não foi possível conectar ao Spring Boot (%s): %s", self.endpoint_url, err)
            return False


# ==============================================================================
# ORQUESTRADOR DO WORKER COM LOOP PERIÓDICO E DIFF DE ESTADO
# ==============================================================================
class VLRMatchWorker:
    def __init__(
        self,
        backend_url: str = "http://localhost:8080",
        poll_interval_seconds: int = 15,
        only_live_matches: bool = True
    ):
        self.poll_interval = poll_interval_seconds
        self.only_live_matches = only_live_matches
        self._running = False
        self._state_cache: Dict[str, str] = {}

        # Sessão resiliente com política de repetição automática
        self.session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS", "POST"]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        self.scraper = VLRScraper(self.session)
        self.client = BackendIntegrationClient(backend_url, self.session)

    def start(self):
        """Inicia a execução contínua com tratamento para encerramento gracioso."""
        self._running = True
        signal.signal(signal.SIGINT, self._handle_exit)
        signal.signal(signal.SIGTERM, self._handle_exit)

        logger.info("==========================================================")
        logger.info("🚀 RF02 Worker VLR.gg iniciado com sucesso!")
        logger.info("📡 Destino Backend: %s", self.client.endpoint_url)
        logger.info("⏱️ Intervalo de Polling: %d segundos", self.poll_interval)
        logger.info("🎯 Modo: %s", "Apenas Partidas AO VIVO" if self.only_live_matches else "Todas as Partidas")
        logger.info("==========================================================")

        while self._running:
            try:
                self._run_cycle()
            except Exception as e:
                logger.exception("Erro não tratado durante o ciclo de scraping: %s", e)

            # Aguarda próximo ciclo com verificação periódica de cancelamento
            for _ in range(self.poll_interval):
                if not self._running:
                    break
                time.sleep(1)

        logger.info("🛑 Worker finalizado graciosamente.")

    def _run_cycle(self):
        matches = self.scraper.fetch_matches()
        if not matches:
            return

        target_matches = [
            m for m in matches
            if (not self.only_live_matches) or (m.status == "LIVE")
        ]

        logger.info("🔍 Varredura concluída: %d partidas no portal (%d elegíveis).", len(matches), len(target_matches))

        updated_count = 0
        for match in target_matches:
            current_state = match.get_state_key()
            previous_state = self._state_cache.get(match.match_id)

            # Notifica o backend apenas se o placar ou status mudou (ou primeira vez visto)
            if previous_state != current_state:
                if self.client.notify_match_update(match):
                    self._state_cache[match.match_id] = current_state
                    updated_count += 1

        if updated_count == 0 and target_matches:
            logger.info("ℹ️ Nenhuma alteração de placar/status detectada nesta rodada.")

    def _handle_exit(self, signum, frame):
        logger.info("Sinal de interrupção (%s) recebido. Finalizando worker...", signum)
        self._running = False


# ==============================================================================
# EXECUÇÃO PRINCIPAL
# ==============================================================================
if __name__ == "__main__":
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8080")
    poll_interval = int(os.getenv("POLL_INTERVAL_SECONDS", "15"))
    only_live = os.getenv("ONLY_LIVE_MATCHES", "true").lower() in ("true", "1", "yes")

    worker = VLRMatchWorker(
        backend_url=backend_url,
        poll_interval_seconds=poll_interval,
        only_live_matches=only_live
    )
    worker.start()

