import request from 'superagent'
import {getCookieByName, cookieTokenUtil} from '../helpers/utils'

function promiseErrorHandler(err) {
  console.log(err.text)
}

export function requestWithParams({url, cookie, token, formData, method}) {
  return new Promise(function(resolve, reject) {
    request[method || 'post'](url)
      .send(formData)
      .set('X-XSRF-TOKEN', token)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json;charset=UTF-8')
      .timeout(5000)
      .end(function(err, res) {
        if (err) {
          reject(err)
          return
        }

        let json = JSON.parse(res.text)
        json.csrfToken = getCookieByName(res.headers['set-cookie'].join('; '), 'XSRF-TOKEN')
        json.cookie = cookieTokenUtil(cookie, json.csrfToken).cookie
        resolve(json)
      })
  })
}

/**
 * 获取知乎草稿id
 */
export function getZhihuDrafts(cookie, token) {
  return requestWithParams({
    url: 'https://zhuanlan.zhihu.com/api/drafts',
    formData : {
      topics: [],
      title: '标题',
      content: '',
      titleImage: '',
      column: '',
      isTitleImageFullScreen: false
    },
    cookie,
    token
  }).catch(promiseErrorHandler)
}

export function getZhihuAuthorInfo(cookie, token) {
  return requestWithParams({
    url: 'https://zhuanlan.zhihu.com/api/me',
    cookie,
    token
  }).catch(promiseErrorHandler)
}

// [{"followersCount": 37, "creator": {"bio": "\u770b\u4e09\u505a\u4e8c\u8bf4\u4e00 https://github.com/simongfxu", "hash": "75f1c2aa7927f7dbeb8d5cfe702fc92d", "description": "https://github.com/simongfxu", "profileUrl": "https://www.zhihu.com/people/reduxis", "avatar": {"id": "9a20d473d826eb58e1507da1bcc4027e", "template": "https://pic3.zhimg.com/{id}_{size}.jpg"}, "slug": "reduxis", "name": "\u9ad8\u51e1"}, "topics": [{"url": "https://www.zhihu.com/topic/19550516", "id": "19550516", "name": "Web \u5f00\u53d1"}, {"url": "https://www.zhihu.com/topic/20013159", "id": "20013159", "name": "React"}, {"url": "https://www.zhihu.com/topic/19552521", "id": "19552521", "name": "JavaScript"}], "activateState": "activated", "href": "/api/columns/reduixs", "acceptSubmission": true, "postTopics": [{"postsCount": 1, "id": 769, "name": "JavaScript"}, {"postsCount": 1, "id": 156416, "name": "React"}], "pendingName": "", "avatar": {"id": "f12f6dac2267cefdbabe1b16808c7694", "template": "https://pic1.zhimg.com/{id}_{size}.jpeg"}, "canManage": true, "description": "\u9ad8\u51e1@DataEye\uff0c\u5173\u6ce8Web\u524d\u7aef\u524d\u6cbf\u6280\u672f\u3002\nhttps://github.com/simongfxu", "pendingTopics": [], "nameCanEditUntil": 0, "reason": "\u8f6f\u4ef6\u5f00\u53d1-\u524d\u7aef\u6280\u672f", "banUntil": 0, "slug": "reduixs", "name": "\u300eReactive Now\u300f", "url": "/reduixs", "intro": "\u9ad8\u51e1@DataEye\uff0c\u5173\u6ce8Web\u524d\u7aef\u524d\u6cbf\u6280\u672f\u3002\n\u2026", "topicsCanEditUntil": 0, "activateAuthorRequested": "none", "commentPermission": "anyone", "following": false, "postsCount": 3, "canPost": true}]
export function getZhihuColumns(cookie, token, slug) {
  return requestWithParams({
    cookie,
    token,
    method: 'get',
    url: 'https://zhuanlan.zhihu.com/api/me/available_columns'
  }).catch(promiseErrorHandler)
}
