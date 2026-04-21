from card import Card

class Hand:
	def __init__(self):
		self.cards = []
		self.numbers = { "club": 0, "spade": 0, "diamond": 0, "heart": 0}

	def draw(self, card: Card):
		if card.colors in self.numbers:
			self.numbers[card.colors] += 1
			self.cards.append(card)

	def remove(self, card: Card):
		try:
			self.cards.remove(card)
		except ValueError:
			print("Error: card not found in hand")
		else:
			if card.colors in self.numbers:
				if self.numbers[card.colors] > 0:
					self.numbers[card.colors] -= 1

	def remaining(self):
		return len(self.cards)

	def print(self):
		for c in self.cards:
			c.print()
		print("\n")

class Player:
	def __init__(self, id: int):
		self.id = id
		self.takenFold = []
		self.points = 0
		self.hands = Hand()
		self.trickPoints = {"6": 0, "7": 0, "8": 0, "10": 10, "Q": 3, "K": 4, "A": 11, "9": 14, "J": 20}
		self.cardPoints = {"6": 0, "7": 0, "8": 0, "9": 0, "10": 10, "J": 2, "Q": 3, "K": 4, "A": 11}


	def drawCard(self, card: Card):
		self.hands.draw(card)

	def playCard(self, card: Card):
		self.hands.remove(card)

	def clearHand(self):
		self.hands = Hand()

	def remainingCard(self):
		return self.hands.remaining()

	def takeFold(self, fold: list[Card]):
		copy = fold.copy()
		self.takenFold.append(copy)

	def countPoint(self, tricks: str):
		for fold in self.takenFold:
			for c in fold:
				if (c.colors == tricks):
					self.points += self.trickPoints[c.values]
				else:
					self.points += self.cardPoints[c.values]

	def print(self):
		print("Player ", self.id, ", points = ", self.points, " :")
		self.hands.print()
		# print("\n")
