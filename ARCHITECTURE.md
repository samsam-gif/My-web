# AI Company Command Center — Technical Architecture Blueprint

## 1. System Topology
- **Host / Gateway:** Node.js Express server + Vite middleware + WebSocket server (`ws://0.0.0.0:3000/ws`).
- **Python / FastAPI Foundation:** Modular services in `backend/` with Pydantic v2 schemas and SQLite persistence.
- **Frontend Presentation:** React 19 + Tailwind CSS + Lucide Icons + Motion Layouts.

---

## 2. Autonomous Agent Specifications
| Agent | Role | Autonomy Level | Primary Artifacts |
|---|---|---|---|
| **CEO** | Project Planning & DAG Decomposition | HIGH | `project_spec.json`, task DAG |
| **Sales** | Commercial Proposals & Deals | MEDIUM | `proposal.pdf`, pricing matrix |
| **Client** | Feedback Intake & Revision Matrix | MEDIUM | `client_feedback.md` |
| **Design** | UI/UX Wireframing & Design Tokens | HIGH | `design_tokens.json`, `wireframe_spec.md` |
| **Developer** | Full-Stack Code Construction | MEDIUM | `index.html`, `styles.css`, `app.js` |
| **QA** | Automated Unit & Regression Tests | HIGH | `qa_test_report.json` |
| **Security** | Vulnerability Audit & AST Sandbox Guard | HIGH | `security_audit_report.json` |
| **Deployment** | Artifact Packaging & Staging Release Gate | LOW (Gated) | `release_bundle.zip`, manifest |
| **Documentation** | Technical Writing & API References | HIGH | `README.md`, `USER_MANUAL.md` |

---

## 3. Security & Sandboxing Engine
1. **Workspace Boundary:** Agents strictly read/write inside `projects/<project_id>/workspace/`. Paths outside this tree are rejected with a 403 authorization error.
2. **Command Safety Engine:** Shell command AST filter rejects destructive signatures (`rm -rf /`, `mkfs`, fork bombs, raw `/dev/sda` writes).
3. **High-Risk Approval Gate:** High-risk actions (live production deployment, source deletions) pause worker execution and emit an `approval.required` event. Execution resumes only upon Owner approval.

---

## 4. Model Router
- **Hierarchy:** Google Gemini (`gemini-2.5-flash`) -> OpenAI (`gpt-4o-mini`) -> Anthropic (`claude-3-5-sonnet`) -> Built-in Fallback Heuristic Engine.
- **Zero-Config Guarantee:** If no API keys are supplied in `.env`, the system runs autonomously using deterministic structured synthesis.
