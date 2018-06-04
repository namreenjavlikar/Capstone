//use: npm run serverEmail
import r from 'rethinkdb'
var express = require('express')
var http = require('http')
var app = express()
var multer = require('multer');

app.use('/', express.static('assets'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var httpServer = http.createServer(app)

httpServer.listen(3001)
console.log('Listening on port 3001')

const db = r.connect({
	host: "localhost",
	port: 28015,
	db: 'capstonedemo'
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

app.get('/api/resetpassword/:recovEmail/:key/:id', async (req, res) => {
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: req.params.recovEmail,
		subject: 'Reset Password',
		html: "<a href='http://localhost:3000/reset/" + req.params.id + "/" + req.params.key + "'>Click here to Reset</a>"
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		}
		return console.log('Message sent')
	})
	res.json({ "success": true })
})

app.get('/api/activate/:recovEmail/:key/:id', async (req, res) => {
	let mailOptions = {
		from: 'dms-q-system@outlook.com',
		to: req.params.recovEmail,
		subject: 'Activate Account',
		html: "<a href='http://localhost:3000/reset/" + req.params.id + "/" + req.params.key + "'>Click here to Activate Account</a><br/> Your username is " + req.params.id
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		}
		return console.log('Message sent')
	})
	res.json({ "success": true })
})


app.post('/fileUpload', upload.single('file'), (req, res) => {
	console.log("yes")
	db.then(conn => {
		console.log("yup")
		r.table('users').insert({ imagePath: req.file.path }).run(conn, (err, data) => {
			console.log("nope")
			res.json({ link: 'http://localhost:3001/' + req.file.path })
		})
	})
});

app.post('/fileUploadLink', upload.single('file'), (req, res) => {
	console.log("yes file")
	db.then(conn => {
		console.log("yup")
		r.table('users').insert({ filePath: req.file.path }).run(conn, (err, data) => {
			console.log("nope")
			res.json({ link: 'http://localhost:3001/file/' + req.file.path })
		})
	})
});

app.get('/public/uploads/:filelink', (req, res) => {
	console.log("yes2", req.params.filelink)
	res.sendFile(__dirname + '/public/uploads/' + req.params.filelink);
});


app.get('/file/public/uploads/:filelink', (req, res) => {
	console.log("yes3", req.params.filelink)
	res.download(__dirname + '/public/uploads/' + req.params.filelink);
});

app.post('/fileUploadChat', upload.single('file'), (req, res) => {
	res.json({ chat: 'http://localhost:3001/file/' + req.file.path })
});
