import random
import uuid

from faker import Faker

from django.utils import timezone
from django.core.management.base import BaseCommand

from ...models import Friendship, User
from game.models import (
    Room,
    PlayerPresence,
    PlayerScore,
    Stat,
)

fake = Faker()


class Command(BaseCommand):

    help = "Seed database"

    def handle(self, *args, **kwargs):

        self.stdout.write("Seeding database...")

        users = []

        # ==================================================
        # USERS + STATS
        # ==================================================

        for i in range(20):

            username = f"{fake.user_name()}_{i}"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@test.com",
                    "avatar": fake.image_url(),
                    "is_online": random.choice([True, False]),
                    "is_bot": random.choice([False, False, False, True]),
                    "elo": random.randint(0, 3000),
                    "has_password": True,
                }
            )

            if created:
                user.set_password("password123")
                user.save()

            users.append(user)

            Stat.objects.get_or_create(
                user=user,
                defaults={
                    "win": random.randint(0, 200),
                    "lose": random.randint(0, 200),
                    "played": random.randint(0, 400),
                    "total_points": random.randint(0, 50000),
                    "nb_taken": random.randint(0, 500),
                    "nb_last_take": random.randint(0, 100),
                    "nb_trick_choose": random.randint(0, 100),
                    "prefered_trick": random.choice([
                        "club",
                        "heart",
                        "spade",
                        "diamond"
                    ]),
                    "tricks": {
                        "club": random.randint(0, 50),
                        "heart": random.randint(0, 50),
                        "spade": random.randint(0, 50),
                        "diamond": random.randint(0, 50),
                    },
                    "hand_meld_points": random.randint(0, 10000),
                    "board_meld_points": random.randint(0, 10000),
                    "highest_hand_meld": random.randint(0, 500),
                    "highest_board_meld": random.randint(0, 500),
                    "nb_host": random.randint(0, 100),
                }
            )

        self.stdout.write(self.style.SUCCESS("Users created"))

        # ==================================================
        # FRIENDSHIPS
        # ==================================================

        statuses = ["accepted", "pending", "blocked"]

        for _ in range(30):

            u1, u2 = random.sample(users, 2)

            if Friendship.objects.filter(
                from_user=u1,
                to_user=u2
            ).exists():
                continue

            status = random.choice(statuses)

            friendship = Friendship.objects.create(
                from_user=u1,
                to_user=u2,
                status=status,
            )

            if status == "accepted":
                friendship.accepted_at = fake.date_this_year()

            elif status == "blocked":
                friendship.blocked_by = random.choice([u1, u2])
                friendship.blocked_at = fake.date_this_year()

            friendship.save()

        self.stdout.write(self.style.SUCCESS("Friendships created"))

        # ==================================================
        # ROOMS
        # ==================================================

        rooms = []

        for i in range(10):

            host = random.choice(users)

            status = random.choice([
                "open",
                "start",
                "end"
            ])

            created_at = fake.date_time_between(
                start_date="-30d",
                end_date="now",
                tzinfo=timezone.get_current_timezone()
            )

            started_at = None
            ended_at = None

            if status in ["start", "end"]:
                started_at = fake.date_time_between(
                    start_date=created_at,
                    end_date="now",
                    tzinfo=timezone.get_current_timezone()
                )

            if status == "end":
                ended_at = fake.date_time_between(
                    start_date=started_at,
                    end_date="now",
                    tzinfo=timezone.get_current_timezone()
                )

            room = Room.objects.create(
                code=str(uuid.uuid4())[:8].upper(),
                host=host,
                status=status,
                created_at=created_at,
                started_at=started_at,
                ended_at=ended_at,
                is_private=random.choice([True, False]),
                nb_player=0,
                game_state={
                    "players": {},
                    "lastCard": None,
                    "playing": random.randint(0, 6),
                    "board": {}
                }
            )

            rooms.append(room)

        self.stdout.write(self.style.SUCCESS("Rooms created"))

        # ==================================================
        # PLAYER PRESENCE + SCORES
        # ==================================================

        for room in rooms:

            nb_players = random.randint(2, 7)

            selected_users = random.sample(users, nb_players)

            room.nb_player = nb_players
            room.save()

            scores = []

            for position, user in enumerate(selected_users):

                presence = PlayerPresence.objects.create(
                    player=user,
                    room=room,
                    is_online=random.choice([True, False]),
                    is_human=not user.is_bot,
                    position=position + 1,
                    difficulty=random.choice([
                        "easy",
                        "medium",
                        "hard"
                    ])
                )

                score = random.randint(0, 5000)

                scores.append({
                    "user": user,
                    "score": score
                })

            # classement
            scores.sort(
                key=lambda x: x["score"],
                reverse=True
            )

            for rank, data in enumerate(scores, start=1):

                PlayerScore.objects.create(
                    player=data["user"],
                    room=room,
                    score=data["score"],
                    rank=rank
                )

        self.stdout.write(self.style.SUCCESS("Presences created"))
        self.stdout.write(self.style.SUCCESS("Scores created"))

        self.stdout.write(
            self.style.SUCCESS("DATABASE SEEDED")
        )