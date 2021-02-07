import { login } from '@/api/manager'
import { setToken, getToken } from '@/libs/util'
export default {
	state: {
		roleName: [],
		userName: '',
		userId: '',
		token: getToken(),
		role: [],
		phone: '',
		name: '',
	},
	mutations: {
		setUserId (state, id) {
			state.userId = id
		},
		setName (state, name) {
			state.name = name
		},
		setUserRole (state, role) {
			state.role = role
		},
		setToken (state, token) {
		  state.token = token
		  setToken(token)
		},
	},
	getters: {

	},
	actions: {
		// 登录
		handleLogin ({ commit }, { userName, password }) {
			userName = userName.trim()
			let params = {
				name: userName,
				password: password
			}
			return new Promise((resolve, reject) => {
				login(params).then((res) => {
					if (res.errno === 0) {
						// 登录成功
						const data = res.data
						//console.log(data);
						commit('setToken', data.token)
						commit('setUserId', data.account_id)
						commit('setName', data.account_name)
						commit('setUserRole', data.role_id)
						localStorage.setItem('token', data.token)
						localStorage.setItem('account_name', data.account_name)
						localStorage.setItem('account_id', data.account_id)
						localStorage.setItem('role_id', data.role_id)
						if(data.project_id){
							localStorage.setItem('project_id', data.project_id)
						}
						
						// 权限设置
						// let access = []
						// if (data['functions']) {
						// 	data.functions.forEach(v => {
						// 		access.push(v.front)
						// 	})
						// }
						// let roles = []
						// if (data.managerInfo.roles.length > 0) {
						// 	data.managerInfo.roles.forEach(v => {
						// 		roles.push(v.name)
						// 	})
						// }
						// localStorage.setItem('access', access)
						// localStorage.setItem('role_name', roles)
						// const info = data.managerInfo
						// if (info.isEnable === 1) {
						// 	// console.log(data)
						// 	commit('setRoleName', roles)
						// 	commit('setAccess', access)
						// 	commit('setUserName', info.username)
						// 	commit('setName', info.name)
						// 	commit('setUserId', info.id)
						// 	commit('setUserPhone', info.phone)
						// 	commit('setUserRole', info.role)
						// 	commit('setToken', data.token)
						// }
					}
					resolve(res)
				}).catch((err) => {
					reject(err)
				})
			})
		},
		// 退出登录
		handleLogOut ({ state, commit }) {
			//   如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
			commit('setToken', '')
			localStorage.clear()
			// commit('setAccess', [])
			// resolve()
			// })
		},
	}
}
