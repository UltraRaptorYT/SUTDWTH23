FROM python:3.9-slim

ARG DEBIAN_FRONTEND=noninteractive

EXPOSE 8080

WORKDIR /server
COPY ./app2.py /server/app.py
COPY ./requirements.txt /server/requirements.txt

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

ENTRYPOINT [ "python3", "app.py" ]