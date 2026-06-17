#!/bin/sh

set -e


python manage.py migrate --noinput

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.update(is_online=False, presence=0, presence_game=0)
"

exec daphne -b 0.0.0.0 -p 8000 backend.asgi:application