from asgiref.sync import sync_to_async

from datetime import timedelta
from game.models import PlayerPresence, GameLog, Room
from game_engine.game import GameEngine
from game_engine.card import Card
import copy

import asyncio



class Broadcast:
    @staticmethod
    async def _get_username(presence):
        username = presence.player.username
        
        if not presence.is_human:
            if presence.difficulty == "easy":
                username += " [kILIAN]"
            elif presence.difficulty == "medium":
                username += " [Alex]"
            elif presence.difficulty == "hard":
                username += " [Dana]"
            
        return username
    
    @staticmethod
    async def _get_players(room):
        if room == None:
            return {"error": "No room send"}

        presences = await sync_to_async(list)(
            PlayerPresence.objects.select_related("player").filter(
                room=room
            )
        )
        
        players = []
        
        for p in presences:
            players.append({
                "id": p.player.id,
                "username": await Broadcast._get_username(p),
                "is_host": p.player == room.host,
                "position": p.position
            })


        return players

    @staticmethod
    async def _get_room_snapshot(room):
        
        return {
            "code": room.code,
            "status": room.status,
            "max_player": room.max_player,
            "type": room.type,
            "goal": room.goal,
            **(
                {"nb_games": room.nb_games}
                if room.goal == "games"
                else {"nb_points": room.nb_points}
            ),
            "timestamp": (room.created_at + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
        }
            
    @staticmethod
    async def broadcast_settings(room_code, message):
        room = await sync_to_async(
            Room.objects.select_related("host").get
        )(code=room_code)
        players = await Broadcast._get_players(room)
        params = await Broadcast._get_room_snapshot(room)

        return {
            "type": "settings_event",
            "event": message,
            "payload": {
                "players": players,
                "params": params
            }
        }