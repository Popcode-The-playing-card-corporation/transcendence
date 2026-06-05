from ..db import save_room_state, get_player_pos
from .game_service import GameService
from .stats_service import StatsService
from game_engine.game import GameEngine

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
    async def play_meld(room, user, cards):
        position = await get_player_pos(user, room.code)

        error = await MeldService.validate_turn(
            room,
            position
        )

        if error:
            return {"error": error}

        selected_cards_idx = await MeldService.extract_card_indexes(
            room,
            user,
            cards
        )
        
        selected_cards = await MeldService.extract_cards(
            room,
            user,
            position,
            cards
        )

        if selected_cards_idx is None:
            return {"error": "Carte invalide"}

        valid = MeldService.compute_sequences(
            selected_cards
        )

        if not valid:
            return {
                "error": "Toutes les cartes doivent appartenir à des suites valides"
            }

        game = GameEngine(room.uuid)

        game_state = game.handleAction(
            "meld",
            room.game_state,
            idPlayer=str(position),
            meldIndex=selected_cards_idx
        )

        points = game.handleAction(
            "point_meld",
            room.game_state,
            idPlayer=str(position),
            meldIndex=selected_cards_idx
        )

        await save_room_state(room.uuid, game_state)

        await StatsService.add_meld_points(
            user,
            points
        )

        return {
            "success": True,
            "points": points
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
            idx = await GameService.get_card_index(
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
    
            idx = await GameService.get_card_index(
                user,
                room,
                card["cardId"]
            )
    
            if idx == -1:
                return None
    
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
                "type": "meld_result",
                "valid": False,
                "message": error
            }

        if len(cards) < 3:
            return {
                "type": "meld_result",
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
                "type": "meld_result",
                "valid": False,
                "message": "Carte invalide ou non présente dans la main"
            }

        valid, sequences = MeldService.compute_sequences(
            selected_cards
        )

        if not valid:
            return {
                "type": "meld_result",
                "valid": False,
                "message": "Toutes les cartes doivent appartenir à des suites valides"
            }

        return {
            "type": "meld_result",
            "valid": True,
            "valid_sequences": [
                [card["raw"] for card in seq]
                for seq in sequences
            ]
        }
        
    @staticmethod
    def compute_sequences(selected_cards):
    
        values_cards = [
            {
                "value": CARD_VALUES[card["value"]],
                "color": card["color"],
                "raw": card
            }
            for card in selected_cards
        ]
    
        values_cards.sort(
            key=lambda x: x["value"]
        )
    
        sequences = []
        current_seq = [values_cards[0]]
    
        for i in range(1, len(values_cards)):
    
            prev = values_cards[i - 1]
            curr = values_cards[i]
    
            if (
                curr["value"] == prev["value"] + 1
                and curr["color"] == prev["color"]
            ):
                current_seq.append(curr)
    
            else:
                sequences.append(current_seq)
                current_seq = [curr]
    
        sequences.append(current_seq)
    
        valid_sequences = [
            seq
            for seq in sequences
            if len(seq) >= 3
        ]
    
        used_cards = sum(
            len(seq)
            for seq in valid_sequences
        )
    
        valid = (
            used_cards == len(selected_cards)
        )
    
        return valid, valid_sequences
    
    @staticmethod
    async def validate_player_can_announce(room, position):
    
        if int(position) != int(room.game_state["playing"]):
            return "Ce n'est pas à toi de jouer"
    
        already_started = any(
            len(player["taken"]) > 0
            for player in room.game_state["players"].values()
        )
    
        if already_started:
            return "Tu ne peux plus faire d'annonce"
    
        return None