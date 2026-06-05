from .medium import takeFold, convert, copy_fold
from ..card import Card
from ..player import Player

cardPoint = {"6": 0, "7": 0, "8": 0, "9": 0, "10": 10, "J": 2, "Q": 3, "K": 4, "A": 11}
tricksValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}
cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}

def countCard(card, data, fold):
	cards = []
	cards.append(card)

	for c in fold:
		if (c.colors == card.colors):
			cards.append(c)

	for p in data["players"].values():
		for c in p["cards"]:
			if (c["color"] == card.colors):
				cards.append(Card(c["value"], c["color"]))

	cards = sorted(cards)
	index = cards.index(card)
	return abs(index - cardValue[card.values])

def splithand(data, idPlayer, legal):
	playable = []
	tricks = data["tricks"]
	fold = copy_fold(data["board"])
	asked = None
	playing = len(data["players"]) - len(fold)

	if (len(fold) != 0):
		asked = fold.pop(0)

	i = 0
	while (i < len(legal)):
		if (legal[i]):
			c = data["players"][idPlayer]["cards"][i]
			playable.append(Card(c["value"], c["color"], c["id"]))
		i += 1

	take = []
	dontTake = []
	for c in playable:
		if (takeFold(fold, asked, tricks, c)):
			if (c.colors == tricks):
				take.append(c)
			left = countCard(c, data, fold)
			if (left < playing):
				if (tricks != "none"):
					dontTake.append(c)
				elif (left < playing - 1):
					dontTake.append(c)
				else:
					take.append(c)
			else:
				take.append(c)
		else:
			dontTake.append(c)

	return take, dontTake, fold, asked

def Tricks(data: dict, tricks: str):
	played = []
	playedTricks = 0

	for p in data["players"].values():
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

	return first, second

def boardPoints(data: dict, board):
	points = 0
	for c in board:
		if (c.colors == data["tricks"]):
			if (c.values == "J"):
				points += 20
				continue
			elif (c.values == "9"):
				points += 14
				continue
		points += cardPoint[c.values]

	points += Player.countMelds(Player(), board, data["tricks"])
	return points

def hard(data: dict, idPlayer, legal):
	take, dontTake, board, asked = splithand(data, idPlayer, legal)

	first, second = Tricks(data, data["tricks"])
	points = boardPoints(data, board)

	if (len(board) != 0):
		for c in take:
			if (asked.colors == data["tricks"]):
				break 
			if (c.colors == data["tricks"]):
				if (c.values == first and points <= 20 - (10 * len(data["players"]))):
					return data["players"][idPlayer]["cards"].index(convert(c))

				if (c.values == second and points <= 10- (5 * len(data["players"]))):
					return data["players"][idPlayer]["cards"].index(convert(c))

	card = None
	if (len(dontTake) > 0):
		maxPoint = 0
		for c in dontTake:
			newBoard = board.copy()
			newBoard.append(c)
			newPoints = boardPoints(data, newBoard)
			if (newPoints >= maxPoint):
				card = c
				maxPoint = newPoints

		card = convert(card)
		return data["players"][idPlayer]["cards"].index(card)

	maxPoint = 0
	for c in take:
		newBoard = board.copy()
		newBoard.append(c)
		newPoints = boardPoints(data, newBoard)
		if (newPoints < maxPoint):
			card = c
			maxPoint = newPoints

	if (card == None):
		card = take[0]

	card = convert(card)
	return data["players"][idPlayer]["cards"].index(card)