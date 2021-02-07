import { fetch, post, patch, del } from '../libs/http'

export function getSosList (params) {
  return fetch('sos/list', params)
}

// 添加
export function sosAdd (params) {
  return post('sos/add', params)
}

// 编辑
export function sosEdit (params) {
  return patch('sos/update', params)
}

// 删除
export function sosDel (params) {
  return del('sos/del', params)
}

// 删除(多个)
export function sosDelMany (params) {
  return del('sos/deleteMany', params)
}
