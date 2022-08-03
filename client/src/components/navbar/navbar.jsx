import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import cloud from '../../assets/img/cloud.png'
import setting from '../../assets/img/setting.png'
import find from '../../assets/img/find.png'
import './navbar.scss';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/userReducer';

const Navbar = () => {
	const isAuth = useSelector(state => state.user.isAuth)
	const dispatch = useDispatch()
	const hello = useSelector(state => state.user.currentUser.email)

	return (
		<div className="navbar">
			<div className="container">
				<div className="navbar__main">
					<img src={cloud} alt="" />
					<span>CLOUD</span>
				</div>
				<div className="navbar__introduce">
					Hi,
					<span> {(hello) ? hello : 'User'} </span>
				</div>
				<div className="navbar__tools">
					<div className="navbar__find">
						<input type="text" />
						<img src={find} alt="" />
					</div>
					{!isAuth && <div className="navbar__login"><Link to="/login">Войти</Link></div>}
					{!isAuth && <div className="navbar__registration"><NavLink to="/registration">Регистрация</NavLink></div>}
					{isAuth && <div className="navbar__login" onClick={() => dispatch(logout())}>Выйти</div>}
					<div className="navbar__setting">
						<img src={setting} alt="" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar