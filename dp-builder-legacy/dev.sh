#!/bin/sh

# docker-compose up -d --remove-orphans

echo "starting tmux"

tmux new -s dev -d
tmux send-keys -t dev 'cd packages/api_server && API_PORT=8000 pnpm run dev' C-m
tmux split-window -h -t dev
tmux send-keys -t dev 'cd packages/frontend && WEB_PORT=8080 API_PORT=8000 pnpm start' C-m

tmux select-layout even-horizontal

tmux attach -t dev
