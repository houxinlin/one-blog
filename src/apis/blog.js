import axios from './axiso'
export function listDiaryApi() {
  return axios({
    url: '/api/blog/listDiary',
    method: 'get',
  })
}
export function noteApi(data) {
  return axios({
    url: '/api/blog/note',
    method: 'get',
    params: data
  })
}
export function getListApi(data) {
  return axios({
    url: '/api/blog/list',
    method: 'get',
    params: data
  })
}
export function getMarkdownContentApi(data) {
  return axios({
    url: '/api/blog/detail',
    method: 'get',
    params: data
  })
}
export function listClassifyApi() {
  return axios({
    url: '/api/classify/listClassify',
    method: 'get',
  })
}



export function autoCompletionApi(text) {
  return axios({
    url: '/api/blog/autoCompletion',
    method: 'get',
    params: {text}
  })
}
export function searchApi(q,from) {
  return axios({
    url: '/api/blog/search',
    method: 'get',
    params: {q,from}
  })
}

export function getConfigInfo() {
  return axios({
    url: '/api/blog/getConfigs',
    method: 'get'
  })
}
