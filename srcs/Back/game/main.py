from game import Game
from player import Player

def main():
	players = [Player(0), Player(1), Player(2), Player(3), Player(4)]
	game = Game(players)
	game.setupGame()
	# game.printGameInfo()
	game.gameLoop()

if __name__ == "__main__":
	main()