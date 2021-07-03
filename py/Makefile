RUN_IN_ALL_DIRS=../tools/run-in-all-dirs.sh

.PHONY: install
install:
	$(RUN_IN_ALL_DIRS) poetry install

.PHONY: dev
dev:
	cd server; poetry run uvicorn main:app --reload

.PHONY: test
test:
	@echo "No tests"

