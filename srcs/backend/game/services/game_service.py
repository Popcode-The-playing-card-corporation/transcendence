
from ..db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from ..models import PlayerPresence, Room, PlayerScore, Stat
from api.models import Friendship, User
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from game_engine.card import Card
import copy
from .board_service import BoardService
from .stats_service import StatsService
from .score_service import ScoreService
from .bot_service import BotService
from .room_task_service import RoomTaskService
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

        room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
        await sync_to_async(room.save)()

        await start_room(room.uuid, game_state)

        await GameService.create_scores(room, game_state)
        await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
        
        if send_init_callback:
                await send_init_callback()
                
        game_state = await BotService.play_until_human(room, game_state, game, 
                                                       send_data_callback=send_data_callback, 
                                                       check_end=GameService.check_game_end, 
                                                       check_take_fold_callback=GameService.check_take_fold
                                                )
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        if p.is_human and p.is_online:
            await RoomTaskService.schedule_play_for_player(room.code, p.player_id, 30 if game_state["round"] == 0 else 15)
            
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

    def findSuit(bucket):
        cardValue = {"6": 1, "7": 2, "8": 3, "9": 4, "10": 5, "J": 6, "Q": 7, "K": 8, "A": 9}
        suitePoint = {3: 20, 4: 50, 5: 100, 6: 150, 7: 200, 8: 250, 9: 300}

        ret = []

        for b in bucket.values():
            cards = {"cards": [], "point": 0}
            if (len(b) >= 3):
                b = sorted(b)
                value = 0
                suite = 1
                for c in b:
                    if (value == 0):
                        value = cardValue[c.values]
                        cards["cards"].append(c.id)
                        continue
                    if (cardValue[c.values] == value + 1):
                        value += 1
                        suite += 1
                        cards["cards"].append(c.id)
                    else:
                        if (suite > 2):
                            cards["point"] = suitePoint[len(cards["cards"])]
                            ret.append(copy.deepcopy(cards))
                        value = 0
                        suite = 1
                        cards["cards"] = []
                if (suite > 2):
                    cards["point"] = suitePoint[len(cards["cards"])]
                    ret.append(copy.deepcopy(cards))

        return ret
    
    @staticmethod
    async def count_melds(cards):
        clubs = []
        spades = []
        diamonds = []
        hearts = []
        bucket = {"club": clubs, "spade": spades, "diamond": diamonds, "heart": hearts}

        ex = Card("-1", "none")
        for c in cards:
            if (type(ex) == type(c)):
                cList = bucket[c.colors]
                cList.append(Card(c.values, c.colors, c.id))
            else:
                cList = bucket[c["color"]]
                cList.append(Card(c["value"], c["color"], c["id"]))

        ret = GameService.findSuit(bucket)
        for c in clubs:
            if (c in spades and c in diamonds and c in hearts):
                cards = {"cards": [c.id, c.id + 9, c.id + 18, c.id + 27], "point": 0}
                if (c.values == "J"):
                    cards["point"] = 200
                elif (c.values == "9"):
                    cards["point"] = 150
                else:
                    cards["point"] = 100
                ret.append(copy.deepcopy(cards))

        return ret

    @staticmethod
    async def play_card(room, user, position, card_id):
        game = GameEngine(room.uuid)
        state = copy.deepcopy(room.game_state)

        legal = game.handleAction("legal", state, idPlayer=str(position))
        if len(legal) == 0:
            return {"error": "No card in hand"}
        idx = await GameService.get_card_index(user, room, card_id)

        if idx is None:
            return {"error": "Card not found"}

        if idx >= len(legal) and not legal[idx]:
            return {"error": "Illegal move"}
        if room.game_state["playing"] != position:
            return {"error": "Not your turn bitch !!!"}
        state, taker, melds = await BoardService.resolve_if_needed(
            game, state, room, position, idx
        )

        prev_tricks = copy.deepcopy(state["tricks"])

        await RoomTaskService.cancel_play_for_player(room.code, user.id)
        state = game.handleAction("play", state, idPlayer=str(position), idCard=idx)
        
        room.round_time = (timezone.now() + timedelta(seconds=(25 if state["round"] == 0 else 10)))
        await sync_to_async(room.save)()
            
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
    async def check_take_fold(game_state, room):
        card_on_board = len(game_state["board"]) - 1
        nb_players = len(game_state["players"])

        if (card_on_board == nb_players):
            game = GameEngine(room.uuid)

            game_state, melds = game.handleAction("take_fold", game_state)
            await save_room_state(room.uuid, game_state)
            
            await ScoreService.save_meld(room.code, game_state["playing"], game_state["game"], game_state["round"] - 1, melds)
            await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
            return True, game_state
        
        return False, game_state

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
   
        game = GameEngine(room.uuid)

        points = game.handleAction("get_final_score", game_state)
        
        await ScoreService.save_final_score(room.code, room.game_state["game"], room.game_state["round"], points)

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
                    "actions": ["continue", "end_game"]
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
        
        room.game_state["game"] += 1
        
        await save_room_state(room.uuid, room.game_state)

        await start_room(
            room.uuid,
            game_state
        )
        await ScoreService.create_logs(room.code, game_state["game"], game_state["round"])
        if send_init_callback:
                await send_init_callback()
        
        game_state = await BotService.play_until_human(
            room,
            game_state,
            game,
            send_data_callback,
            check_end=GameService.check_game_end,
            check_take_fold_callback=GameService.check_take_fold
        )
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        if p.is_human and p.is_online:
            await RoomTaskService.schedule_play_for_player(room.code, p.player_id, 30 if game_state["round"] == 0 else 15)
            
        return game_state