from asgiref.sync import sync_to_async
from ..models import Stat


class StatsService:
    @staticmethod
    async def update_after_play(user, state, prev_tricks, taker, melds):
        if state["tricks"] != prev_tricks and state["tricks"] != "none":
            stat = await sync_to_async(Stat.objects.get)(user_id=user.id)

            stat.nb_trick_choose += 1

            if state["tricks"] not in stat.tricks:
                stat.tricks[state["tricks"]] = 0

            stat.tricks[state["tricks"]] += 1

            stat.prefered_trick = max(stat.tricks, key=stat.tricks.get)

            await sync_to_async(stat.save)()
    
    @staticmethod
    async def add_meld_points(user, points):
        stat = await sync_to_async(
            Stat.objects.get
        )(user=user)

        stat.hand_meld_points += points
        stat.highest_hand_meld = max(
            stat.highest_hand_meld,
            points
        )

        await sync_to_async(stat.save)()