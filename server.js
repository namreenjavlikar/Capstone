var express = require('express');
var http = require('http');
var RethinkdbWebsocketServer = require('rethinkdb-websocket-server');

var app = express();
app.use('/', express.static('assets'));
var httpServer = http.createServer(app);

// Configure rethinkdb-websocket-server to listen on the /db path and proxy
// incoming WebSocket connections to the RethinkDB server running on localhost
// port 28015. Because unsafelyAllowAnyQuery is true, any incoming query will
// be accepted (not safe in production).
RethinkdbWebsocketServer.listen({
	httpServer: httpServer,
	httpPath: '/db',
	dbHost: 'localhost',
	dbPort: 28015,
	unsafelyAllowAnyQuery: true,
});

// Start the HTTP server on port 8015
httpServer.listen(8015);
console.log('Listening on port 8015');


import nodemailer from 'nodemailer'
let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "dms-q-system@outlook.com",
        pass: "12class34"
    }
});

app.get('http://localhost:3000/api/users/resetpassword', async (req, res) => {
	console.log("IN")
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: req.params.email,
		subject: 'Reset Password',
		html: "<a href='http://localhost:3000/auth/reset/" + req.params.username + "/" + req.params.key + "'>Click here to Reset</a>"
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		}
		return console.log('Message sent')
	})
	res.json({ "success": true })
})
