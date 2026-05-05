from .card import Card
import random

class Deck:
	def __init__(self):
		self.cards = []

		values = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"]
		colors = ["club", "spade", "diamond", "heart"]

		id = 0
		for color in colors:
			for value in values:
				self.cards.append(Card(value, color, id))
				id += 1

	def drawRandom(self):
		lenCards = len(self.cards)
		if lenCards > 0:
			index = random.randint(0, lenCards - 1)
			return self.cards.pop(index)
		else:
			return Card("-1", "other")

	def remaining(self):
		return len(self.cards)