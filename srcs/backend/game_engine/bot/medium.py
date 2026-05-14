from ..card import Card

trickValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}
cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}

def strongestCard(asked, fold, tricks):
	strongest = Card("-1", "none")
	for c in fold:
		if (c == fold[0]):
			strongest = c
			continue
		if (c.colors != tricks and c.colors != asked.colors):
			continue
		if (c.colors == tricks):
			if (strongest.colors == tricks):
				if (trickValue[c.values] > trickValue[strongest.values]):
					strongest = c
				continue
			strongest = c
			continue
		else:
			if (strongest.colors == tricks):
				continue
			if (cardValue[c.values] > cardValue[strongest.values]):
				strongest = c
			continue
	return strongest

def takeFold(fold, asked, tricks, card):
	fold_copy = fold.copy()
	fold_copy.append(card)
	strongest = strongestCard(asked, fold_copy, tricks)

	if (strongest.values == card.values and 
		strongest.colors == card.colors):
		return True

	return False

def copy_fold(board):
	ret = []
	for c in board.values():
		ret.append(Card(
			c["value"],
			c["color"],
			c["id"]
		))
	return ret

def convert(card):
	return {
		"value": card.values,
		"color": card.colors,
		"id": card.id
	}

def medium(data: dict, idPlayer, legal):
	playable = []
	tricks = data["tricks"]
	fold = copy_fold(data["board"])
	asked = fold.pop(0)

	i = 0
	while (i < len(legal)):
		if (legal[i]):
			card = data["players"][idPlayer]["cards"][i]
			playable.append(Card(card["value"], card["color"], card["id"]))
		i += 1

	take = []
	dontTake = []
	for c in playable:
		if (takeFold(fold, asked, tricks, c)):
			take.append(c)
		else:
			dontTake.append(c)

	if (len(dontTake) != 0):
		dontTake = sorted(dontTake)
		i = len(dontTake) - 1
		card = convert(dontTake[i])
		index = data["players"][idPlayer]["cards"].index(card)
	else:
		take = sorted(take)
		card = convert(take[0])
		index = data["players"][idPlayer]["cards"].index(card)

	return index