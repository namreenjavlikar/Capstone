//use: npm run serverEmail
import r from 'rethinkdb'
var express = require('express')
var http = require('http')
var app = express()
var multer = require('multer');

app.use('/', express.static('assets'))
var httpServer = http.createServer(app)

httpServer.listen(3001)
console.log('Listening on port 3001')

const db = r.connect({
	host: "localhost",
	port: 28015,
	db: 'capstone'
})

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

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname) 
	}
});
var upload = multer({ storage: storage });

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


app.post('/fileUpload', upload.single('file-to-upload'), (req, res) => {
	db.then(conn => {
		r.table('users').insert({ imagePath: req.file.path }).run(conn, (err, data) => {
			res.json({ 'message': 'File uploaded successfully' })
		})
	})
});
