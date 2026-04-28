import random

# si le bot il bloque faut changer tkt

def easy(legal):
	len = len(legal)
	rand = random.randint(0, len - 1)
	while (legal[rand] != True):
		rand = random.randint(0, len - 1)
	return rand
