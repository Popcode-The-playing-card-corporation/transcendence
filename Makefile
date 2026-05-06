COMPOSE = docker compose -f ./srcs/docker-compose.yml

RM = rm -rf

GREEN = \033[1;32m
CYAN = \033[1;36m
YELLOW = \033[1;33m
RESET = \033[0m

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