# ===== Environment Setup =====
setup-env:
	@echo "# Auto-generated Docker environment" > .env
	@if [ "$(shell uname -m)" = "arm64" ]; then \
		echo "DOCKER_PLATFORM=linux/amd64" >> .env; \
		echo "TARGETARCH=arm64" >> .env; \
		echo "# Detected ARM architecture (M1/M2)" >> .env; \
	else \
		echo "# Using native x86 architecture" >> .env; \
	fi

# ===== Docker Commands =====
up: setup-env
	docker-compose up --build

frontend: setup-env
	docker-compose up frontend

backend: setup-env
	docker-compose up backend

down:
	docker-compose down

clean: down
	docker-compose down -v --rmi all  # Only affects current project

# ===== Shortcuts =====
logs:
	docker-compose logs -f

ps:
	docker-compose ps

# ===== Help =====
help:
	@echo "Available commands:"
	@echo "  make up      - Build and start containers"
	@echo "  make down    - Stop containers"
	@echo "  make clean   - Stop and remove everything"
	@echo "  make logs    - Show container logs"
	@echo "  make ps      - List running containers"