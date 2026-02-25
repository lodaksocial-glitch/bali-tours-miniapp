FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

ENV APP_ROLE=web
CMD ["sh", "-c", "if [ \"$APP_ROLE\" = \"bot\" ]; then python bot.py; else python server.py; fi"]
