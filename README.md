# 🎮 Spike News — Plataforma de Esports & VALORANT em Tempo Real

Plataforma completa de cobertura jornalística, catálogo oficial de assets e placares em tempo real para **VALORANT Esports (VCT)**.

Desenvolvida seguindo a arquitetura especificada no **Master Plan** (`00` a `07`).

---

## 🏗️ Arquitetura do Sistema

```
spike_news/
├── backend/            # Spring Boot 3.3.4 (Java 17/25) + SQLite (WAL Mode) + Spring Security (JWT)
├── frontend/           # Next.js 14 App Router + TypeScript + Tailwind CSS + Material UI (SSE Listener)
├── scraper/            # Worker Python (BeautifulSoup4 + Requests + Schedule) sincronizando VLR.gg
└── README.md           # Documentação completa de execução
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- **Java 17+** (configurado no PATH ou JDK instalado)
- **Maven 3.8+**
- **Node.js 18+** e **npm**
- **Python 3.10+**

---

### 2. Executando o Backend (Spring Boot + SQLite)

O backend utiliza SQLite com modo WAL (`journal_mode=WAL`) para alta performance e concorrência:

```bash
cd backend
mvn spring-boot:run
```

O servidor iniciará em `http://localhost:8080`.
- **Carga de Dados Automática**: O `DataInitializer` cria os usuários padrão (`admin@spikenews.gg`, `jornalista@spikenews.gg`, `user@spikenews.gg` - senha: `admin123` / `jornalista123` / `user123`), times e notícias iniciais.
- **Catálogo Valorant**: Sincroniza automaticamente os agentes, mapas e armas de `valorant-api.com` no startup.

---

### 3. Executando o Worker Scraper (Python)

O worker monitora as partidas em tempo real no VLR.gg e envia os placares via webhook interno com token de segurança:

```bash
cd scraper
# Ativar o ambiente virtual (já configurado em scraper/.venv)
.venv\Scripts\activate

# Executar o scraper
python scraper.py
```

---

### 4. Executando o Frontend (Next.js)

```bash
cd frontend
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🎯 Funcionalidades Implementadas

| Módulo | Descrição |
|---|---|
| **Placares em Tempo Real (SSE)** | Conexão `EventSource` (`/api/matches/stream`) atualizando placares instantaneamente na tela sem refresh. |
| **Feed de Notícias & SSR** | Listagem pública com paginação, filtros por times (LOUD, Sentinels, Fnatic, Paper Rex) e página de detalhe. |
| **Painel do Jornalista** | Área restrita para publicação, edição e exclusão de matérias por jornalistas (`Role.JORNALISTA` e `Role.ADMIN`). |
| **Exportação de Relatórios CSV** | Exportação pública de estatísticas e exportação restrita de matérias do jornalista via OpenCSV. |
| **Catálogo de Assets Valorant** | Consulta de agentes (com roles e portraits), mapas com coordenadas e arsenal completo de armas. |
| **Motor de Preferências & Alertas** | Torcedores se inscrevem em alertas para seus times favoritos (Jogos, Notícias ou Ambos). |

---

## 🔑 Credenciais de Teste

| Perfil | Email | Senha | Acesso |
|---|---|---|---|
| **Jornalista** | `jornalista@spikenews.gg` | `jornalista123` | Painel de Redação, Publicação & CSV |
| **Admin** | `admin@spikenews.gg` | `admin123` | Acesso Total |
| **Torcedor / Usuário** | `user@spikenews.gg` | `user123` | Leitura & Preferências de Alertas |

---

## 🧪 Testes Automatizados

Para rodar a suíte de testes de integração e unitários do backend:
```bash
cd backend
mvn test
```

Para validar a compilação de produção do frontend:
```bash
cd frontend
npm run build
```
