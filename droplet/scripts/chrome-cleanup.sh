#!/bin/bash
# Chrome cleanup on SSH login - kills stale Chrome processes (>1 hour old)
# Agents can restart Chrome as needed
# Install: cp to /etc/profile.d/chrome-cleanup.sh

# Only run for interactive shells
[[ $- == *i* ]] || return

# Get oldest Chrome process age in seconds
CHROME_PID=$(pgrep -o chrome 2>/dev/null)
if [ -n "$CHROME_PID" ]; then
    CHROME_AGE=$(ps -o etimes= -p $CHROME_PID 2>/dev/null | tr -d " ")
    CHROME_COUNT=$(pgrep -c chrome 2>/dev/null || echo 0)
    CHROME_HOURS=$((CHROME_AGE / 3600))

    if [ "$CHROME_AGE" -gt 3600 ]; then
        echo -e "\033[33m⚠ Found $CHROME_COUNT Chrome processes (${CHROME_HOURS}h old) - cleaning up...\033[0m"
        pkill -9 chrome 2>/dev/null
        echo -e "\033[32m✓ Killed stale Chrome processes\033[0m"
    elif [ "$CHROME_COUNT" -gt 0 ]; then
        echo -e "\033[36mℹ Chrome running ($CHROME_COUNT processes, ${CHROME_HOURS}h old) - keeping active session\033[0m"
    fi
fi

# Show quick server stats
echo -e "\033[90m─────────────────────────────────────────\033[0m"
echo -e "\033[90mLoad: $(cat /proc/loadavg | cut -d' ' -f1-3) | Mem: $(free -m | awk '/Mem:/ {printf "%dMB / %dMB", $3, $2}')\033[0m"
echo -e "\033[90m─────────────────────────────────────────\033[0m"
