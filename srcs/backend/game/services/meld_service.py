from ..db import save_room_state, get_player_pos, get_room_with_host
from .stats_service import StatsService
from game_engine.game import GameEngine
from .score_service import ScoreService
from game.models import PlayerPresence, Room
from asgiref.sync import sync_to_async
from game_engine.card import Card
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
    "A": 14
}

class MeldService:

    @staticmethod
    async def play_melds(room):
        room = await get_room_with_host(room.code)
        game_state = room.game_state
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=room.id,
                position=int(player_id)
            )

            cards = []
            for meld in player_data.get("melds", []):
                for card in meld["cards"]:
                    cards.append({
                        "cardId": card["id"]
                    })
            if len(cards) > 0:
                selected_cards_idx = await MeldService.extract_card_indexes(
                    room,
                    p.player,
                    cards
                )
                
                selected_cards = await MeldService.extract_cards(
                    room,
                    p.player,
                    player_id,
                    cards
                )
                
                if selected_cards_idx is None:
                    return {"error": "Carte invalide"}
        
                valid, _ = MeldService.compute_sequences(
                    selected_cards
                )
        
                if not valid:
                    return {
                        "error": "Toutes les cartes doivent appartenir à des suites valides"
                    }
        
                game = GameEngine(room.uuid)
        
                game_state = game.handleAction(
                    "meld",
                    game_state,
                    idPlayer=str(player_id),
                    meldIndex=selected_cards_idx
                )
    
                points = game.handleAction(
                    "point_meld",
                    game_state,
                    idPlayer=str(player_id),
                    meldIndex=selected_cards_idx
                )
            
                await ScoreService.save_meld(room.code, player_id, game_state["game"], game_state["round"], points * -1)
            
                await StatsService.add_meld_points(
                    p.player,
                    points
                )
                await save_room_state(room.uuid, game_state)
            
            room = await get_room_with_host(room.code)
            game_state = room.game_state

        return {
            "success": True
        }
        
    @staticmethod
    async def validate_turn(room, position):
    
        if int(position) != int(room.game_state["playing"]):
            return "Ce n'est pas à toi de jouer"
    
        first_round = any(
            len(player["taken"]) > 0
            for player in room.game_state["players"].values()
        )
    
        if first_round:
            return "Tu ne peux plus faire d'annonce"
    
        return None

    @staticmethod
    async def extract_card_indexes(room, user, cards):
    
        if len(cards) < 3:
            return None
    
        selected_idx = []
    
        for card in cards:
            idx = await MeldService.get_card_index(
                user,
                room,
                card["cardId"]
            )
    
            if idx == -1:
                return None
    
            selected_idx.append(idx)
    
        return selected_idx

    @staticmethod
    async def extract_cards(room, user, position, cards):
    
        player_cards = room.game_state["players"][str(position)]["cards"]
    
        selected_cards = []
    
        for card in cards:
    
            idx = await MeldService.get_card_index(
                user,
                room,
                card["cardId"]
            )
    
            if idx == -1:
                return None
            if player_cards[idx] not in selected_cards:
                selected_cards.append(
                    player_cards[idx]
                )
        
        return selected_cards

    @staticmethod
    async def verify_melds(room, user, cards):
        position = await get_player_pos(user, room.code)

        error = await MeldService.validate_player_can_announce(
            room,
            position
        )

        if error:
            return {
                "type": "game_event",
                "event": "annonces_valid",
                "valid": False,
                "message": error
            }

        if len(cards) < 3:
            return {
                "type": "game_event",
                "event": "annonces_valid",
                "valid": False,
                "message": "Minimum 3 cartes"
            }

        selected_cards = await MeldService.extract_cards(
            room,
            user,
            position,
            cards
        )

        if selected_cards is None:
            return {
                "type": "game_event",
                "event": "annonces_valid",
                "valid": False,
                "message": "Carte invalide ou non présente dans la main"
            }

        valid, sequences = MeldService.compute_sequences(
            selected_cards
        )

        if not valid:
            return {
                "type": "game_event",
                "event": "annonces_valid",
                "valid": False,
                "message": "Toutes les cartes doivent appartenir à des suites valides"
            }
        bucket = [
            {
                "cards": [card["raw"] for card in seq]
            }
            for seq in sequences
        ]
        await MeldService.save_melds(room.id, user.id, bucket)
        return {
            "type": "game_event",
            "event": "annonces_valid",
            "valid": True
        }
    
    @staticmethod
    async def save_melds(room_id, user_id, sequences):
        p = await sync_to_async(
            PlayerPresence.objects.select_related("player").get
        )(
            room_id=room_id,
            player_id=int(user_id)
        )
        room = await sync_to_async(Room.objects.get)(id=room_id)
        game_state = room.game_state
        
        player_melds = game_state["players"][str(p.position)]["melds"]
        
        for sequence in sequences:
            if sequence not in player_melds:
                game_state["players"][str(p.position)]["melds"].append(sequence)
                
        await save_room_state(room.uuid, game_state)
    
    @staticmethod
    def compute_sequences(selected_cards):
    
        cards = [
            {
                "value": CARD_VALUES[card["value"]],
                "value_str": card["value"],
                "color": card["color"],
                "raw": card
            }
            for card in selected_cards
        ]
    
        melds = []
    
        by_color = {}
    
        for card in cards:
            by_color.setdefault(card["color"], []).append(card)
    
        for color_cards in by_color.values():
    
            color_cards.sort(key=lambda c: c["value"])
    
            current = [color_cards[0]]
    
            for i in range(1, len(color_cards)):
                prev = color_cards[i - 1]
                curr = color_cards[i]
    
                if curr["value"] == prev["value"] + 1:
                    current.append(curr)
                else:
                    if len(current) >= 3:
                        melds.append(current)
                    current = [curr]
    
            if len(current) >= 3:
                melds.append(current)
    
        by_value = {}
    
        for card in cards:
            by_value.setdefault(card["value"], []).append(card)
    
        for value_cards in by_value.values():
            if len(value_cards) == 4:
                colors = {c["color"] for c in value_cards}
    
                if len(colors) == 4:
                    melds.append(value_cards)
    
        used_ids = set()
    
        for meld in melds:
            for card in meld:
                used_ids.add(card["raw"]["id"])
    
        selected_ids = {
            card["id"]
            for card in selected_cards
        }

        valid = used_ids == selected_ids
    
        return valid, melds
    
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
    async def validate_player_can_announce(room, position):
    
        #if int(position) != int(room.game_state["playing"]):
        #    return "Ce n'est pas à toi de jouer"
    
        already_started = any(
            len(player["taken"]) > 0
            for player in room.game_state["players"].values()
        )
    
        if already_started:
            return "Tu ne peux plus faire d'annonce"
    
        return None
    
    async def check_shtokr(room_code, game_state):
        players = game_state["players"]
        tricks = game_state["tricks"]
        colors = {"club": 0, "spade": 9, "diamond": 18, "heart": 27}

        for id, p in players.items():
            if tricks in p["shtokr"]:
                if ({"value": "K", "color": tricks, "id": 7 + colors[tricks]} not in p["cards"] and
                    {"value": "Q", "color": tricks, "id": 6 + colors[tricks]} not in p["cards"]):
                    await  ScoreService.save_meld(room_code, id, game_state["game"], game_state["round"] - 1, -20)
                    p["shtokr"] = []
                    p["puntos"] -= 20
                    return game_state
                return game_state

        return game_state