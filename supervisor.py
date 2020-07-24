import paho.mqtt.client as mqtt
import sys
import requests
import datetime

def main():
    client = mqtt.Client(client_id='agua', clean_session=False)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(host='qtt_server', port=1883)
    client.loop_forever()

def on_connect(client, userdata, flags, rc):
    log('Conectado al servidor MQTT')
    client.subscribe(topic='despachador', qos=2)

def on_message(client, userdata, message):
    data = message.payload.decode('utf-8')
    if data.split(':')[0] == 'Lectura':
        code = data.split(':')[1]
        log("Recibido: " + code)
        quantity = get_quantity(code)
        dispatch(quantity, client)

def get_quantity(code):
    response = requests.get('http://ws-agua/code_used?code=' + code)
    info = response.json()
    if response.status_code == 200:
        return info

def dispatch(quantity, client):
    client.publish("despachador", "Despachar:" + str(quantity))
    log("Despachar:" + str(quantity))

def log(message):
    f = open("./log/log.txt", "a")
    f.write(str(datetime.datetime.now()) + ' ' + message + '\n')
    f.close()

if __name__ == '__main__':
    main()

sys.exit(0)