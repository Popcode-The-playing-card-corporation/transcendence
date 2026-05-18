COMPOSE = docker compose -f ./srcs/docker-compose.yml

RM = rm -rf

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
all: header up

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


up:
	@if [ -f ./srcs/.env ]; then \
		echo "$(YELLOW)Launching docker container...$(RESET)"; \
		$(COMPOSE) up -d; \
		echo "$(CYAN)Launching completed!$(RESET)"; \
	else \
		echo "❌ Missing ./srcs/.env file"; \
	fi
	

down:
	@echo "$(YELLOW)Stopping docker container...$(RESET)"
	@$(COMPOSE) down
	@echo "$(CYAN)Stopped!$(RESET)"

clean:
	@echo "Removing containers..."
	@$(COMPOSE) down

fclean: clean
	@docker volume rm -f srcs_db_data || true

re: down fclean up

.PHONY: all up down clean fclean re header
