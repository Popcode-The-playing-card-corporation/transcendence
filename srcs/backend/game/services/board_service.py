from asgiref.sync import sync_to_async
from ..models import PlayerPresence, Stat

class BoardService:

    @staticmethod
    async def resolve_if_needed(game, state, room, position, idx):
        taker = None
        melds = 0

        if len(state["board"]) == room.nb_player:
            melds = game.handleAction("board_meld", state, idPlayer=str(position), idCard=idx)

            taker = game.handleAction("who_take", state, idPlayer=str(position), idCard=idx)

            presence = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(taker)
            )

            stat = await sync_to_async(Stat.objects.get)(user_id=presence.player_id)

            stat.board_meld_points += melds
            stat.nb_taken += 1

            if stat.highest_board_meld < melds:
                stat.highest_board_meld = melds

            await sync_to_async(stat.save)()

        return state, taker, melds