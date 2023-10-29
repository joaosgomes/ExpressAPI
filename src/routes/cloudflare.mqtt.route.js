
const mqttService = require("../services/cloudflare.mqtt.service");

// Change this to point to your MQTT broker
const MQTT_HOST_NAME = "mqtts://joaosgomesbroker.joaosgomesbroker.cloudflarepubsub.com";


var mqttClient = new mqttService(MQTT_HOST_NAME);
mqttClient.connect();

exports.publishMQTTMessage = async function (req, res) {
    try {
      mqttClient.publish('cloudflare', 'Hello Cloudflare : ' + new Date(), {qos:1});
      mqttClient.subscribe('cloudflare', {qos:1});
      res.status(200).json({ status: "200", message: "Sucessfully published MQTT Message" });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };