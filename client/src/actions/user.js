import axios from 'axios';
import { setUser } from '../reducers/userReducer'
import { store } from './../reducers/index';
import { React } from 'react';




export const registration = async (email, password) => {
	try {
		const responce = await axios.post('http://localhost:27017/api/auth/registration',
			{
				email,
				password
			})
		alert(responce.data.message)
	} catch (error) {
		console.log(error, 'Ошибка на стадии передачи данных регистрации на сервер');
	}
}



export const login = (email, password) => {
	return async () => {
		try {
			const responce = await axios.post(
				'http://localhost:27017/api/auth/login',
				{
					email,
					password
				})
			store.dispatch(setUser(responce.data.user))
			localStorage.setItem('token', responce.data.token)

			console.log(responce.data);
		} catch (error) {
			console.log(error);
		}
	}
}


export const auth = () => {
	return async () => {
		try {
			const responce = await axios.get(
				'http://localhost:27017/api/auth/auth',
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			store.dispatch(setUser(responce.data.user))
			localStorage.setItem('token', responce.data.token)


			console.log(responce.data);
		} catch (error) {
			console.log(error);
			localStorage.removeItem('token')
		}
	}
}
