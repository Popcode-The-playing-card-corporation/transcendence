from asgiref.sync import sync_to_async
from ..db import  remove_player_from_room, get_room_with_host, get_params
from datetime import timedelta

from ..models import PlayerPresence

from channels.layers import get_channel_layer

import asyncio

class BroadcastService:

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
                "username": p.player.username,
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
            "timestamp": (room.created_at + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
        }
            
    @staticmethod
    async def broadcast_settings(room_code, channel_layer, message, group):
        room = await get_room_with_host(room_code)
        players = await BroadcastService._get_players(room)
        params = await BroadcastService._get_room_snapshot(room)

        await channel_layer.group_send(
            group,
            {
                "type": "settings_event",
                "event": message,
                "payload": {
                    "players": players,
                    "params": params
                }
            }
        )
    