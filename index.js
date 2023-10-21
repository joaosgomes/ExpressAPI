const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();
const nodemailer = require('nodemailer');
const UAParser = require('ua-parser-js');
const requestIp = require('request-ip');
const routes = require('./src/routes');
const helmet = require('helmet');

let setCache = function (req, res, next) {
    // Define period in second = 5 minutes
    const period = 60 * 5

    // set strict no caching parameters
    res.set('Cache-control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0')


    //  call next() to pass on the request
    next()
}

// middleware function

app.use(setCache)

// Use Helmet!
app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/', routes);

function parseUserAgent(userAgent) {
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();
    return result;
}

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// Route for retrieving all routes in JSON format
app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'];
    const ip = req.header['x-forwarded-for']; // Get IP - allow for proxy
    const deviceInfo = parseUserAgent(userAgent);
    const clientIp = requestIp.getClientIp(req);


    //console.dir(req);
    console.dir(deviceInfo);
    console.dir(req.ip);
    console.dir(referer);
    console.dir(ip);
    console.dir(clientIp);
    console.log(JSON.stringify(parseUserAgent(req.headers['user-agent']), null, "\t"));
    const routes = app._router.stack
        .filter((r) => r.route && r.route.path)
        .map((r) => {
            return {
                path: r.route.path,
                methods: Object.keys(r.route.methods),
            };
        });

    res.json(routes);
});


// In-memory database
const database = {
    records: []
};

// Route to add a Record
/*

{
    "record": "Record 1"
}
*/
app.post('/records', (req, res) => {
    const { record } = req.body;


    // Check if the 'record' property is present in the request body
    if (!record) {
        return res.status(400).json({ message: '"record" is required' });
    }

    // Add the record to the db
    database.records.push(record);

    res.status(200).json({ message: 'Record added successfully' });


});

// Route to get all Records
app.get('/records', (req, res) => {
    res.json(database.records);
});







app.get('/email', async (req, res) => {
    try {
        // Create a transporter using SMTP Outlook
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            logger: true,
            transactionLog: true, // include SMTP traffic in the logs
            allowInternalNetworkInterfaces: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Email options
        const mailOptions = {
            from: 'JOAOSGOMES SMTP  <joao.s.gomes@outlook.pt>',
            sender: 'JOAOSGOMES SMTP',
            to: 'joao.s.gomes@outlook.pt',
            subject: '•⏀JOAOSGOMES SMTP⏀• ' + new Date().toISOString(),
            text: 'JOAOSGOMES SMTP' + new Date().toISOString(),
            date: new Date(),
            html: '<small><code>' + new Date().toISOString() + '</code></small>' +
                '<small><code>' + JSON.stringify(parseUserAgent(req.headers['user-agent']), null, "\t") + '</code></small>',
            alternatives: [
                {
                    contentType: 'text/x-web-markdown',
                    content: '**Hello world!**'
                }
            ],
            headers: {
                'X-JOAOSGOMES-SMTP': 'JOAOSGOMES SMTP'
            }
        };


        try {
            await transporter.verify();
            console.log('Credentials are valid');
        } catch (err) {
            // throws on invalid credentials
            console.log('Credentials are invalid');
            throw err;
        }

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
            }

            console.log('Message sent successfully!');
            console.log('Email sent:', info.messageId);
            console.log('Email response:', info.response);
            console.dir(info);
        });




        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});










const server = app.listen(process.env.PORT || 3000, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
});

// Handle server startup errors
server.on('error', (error) => {
    console.error('Server startup error:', error);

});

// Shut down the server
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server is gracefully shutting down');
        process.exit(0);
    });
});