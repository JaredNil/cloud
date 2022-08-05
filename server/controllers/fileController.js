const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const config = require('config')
const fs = require('fs')
const Uuid = require('uuid')

class fileController {
	async createDir(req, res) {
		console.log('server createDir')
		try {
			const { name, type, parent } = req.body

			const file = new File({ name, type, parent, user: req.user.id })

			const parentFile = await File.findOne({ _id: parent })

			if (!parentFile) {
				file.path = name
				await fileService.createDir(file)
			} else {
				file.path = `${parentFile.path}\\${file.name}`

				await fileService.createDir(file)
				parentFile.childs.push(file._id)
				await parentFile.save()
			}

			await file.save()
			return res.json(file)

		} catch (error) {
			console.log(error);
			return res.status(400).json(error)
		}
	}
	async getFile(req, res) {
		console.log('server getFile')

		try {
			const { sort } = req.query

			let files
			switch (sort) {
				case 'name':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })
					break
				case 'type':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
					break
				case 'date':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 })
					break
				default:
					files = await File.find({ user: req.user.id, parent: req.query.parent })
					break;
			}

			return res.json(files)
		} catch (error) {
			return res.status(500).json({ message: "Can not get Files" })
		}
	}

	async uploadFile(req, res) {
		console.log('server uploadFile')
		try {
			const file = req.files.file
			const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
			const user = await User.findOne({ _id: req.user.id })

			if (user.usedSpace + file.size > user.diskSpace) {
				return res.status(400).json({ message: 'There no space on the disk' })
			}

			user.usedSpace = user.usedSpace + file.size

			let path
			if (parent) {
				path = `${config.get('filePath')}\\${user._id}\\${parent.path}\\${file.name}`
			} else {
				path = `${config.get('filePath')}\\${user._id}\\${file.name}`
			}



			if (fs.existsSync(path)) {
				console.log('File already exist')
				return res.status(500).json({ message: 'File already exist' })
			}


			file.mv(path)


			const type = file.name.split('.').pop()
			let filePath = file.name


			if (parent) { filePath = parent.path + `\\` + file.name }
			console.log(type, filePath)
			const dbFile = new File({
				name: file.name,
				type,
				size: file.size,
				path: filePath,
				parent: parent?._id,
				user: user._id
			})

			await dbFile.save()
			await user.save()

			res.json(dbFile)
		}
		catch (error) {
			return res.status(500).json({ message: "Cannot upload Files" })
		}
	}

	async downloadFile(req, res) {
		console.log('server downloadFile')
		try {
			const file = await File.findOne({ _id: req.query.id, user: req.user.id })
			const path = fileService.getPath(file)

			if (fs.existsSync(path)) return res.download(path, file.name)
			return res.status(400).json({ message: "Download error" })

		} catch (e) {
			res.status(500).json({ message: "Download error" })
		}
	}

	async deleteFile(req, res) {
		console.log('server deleteFile')
		try {
			const files = await File.findOne({ _id: req.query.id, user: req.user.id })
			if (!files) {
				return res.status(400).json({ message: 'file not found' })
			}
			fileService.deleteFile(files)
			await files.remove()
			return res.json({ message: 'File was deleted' })
		} catch (e) {
			console.log(e)
			return res.status(400).json({ message: 'Dir is not empty' })
		}
	}

	async searchFiles(req, res) {
		console.log('searchFile')
		try {
			const searchName = req.query.search
			let files = await File.find({ user: req.user.id })
			files = files.filter(file => file.name.includes(searchName))
			return res.json(files)
		} catch (e) {
			return res.status(400).json({ message: 'Search error' })
		}
	}

	async uploadAvatar(req, res) {
		console.log('uploadAvatar')
		try {
			const file = req.files.file
			const user = await User.findById(req.user.id)
			const avatarName = Uuid.v4() + ".jpg"

			file.mv(config.get('staticPath') + "\\" + avatarName)
			user.avatar = avatarName
			await user.save()
			return res.json(user)

		} catch (e) {
			console.log(e)
			return res.json({ message: 'Upload avatar error' })
		}
	}

	async deleteAvatar(req, res) {
		console.log('deleteAvatar')
		try {
			const user = await User.findById(req.user.id)
			fs.unlinkSync(config.get('staticPath') + "\\" + user.avatar)
			user.avatar = null
			await user.save()
			return res.json(user)

		} catch (e) {
			console.log(e)
			return res.json({ message: 'Delete avatar error' })
		}
	}
}


module.exports = new fileController()