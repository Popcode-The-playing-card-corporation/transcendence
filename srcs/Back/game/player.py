from card import Card

class Player:
	hands = []

	def __init__(self, id):
		self.id = id

	def drawCard(self, card):
		self.hands.append(card)