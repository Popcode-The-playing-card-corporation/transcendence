COMPOSE = docker compose -f ./srcs/docker-compose.yml --env-file "./srcs/secrets/.env"
DEV_COMPOSE = $(COMPOSE) --profile dev
PROD_COMPOSE = $(COMPOSE) --profile prod

REQUIRED_FILES_PROD := \
	./srcs/secrets/.env \
	./srcs/secrets/google_secret.txt \
	./srcs/secrets/git_secret.txt \
	./srcs/secrets/42_secret.txt \
	./srcs/secrets/django_secret.txt \
	./srcs/Docker/nginx/prod_nginx/ssl.crt \
	./srcs/Docker/nginx/prod_nginx/ssl.key

REQUIRED_FILES_DEV := \
	./srcs/secrets/.env \
	./srcs/secrets/google_secret.txt \
	./srcs/secrets/git_secret.txt \
	./srcs/secrets/42_secret.txt \
	./srcs/secrets/django_secret.txt

MISSING_FILES_PROD := $(strip $(foreach f,$(REQUIRED_FILES_PROD),$(if $(wildcard $(f)),,$(f))))

MISSING_FILES_DEV := $(strip $(foreach f,$(REQUIRED_FILES_DEV),$(if $(wildcard $(f)),,$(f))))

RESET := $(shell printf "\033[0m")
WHITE    := $(shell printf "\033[1;37m")
NC       := $(shell printf "\033[0m")
PINK     := $(shell printf "\033[1;35m")
GREEN    := $(shell printf "\033[32m")
BOLD     := $(shell printf "\033[1m")
L_PURPLE := $(shell printf "\033[38;5;55m")
YELLOW   := $(shell printf "\033[33m")
BLUE     := $(shell printf "\033[34m")
BLACK    := $(shell printf "\033[1;90m")

# Règles
all:
	@echo "Make usage:\n\nLaunch in production mode: $(GREEN)make prod\n$(RESET)Launch in developer mode: $(GREEN)make dev$(RESET)"
	@echo "\n\nDeveloper tools:\n"
	@echo "Clean up unused images/containers: $(GREEN)make clean$(RESET)"
	@echo "Force rebuild and relaunch containers: $(GREEN)make prod-build $(RESET)||$(GREEN) make dev-build\n$(RESET)Reset volumes and clean up: $(GREEN)make fclean$(RESET)"
	@echo "All of the above: $(GREEN)make prod-re$(RESET) || $(GREEN)make dev-re$(RESET)"

dev: header dev-up

prod: header prod-up

header:
	@echo "$(GREEN)"
	@echo ".------..------..------..------..------..------..------..------..------..------..------..------..------."
	@echo "|T.--. ||R.--. ||A.--. ||N.--. ||S.--. ||C.--. ||E.--. ||N.--. ||D.--. ||E.--. ||N.--. ||C.--. ||E.--. |"
	@echo "| :/\\: || :(): || (\\/) || :(): || :/\\: || :/\\: || (\\/) || :(): || :/\\: || (\\/) || :(): || :/\\: || (\\/) |"
	@echo "| (__) || ()() || :\\/: || ()() || :\\/: || :\\/: || :\\/: || ()() || (__) || :\\/: || ()() || :\\/: || :\\/: |"
	@echo "| '--'T|| '--'R|| '--'A|| '--'N|| '--'S|| '--'C|| '--'E|| '--'N|| '--'D|| '--'E|| '--'N|| '--'C|| '--'E|"
	@echo "'------''------''------''------''------''------''------''------''------''------''------''------''------'"
	@echo "BY DVAUTHEY, ATOMASI, KTINTIM-, AKABBAJ, CGOLDENS"
	@echo "$(RESET)"

prod-up:
	@if [ -n "$(MISSING_FILES_PROD)" ]; then \
		echo "❌ Missing files:"; \
		printf '%s\n' $(MISSING_FILES_PROD); \
		exit 1; \
	else \
		$(COMPOSE) --profile "*" down; \
		sed -i 's/DEBUG=True/DEBUG=False/g' ./srcs/secrets/.env; \
		echo "$(YELLOW)Launching docker container...$(RESET)"; \
		$(PROD_COMPOSE) up -d; \
		echo "$(CYAN)Launching completed!$(RESET)"; \
	fi

dev-up:
	@if [ -n "$(MISSING_FILES_DEV)" ]; then \
		echo "❌ Missing files:"; \
		printf '%s\n' $(MISSING_FILES_DEV); \
		exit 1; \
	else \
		$(COMPOSE) --profile "*" down; \
		sed -i 's/DEBUG=True/DEBUG=False/g' ./srcs/secrets/.env; \
		echo "$(YELLOW)Launching docker container...$(RESET)"; \
		$(DEV_COMPOSE) up -d; \
		echo "$(CYAN)Launching completed!$(RESET)"; \
	fi

down:
	@echo "$(YELLOW)Stopping docker container...$(RESET)"
	@$(COMPOSE) --profile "*" down
	@echo "$(CYAN)Stopped!$(RESET)"

clean:
	@echo "Cleaning up images and containers.."
	@$(COMPOSE) --profile "*" down --rmi local --remove-orphans

fclean:
	@echo "Cleaning up images and containers.."
	@echo "Clearing volumes.."
	@$(COMPOSE) --profile "*" down -v --rmi local --remove-orphans

prod-build: down
	@$(COMPOSE) build --no-cache django
	@$(PROD_COMPOSE) build --no-cache nginx_prod
	@$(MAKE) prod-up

dev-build: down
	@$(COMPOSE) build --no-cache django
	@$(COMPOSE) build --no-cache frontend
	@$(MAKE) dev-up

prod-re: fclean prod-up

dev-re: fclean dev-up 

.PHONY: all prod-up dev-up down clean fclean prod-re dev-re header prod-build dev-build
