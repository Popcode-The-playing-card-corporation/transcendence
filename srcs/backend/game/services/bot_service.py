from asgiref.sync import sync_to_async
from ..models import PlayerPresence
from .room_task_service import RoomTaskService
from .broadcast_service import BroadcastService
from django.utils import timezone
from datetime import timedelta
from ..db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
from channels.layers import get_channel_layer
import asyncio


class BotService:

    @staticmethod
    async def play_until_human(room, game_state, game, check_end=None, check_take_fold_callback=None):
        channel_layer = get_channel_layer()
        is_end, gs = await check_end(room, game)
        if is_end:
            return game_state
        
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        
        if p.is_human and p.is_afk:
            game_state = await BotService.play_bot(game, room.code, check_end=check_end)
            if (check_take_fold_callback):
                take_fold, game_state = await check_take_fold_callback(game_state, room)
                if (take_fold):
                    await BroadcastService.broadcast_game(room.code, channel_layer, "finish_round")
            await save_room_state(room.uuid, game_state)
            room = await get_room_with_host(room.code)
            is_end, gs = await check_end(room, game)
            if is_end:
                return
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(game_state["playing"])
            )
            

        while (not is_end and (not p.is_human or not p.is_online)):
            
            #await asyncio.sleep(2.0)
            
            game_state = await BotService.play_bot(game, room.code, check_end=check_end)
            await save_room_state(room.uuid, game_state)
            await BroadcastService.broadcast_game(room.code, channel_layer, "card_valid")

            #await asyncio.sleep(1.2)
            if (check_take_fold_callback):
                take_fold, game_state = await check_take_fold_callback(game_state, room)
                if (take_fold):
                    await BroadcastService.broadcast_game(room.code, channel_layer, "finish_round")

            room = await get_room_with_host(room.code)
            is_end, gs = await check_end(room, game)
            if is_end:
                return
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(game_state["playing"])
            )
            #TODO add here task for ? idk xD
            
            if p.is_human and p.is_online:
                await RoomTaskService.schedule_play_for_player(room.code, p.player_id, 30 if game_state["round"] == 0 else 15)
            
                
    @staticmethod
    async def play_bot(game, room_code, check_end=None):
        room = await get_room_with_host(room_code)
        game_state = room.game_state
        is_end, gs = await check_end(room, game)
        if is_end:
            return game_state
        
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        if not p.is_online or not p.is_human or p.is_afk:
            await asyncio.sleep(2.0)
            position = str(game_state["playing"])
    
            legal = game.handleAction("legal", game_state, idPlayer= position)
             
            card = bot(game_state, position, legal, p.difficulty)
             
            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            
            room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
            await sync_to_async(room.save)()

            await save_room_state(room.uuid, game_state)
        
        return game_state
     
    
    @staticmethod
    async def replace_disconnected_player(room, user, play_callback):

        position = await get_player_pos(user, room.code)

        if not room.game_state:
            return

        if str(position) != str(room.game_state.get("playing")):
            return

        game = GameEngine(room.uuid)

        legal = game.handleAction(
            "legal",
            room.game_state,
            idPlayer=str(position)
        )

        payload = {
            "cardId": bot(
                room.game_state,
                str(position),
                legal
            )
        }

        await play_callback(payload)