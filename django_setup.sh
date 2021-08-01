docker-compose exec django python3 manage.py makemigrations
docker-compose exec django python3 manage.py migrate
docker-compose exec django python3 manage.py createsuperuser