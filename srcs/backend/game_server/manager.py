from game_server.room import GameRoom
from game_server.redis import client

import json

class GameManager:

    rooms = {}

    def __init__(self):
        self.rooms = {}


    def get_or_create_room(self, room_id):

        if room_id not in self.rooms:
            self.rooms[room_id] = GameRoom(room_id)

            print(
                "Nouvelle room créée:",
                room_id
            )

        return self.rooms[room_id]
    
#2026-07-17 13:51:21 {"room": "01c530c8", "player": 7, "action": {"type": "action", "action": "patch_param", "payload": {"max_player": 3}}}
#2026-07-17 13:51:21 Action inconnue: {'type': 'action', 'action': 'patch_param', 'payload': {'max_player': 3}}
#2026-07-17 13:51:25 {"room": "01c530c8", "player": 7, "action": {"type": "action", "action": "patch_param", "payload": {"nb_games": 1}}}
    
    async def handle_action(self, room_id, data):

        room = self.get_or_create_room(room_id)

        response = await room.handle_action(data)

        if response:
            await self.broadcast(
                room_id,
                response
            )


    async def broadcast(self, room_id, message):
        print(message)
        await client.publish(
            f"room_events:{room_id}",
            json.dumps(message)
        )