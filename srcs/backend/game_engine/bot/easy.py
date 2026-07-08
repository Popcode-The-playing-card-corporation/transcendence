import random

def easy(legal):
	lens = len(legal)
	rand = random.randint(0, lens - 1)
	while (not legal[rand]):
		rand = random.randint(0, lens - 1)
	return rand
