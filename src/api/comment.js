import { fetch, post, patch, del } from '../libs/http'

export function getRoleList (params) {
	return fetch('role/ids', params)
}



