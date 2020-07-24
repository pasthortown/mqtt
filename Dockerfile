FROM python:3.8

WORKDIR /usr/src/app

COPY supervisor.py ./
RUN pip install paho-mqtt==1.5.0
RUN pip install requests
RUN pip install DateTime
CMD [ "python", "supervisor.py" ]