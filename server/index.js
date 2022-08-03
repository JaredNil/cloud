const express = require('express')
const mongoose = require('mongoose');
const config = require('config')
const fileUpload = require('express-fileupload')

const authRouter = require('./routes/auth.routes')
const fileRouter = require('./routes/file.routes')

const app = express()
const PORT = config.get('serverPort')
const coreMiddleware = require('./middleware/core.middleware')


app.use(fileUpload({}))
app.use(coreMiddleware)
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)


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