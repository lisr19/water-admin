import { fetch, post, patch, del } from '../libs/http'

// 水环境预警告警列表
export function environmentList (params) {
	return fetch('warning/environment_list', params)
}

// 水资源预警告警列表
export function resourcesList (params) {
	return fetch('warning/resources_list', params)
}


