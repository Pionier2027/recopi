FROM python:3.7

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/api
COPY requirements.txt /app/api
RUN pip3 install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["python3", "-u", "manage.py", "runserver", "0.0.0.0:8000"]