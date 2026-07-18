from game_server.state import GameState
from game_server.broadcast import Broadcast
from game.models import Room
from asgiref.sync import sync_to_async

class GameRoom:

    def __init__(self, room_id):
        self.room_id = room_id
        
        self.players = {}


    async def handle_action(self, data):

        action = data["action"]


        if action["type"] == "join":

            player = data["player"]

            self.players[player] = {
                "ready": False
            }
            room = await sync_to_async(Room.objects.get)(code=self.room_id)
            if room.host_id == player:
                test = await Broadcast.broadcast_settings(self.room_id, "host_join")
            else:
                test = await Broadcast.broadcast_settings(self.room_id, "player_joined")
            print(test)
            return test

