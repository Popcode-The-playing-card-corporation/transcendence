from game_engine.game import GameEngine
from game_engine.deck import Deck
from game_engine.card import Card
import json
import copy
from game_engine.bot.bot import bot



def main():

	data = {
		"players": {},
		"board": {}
	}

	game = GameEngine(1)
	# game.setupGame()
	# game.printGameInfo()
	# game.gameLoop()

	data = game.handleAction("start", data, nbPlayer=4)
	print(json.dumps(data, indent=6))
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	card = bot(data, str(data["playing"]), legal, difficulty="hard")
	data = game.handleAction("play", data, idPlayer=str(data["playing"]), idCard=card)
	print("board = ", data["board"], " --- card = ", card)
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	card = bot(data, str(data["playing"]), legal, difficulty="hard")
	data = game.handleAction("play", data, idPlayer=str(data["playing"]), idCard=card)
	print("board = ", data["board"], " --- card = ", card)
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	card = bot(data, str(data["playing"]), legal, difficulty="hard")
	data = game.handleAction("play", data, idPlayer=str(data["playing"]), idCard=card)
	print("board = ", data["board"], " --- card = ", card)
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	card = bot(data, str(data["playing"]), legal, difficulty="hard")
	data = game.handleAction("play", data, idPlayer=str(data["playing"]), idCard=card)
	print("board = ", data["board"], " --- card = ", card)
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	card = bot(data, str(data["playing"]), legal, difficulty="hard")
	data = game.handleAction("play", data, idPlayer=str(data["playing"]), idCard=card)
	print("board = ", data["board"], " --- card = ", card)
	# print(json.dumps(data, indent=6))
	# data = game.handleAction("point", data)
	# print(json.dumps(data, indent=6))
	# legal = game.handleAction("legal", data, idPlayer=data["playing"])
	# print(legal)
	# game.handleAction("meld", data, idPlayer=0, meldIndex=[0, 1, 2, 3])

# def end(player):
# 	if (len(player["cards"]) == 0):
# 		return False
# 	return True

# def main():
# 	data = {
# 		"players": {},
# 		"board": {}
# 	}

# 	game = GameEngine(1)

# 	data = game.handleAction("start", data, nbPlayer=4)
# 	while(end(data["players"][str(data["playing"])])):

# 		playing = str(data["playing"])
# 		player = data["players"][playing]
# 		cardNbr = len(player["cards"])
# 		print("cardNBr = ", cardNbr)


# 		legal = game.handleAction("legal", data, idPlayer=playing)
# 		if (cardNbr != len(data["players"][playing]["cards"])):
# 			print("pb is legal")
# 			return

# 		card = bot(data, playing, legal, difficulty="hard")
# 		if (cardNbr != len(data["players"][playing]["cards"])):
# 			print("pb is bot")
# 			return

# 		data = game.handleAction("play", data, idPlayer= playing, idCard=card)
# 		if (cardNbr -1 != len(data["players"][playing]["cards"])):
# 			print("pb is play - nb card = ", len(data["players"][playing]["cards"]))
# 			return

# def findSuit(bucket):
# 	cardValue = {"6": 1, "7": 2, "8": 3, "9": 4, "10": 5, "J": 6, "Q": 7, "K": 8, "A": 9}
# 	suitePoint = {3: 20, 4: 50, 5: 100, 6: 150, 7: 200, 8: 250, 9: 300}

# 	ret = []

# 	for b in bucket.values():
# 		cards = {"cards": [], "point": 0}
# 		print("b = ", b)
# 		# breakpoint()
# 		if (len(b) >= 3):
# 			b = sorted(b)
# 			value = 0
# 			suite = 1
# 			for c in b:
# 				if (value == 0):
# 					value = cardValue[c.values]
# 					cards["cards"].append(c.id)
# 					continue
# 				if (cardValue[c.values] == value + 1):
# 					value += 1
# 					suite += 1
# 					cards["cards"].append(c.id)
# 				else:
# 					if (suite > 2):
# 						print(cards)
# 						print("len cards ",len(cards["cards"]))
# 						cards["point"] = suitePoint[len(cards["cards"])]
# 						print("cards = ", cards, " - suite = ", suite)
# 						ret.append(copy.deepcopy(cards))
# 					value = cardValue[c.values]
# 					suite = 1
# 					cards["cards"] = []
# 					cards["cards"].append(c.id)
# 			if (suite > 2):
# 				cards["point"] = suitePoint[len(cards["cards"])]
# 				print("cards = ", cards, " - suite = ", suite)
# 				ret.append(copy.deepcopy(cards))

# 	# print("ret = ", ret)
# 	return ret

# def count_melds(cards):
# 	clubs = []
# 	spades = []
# 	diamonds = []
# 	hearts = []
# 	bucket = {"club": clubs, "spade": spades, "diamond": diamonds, "heart": hearts}

# 	ex = Card("-1", "none")
# 	for c in cards:
# 		if (type(ex) == type(c)):
# 			cList = bucket[c.colors]
# 			cList.append(Card(c.values, c.colors, c.id))
# 		else:
# 			cList = bucket[c["color"]]
# 			cList.append(Card(c["value"], c["color"], c["id"]))

# 	ret = findSuit(bucket)
# 	for c in clubs:
# 		if (c in spades and c in diamonds and c in hearts):
# 			cards = {"cards": [c.id, c.id + 9, c.id + 18, c.id + 27], "point": 0}
# 			if (c.values == "J"):
# 				cards["point"] = 200
# 			elif (c.values == "9"):
# 				cards["point"] = 150
# 			else:
# 				cards["point"] = 100
# 			ret.append(copy.deepcopy(cards))

# 	return ret

# def main():
# 	i = 0
	# decks = Deck()
	# deck = []
	# while i != 20:
	# 	i += 1
	# 	deck.append(decks.drawRandom())

	# print(deck)

	# deck = [{"color": "club", "value": "6", "id": 0}, {"color": "club", "value": "9", "id": 3}, {"color": "club", "value": "10", "id": 4}, {"color": "club", "value": "J", "id": 5}, {"color": "club", "value": "K", "id": 7}, {"color": "club", "value": "A", "id": 8}, {"color": "diamond", "value": "6", "id": 18}, {"color": "diamond", "value": "7", "id": 19}, {"color": "diamond", "value": "9", "id": 21}, {"color": "diamond", "value": "10", "id": 22}, {"color": "diamond", "value": "Q", "id": 24}, {"color": "diamond", "value": "A", "id": 26}, {"color": "spade", "value": "6", "id": 9}, {"color": "spade", "value": "9", "id": 12}, {"color": "spade", "value": "J", "id": 14}, {"color": "spade", "value": "K", "id": 16}, {"color": "heart", "value": "Q", "id": 33}, {"color": "heart", "value": "A", "id": 35}]

	# data = count_melds(deck)

	# print(json.dumps(data))

if __name__ == "__main__":
	main()