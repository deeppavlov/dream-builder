# DP-Builder

DP-Builder is a graphical interface for creating and configuring multi-skill AI assistants, built on top of DeepPavlov

## Repository structure

```
/
├─ py/          - python packages
│  ├─ server/   - API backend
├─ ts/          - PNPM workspace with TypeScript packages
│  ├─ packages/
│  │  ├─ web/   - web frontend
```

## Building

Requirements:
 - GNU Make
 - Node 16+
 - Python 3.9+
 - [pnpm](https://pnpm.io)
 - [poetry](https://python-poetry.org/)

To run a local development version at http://localhost:8080:
```
make dev
```

To run tests
```
make test
```

To create a production build:
```
make
```
