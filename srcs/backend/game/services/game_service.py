
from ..db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from ..models import PlayerPresence, Room, PlayerScore, Stat
from api.models import Friendship, User
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
from django.db.models import Q
import copy
from .board_service import BoardService
from .stats_service import StatsService
from .bot_service import BotService
from channels.layers import get_channel_layer



class GameService:

    @staticmethod
    async def start_game(room, send_data_callback=None, send_init_callback=None):
        game = GameEngine(room.uuid)

        game_state = game.handleAction(
            "start",
            room.game_state,
            await count_player(room.code)
        )

        await start_room(room.uuid, game_state)

        await GameService.create_scores(room, game_state)
        
        if send_init_callback:
                await send_init_callback()
                
        game_state = await BotService.play_until_human(room, game_state, game, send_data_callback=send_data_callback, check_end=GameService.check_game_end)

        return game_state
    
    @staticmethod
    async def create_scores(room, game_state):
        for player_id in game_state["players"]:
            presence = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(player_id)
            )
    
            user = presence.player
    
            await sync_to_async(PlayerScore.objects.get_or_create)(
                player=user,
                room=room
            )           

    @staticmethod
    async def play_card(room, user, position, card_id):
        game = GameEngine(room.uuid)
        state = copy.deepcopy(room.game_state)

        legal = game.handleAction("legal", state, idPlayer=str(position))

        idx = await GameService.get_card_index(user, room, card_id)

        if idx is None:
            return {"error": "Card not found"}

        if idx >= len(legal) or not legal[idx]:
            return {"error": "Illegal move"}

        state, taker, melds = await BoardService.resolve_if_needed(
            game, state, room, position, idx
        )

        prev_tricks = copy.deepcopy(state["tricks"])

        state = game.handleAction("play", state, idPlayer=str(position), idCard=idx)

        await save_room_state(room.uuid, state)

        await StatsService.update_after_play(
            user=user,
            state=state,
            prev_tricks=prev_tricks,
            taker=taker,
            melds=melds
        )

        finished, game_state = await GameService.check_game_end(room, game)

        if finished:
            await GameService.ask_host_continue(room, game_state)
            return
        
        return {"state": state}

    @staticmethod
    async def get_card_index(user, room, card_id):
        room = await get_room_with_host(room.code)
        position = await get_player_pos(user, room.code)
        i = 0
        for card in room.game_state["players"][str(position)]["cards"]:
            if card["id"] == card_id:
                return i
            i += 1
        return -1
    
    @staticmethod
    async def ask_host_continue(room, game_state):
        
        await save_room_state(room.uuid, game_state)
    
        host_presence = await sync_to_async(PlayerPresence.objects.get)(
            room=room,
            player=room.host
        )
        channel_layer = get_channel_layer()
        await channel_layer.send(
            host_presence.channel_name,
            {
                "type": "room_event",
                "event": "game_finished",
                "payload": {
                    "message": "Game finished. Continue or stop?",
                    "actions": ["continue", "stop"]
                }
            }
        )
    
    @staticmethod
    async def check_game_end(room, game):
        game_state = room.game_state
    
        finished = all(
            len(p["cards"]) == 0
            for p in game_state["players"].values()
        )
    
        if not finished:
            return False, None
    
        game_state = game.handleAction("point", game_state)
        await save_room_state(room.uuid, game_state)
    
        return True, game_state

    @staticmethod
    async def continue_game(
        room,
        send_data_callback=None,
        send_init_callback=None
    ):
        game = GameEngine(room.uuid)

        game_state = game.handleAction(
            "start",
            room.game_state,
            await count_player(room.code)
        )

        await start_room(
            room.uuid,
            game_state
        )
        
        if send_init_callback:
                await send_init_callback()
                
        game_state = await BotService.play_until_human(
            room,
            game_state,
            game,
            send_data_callback,
            check_end=GameService.check_game_end
        )

        return game_state