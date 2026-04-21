from card import Card
from player import Player
from player import Hand

class Board:
	def __init__(self):
		self.fold = []
		self.trickValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}
		self.cardValue = {"6": 0, "7": 1, "8": 2, "9": 3, "10": 4, "J": 5, "Q": 6, "K": 7, "A": 8}

	def findHighestTrick(self, tricks: str):
		ret = -1
		for c in self.fold:
			if c.colors == tricks:
				ret = self.trickValue[c.values]
		return ret

	def legalCard(self, hands: Hand, tricks: str):
		legal = []
		for card in hands.cards:
			if (len(self.fold) == 0):
				legal.append(True)
				continue
			if (card.colors == self.fold[0].colors):
				legal.append(True)
				continue
			if (card.colors == tricks):
				if (len(hands.cards) == hands.numbers[tricks]):
					legal.append(True)
					continue
				if (self.trickValue[card.values] > self.findHighestTrick(tricks)):
					legal.append(True)
					continue
				legal.append(False)
				continue
			print("hands number for ", self.fold[0].colors, " = ", hands.numbers[self.fold[0].colors])
			if (hands.numbers[self.fold[0].colors] == 0):
				legal.append(True)
				continue
			legal.append(False)
		return legal

	def playCard(self, card: Card):
		self.fold.append(card)

	def printFold(self, tricks: str):
		print("fold:", "\ttricks: ", tricks)
		for c in self.fold:
			c.print()
		print("\n")