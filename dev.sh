#!/bin/sh

docker-compose up -d --remove-orphans

echo "starting tmux"

tmux new -s dev -d
tmux send-keys -t dev 'cd packages/api_server && API_PORT=8000 MONGODB_URL=mongodb://localhost:27017/dp-builder pnpm start' C-m
tmux split-window -h -t dev
tmux send-keys -t dev 'cd packages/frontend && WEB_PORT=8080 API_PORT=8000 pnpm start' C-m

if [ ! -z ${1+z} ] && [ $1 = "--local" ]
then
  tmux split-window -h -t dev
  tmux send-keys -t dev 'cd packages/manager && pnpm start' C-m
# else
#   tmux split-window -h -t dev
#   tmux send-keys -t dev 'sleep 3 && ssh -t -p2251 -R 8000:localhost:8000 -L 5555:localhost:5555 admin@lnsigo.mipt.ru "/bin/bash -i -c \"cd manager && /home/admin/.local/bin/poetry run uvicorn manager.main:app --port 5555 --reload\""'
fi
tmux select-layout even-horizontal

tmux attach -t dev
