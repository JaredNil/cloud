
import './fileList.scss'
import { useSelector } from 'react-redux';
import React from 'react'
import '../fileList/file/file.scss'
import dirLogo from '../../../assets/img/dir.svg'
import fileLogo from '../../../assets/img/file.svg'


const FileList = () => {

	let files = useSelector(state => state.files.files)
	files = files.map(file => {
		return <div className="file" key={file._id}>
			<img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file__img" />
			<div className="file__name">{file.name}</div>
			<div className="file__date">{file.date.slice(0, 10)}</div>
			<div className="file__size">{file.size}</div>
		</div >

		// return React.createElement(File, file)
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