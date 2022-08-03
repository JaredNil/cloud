import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, createDir } from './../../actions/file';
import FileList from './fileList/FileList';
import './disk.scss';
import Popup from "./Popup";
import { setPopupDisplay, setCurrentDir } from './../../reducers/fileReducer';

const Disk = () => {
	const dispatch = useDispatch()
	const dirStack = useSelector(state => state.files.dirStack)


	const currentDir = useSelector(state => state.files.currentDir)
	React.useEffect(() => {
		dispatch(getFiles(currentDir))
	}, [currentDir])

	function showPopupHandler() {
		dispatch(setPopupDisplay('flex'))
	}
	function backClickHandler() {
		const backDirId = dirStack.pop()
		dispatch(setCurrentDir(backDirId))
	}

	return (
		<div className='disk'>
			<div className="disk__btns">
				<button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
				<button className="disk__create" onClick={() => showPopupHandler()}>Создать</button>
			</div>
			<FileList />
			<Popup />
		</div>
	);
};

export default Disk;