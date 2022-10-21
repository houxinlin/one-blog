import axios from './axiso'
export function loginApi(data) {
  return axios({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function deleteArticleApi(data) {
  return axios({
    url: '/api/admin/deleteArticle',
    method: 'post',
    data
  })
}

export function getBrowseRecordApi(params) {
  return axios({
    url: '/api/admin/getBrowseRecord',
    method: 'get',
    params
  })
}
export function getSysConfigApi() {
  return axios({
    url: '/api/admin/getSysConfig',
    method: 'get',
  })
}

export function setSysConfig(data) {
  return axios({
    url: '/api/admin/setSysConfig',
    method: 'post',
    data
  })
}
export function dashboardApi() {
  return axios({
    url: '/api/admin/dashboard',
    method: 'get',
  })
}
export function addClassifyApi(data) {
  return axios({
    url: '/api/admin/addClassify',
    method: 'post',
    data
  })
}

export function removeClassifyApi(data) {
  return axios({
    url: '/api/admin/removeClassify',
    method: 'post',
    data
  })
}
export function restPassword(data) {
  return axios({
    url: '/api/admin/restPassword',
    method: 'post',
    data
  })
}

export function configInfo(data) {
  return axios({
    url: '/api/admin/configInfo',
    method: 'post',
    data
  })
}

