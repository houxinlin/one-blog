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




