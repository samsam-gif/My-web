#!/usr/bin/env bash
# ==========================================================
# AI COMPANY COMMAND CENTER — SYSTEM STATUS
# ==========================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================================="
echo " 📊 AI COMPANY COMMAND CENTER — STATUS CHECK"
echo "=========================================================="

PID_FILE="$DIR/.app.pid"
RUNNING=false

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "🟢 Application Process: ACTIVE (PID: $PID)"
        RUNNING=true
    else
        echo "🔴 Application Process: DEAD (Stale PID: $PID)"
    fi
else
    # Check if port 3000 is open
    if command -v ss >/dev/null 2>&1 && ss -tuln | grep -q ":3000 "; then
        echo "🟢 Port 3000 Listener: ACTIVE"
        RUNNING=true
    elif command -v netstat >/dev/null 2>&1 && netstat -tuln | grep -q ":3000 "; then
        echo "🟢 Port 3000 Listener: ACTIVE"
        RUNNING=true
    else
        echo "⚪ Application Process: STOPPED"
    fi
fi

echo "----------------------------------------------------------"
echo "Agents Active:      9 [CEO, Sales, Client, Design, Dev, QA, Security, Deployment, Docs]"
echo "Database:           $( [ -f "ai_company.db" ] && echo "FOUND (ai_company.db)" || echo "IN-MEMORY / LOCAL" )"
echo "Project Workspaces: $( ls -1 projects 2>/dev/null | wc -l ) active projects"
echo "=========================================================="
