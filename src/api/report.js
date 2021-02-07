import { fetch, post, patch, del } from '../libs/http'

// 列表
export function getList (params) {
	return fetch('report/list', params)
}
//跟踪历史
export function historyList (params) {
	return fetch('report/history_list', params)
}
//编辑
export function editList (params) {
	return post('report/update', params)
}
//删除
export function delList (params) {
	return fetch('report/delete', params)
}


