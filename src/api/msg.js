import { fetch, post, patch, del } from '../libs/http'

// 信息列表
export function getList (params) {
	return fetch('msg/list', params)
}
//添加
export function addList (params) {
	return post('msg/add', params)
}
//编辑
export function editList (params) {
	return post('msg/update', params)
}
//删除
export function delList (params) {
	return fetch('msg/delete', params)
}


