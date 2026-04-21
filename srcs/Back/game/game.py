from player import Player
from card import Card
from board import Board
from deck import Deck


class Game:
	def __init__(self, playersList: list[Player]):
		self.indexPlayer = -1
		self.players = playersList
		self.tricks = "none"
		self.board = Board()

	def __cardDistribution(self):
		deck = Deck()
		while deck.remaining() > len(self.players):
			for p in self.players:
				card = deck.drawRandom()
				p.drawCard(card)
		lastCard = Card(-1, "other")
		if deck.remaining() > 0:
			lastCard = deck.drawRandom()
		return lastCard
			
	def __find7Diamond(self):
		for p in self.players:
			for c in p.hands.cards:
				if c.colors == "diamond" and c.values == "7":
					return p
	
	def setupGame(self):
		self.lastCard = self.__cardDistribution()
		while self.lastCard.values == "7" and self.lastCard.colors == "diamond":
			for p in self.players:
				p.clearHand
			self.__cardDistribution()
		p = self.__find7Diamond()
		self.indexPlayer = self.players.index(p)
		self.startingPlayer = self.indexPlayer

	def chooseCard(self, player: Player):
		player.print()
		legal = self.board.legalCard(player.hands, self.tricks)
		print("choose a card to play")
		while True:
			index = input()
			try:
				index = int(index)
			except ValueError:
				print("not a card choose another one")
			else:
				if (index >= 0 and index < player.remainingCard() and legal[index] == True):
					return player.hands.cards[index]
				else:
					player.print()
					print("not a card choose another one")

	def strongestCard(self):
		strongest = Card("-1", "none")
		asked = self.board.fold[0].colors
		for c in self.board.fold:
			if (c == self.board.fold[0]):
				strongest = c
				continue
			if (c.colors != self.tricks and c.colors != asked):
				continue
			if (c.colors == self.tricks):
				if (strongest.colors == self.tricks):
					if (self.board.trickValue[c.values] > self.board.trickValue[strongest.values]):
						strongest = c
					continue
				strongest = c
				continue
			elif (c.colors == asked):
				if (strongest.colors == self.tricks):
					continue
				if (self.board.cardValue[c.values] > self.board.cardValue[strongest.values]):
					strongest = c
				continue
		return self.board.fold.index(strongest)

	def gameLoop(self):
		while True:
			if (self.indexPlayer == len(self.players)):
				self.indexPlayer = 0

			if (len(self.board.fold) == len(self.players)):
				winner = self.strongestCard()
				self.indexPlayer = winner
				self.players[winner].takeFold(self.board.fold)
				self.board.fold.clear()
				if (len(self.players[winner].hands.cards) == 0):
					self.players[winner].points += 5
					break

			playedCard = self.chooseCard(self.players[self.indexPlayer])
			if (self.tricks == "none" and len(self.board.fold) != 0):
				if (playedCard.colors != self.board.fold[0].colors):
					self.tricks = playedCard.colors

			self.players[self.indexPlayer].playCard(playedCard)
			self.board.playCard(playedCard)
			self.board.printFold(self.tricks)
			self.indexPlayer += 1

		print("lastCard = ")
		self.lastCard.print()
		print("point among player = ")
		totalPoint = 0
		for p in self.players:
			p.countPoint(self.tricks)
			totalPoint += p.points
		print(totalPoint)

	def printGameInfo(self):
		for p in self.players:
			p.print()
		print("last card:")
		self.lastCard.print()
		print("player who start:")
		print(self.startingPlayer)