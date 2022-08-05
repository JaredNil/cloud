import axios from 'axios'
import { setFiles, addFile, deleteFileAction } from "../reducers/fileReducer";
import { showUploader, addUploadFile, changeUploadFile } from "../reducers/uploadReducer";


export function getFiles(dirId, sort) {
	return async dispatch => {
		try {

			let url = `http://localhost:27017/api/files`
			if (dirId) { url = `http://localhost:27017/api/files?parent=${dirId}` }
			if (sort) { url = `http://localhost:27017/api/files?sort=${sort}` }
			if (dirId && sort) { url = `http://localhost:27017/api/files?parent=${dirId}&sort=${sort}` }


			const response = await axios.get(
				url,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
				})
			dispatch(setFiles(response.data))
		} catch (e) {
			alert(e.response.data)
		}
	}
}

export function createDir(dirId, name) {
	return async dispatch => {
		try {
			const response = await axios.post(
				`http://localhost:27017/api/files`,
				{
					name,
					parent: dirId,
					type: 'dir'
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
				})
			dispatch(addFile(response.data))
		} catch (e) {
			alert(e.response.data)
		}
	}
}


export function uploadFile(file, dirId) {
	return async dispatch => {
		try {

			let formData = new FormData()
			formData.append('file', file)
			if (dirId) formData.append('parent', dirId)

			const uploadFile = { name: file.name, progress: 0, id: Date.now() }
			dispatch(showUploader())
			dispatch(addUploadFile(uploadFile))

			const response = await axios.post(
				`http://localhost:27017/api/files/upload`,
				formData,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
					onUploadProgress: progressEvent => {
						const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
						console.log('total', totalLength)
						if (totalLength) {
							uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
							dispatch(changeUploadFile(uploadFile))
						}
					}
				})
			dispatch(addFile(response.data))

		} catch (e) {
			console.log(e.response)
		}
	}
}


export async function downloadFile(file) {
	const response = await fetch(
		`http://localhost:3000/api/files/download?id=${file._id}`,
		{
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000/",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
				"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
	if (response.status === 200) {
		const blob = await response.blob()
		const downloadUrl = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = downloadUrl
		link.download = file.name
		document.body.appendChild(link)
		link.click()
		link.remove()
	}
}



export function deleteFile(file) { // НЕ РАБОТАЕТ
	return async dispatch => {
		try {
			const response = await axios.delete(
				`http://localhost:27017/api/files?id=62eb0b3220952ccb0108e50e`,
				{
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			)
			console.warn(response.data.message)
			dispatch(deleteFileAction(file._id))
		} catch (e) {
			console.log(e.response)
		}
	}
}

