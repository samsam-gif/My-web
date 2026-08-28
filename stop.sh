#!/usr/bin/env bash
# ==========================================================
# AI COMPANY COMMAND CENTER — SHUTDOWN ENGINE
# ==========================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PID_FILE="$DIR/.app.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Gracefully stopping AI Company Command Center (PID $PID)..."
        kill -15 "$PID" || kill -9 "$PID"
        rm -f "$PID_FILE"
        echo "Command Center stopped."
    else
        echo "Process $PID is not running. Cleaning up stale PID file."
        rm -f "$PID_FILE"
    fi
else
    echo "No running Command Center PID found. Checking for port 3000 listeners..."
    fuser -k 3000/tcp 2>/dev/null || true
    echo "Services stopped."
fi
