import { fetch, post, patch, del } from '../libs/http'

// 用户列表
export function getList (params) {
	return fetch('account/list', params)
}
//添加用户
export function addList (params) {
	return post('account/add', params)
}
//编辑用户
export function editList (params) {
	return post('account/update', params)
}
//修改用户是否启用
export function updateWorked (params) {
	return post('account/worked', params)
}
//删除用户
export function delList (params) {
	return fetch('account/delete', params)
}

//用户详情
export function openDetail (params) {
	return fetch('account/detail', params)
}

// 角色列表
export function getRoleList (params) {
	return fetch('role/list', params)
}
//添加角色
export function addRoleList (params) {
	return post('role/add', params)
}
//编辑角色
export function editRoleList (params) {
	return post('role/update', params)
}
//删除角色
export function delRoleList (params) {
	return fetch('role/delete', params)
}

//选择
export function idsList (params) {
	return fetch('account/ids', params)
}

