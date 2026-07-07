from asgiref.sync import sync_to_async
from ..models import GameLog, PlayerPresence
from ..db import get_room_with_host
from django.db.models import F

class ScoreService:
        
    @staticmethod
    async def save_meld(room_code, player_id, game, round, score):
        room = await get_room_with_host(room_code)
    
        p = await sync_to_async(PlayerPresence.objects.get)(
            room=room,
            position=int(player_id)
        )

        log, created = await sync_to_async(
            GameLog.objects.get_or_create
        )(
            room=room,
            player=p,
            game=game,
            round=round
        )
        
        await sync_to_async(
            GameLog.objects.filter(id=log.id).update
        )(
            score=F("score") + score
        )
        
    @staticmethod
    async def create_logs(room_code, game, round):
        room = await get_room_with_host(room_code)
        
        for player_id, player_data in room.game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(player_id)
            )
            log, created = await sync_to_async(
                GameLog.objects.get_or_create
            )(
                room=room,
                player=p,
                game=game,
                round=round
            )
    
    
    @staticmethod
    async def save_final_score(room_code, game, round, scores):
        room = await get_room_with_host(room_code)
    
        game_state = room.game_state
        
        for player_id, player_data in game_state["players"].items():
            
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
				room_id=room.id,
                position=int(player_id)
			)
        

            log, created = await sync_to_async(
                GameLog.objects.get_or_create
            )(
                room=room,
                player=p,
                game=game,
                round=round
            )
            
            await sync_to_async(
                GameLog.objects.filter(id=log.id).update
            )(
                score=F("score") + scores[int(player_id)]
            )





