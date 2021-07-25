#!/bin/sh

docker-compose up -d --remove-orphans

echo "starting tmux"

tmux new -s dev -d
tmux send-keys -t dev 'cd packages/api_server && API_PORT=8000 MONGODB_URL=mongodb://localhost:27017/dp-builder pnpm start' C-m
tmux split-window -h -t dev
tmux send-keys -t dev 'cd packages/frontend && WEB_PORT=8080 API_PORT=8000 pnpm start' C-m

if [ $1 == "--local" ]
then
  tmux split-window -h -t dev
  tmux send-keys -t dev 'cd packages/manager && pnpm start' C-m
  tmux select-layout even-horizontal
fi

tmux attach -t dev
