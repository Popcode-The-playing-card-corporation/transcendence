
from ..db import save_room_state, get_room_with_host, start_room, count_player, end_room
from ..models import PlayerPresence,  PlayerScore
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from django.utils import timezone
from datetime import timedelta
import copy
from .board_service import BoardService
from .stats_service import StatsService
from .score_service import ScoreService
from .bot_service import BotService
from .broadcast_service import BroadcastService
from .room_task_service import RoomTaskService
from .meld_service import MeldService
from channels.layers import get_channel_layer

import json
import asyncio

class GameService:

    @staticmethod
    async def start_game(room):
        game = GameEngine(room.uuid)
        room = await get_room_with_host(room.code)
        channel_layer = get_channel_layer()

        game_state = game.handleAction(
            "start",
            room.game_state,
            await count_player(room.code)
        )

        room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
        await sync_to_async(room.save)()

        await start_room(room.uuid, game_state)

        await GameService.create_scores(room, game_state)
        await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
        
        await BroadcastService.broadcast_game(room.code, channel_layer, "game_started")
        await BroadcastService.broadcast_game(room.code, channel_layer, "start_round")
        
        game_state = await BotService.play_until_human(room, game_state, game,
                                                        check_end=GameService.check_game_end, 
                                                        check_take_fold_callback=GameService.check_take_fold,
                                                        ask_continue=GameService.check_goal_reached
                                                )
        
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
    async def create_scores(room, game_state):
        for player_id in game_state["players"]:
            presence = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(player_id)
            )
    
            await sync_to_async(PlayerScore.objects.get_or_create)(
                player=presence,
                room=room
            )   

    @staticmethod
    async def play_card(room, user, position, card_id):
        game = GameEngine(room.uuid)
        state = copy.deepcopy(room.game_state)
        
        channel_layer = get_channel_layer()

        legal = game.handleAction("legal", state, idPlayer=str(position))
        if len(legal) == 0:
            return {"error": "No card in hand"}
        idx = await MeldService.get_card_index(user, room, card_id)

        if idx is None:
            return {"error": "Card not found"}

        if idx >= len(legal):
            return {"error": "Card not found"}
        
        if not legal[idx]:
            await channel_layer.group_send(
                f"player_{user.id}",
                {
                    "type": "game_event",
                    "event": "card_valid",
                    "payload": {"status": "invalid"}
                }
            )
            return {"invalid": "Card not found"}
        
        if room.game_state["playing"] != position:
            await channel_layer.group_send(
                f"player_{user.id}",
                {
                    "type": "game_event",
                    "event": "card_valid",
                    "payload": {"status": "invalid"}
                }
            )
            return {"invalid": "Not your turn bitch !!!"}
        state, taker, melds = await BoardService.resolve_if_needed(
            game, state, room, position, idx
        )

        prev_tricks = copy.deepcopy(state["tricks"])

        await RoomTaskService.cancel_play_for_player(room.code, user.id)
        state = game.handleAction("play", state, idPlayer=str(position), idCard=idx)
        
        room.round_time = (timezone.now() + timedelta(seconds=(25 if state["round"] == 0 else 10)))
        await sync_to_async(room.save)()
            
        state = await MeldService.check_shtokr(room, state)

        await save_room_state(room.uuid, state)

        await StatsService.update_after_play(
            user=user,
            state=state,
            prev_tricks=prev_tricks,
            taker=taker,
            melds=melds
        )
        #TODO delete this double id player finished ?
        finished, game_state = await GameService.check_game_end(room, game)

        if finished:
            await GameService.check_goal_reached(room.code)
            return
        
        return {"state": state}

    @staticmethod
    async def _count_hand_melds(room_code):
        room = await get_room_with_host(room_code)
        game_state = room.game_state
        
        nb_melds = 0
        
        for player_id, player_data in game_state["players"].items():
            for meld in player_data.get("melds", []):
                nb_melds += 1
        
        return nb_melds
        
        
    @staticmethod
    async def check_take_fold(game_state, room):
        room = await get_room_with_host(room.code)
        card_on_board = len(game_state["board"]) - 1
        nb_players = len(game_state["players"])
        channel_layer = get_channel_layer()

        if (card_on_board == nb_players):
            game = GameEngine(room.uuid)
            if room.game_state["round"] == 0:
                if await GameService._count_hand_melds(room.code) > 0:
                    await MeldService.play_melds(room)
                    room = await get_room_with_host(room.code)
                    game_state = room.game_state
                    await BroadcastService.broadcast_game(room.code, channel_layer, "reveal_announces")
                    await RoomTaskService.schedule_wait_time(room.code, game_state["round"], game_state["game"], 8)
                    await asyncio.sleep(3)
            
            
            await BroadcastService.broadcast_game(room.code, channel_layer, "finish_round")
            game_state, melds = game.handleAction("take_fold", game_state)
            await save_room_state(room.uuid, game_state)
            
            await ScoreService.save_meld(room.code, game_state["playing"], game_state["game"], game_state["round"] - 1, melds)
            await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
            
            
            game_state = game.handleAction("clear_board", game_state)
            await save_room_state(room.uuid, game_state)
            
            if not (room.game_state["round"] == 0 and await GameService._count_hand_melds(room.code) > 0):
                await RoomTaskService.schedule_wait_time(room.code, game_state["round"], game_state["game"], 5)
            await asyncio.sleep(5)
            
            return True, game_state
        
        return False, game_state
    
    @staticmethod
    async def ask_host_continue(room, game_state):
        room = await get_room_with_host(room.code)
        await save_room_state(room.uuid, game_state)
        
        game_state = room.game_state
        game = GameEngine(room.uuid)

        points = game.handleAction("get_final_score", game_state)
        
        game_state = game.handleAction("point", game_state)
        await save_room_state(room.uuid, game_state)
        
        await ScoreService.save_final_score(room.code, room.game_state["game"], room.game_state["round"], points)

    @staticmethod
    async def check_game_end(room, game):
        game_state = room.game_state
    
        finished = all(
            len(p["cards"]) == 0
            for p in game_state["players"].values()
        )
    
        if not finished:
            return False, None
    
        return True, game_state
    
    @staticmethod
    async def check_goal_reached(room_code):
        room = await get_room_with_host(room_code)
        game_state = room.game_state
        is_finished = False
        if room.goal == "games":
            if game_state["game"] >= room.nb_games - 1:
                is_finished = True
        elif room.goal == "points":
            for player_id, player_data in game_state["players"].items():
                if int(player_data["puntos"]) >= room.nb_points:
                    is_finished = True
        
        if is_finished:
            await GameService.ask_host_continue(room, game_state)
            channel_layer = get_channel_layer()

            room = await get_room_with_host(room_code)
            room.status = "end"
            await sync_to_async(room.save)()
        
            game_state = room.game_state
            await end_room(room.uuid, game_state)
            await BroadcastService.broadcast_game(room.code, channel_layer, "game_finish")
        else:
            await GameService.ask_host_continue(room, game_state)
            room = await get_room_with_host(room_code)
            await GameService.continue_game(room)
            
        

    @staticmethod
    async def continue_game(
        room
    ):
        game = GameEngine(room.uuid)

        game_state = game.handleAction(
            "start",
            room.game_state,
            await count_player(room.code)
        )
        
        room.game_state["game"] += 1
        
        await save_room_state(room.uuid, room.game_state)

        await start_room(
            room.uuid,
            game_state
        )
        channel_layer = get_channel_layer()
        await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
        await BroadcastService.broadcast_game(room.code, channel_layer, "game_continued")
          
        
        game_state = await BotService.play_until_human(
            room,
            game_state,
            game,
            check_end=GameService.check_game_end,
            check_take_fold_callback=GameService.check_take_fold,
            ask_continue=GameService.check_goal_reached
        )
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        if p.is_human and p.is_online:
            room = await get_room_with_host(room.code)
            game_state = room.game_state
            await RoomTaskService.schedule_play_for_player(room.code, p.player_id, game_state["round"], game_state["game"], 30 if game_state["round"] == 0 else 15)
            
        return game_state