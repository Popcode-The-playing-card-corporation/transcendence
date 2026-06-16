from asgiref.sync import sync_to_async
from ..models import PlayerPresence
from .room_service import RoomService
from django.utils import timezone
from datetime import timedelta
from ..db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from game_engine.game import GameEngine
from game_engine.bot.bot import bot

class BotService:

    @staticmethod
    async def play_until_human(room, game_state, game, send_data_callback=None, check_end=None, check_take_fold_callback=None):

        is_end, gs = await check_end(room, game)
        if is_end:
            return game_state
        
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )

        while (not is_end and not p.is_human or not p.is_online):
            position = str(game_state["playing"])

            legal = game.handleAction("legal", game_state, idPlayer= position)
            
            card = bot(game_state, position, legal, p.difficulty)

            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            
            game_state["round_time"] = (timezone.now() + timedelta(seconds=30)).strftime("%d/%m/%Y %H:%M:%S")
            
            await save_room_state(room.uuid, game_state)
            
            
            if send_data_callback:
                await send_data_callback()

            if (check_take_fold_callback):
                take_fold, game_state = await check_take_fold_callback(game_state, room)
                if (take_fold and send_data_callback):
                    await send_data_callback()

            is_end, gs = await check_end(room, game)
            if is_end:
                return
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(game_state["playing"])
            )
    
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