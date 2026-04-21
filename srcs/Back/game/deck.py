from card import Card
import random

class Deck:
	def __init__(self):
		self.cards = []

		values = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"]
		colors = ["club", "spade", "diamond", "heart"]

		for color in colors:
			for value in values:
				self.cards.append(Card(value, color))

	def drawRandom(self):
		lenCards = len(self.cards)
		if lenCards > 0:
			index = random.randint(0, lenCards - 1)
			ret = self.cards[index]
			self.cards.remove(ret)
			return ret
		else:
			return False

	def remaining(self):
		return len(self.cards)