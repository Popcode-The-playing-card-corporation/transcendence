from asgiref.sync import sync_to_async
from ..db import  remove_player_from_room, get_room_with_host, get_params
from datetime import timedelta
from ..models import PlayerPresence, GameLog
import json
from game_engine.game import GameEngine
from channels.layers import get_channel_layer
from game_engine.card import Card
import copy

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
            "goal": room.goal,
            **(
                {"nb_games": room.nb_games}
                if room.goal == "games"
                else {"nb_points": room.nb_points}
            ),
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
    
    @staticmethod
    async def _board_data(room, player_position, is_r0_finish=False):
        room = await get_room_with_host(room.code)
        game_state = room.game_state

        player_puntos = {}
        player_list = {}
        detailed_points = {}
        player_annonces = []
        
        for player_id, player_data in game_state["players"].items():

            p = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=room.id,
                position=int(player_id)
            )

            player_id_str = str(player_id)
            
            if is_r0_finish:
                for meld in player_data.get("melds", []):
                    player_annonces.append({
                        "room_id": player_id,
                        "cards": meld["cards"]
                    })
                
            player_puntos[player_id_str] = player_data["puntos"]
            p_name = p.player.username
            if not p.is_human:
                if p.difficulty == "easy":
                    p_name += " [kILIAN]"
                elif p.difficulty == "medium":
                    p_name += " [Alex]"
                elif p.difficulty == "hard":
                    p_name += " [Dana]"
                    
            player_list[player_id_str] = {
                "hand": len(player_data["cards"]),
                "user": {
                    "id": p.player.id,
                    "username": p_name,
                    "avatar": p.player.avatar,
                }
            }

        logs = await sync_to_async(list)(
            GameLog.objects.filter(room=room)
        )

        nb_round = int(36 / room.nb_player)

        for log in logs:
            player = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=log.room_id,
                id=log.player_id
            )

            game_key = str(log.game)
            round_key = str(log.round)

            if game_key not in detailed_points:
                detailed_points[game_key] = {}

            if round_key == str(nb_round):
                if "total" not in detailed_points[game_key]:
                    detailed_points[game_key]["total"] = []

                detailed_points[game_key]["is_finished"] = True

                detailed_points[game_key]["total"].append({
                    "id": str(player.player_id),
                    "username": player.player.username,
                    "score": log.score,
                })
            else:
                if round_key not in detailed_points[game_key]:
                    detailed_points[game_key][round_key] = []

                detailed_points[game_key][round_key].append({
                    "id": str(player.player_id),
                    "username": player.player.username,
                    "score": log.score,
                })
                    
            tmp_board = game_state['board']
            asked = tmp_board.get('asked')
            if asked:
                board = []
                for id, cards in tmp_board.items():
                    if id == "asked":
                        continue
                    board.append({"room_id":id, "card":cards})
            else:
                board = []
                
        return {
            "self_id": player_position,
            "trick": None if game_state["tricks"] == "none" else game_state["tricks"],
            **(
                {"annonces": player_annonces}
                if is_r0_finish
                else {}
            ),
            "board": board,
            "asked": asked,
            "points": player_puntos,
            "detailed_points": detailed_points,
            "playing": game_state["playing"],
            "player_list": player_list,
            "started_at": room.started_at.strftime("%Y-%m-%d %H:%M:%S"),
            "round_time": room.round_time.strftime("%H:%M:%S"),
            "round": game_state["round"],
            "last_fold": {
                    "room_id": game_state.get("last_fold_player"),
                    "cards": game_state.get("last_fold"),
                }
        }       
    
    @staticmethod
    def _find_suit(bucket):
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
                        value = cardValue[c.values]
                        suite = 1
                        cards["cards"] = []
                        cards["cards"].append(c.id)
                if (suite > 2):
                    cards["point"] = suitePoint[len(cards["cards"])]
                    ret.append(copy.deepcopy(cards))
    
        return ret
    
    @staticmethod
    def _count_melds(cards):
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

        ret = BroadcastService._find_suit(bucket)
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
    async def _get_cards(room, player_data, player_id):
        
        game_state = room.game_state
        game = GameEngine(room.uuid)
        melds = BroadcastService._count_melds(player_data["cards"])
        
        init_cards = {
                "hand": player_data["cards"],
                **(
                    {"legal": game.handleAction(
                        "legal",
                        game_state,
                        idPlayer=str(player_id),
                        
                    )} if game_state["playing"] == int(player_id)
                       else {}
                ),
                "melds": melds
            }
        
        return init_cards
    
    @staticmethod
    async def broadcast_game(room_code, channel_layer, message, user=None):
        room = await get_room_with_host(room_code)
        
        game_state = room.game_state
        
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get
            )(
                room_id=room.id,
                position=int(player_id)
            )
            
            board_data = await BroadcastService._board_data(room, player_id, (message == "reveal_announces" and game_state["round"] == 0))
            init_cards = await BroadcastService._get_cards(room, player_data, player_id)
            
            if p.channel_name:
                await channel_layer.send(
                    p.channel_name,
                    {
                        "type": "game_event",
                        "event": message,
                        "payload": {
                            "self_card": init_cards,
                            "board_data": board_data,
                            **(
                                {"player_name": user}
                                if message in ("player_disconnect", "player_reconnect") and user
                                else {}
                            )
                        }
                    }
                )
            