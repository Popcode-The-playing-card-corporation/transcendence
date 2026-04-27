from .card import Card

class Hand:
	def __init__(self):
		self.cards = []
		self.numbers = { "club": 0, "spade": 0, "diamond": 0, "heart": 0}

	def draw(self, card: Card):
		if card.colors in self.numbers:
			self.numbers[card.colors] += 1
			self.cards.append(card)

class Player:
	def __init__(self):
		self.cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}
		self.suitePoint = {3: 20, 4: 50, 5: 100, 6: 150, 7: 200, 8: 250, 9: 300}

	def findSuit(self, bucket: dict[str, Card]):
		ret = 0
		for b in bucket.values():
			if (len(b) >= 3):
				b = sorted(b)
				value = 0
				suite = 1
				for c in b:
					if (value == 0):
						value = self.cardValue[c.values]
						continue
					if (self.cardValue[c.values] == value + 1):
						value += 1
						suite += 1
					else:
						if (suite > 2):
							ret += self.suitePoint[suite]
						value = 0
						value = 1
				if (suite > 2):
					ret += self.suitePoint[suite]
		return ret

	def countMelds(self, fold: list):
		clubs = []
		spades = []
		diamonds = []
		hearts = []
		bucket = {"club": clubs, "spade": spades, "diamond": diamonds, "heart": hearts}

		for c in fold:
			cList = bucket[c["color"]]
			cList.append(Card(c["value"], c["color"]))

		ret = self.findSuit(bucket)
		for c in clubs:
			if (c in spades and c in diamonds and c in hearts):
				if (c.values == "J"):
					ret += 200
				elif (c.values == "9"):
					ret += 150
				else:
					ret += 100
		return ret

	def countPoint(self, tricks: str):
		for fold in self.takenFold:
			self.countMelds(fold)
			for c in fold:
				if (c.colors == tricks):
					self.points += self.trickPoints[c.values]
				else:
					self.points += self.cardPoints[c.values]