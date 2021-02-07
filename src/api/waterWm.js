import { fetch, post, patch, del } from '../libs/http'

// 列表
export function getList (params) {
	return fetch('water_wm/list', params)
}

// 识别列表
export function getIdentify (params) {
	return fetch('water_wm/identify', params)
}


