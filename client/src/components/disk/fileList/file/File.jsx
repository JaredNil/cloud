import React from 'react';
import './file.scss'
import dirLogo from '../../../../assets/img/dir.svg'
import fileLogo from '../../../../assets/img/file.svg'
import { useDispatch } from 'react-redux';
import { setCurrentDir, pushToStack } from './../../../../reducers/fileReducer';
import { useSelector } from 'react-redux';

const File = ({ file }) => {
	const dispatch = useDispatch();
	const currentDir = useSelector(state => state.files.currentDir)

	function openHandler() {
		dispatch(pushToStack(currentDir))
		dispatch(setCurrentDir(file._id))
	}

	return (
		<div
			className="file"
			key={file._id}
			onClick={file.type === 'dir' ? () => openHandler() : ''}>

			<img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file__img" />
			<div className="file__name">{file.name}</div>
			<div className="file__date">{file.date.slice(0, 10)}</div>
			<div className="file__size">{file.size}</div>
		</div >)
};

export default File;
