from asgiref.sync import sync_to_async
from ..models import PlayerPresence, GameLog
from ..db import get_room_with_host

class GameSnapshotService:

    @staticmethod
    async def build(room_code, user):
        room = await get_room_with_host(room_code)
        game_state = room.game_state

        player_puntos = {}
        player_list = {}
        detailed_points = {}

        for player_id, player_data in game_state["players"].items():

            p = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=room.id,
                position=int(player_id)
            )

            player_id_str = str(player_id)

            player_puntos[player_id_str] = player_data["puntos"]
            player_list[player_id_str] = {
                "hand": len(player_data["cards"]),
                "user": {
                    "id": p.player.id,
                    "username": p.player.username,
                    "avatar": p.player.avatar
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
                player_id=log.player_id
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

        return {
            "board": game_state["board"],
            "points": player_puntos,
            "detailed_points": detailed_points,
            "playing": game_state["playing"],
            "player_list": player_list,
            "started_at": room.started_at.strftime("%Y-%m-%d %H:%M:%S"),
            "round_time": game_state["round_time"],
            "round": game_state["round"],
            "last_fold": game_state.get("last_fold"),
        }