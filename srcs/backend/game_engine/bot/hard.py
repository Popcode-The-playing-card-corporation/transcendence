from medium import takeFold
from ..card import Card

tricksValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}

def splithand(data, idPlayer, legal):
	playable = []
	tricks = data["tricks"]
	fold = data["board"].copy()
	asked = fold.pop("asked")

	i = 0
	while (i < len(legal)):
		if (legal[i]):
			playable.append(data["players"][idPlayer]["cards"][i])
		i += 1

	take = []
	dontTake = []
	for c in playable:
		if (takeFold(fold, asked, tricks, c)):
			take.append(c)
		else:
			dontTake.append(c)

	return take, dontTake

def Tricks(data: dict, tricks: str):
	played = []
	playedTricks = 0

	for p in data["players"]:
		for c in p["taken"]:
			if (c["color"] == tricks):
				playedTricks += 1
				played.append(Card(c["value"], c["color"]))
	
	played = sorted(played)
	
	first = "none1" 
	second = "none2"
	for v in tricksValue.keys():
		if (Card(v, tricks) not in played):
			second = first
			first = v

	return first, second, playedTricks

def hard(data: dict, idPlayer, legal):
	take, dontTake = splithand(data, idPlayer, legal)

	first, second, playedTricks = Tricks(data, data["tricks"])
	strongestHand = -1
	for c in take:
		if (c["value"] == first):
			#check if its worth
			pass

		if (c["value"] == second):
			#check if its worth
		if (tricksValue[c["value"]] > strongestHand):
