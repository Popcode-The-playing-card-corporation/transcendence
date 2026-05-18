import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from .models import PlayerPresence, Room, PlayerScore, Stat
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
import copy

CARD_VALUES = {
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14   # ou 1 selon ton jeu
}

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.code = self.scope["url_route"]["kwargs"]["code"]
        self.group_name = f"room_{self.code}"
        
        self.user = self.scope.get("user")
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        try:
            room = await sync_to_async(Room.objects.get)(code=self.code)
        except Room.DoesNotExist:
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "error",
                "message": "La room n'existe pas ou a été supprimée"
            }))
            await self.close(code=4004)
            return
        
        is_member = await sync_to_async(
            PlayerPresence.objects.filter(
                player=self.user,
                room=room
            ).exists
        )()
        
        if room.status == "end":
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "game_ended",
                "message": "La partie est déjà finie"
            }, ensure_ascii=False))
            await self.close(code=4003)
            return
        
        if room.status == "start" and not is_member:
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "game_started",
                "message": "La partie est déjà lancée"
            }, ensure_ascii=False))
            await self.close(code=4003)
            return
        await self.accept()

        await add_player_to_room(self.user, self.code)
        
        await sync_to_async(PlayerPresence.objects.filter(
            player=self.user,
            room=room
        ).update)(
            channel_name=self.channel_name
        )
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "user_joined",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )
        if room.status == "start":
            await self.send_data()

    async def disconnect(self, close_code):
        group_name = getattr(self, "group_name", None)
        code = getattr(self, "code", None)
        user = getattr(self, "user", None)
        
        room = await get_room_with_host(self.code)
        if group_name:
            await self.channel_layer.group_discard(
                group_name,
                self.channel_name
            )

        if user and code:
            await remove_player_from_room(user, code)
            
            await sync_to_async(PlayerPresence.objects.filter(
                player=self.user,
                room__code=self.code
            ).update)(
                channel_name=None
            )
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "user_left",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "host_changed",
                "payload": {
                    "new_host": room.host.username
                }
            }
        )
        position = get_player_pos(user, room.code)
        if (int(position) == int(room.game_state["playing"])):
            game = GameEngine(room.uuid)
            legal = game.handleAction("legal", room.game_state, idPlayer= str(position))
            payload = {
                "cardId": bot(room.game_state, int(position), legal)
            }
            self.handle_play_card(payload)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        
            msg_type = data.get("type")
            action = data.get("action")
            payload = data.get("payload", {})

            if msg_type == "action":
                if action == "start_game":
                    await self.handle_start_game()
                if action == "play_card":
                    await self.handle_play_card(payload)
                if action == "continue":
                    await self.handle_continue_game()
                if action == "end_game":
                    await self.handle_end_game()
                if action == "melds":
                    await self.handle_melds(payload)
                if action == "verify_melds":
                    await self.handle_verify_melds(payload)
            else:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "Unknown message type"
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Invalid JSON"
            }))



    async def private_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "private",
            "event": event["event"],
            "payload": event["payload"]
        }))

    async def room_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "event",
            "event": event["event"],
            "payload": event.get("payload", {}),
        }))

    async def handle_start_game(self):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
    
        if room.status == "start":
            await self.send(json.dumps({
                "event": "error",
                "message": "Game already started"
            }))
            return
        
        game = GameEngine(room.uuid)
        game_state = game.handleAction("start", room.game_state, await count_player(room.code))
        
        for player_id, player_data in game_state["players"].items():
            presence = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(player_id)
            )
            
            user = await sync_to_async(lambda: presence.player)()
        
            await sync_to_async(PlayerScore.objects.get_or_create)(
                player=user,
                room=room
            )
        
        await start_room(room.uuid, game_state)
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_started",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )
        await self.send_init()

        p = await sync_to_async(PlayerPresence.objects.get)(
            room=room,
            position= game_state["playing"]
        )
        while (not p.is_human):
            print(game_state)
            position = str(game_state["playing"])
            legal = game.handleAction("legal", game_state, idPlayer= position)
            card = bot(game_state, position, legal, p.difficulty)
            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            await save_room_state(room.uuid, game_state)

            await self.send_data()
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position= game_state["playing"]
            )
        self.send_data()

    async def end(self, room, game):
        player_finished = 0
        game_state = room.game_states
        for player_id, player_data in game_state["players"].items():
            if len(player_data["cards"]) == 0:
                player_finished += 1
        if player_finished == room.nb_player:
            game_state = game.handleAction("point", game_state)
            await save_room_state(room.uuid, game_state)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "game finished do you want continue or stop ?"
					}
                }
            )
            return True
        return False
        
    async def handle_play_card(self, payload: dict):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        if int(position) != int(room.game_state["playing"]):
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "ce n'est pas à toi de jouer"
					}
                }
            )
            return

        game = GameEngine(room.uuid)
        
        legal = game.handleAction("legal", room.game_state, idPlayer=str(position))
        idx = await self.get_position(payload["cardId"])
        if idx >= len(legal) or idx < 0:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "il n'y a pas de carte a cette position"
					}
                }
            )
            return
        
        if not legal[idx]:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "tu ne peux pas jouer cette carte"
					}
                }
            )
            return

        taker = -1
        state = copy.deepcopy(room.game_state)
        if len(state["board"]) == room.nb_player:
            melds = game.handleAction("board_meld", state, idPlayer= str(position), idCard= int(idx))
            taker = game.handleAction("who_take", state, idPlayer= str(position), idCard= int(idx))

            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(taker)
            )
            stat = await sync_to_async(Stat.objects.get)(user_id=p.player_id)
            stat.board_meld_points = stat.board_meld_points + melds
            if stat.highest_board_meld < melds:
                stat.highest_board_meld = melds
            stat.nb_taken += 1
            await sync_to_async(stat.save)()

        tricks = copy.deepcopy(state["tricks"])
        game_state = game.handleAction("play", state, idPlayer= str(position), idCard= int(idx))
        await save_room_state(room.uuid, game_state)
        if game_state["tricks"] != tricks and game_state["tricks"] != "none":
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(taker)
            )
            stat = await sync_to_async(Stat.objects.get)(user_id=p.player_id)
            stat.nb_trick_choose += 1
            stat.tricks[game_state["tricks"]] += 1
            preferred = max(stat.tricks, key=stat.tricks.get)
            stat.prefered_trick = preferred
            await sync_to_async(stat.save)()

        if (self.end(room, game)):
            return 

        await self.send_data()

        p = await sync_to_async(PlayerPresence.objects.get)(
            room=room,
            position= await get_player_pos(self.user, room.code)
        )
        while (not p.is_human or not p.is_online):
            position = str(game_state["playing"])
            card = bot(game_state, position, legal, p.difficulty)
            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            await save_room_state(room.uuid, game_state)

            if (self.end(room, game)):
                return

            await self.send_data()

            player_finished = 0
            for player_id, player_data in game_state["players"].items():
                p = await sync_to_async(PlayerPresence.objects.get)(
                    room=room,
                    position= await get_player_pos(self.user, room.code)
                )
                if len(player_data["cards"]) == 0:
                    player_finished += 1

            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(game_state["playing"])
            )
                
        if player_finished == room.nb_player:
            stat = await sync_to_async(Stat.objects.get)(user_id=p.player_id)
            stat.nb_last_take += 1
            await sync_to_async(stat.save)()
            game_state = game.handleAction("point", game_state)
            await save_room_state(room.uuid, game_state)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "game finished do you want continue or stop ?"
					}
                }
            )
            return
        await self.send_data()

    async def handle_melds(self, payload: dict):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        if int(position) != int(room.game_state["playing"]):
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "ce n'est pas à toi de jouer"
					}
                }
            )
            return

        first_round = 0
        for player_id, player_data in room.game_state["players"].items():
            if len(player_data["taken"]) != 0:
                first_round += 1
        if first_round != 0:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "tu ne peux plus faire d'annonce"
					}
                }
            )
            return 

        if len(payload["cards"]) < 3:
            return
        
        player_cards = room.game_state["players"][str(position)]["cards"]

        selected_cards = []
        selected_cards_idx = []
        
        for card in payload["cards"]:
            idx = await self.get_position(card["cardId"])
            if idx == -1:
                await self.send(json.dumps({
                    "type": "meld_result",
                    "valid": False,
                    "message": "Carte invalide ou non présente dans la main"
                }))
                return
            selected_cards.append(player_cards[idx])
            selected_cards_idx.append(idx)
        
        values_cards = [
            {
                "value": CARD_VALUES[card["value"]],
                "color": card["color"],
                "raw": card
            }
            for card in selected_cards
        ]
        
        values_cards.sort(key=lambda x: x["value"])
        
        sequences = []
        current_seq = [values_cards[0]]
        
        for i in range(1, len(values_cards)):
            prev = values_cards[i - 1]
            curr = values_cards[i]
        
            if curr["value"] == prev["value"] + 1 and curr["color"] == prev["color"]:
                current_seq.append(curr)
            else:
                sequences.append(current_seq)
                current_seq = [curr]
        
        sequences.append(current_seq)
        valid_sequences = []

        for seq in sequences:
            if len(seq) >= 3:
                valid_sequences.append(seq)

        used_cards_count = sum(len(seq) for seq in valid_sequences)
        
        total_selected = len(selected_cards)
        
        all_cards_used = used_cards_count == total_selected
        
        if all_cards_used:
            game = GameEngine(room.uuid)
            game_state = game.handleAction("meld", room.game_state, idPlayer=str(position), meldIndex=selected_cards_idx )
            
            melds = game.handleAction("point_meld", room.game_state, idPlayer=str(position), meldIndex=selected_cards_idx )
            stat = await sync_to_async(Stat.objects.get)(user_id=self.user.id)
            stat.hand_meld_points = stat.hand_meld_points + melds
            if stat.highest_hand_meld < melds:
                stat.highest_hand_meld = melds
            await sync_to_async(stat.save)()
            
            await save_room_state(room.uuid, game_state)
        else:
            await self.send(json.dumps({
                "type": "meld_result",
                "valid": False,
                "message": "Toutes les cartes doivent appartenir à des suites valides"
            }))

    async def handle_verify_melds(self, payload: dict):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        if int(position) != int(room.game_state["playing"]):
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "ce n'est pas à toi de jouer"
					}
                }
            )
            return

        first_round = 0
        for player_id, player_data in room.game_state["players"].items():
            if len(player_data["taken"]) != 0:
                first_round += 1
        if first_round != 0:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "tu ne peux plus faire d'annonce"
					}
                }
            )
            return 

        if len(payload["cards"]) < 3:
            return
        
        player_cards = room.game_state["players"][str(position)]["cards"]

        selected_cards = []
        
        for card in payload["cards"]:
            idx = await self.get_position(card["cardId"])
            if idx == -1:
                await self.send(json.dumps({
                    "type": "meld_result",
                    "valid": False,
                    "message": "Carte invalide ou non présente dans la main"
                }))
                return
            selected_cards.append(player_cards[idx])
        
        values_cards = [
            {
                "value": CARD_VALUES[card["value"]],
                "color": card["color"],
                "raw": card
            }
            for card in selected_cards
        ]
        
        values_cards.sort(key=lambda x: x["value"])
        
        sequences = []
        current_seq = [values_cards[0]]
        
        for i in range(1, len(values_cards)):
            prev = values_cards[i - 1]
            curr = values_cards[i]
        
            if curr["value"] == prev["value"] + 1 and curr["color"] == prev["color"]:
                current_seq.append(curr)
            else:
                sequences.append(current_seq)
                current_seq = [curr]
        
        sequences.append(current_seq)
        valid_sequences = []

        for seq in sequences:
            if len(seq) >= 3:
                valid_sequences.append(seq)

        used_cards_count = sum(len(seq) for seq in valid_sequences)
        
        total_selected = len(selected_cards)
        
        all_cards_used = used_cards_count == total_selected
        
        if all_cards_used:
            await self.send(json.dumps({
                "type": "meld_result",
                "valid": True,
                "valid_sequences": [
                    [card["raw"] for card in seq]
                    for seq in valid_sequences
                ]
            }))
        else:
            await self.send(json.dumps({
                "type": "meld_result",
                "valid": False,
                "message": "Toutes les cartes doivent appartenir à des suites valides"
            }))
        
    async def handle_continue_game(self):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
        
        # for player_id, player_data in room.game_state["players"].items():
        #     if len(player_data["cards"]) != 0:
        #         return
        
        game = GameEngine(room.uuid)
        game_state = game.handleAction("start", room.game_state, await count_player(room.code))
                
        await start_room(room.uuid, game_state)
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_started",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )
        await self.send_data()

        p = await sync_to_async(PlayerPresence.objects.get)(
            room=room,
            position= game_state["playing"]
        )
        while (not p.is_human):
            print(game_state)
            position = str(game_state["playing"])
            legal = game.handleAction("legal", game_state, idPlayer= position)
            card = bot(game_state, position, legal, p.difficulty)
            game_state = game.handleAction("play", game_state, idPlayer= position, idCard= card)
            await save_room_state(room.uuid, game_state)

            await self.send_data()
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position= game_state["playing"]
            )

    async def handle_end_game(self):
        room = await get_room_with_host(self.code)

        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
        
        if room.status == "open" or room.status == "end":
            await self.send(json.dumps({
                "event": "error",
                "message": "Game not launch or already stopped"
            }))
            return

        await end_room(room.uuid, room.game_state)
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_ended",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )

    async def get_position(self, cardId):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)
        i = 0
        for card in room.game_state["players"][str(position)]["cards"]:
            if card["id"] == cardId:
                return i
            i += 1
        return -1

    async def send_init(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state
        
        game = GameEngine(room.uuid)
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(player_id)
            )
            if int(player_id) == game_state["playing"]:
                legal = game.handleAction("legal", game_state, idPlayer=str(player_id))
                if p.channel_name:
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                                "legal": legal,
                                
                            }
                        }
                    )
            else:
                if p.channel_name:
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                            }
                        }
                    )

    async def send_data(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state
        
        game = GameEngine(room.uuid)
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(player_id)
            )
            if int(player_id) == game_state["playing"]:
                legal = game.handleAction("legal", game_state, idPlayer=str(player_id))
                if p.channel_name:
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                                "legal": legal,
                            }
                        }
                    )
            else:
                player_puntos = {}

                for player_id, player_data in game_state["players"].items():
                    player_puntos[player_id] = player_data["puntos"]
                
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "room_event",
                        "event": "board_data",
                        "payload": {
                            "board": game_state["board"],
                            "puntos": player_puntos
                        }
                    }
                )
    
    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"