#!/bin/sh

tmux new-session -d 'cd ts; make dev'
tmux split-window -h 'cd py; make dev'
tmux -2 attach-session -d
