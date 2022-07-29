const express = require('express')
const mongoose = require('mongoose');
const config = require('config')
const authRouter = require('./routes/auth.routes')

const app = express()
const PORT = config.get('serverPort')
const coreMiddleware = require('./middleware/core.middleware')

app.use(coreMiddleware)
app.use(express.json())
app.use("/api/auth", authRouter)


const start = async () => {
	try {
		mongoose.connect('mongodb://localhost:27017/', console.log('Success сonnect with mongoDB'))

		app.listen(
			PORT,
			() => {
				console.log('Server started on the PORT ', PORT);
			}
		)
	} catch (error) {
		console.log(error);
	}
}

start()