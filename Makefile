.PHONY: help verify check web-install web-build web api clip

help:
	@echo 'make verify      Verify all imported repositories, branches and snapshot trees'
	@echo 'make check       Run import verification, Python syntax checks and secret scan'
	@echo 'make web-install Install locked frontend dependencies'
	@echo 'make web-build   Build the React frontend'
	@echo 'make web         Start the frontend on port 3000'
	@echo 'make api         Start the API on port 7000 (install requirements/api.txt first)'
	@echo 'make clip        Start the CLIP index service on port 13131'

verify:
	python3 scripts/verify_import.py

check: verify
	python3 scripts/check_repository.py

web-install:
	npm ci --prefix apps/web --ignore-scripts --no-audit --no-fund

web-build:
	npm run build --prefix apps/web

web:
	npm start --prefix apps/web

api:
	bash scripts/run-api.sh

clip:
	bash scripts/run-clip.sh
