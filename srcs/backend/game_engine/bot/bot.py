from .easy import easy
from .medium import medium
from .hard import hard

def bot(data: dict, idPlayer, legal, difficulty="medium"):

	if (difficulty == "easy"):
		return easy(legal)
	
	if (difficulty == "medium"):
		return medium(data, idPlayer, legal)
	
	if (difficulty == "hard"):
		return hard(data, idPlayer, legal)
