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
                "username": await BroadcastService._get_username(p),
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
    async def _get_player_data(room, is_r0_finish):
        game_state = room.game_state
        player_puntos = []
        player_list = []
        player_annonces = []
        finished = 0
        
        for player_id, player_data in game_state["players"].items():

            p = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=room.id,
                position=int(player_id)
            )

            
            player_puntos.append({"room_id":int(player_id), "user_id":p.player.id, "username": await BroadcastService._get_username(p), "score":player_data["puntos"]})
            
            if is_r0_finish:
                melds = []
                for meld in player_data.get("melds", []):
                    melds.append(meld["cards"])
                
                player_annonces.append({
                    "username": await BroadcastService._get_username(p),
                    "room_id": int(player_id),
                    "cards": melds
                })
            if len(player_data["cards"]) == 0:
                finished += 1
            player_list.append( {
                "room_id": int(player_id),
                "hand": len(player_data["cards"]),
                "taken": len(player_data["taken"]),
                "user": {
                    "id": p.player.id,
                    "username": await BroadcastService._get_username(p),
                    "avatar": p.player.avatar,
                }
            } )
            
        return player_puntos, player_list, player_annonces, finished
        
    
    @staticmethod
    async def _board_data(room, player_position, is_r0_finish=False, is_game_finish=False):
        room = await get_room_with_host(room.code)
        game_state = room.game_state

        detailed_points = []
        
        player_puntos, player_list, player_annonces, finished = await BroadcastService._get_player_data(room, is_r0_finish)

        logs = await sync_to_async(list)(
            GameLog.objects.filter(room=room).order_by("game", "round", "player_id")
        )

        nb_round = int(36 / room.nb_player)

        for log in logs:
            p = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=log.room_id,
                id=log.player_id
            )

            game_num=int(log.game)
            round_num=int(log.round)

            game = None
            for cur_game in detailed_points:
                if cur_game["game"] == game_num:
                    game = cur_game
                    break
                
            if game is None:
                game = {
                    "game": game_num,
                    "rounds": [],
                    "is_finished": False,
                    "total": [],
				}
                detailed_points.append(game)
                
            player_score = {"id":p.player.id, "username": await BroadcastService._get_username(p), "score":log.score}
            
            if round_num == nb_round:
                game['is_finished'] = True
                game['total'].append(player_score)
            else:
                round = None
                for cur_round in game["rounds"]:
                    if cur_round["round"] == round_num:
                        round = cur_round
                        break
                        
                if round is None:
                    round = {"round":round_num, "players":[]}
                    game["rounds"].append(round)
                round["players"].append(player_score)
            
        for game in detailed_points:
            del game ["game"]
            for round in game["rounds"]:
                del round["round"]
                            
                    
            tmp_board = game_state['board']
            asked = tmp_board.get('asked')
            if asked:
                board = []
                for id, cards in tmp_board.items():
                    if id == "asked":
                        continue
                    board.append({"room_id":int(id), "card":cards})
            else:
                board = []
                
        user = await sync_to_async(PlayerPresence.objects.select_related("player").get)(position=player_position, room=room)
        username = await BroadcastService._get_username(user)
        last_fold_id = game_state.get("last_fold_player")
        last_fold_username = ""
        if last_fold_id is not None:
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(room=room, position=last_fold_id)
            last_fold_username = await BroadcastService._get_username(p)
        
        return {
            "self_id": int(player_position),
            "host": room.host.username,
            "user": username,
            "trick": None if game_state["tricks"] == "none" else game_state["tricks"],
            "lastCard": None if game_state["lastCard"]["id"] == -1 or finished < room.nb_player else game_state["lastCard"],
            "annonces": player_annonces,
            "board": board,
            "asked": asked,
            "points": player_puntos,
            "detailed_points": detailed_points,
            "playing": game_state["playing"] if not is_game_finish else -1,
            "player_list": player_list,
            "started_at": room.started_at.strftime("%Y-%m-%d %H:%M:%S"),
            "round_time": (room.round_time + timedelta(seconds=5)).strftime("%Y-%m-%d %H:%M:%S"),
            "round": game_state["round"],
            "game": game_state["game"],
            "last_fold": {
					"username": last_fold_username,
                    "room_id": last_fold_id,
                    "cards": game_state.get("last_fold"),
                },
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
                cards = {"cards": [c.id, c.id + 9, c.id + 18, c.id + 27], "points": 0}
                if (c.values == "J"):
                    cards["points"] = 200
                elif (c.values == "9"):
                    cards["points"] = 150
                else:
                    cards["points"] = 100
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
            if (not (message == "finish_round" or message == "reveal_announces")):
                room.wait_schedule = False
                await sync_to_async(room.save)()
                      
            board_data = await BroadcastService._board_data(room, player_id, is_r0_finish=(message == "reveal_announces" and game_state["round"] == 0), is_game_finish=(message == "finish_round" or message == "reveal_announces"))
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
            