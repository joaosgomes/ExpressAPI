const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const status = require('./status.route');
const r = require('./route');



r.use('/status', status);

r.get('/test', (req, res) => { 


    const routes = r.stack
        .filter((r) => r.route && r.route.path)
        .map((r) => {
            return {
                path: r.route.path,
                methods: Object.keys(r.route.methods),
            };
        });

res.json(new SuccessResponseObject('Router Success',routes))


});

console.dir(r.all);

module.exports = r;