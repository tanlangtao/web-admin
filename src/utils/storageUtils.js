/*
进行local数据存储管理的工具模块
 */
import store from 'store'
const USER = 'user_key'
export default {
  /*
  保存user
   */
  saveUser (user) {
    // localStorage.setItem(USER_TOKEN, JSON.stringify(user))
    store.set(USER, user)
  },

  /*
  读取user
   */
  getUser () {
    // return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')
    return store.get(USER) || {}
  },

  /*
  删除user
   */
  removeUser () {
    localStorage.removeItem(USER)
    store.remove(USER)
  }
}