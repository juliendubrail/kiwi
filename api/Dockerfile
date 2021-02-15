FROM python:3.9-alpine

RUN mkdir /backend

WORKDIR /backend

RUN apk add --no-cache gcc musl-dev linux-headers

COPY requirements.txt /backend/requirements.txt

RUN pip install --upgrade pip && \ pip install -r requirements.txt

COPY . .
