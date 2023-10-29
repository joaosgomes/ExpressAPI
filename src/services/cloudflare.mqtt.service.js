const mqtt = require('mqtt');
require('dotenv').config();
const uri = process.env.BROKER_URI;
const username = "";
const password = process.env.BROKER_TOKEN
const topic = "cloudflare";

class MQTTService {
  constructor(host, messageCallback) {
    this.mqttClient = null;
    this.host = host;
    this.messageCallback = messageCallback;
  }

  connect() {
 
    this.mqttClient = mqtt.connect(uri, {
        protocolVersion: 5,
        port: 8883,
        clean: true,
        //connectTimeout: 2000, // 2 seconds
        clientId: "",
        username,
        password,

        keepalive: 60,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000

      });




    // MQTT Callback for 'error' event
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // MQTT Callback for 'connect' event
    this.mqttClient.on('connect', () => {
      console.log('MQTT client connected');
    });

    // Call the message callback function when message arrived
    this.mqttClient.on('message', function (topic, message) {
      console.log(message.toString());
      if (this.messageCallback) this.messageCallback(topic, message);
    });

    this.mqttClient.on('close', () => {
      console.log('MQTT client disconnected');
    });
  }

  // Publish MQTT Message
  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }

  // Subscribe to MQTT Message
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

module.exports = MQTTService;