import { fetch, post, patch, del } from '../libs/http'

// 设备列表
export function getList (params) {
	return fetch('device/list', params)
}
// 设备下拉列表
export function getDeviceList (params) {
	return fetch('device/ids', params)
}
//添加设备
export function addList (params) {
	return post('device/add', params)
}
//设备详情
export function openDetail (params) {
	return fetch('device/detail', params)
}
//编辑设备
export function editList (params) {
	return post('device/update', params)
}
//删除设备
export function delList (params) {
	return fetch('device/delete', params)
}
// 设备类型列表
export function getTypeList (params) {
	return fetch('device/type_ids', params)
}

//添加设备类型
export function addTypeList (params) {
	return post('device/type_add', params)
}
//编辑设备类型
export function editTypeList (params) {
	return post('device/type_edit', params)
}
//删除设备类型
export function delTypeList (params) {
	return post('device/type_del', params)
}
//设备运行日志
export function runLogsList (params) {
	return fetch('device/run_logs', params)
}



