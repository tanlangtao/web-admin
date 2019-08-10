/*
进行local数据存储管理的工具模块
 */
import store from 'store'
const USER_TOKEN = 'user_token'
export default {
  /*
  保存user
   */
  saveUser (user) {
    // localStorage.setItem(USER_TOKEN, JSON.stringify(user))
    store.set(USER_TOKEN, user)
  },

  /*
  读取user
   */
  getUser () {
    // return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')
    return store.get(USER_TOKEN) || {}
  },

  /*
  删除user
   */
  removeUser () {
    // localStorage.removeItem(USER_TOKEN)
    store.remove(USER_TOKEN)
  }
}