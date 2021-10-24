import axios from './axiso'
export function listDiaryApi() {
  return axios({
    url: '/api/blog/listDiary',
    method: 'get',
  })
}
export function noteApi(data){
  return axios({
    url: '/api/blog/note',
    method: 'get',
    params:data
  }) 
}
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
    url: '/api/classify/listClassify',
    method: 'get',
  })
}

export function addBlogApi(data) {
  return axios({
    url: '/api/blog/add',
    method: 'post',
    data:data
  })
}
