from game import GameEngine
from player import Player
import json

def main():

	data = {
		"players": {},
		"board": {}
	}

	# players = [Player(0), Player(1), Player(2), Player(3), Player(4)]
	game = GameEngine(1)
	# game.setupGame()
	# game.printGameInfo()
	# game.gameLoop()

	data = game.handleAction("start", data, nbPlayer=4)
	# print(json.dumps(data, indent=6))
	data = game.handleAction("play", data, idPlayer=data["playing"], idCard=0)
	data = game.handleAction("play", data, idPlayer=data["playing"], idCard=0)
	# breakpoint()
	data = game.handleAction("play", data, idPlayer=data["playing"], idCard=0)
	print(json.dumps(data, indent=6))
	data = game.handleAction("play", data, idPlayer=data["playing"], idCard=0)
	print(json.dumps(data, indent=6))
	legal = game.handleAction("legal", data, idPlayer=data["playing"])
	print(legal)
	game.handleAction("meld", data, idPlayer=0, meldIndex=[0, 1, 2, 3])

if __name__ == "__main__":
	main()