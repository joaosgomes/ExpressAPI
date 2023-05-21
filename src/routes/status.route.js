const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const r = require('./route');


/**
 * GET /status
 */
r.get('/status', (req, res) => res.json(new SuccessResponseObject('Success', res.statusCode)));



module.exports = r;