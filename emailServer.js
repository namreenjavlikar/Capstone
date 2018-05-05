//use: npm run serverEmail

var express = require('express')
var http = require('http')
var app = express()

app.use('/', express.static('assets'))
var httpServer = http.createServer(app)

httpServer.listen(3001)
console.log('Listening on port 3001')

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

app.get('/api/resetpassword/:recovEmail/:key/:loginId', async (req, res) => {
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: req.params.recovEmail,
        subject: 'Reset Password',
		html: "<a href='http://localhost:3000/reset/" + req.params.loginId + "/" + req.params.key + "'>Click here to Reset</a>"
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		}
		return console.log('Message sent')
	})
	res.json({ "success": true })
})

app.get('/api/activate/:recovEmail/:key/:loginId', async (req, res) => {
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: req.params.recovEmail,
        subject: 'Activate Account',
		html: "<a href='http://localhost:3000/reset/" + req.params.loginId + "/" + req.params.key + "'>Click here to Activate Account</a>"
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		}
		return console.log('Message sent')
	})
	res.json({ "success": true })
})