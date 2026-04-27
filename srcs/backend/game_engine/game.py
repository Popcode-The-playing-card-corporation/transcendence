from .player import Player, Hand
from .card import Card
from .board import Board
from .deck import Deck

class GameEngine:
	def __init__(self, roomID: str):
		self.indexPlayer = -1
		self.roomID = roomID
		self.trickValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}
		self.cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}
		
	def initPlayer(self, data: dict, nbrPlayer: int):
		i = 0
		while (i < nbrPlayer):
			data["players"][i] = {}
			data["players"][i]["cards"] = []
			data["players"][i]["taken"] = []
			if ("puntos" not in data["players"][i].keys()):
				data["players"][i]["puntos"] = 0
			i += 1

		return data

	def startGame(self, data: dict, nbrPlayer: int):
		index = 0
		data = self.initPlayer(data, nbrPlayer)
		deck = Deck()
		last = Card("-1", "none")
		if (deck.remaining() % nbrPlayer != 0):
			last = deck.drawRandom()
			while (last.colors == "diamond" and last.values == "7"):
				deck = Deck()
				last = deck.drawRandom()

		while (deck.remaining() != 0):
			i = 0
			while (i < nbrPlayer):
				card = deck.drawRandom()
				if (card.values == "-1"):
					break
				if (card.values == "7" and card.colors == "diamond"):
					index = i
				data["players"][i]["cards"].append({"value": card.values, "color": card.colors})
				i += 1

		data["lastCard"] = {"value": last.values, "color": last.colors}
		data["tricks"] = "none"
		data["playing"] = index
		return data

	def strongestCard(self, asked, fold, tricks):
		strongest = {"value": "-1", "color": "none"}
		for c in fold:
			if (c == fold[0]):
				strongest = c
				continue
			if (c["color"] != tricks and c["color"] != asked["color"]):
				continue
			if (c["color"] == tricks):
				if (strongest["color"] == tricks):
					if (self.trickValue[c["value"]] > self.trickValue[strongest["value"]]):
						strongest = c
					continue
				strongest = c
				continue
			else:
				if (strongest["color"] == tricks):
					continue
				if (self.cardValue[c["value"]] > self.cardValue[strongest["value"]]):
					strongest = c
				continue
		return strongest

	def play(self, data: dict, idPlayer: int , idCard: int):
		card = data["players"][idPlayer]["cards"][idCard].copy()
		del data["players"][idPlayer]["cards"][idCard]
		if (len(data["board"]) == 0):
			data["board"]["asked"] = card
		data["board"][idPlayer] = card
		s = data["playing"]

		if (card["color"] != data["board"]["asked"]["color"] and data["tricks"] == "none"):
			data["tricks"] = card["color"]

		if (len(data["board"]) - 1 == len(data["players"])):
			asked = data["board"].pop("asked")
			fold = []
			for c in data["board"].values():
				fold.append(c)
	
			strongest = self.strongestCard(asked, fold, data["tricks"])
			index = 0
			for i in data["board"].keys():
				if (data["board"][i] == strongest):
					index = i
					break
			
			melds = Player.countMelds(Player(), fold)
			data["players"][index]["puntos"] = data["players"][index]["puntos"] + melds

			for c in data["board"].values():
				data["players"][index]["taken"].append(c)
			
			data["board"].clear()
			s = index
		else:
			s += 1
			if (s == len(data["players"])):
				s = 0

		data["playing"] = s
		return data

	def legal(self, data: dict,  idPlayer: int):
		hand = data["players"][idPlayer]["cards"]
		fold = []
		cardBoard = data["board"].copy()
		asked = {"color": "none", "value": "-1"}
		if ("asked" in cardBoard.keys()):
			asked = cardBoard.pop("asked")

		for c in data["board"].values():
			fold.append(Card(c["value"], c["color"]))
		board = Board(fold, Card(asked["value"], asked["color"]))

		cardHand = Hand()
		for c in hand:
			cardHand.draw(Card(c["value"], c["color"]))
	
		return board.legalCard(cardHand, data["tricks"])

	def handleAction(self, action: str, data: dict, nbPlayer=0, idPlayer=-1, idCard=-1):

		if (action == "start"):
			return self.startGame(data, nbPlayer)

		if (action == "play"):
			return self.play(data, idPlayer, idCard)

		if (action == "legal"):
			return self.legal(data, idPlayer)
		
		return data
