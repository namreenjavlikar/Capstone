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

app.get('/api/resetpassword', async (req, res) => {
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: '60084089@cna-qatar.edu.qa',
        subject: 'Reset Password',
        // html: "<a href='http://localhost:3000/auth/reset/'>Click here to Reset</a>"
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

