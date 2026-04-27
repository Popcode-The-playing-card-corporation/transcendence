from card import Card
from player import Hand

class Board:
	def __init__(self, fold, asked: Card):
		self.fold = fold
		self.asked = asked
		self.trickValue = {"6": 0, "7": 1, "8": 2, "10": 3, "Q": 4, "K": 5, "A": 6, "9": 7, "J": 8}

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
			if (card.colors == self.asked.colors):
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
			if (hands.numbers[self.asked.colors] == 0):
				legal.append(True)
				continue
			legal.append(False)
		return legal
