from .player import Player, Hand
from .card import Card
from .board import Board
from .deck import Deck
import copy

class GameEngine:
	def __init__(self, roomID: str):
		self.indexPlayer = -1
		self.roomID = roomID
		self.trickValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}
		self.cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}
		self.cardPoint = {"6": 0, "7": 0, "8": 0, "9": 0, "10": 10, "J": 2, "Q": 3, "K": 4, "A": 11}
		
	def initPlayer(self, data: dict, nbrPlayer: int):
		if (len(data["players"]) > 0):
			for p in data["players"].values():
				p["cards"].clear()
				p["taken"].clear()
				p["melds"].clear()
			return data

		i = 0
		while (i < nbrPlayer):
			data["players"][str(i)] = {}
			data["players"][str(i)]["cards"] = []
			data["players"][str(i)]["taken"] = []
			data["players"][str(i)]["melds"] = []
			if ("puntos" not in data["players"][str(i)].keys()):
				data["players"][str(i)]["puntos"] = 0
			i += 1

		return data

	def order(self, hand: list):
		ret = []
		clubs = []
		spades = []
		diamonds = []
		hearts = []
		bucket = {"club": clubs, "diamond": diamonds, "spade": spades, "heart": hearts}

		for c in hand:
			cList = bucket[c["color"]]
			cList.append(Card(c["value"], c["color"], c["id"]))

		for color in bucket.values():
			sort = sorted(color)
			for c in sort:
				ret.append({"color": c.colors, "value": c.values, "id": c.id})

		return ret

	def shtokr(self, cards: list):
		colors = ["club", "spade", "diamond", "heart"]
		ret = []
		Q = 6
		K = 7

		for c in colors:
			if ({"value": "Q", "color": c, "id": Q} in cards and 
				{"value": "K", "color": c, "id": K} in cards):
				ret.append(c)
			Q += 9
			K += 9
		
		return ret

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
			for p in data["players"].values():
				card = deck.drawRandom()
				if (card.values == "-1"):
					break
				if (card.values == "7" and card.colors == "diamond"):
					index = i
				p["cards"].append({"value": card.values, "color": card.colors, "id": card.id})
				i += 1

		i = 0
		for p in data["players"].values():
			p["cards"] = self.order(p["cards"])

		for p in data["players"].values():
			p["shtokr"] = self.shtokr(p["cards"])

		data["lastCard"] = {"value": last.values, "color": last.colors, "id": last.id}
		data["tricks"] = "none"
		data["round"] = 0
		if ("game" not in data.keys()):
			data["game"] = 0
		

		if ("start" in data.keys()):
			data["start"] = int(data["start"]) + 1
			if (data["start"] == len(data["players"])):
				data["start"] = 0
			data["playing"] = data["start"]
		else:
			data["playing"] = index
			data["start"] = index

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

	def take_fold(self, data: dict):
		asked = data["board"]["asked"].copy()
		board = data["board"].copy()
		board.pop("asked")
		fold = []
		for c in board.values():
			if c not in fold:
				fold.append(c)
    
		strongest = self.strongestCard(asked, fold, data["tricks"])
		index = 0
		for i in board.keys():
			if (board[i] == strongest):
				index = i
				break
		
		melds = Player.countMelds(Player(), fold, data["tricks"])
  
		data["players"][index]["puntos"] = data["players"][index]["puntos"] + melds

		last_fold = []
		for c in board.values():
			if c not in last_fold:
				data["players"][index]["taken"].append(c)
				last_fold.append(c)

		s = int(index)

		data["playing"] = s
		data["last_fold"] = last_fold
		data["last_fold_player"] = s
		data["round"] = data["round"] + 1
  
		return data, melds

	def clear_board(self, data: dict):
		del data["board"]
		data["board"] = {}
		return data

	def play(self, data: dict, idPlayer: int , idCard: int):
		card = data["players"][idPlayer]["cards"][idCard].copy()
		del data["players"][idPlayer]["cards"][idCard]
		if (len(data["board"]) == 0):
			data["board"]["asked"] = card
		data["board"][idPlayer] = card
		s = int(data["playing"])

		if (card["color"] != data["board"]["asked"]["color"] and data["tricks"] == "none"):
			data["tricks"] = card["color"]

		s += 1
		if (s == len(data["players"])):
			s = 0

		data["playing"] = s
		return data

	def legal(self, data: dict,  idPlayer: int):
		hand = data["players"][str(idPlayer)]["cards"]
		fold = []
		cardBoard = data["board"].copy()
		asked = {"color": "none", "value": "-1", "id": -1}
		if ("asked" in cardBoard.keys()):
			asked = cardBoard.pop("asked")

		for c in data["board"].values():
			fold.append(Card(c["value"], c["color"]))
		board = Board(fold, Card(asked["value"], asked["color"], asked["id"]))

		cardHand = Hand()
		for c in hand:
			cardHand.draw(Card(c["value"], c["color"]))
	
		return board.legalCard(cardHand, data["tricks"])

	def melds(self, data, idPlayer, meldIndex):
		hand = []
		for i in meldIndex:
			hand.append(data["players"][idPlayer]["cards"][i])
		meld = Player.countMelds(Player(), hand, data["tricks"])
		data["players"][idPlayer]["puntos"] = data["players"][idPlayer]["puntos"] - meld
		
		return data

	def point_melds(self, data, idPlayer, meldIndex):
		hand = []
		for i in meldIndex:
			hand.append(data["players"][idPlayer]["cards"][i])
		meld = Player.countMelds(Player(), hand, data["tricks"])
		
		return meld

	def points(self, data: dict):
		try:
			for id, p in data["players"].items():
				points = int(p["puntos"])
				if (id == str(data["playing"])):
					points += 5
				for c in p["taken"]:
					if (c["color"] == data["tricks"]):
						if (c["value"] == "J"):
							points += 20
							continue
						elif (c["value"] == "9"):
							points += 14
							continue
					points += self.cardPoint[c["value"]]
				p["puntos"] = points

			return data
	
		except KeyError:
			return data

	def get_final_score(self, data: dict):
		players = []
		for id, p in data["players"].items():
			points = 0
			if (id == str(data["playing"])):
				points += 5
			if (data["tricks"] in p["shtokr"]):
				points -= 20
			for c in p["taken"]:
				if (c["color"] == data["tricks"]):
					if (c["value"] == "J"):
						points += 20
						continue
					elif (c["value"] == "9"):
						points += 14
						continue
				points += self.cardPoint[c["value"]]
			players.append(points)

		return players

	def board_melds(self, state: dict, idPlayer: int , idCard: int):
		data = copy.deepcopy(state)
		card = data["players"][idPlayer]["cards"][idCard].copy()
		del data["players"][idPlayer]["cards"][idCard]
		if (len(data["board"]) == 0):
			data["board"]["asked"] = card
		data["board"][idPlayer] = card

		if (len(data["board"]) - 1 == len(data["players"])):
			asked = data["board"].pop("asked")

			fold = []
			for c in data["board"].values():
				fold.append(c)
	
			strongest = self.strongestCard(asked, fold, data["tricks"])
			for i in data["board"].keys():
				if (data["board"][i] == strongest):
					break
			
			melds = Player.countMelds(Player(), fold, data["tricks"])
			data["board"]["asked"] = asked
			return melds

	def who_take(self, state: dict, idPlayer: int , idCard: int):
		data = copy.deepcopy(state)
		card = data["players"][idPlayer]["cards"][idCard].copy()
		del data["players"][idPlayer]["cards"][idCard]
		if (len(data["board"]) == 0):
			data["board"]["asked"] = card
		data["board"][idPlayer] = card

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
			data["board"]["asked"] = asked
			return index

	def handleAction(self, action: str, data: dict, nbPlayer=0, idPlayer=-1, idCard=-1, meldIndex=[]):
		if (action == "start"):
			return self.startGame(data, nbPlayer)

		if (action == "play"):
			return self.play(data, idPlayer, idCard)
		
		if (action == "take_fold"):
			return self.take_fold(data)

		if (action == "clear_board"):
			return self.clear_board(data)

		if (action == "legal"):
			return self.legal(data, idPlayer)
		
		if (action == "meld"):
			return self.melds(data, idPlayer, meldIndex)

		if (action == "point"):
			return self.points(data)

		if (action == "get_final_score"):
			return self.get_final_score(data)

		if (action == "point_meld"):
			return self.point_melds(data, idPlayer, meldIndex)
        
		if (action == "board_meld"):
			return self.board_melds(data, idPlayer, idCard)

		if (action == "who_take"):
			return self.who_take(data, idPlayer, idCard)

		return data