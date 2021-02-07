import { fetch, post, patch, del } from '../libs/http'

// 项目列表
export function getList (params) {
	return fetch('project/list', params)
}
//添加项目
export function addList (params) {
	return post('project/add', params)
}
//编辑项目
export function editList (params) {
	return post('project/update', params)
}
//删除项目
export function delList (params) {
	return fetch('project/delete', params)
}
// ID查项目节点
export function getNodeById (params) {
	return fetch('project/node_list', params)
}
// 项目节点列表
export function getNodeList (params) {
	return fetch('node/list', params)
}
//添加项目节点
export function addtNodeList (params) {
	return post('node/add', params)
}
//节点详情
export function openDetail (params) {
	return fetch('node/detail', params)
}
//编辑项目节点
export function editNodeList (params) {
	return post('node/update', params)
}
//删除项目节点
export function deltNodeList (params) {
	return fetch('node/delete', params)
}
//编辑项目节点状态
export function editNodeWorked (params) {
	return post('node/worked', params)
}
//项目下拉列表
export function getProjectList (params) {
	return fetch('project/ids', params)
}
//节点绑定设备
export function bindNodeDevice (params) {
	return post('node/bind_node_device', params)
}
//查看节点已绑定的设备
export function bindDeviceList (params) {
	return fetch('node/device_list', params)
}



