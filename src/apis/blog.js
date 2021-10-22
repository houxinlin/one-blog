import axios from './axiso'

export function getListApi(data) {
  return axios({
    url: '/api/blog/list',
    method: 'get',
    params:data
  })
}
export function getMarkdownContentApi(data) {
  return axios({
    url: '/api/blog/detail',
    method: 'get',
    params:data
  })
}
export function listClassifyApi() {
  return axios({
    url: '/api/classify/getClassify',
    method: 'get',
  })
}
