const { Router } = require("express");
const { SuccessResponseObject, ErrorResponseObject } = require("../common/http");
const status = require("./status.route");
const mqttcontroller = require("./cloudflare.mqtt.route");
const r = require("./route");

r.use("/status", status);

r.get("/routes", (req, res) => {
  const routes = r.stack
    .filter((r) => r.route && r.route.path)
    .map((r) => {
      return {
        path: r.route.path,
        methods: Object.keys(r.route.methods),
      };
    });

  res.json(new SuccessResponseObject("Router Success", routes));
});

r.get("/mqttpublish", mqttcontroller.publishMQTTMessage)

console.dir(r.all);

module.exports = r;
