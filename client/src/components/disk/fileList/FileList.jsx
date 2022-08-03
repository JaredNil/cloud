
import './fileList.scss'
import { useSelector } from 'react-redux';
import React from 'react'
import '../fileList/file/file.scss'

import File from './file/File';



const FileList = () => {
	let files = useSelector(state => state.files.files)
	files = files.map((file, id) => {
		return <File file={file} key={id} />
	})


	return (
		<div className='filelist'>
			<div className="filelist__header">
				<div className="filelist__name">Название</div>
				<div className="filelist__date">Дата</div>
				<div className="filelist__size">Размер</div>
			</div>
			{files}
		</div>
	)
};



export default FileList;