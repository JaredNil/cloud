
import './fileList.scss'
import { useSelector } from 'react-redux';
import React from 'react'
import '../fileList/file/file.scss'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import File from './file/File';



const FileList = () => {
	let files = useSelector(state => state.files.files)


	return (
		<div className='filelist'>
			<div className="filelist__header">
				<div className="filelist__name">Название</div>
				<div className="filelist__date">Дата</div>
				<div className="filelist__size">Размер</div>
			</div>
			<TransitionGroup>
				{files.map((file, id) => {
					return (
						<CSSTransition
							key={id}
							timeout={500}
							classNames={'file'}
							exit={false}
						>
							<File file={file} />
						</CSSTransition>

					)
				})}
			</TransitionGroup>
		</div>
	)
};



export default FileList;