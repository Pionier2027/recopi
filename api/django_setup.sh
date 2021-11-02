#!/bin/bash
yes | python3 manage.py makemigrations # This is a development thing so I don't have to run it manually, but will be removed in production
yes | python3 manage.py migrate
echo "from django.contrib.auth import get_user_model; User = get_user_model();\
    User.objects.create_superuser('admin', 'admin@admin.com', 'admin')" | python3 manage.py shell

python3 -u manage.py runserver 0.0.0.0:8000

# docker-compose exec django python3 manage.py makemigrations
# docker-compose exec django python3 manage.py migrate
# docker-compose exec django python3 manage.py createsuperuser
