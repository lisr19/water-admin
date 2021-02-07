import { fetch, post, patch, del } from '../libs/http'

// 列表
export function getList (params) {
	return fetch('patrol/list', params)
}
//添加
export function addList (params) {
	return post('patrol/add', params)
}
//编辑
export function editList (params) {
	return post('patrol/update', params)
}
//删除
export function delList (params) {
	return fetch('patrol/delete', params)
}
//巡检记录
export function historyList (params) {
	return fetch('patrol/history_list', params)
}


