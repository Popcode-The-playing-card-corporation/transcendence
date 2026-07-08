from asgiref.sync import sync_to_async
from ..models import PlayerPresence, User, Room
from .room_task_service import RoomTaskService
from .broadcast_service import BroadcastService
from django.utils import timezone
from datetime import timedelta
from ..db import save_room_state, get_room_with_host
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
from channels.layers import get_channel_layer
from .meld_service import MeldService
import asyncio
import random

class BotService:

    @staticmethod
    async def play_afk(room, game_state, game, check_end=None, check_take_fold_callback=None, ask_continue=None):
        if not await sync_to_async(Room.objects.filter(code=room.code).exists)():
            return game_state
        channel_layer = get_channel_layer()
        is_end, gs = await check_end(room, game)
        if is_end:
            await ask_continue(room.code)
            return game_state
            
        room = await get_room_with_host(room.code)
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        
        if p.is_human and (p.is_afk or not p.is_online):
            await BroadcastService.broadcast_game(room.code, channel_layer, "bot_takeover")
            game_state = await BotService.play_bot(game, room.code, check_end=check_end, ask_continue=ask_continue)
            await BroadcastService.broadcast_game(room.code, channel_layer, "card_valid")
            game_state = await MeldService.check_shtokr(room, game_state)
            if (check_take_fold_callback):
                take_fold, game_state = await check_take_fold_callback(game_state, room)
                if (take_fold):
                    room = await get_room_with_host(room.code)
                    is_end, gs = await check_end(room, game)
                    if (not is_end):
                        game_state = room.game_state
                        await sync_to_async(Room.objects.filter(code=room.code).update)(round_time=(timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10))))
                        #room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
                        #await sync_to_async(room.save)()
                        await BroadcastService.broadcast_game(room.code, channel_layer, "start_round")

            await save_room_state(room.uuid, game_state)
            room = await get_room_with_host(room.code)
            p.is_afk = False
            await sync_to_async(p.save)()
            is_end, gs = await check_end(room, game)
            if is_end:
                await ask_continue(room.code)
                return game_state
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(game_state["playing"])
            )
            
            if p.is_human and p.is_online:
                room = await get_room_with_host(room.code)
                game_state = room.game_state
                await RoomTaskService.schedule_play_for_player(room.code, p.player_id, game_state["round"], game_state["game"], 30 if game_state["round"] == 0 else 15)
            
        return game_state

    @staticmethod
    async def play_until_human(room, game_state, game, check_end=None, check_take_fold_callback=None, ask_continue=None):
        channel_layer = get_channel_layer()
        room = await get_room_with_host(room.code)
        is_end, gs = await check_end(room, game)
        if is_end:
            await ask_continue(room.code)
            return game_state
        game_state = room.game_state
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        
        while (not is_end and (not p.is_human or not p.is_online) and not room.is_paused):
            await asyncio.sleep(random.randint(1, 3))

            if (game_state["round"] == 0):
                melds = BroadcastService._count_melds(game_state["players"][str(game_state["playing"])]["cards"])
                for a in melds:
                    cards = []
                    for c in a["cards"]:
                        cards.append({"cardId": c})
                    await MeldService.verify_melds(room, await sync_to_async(User.objects.get)(id=p.player_id), cards)

            if p.is_human and not p.is_online:
                await BroadcastService.broadcast_game(room.code, channel_layer, "bot_takeover")
                
            game_state = await BotService.play_bot(game, room.code, check_end=check_end, ask_continue=ask_continue)
            await save_room_state(room.uuid, game_state)
            await BroadcastService.broadcast_game(room.code, channel_layer, "card_valid")

            if (check_take_fold_callback):
                take_fold, game_state = await check_take_fold_callback(game_state, room)
                if (take_fold):
                    room = await get_room_with_host(room.code)
                    is_end, gs = await check_end(room, game)
                    if (not is_end):
                        game_state = room.game_state
                        room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
                        await sync_to_async(room.save)()
                        await BroadcastService.broadcast_game(room.code, channel_layer, "start_round")

            room = await get_room_with_host(room.code)
            is_end, gs = await check_end(room, game)
            if is_end:
                await ask_continue(room.code)
                return game_state
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(game_state["playing"])
            )
            
            if p.is_human and p.is_online:
                room = await get_room_with_host(room.code)
                game_state = room.game_state
                await RoomTaskService.schedule_play_for_player(room.code, p.player_id, game_state["round"], game_state["game"], 30 if game_state["round"] == 0 else 15)
            
            room = await get_room_with_host(room.code)
            
        return game_state
                
    @staticmethod
    async def play_bot(game, room_code, check_end=None, ask_continue=None):
        if not await sync_to_async(Room.objects.filter(code=room_code).exists)():
            return game_state
        room = await get_room_with_host(room_code)
        game_state = room.game_state
        is_end, gs = await check_end(room, game)
        if is_end:
            await ask_continue(room.code)
            return game_state
        
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        if not p.is_online or not p.is_human or p.is_afk:
            # await asyncio.sleep(2.0)
            position = str(game_state["playing"])
    
            legal = game.handleAction("legal", game_state, idPlayer= position)
             
            card = bot(game_state, position, legal, p.difficulty)
             
            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            
            room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
            await sync_to_async(room.save)()

            await save_room_state(room.uuid, game_state)
        
        return game_state
     
