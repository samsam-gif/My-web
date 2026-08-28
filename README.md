# 🚀 AI COMPANY COMMAND CENTER

**Autonomous Multi-Agent Enterprise Operations & Telemetry System**  
Designed for Kali Linux & Cloud Container Environments, Mobile-Ready for Android.

---

## 👑 Executive Summary
The **AI Company Command Center** empowers the Owner (CEO) to autonomously orchestrate an enterprise-grade software development company composed of 9 specialized AI backend worker agents:
- 👑 **CEO Agent:** Strategic project decomposition, DAG planning, and pipeline coordination.
- 💼 **Sales Agent:** Commercial proposals, pricing matrices, and lead qualifications.
- 🤝 **Client Agent:** Client feedback intake and requirement specifications.
- 🎨 **Design Agent:** UI/UX wireframes, style tokens, and layout specifications.
- 💻 **Developer Agent:** Full-stack code construction and component builds.
- 🧪 **QA Agent:** Automated unit testing, DOM audits, and regression gates.
- 🛡️ **Cybersecurity Officer:** AST command validation, OWASP static audit, and sandbox isolation.
- 🚀 **Deployment Agent:** Production artifact packaging and staging release gates.
- 📑 **Documentation Agent:** API references, user manuals, and architectural diagrams.

---

## 🏗️ Core Architecture & Source of Truth
The **Backend is the single source of truth**. All worker routines, task dependencies, permissions, and database operations execute autonomously on the backend and persist state to disk (`ai_company.db` / `ai_company_store.json`), allowing workers to continue uninterrupted even when browser sessions or mobile apps disconnect.

```
                         👑 OWNER / CEO
                                │
                                ▼
                        OPERATIONS DASHBOARD
                   (React Web / Native Android)
                                │
                            REST / WS
                                │
                                ▼
                        UNIFIED API ENGINE
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   TASK QUEUE              MODEL ROUTER            APPROVALS
   (DAG Engine)           (Gemini/Claude/GPT)     (Governance)
        │                       │                       │
        ▼                       ▼                       ▼
 BACKGROUND WORKERS         EXTERNAL APIs          PERMISSIONS
  (9 Autonomous)         (No-Provider Fallback)    (AST Sandbox)
        │
 ┌──────┼────────┬──────────┬─────────┐
 ▼      ▼        ▼          ▼         ▼
CEO   DESIGN    DEV        QA     SECURITY
                                      │
                                      ▼
                                  DEPLOYMENT
                                      │
                                      ▼
                                  DELIVERY
```

---

## ⚡ Quick Start on Kali Linux / Linux / Containers

### 1. Prerequisites (Safe Check)
Assume clean Linux with Python 3 and Node.js:
```bash
python3 --version
node --version
npm --version
```

### 2. Startup Command
```bash
cd ai-company
./start.sh
```

### 3. Service Status Check
```bash
./status.sh
```

### 4. Graceful Shutdown
```bash
./stop.sh
```

---

## 🤖 External AI Provider & No-Ollama Enforcement
- **Absolute Rule #3 Enforcement:** No Ollama daemon or local heavy models are used.
- **Model Router:** Connects to external cloud APIs via `.env`:
  - `GEMINI_API_KEY`: Google Gemini Flash / Pro
  - `OPENAI_API_KEY`: GPT-4o / GPT-4o-mini
  - `ANTHROPIC_API_KEY`: Claude 3.5 Sonnet
- **No-Provider Fallback:** If no API key is provided, the application runs seamlessly in **Autonomous Heuristic Fallback Mode**, synthesizing structured task outputs without interruption.

---

## 🧪 Automated Testing
Run the comprehensive Python test suite:
```bash
python3 -m unittest discover -s tests -v
```

Verified Test Modules:
- `test_database.py`: ACID persistence, transactional projects, tasks, and approval requests.
- `test_task_engine.py`: Dependency graph resolution, DAG transitions, and retry limit ceiling (max 3).
- `test_permissions.py`: AST dangerous command rejection (`rm -rf /`, fork-bombs), risk level classification, and workspace path sandboxing.
- `test_e2e_workflow.py`: End-to-end autonomous pipeline test ("Create a simple landing page for a mobile repair shop").

---

## 📱 Mobile-Ready Android Integration Roadmap
The backend APIs are 100% client-agnostic and mobile-ready:
1. **Authentication:** `POST /api/auth/login` yields a Bearer JWT token.
2. **Telemetry Stream:** `ws://<HOST>:3000/ws` streams real-time agent state changes (`agent.started`, `task.completed`, `approval.required`).
3. **CEO Commands:** `POST /api/projects` with `{ "command": "..." }` triggers autonomous company execution.
4. **Owner Governance:** `POST /api/approvals/{id}/approve` authorizes live releases directly from the mobile app.
5. **Worker Isolation:** Mobile client contains zero worker or AI business logic; acts purely as a remote monitor and approval terminal.
