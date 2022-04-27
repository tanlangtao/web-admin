import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import { Router } from "react-router";
import { createBrowserHistory } from "history";
import { Modal } from 'antd';

//在react-router4中监听路由变化
const history = createBrowserHistory()
history.listen((location, action) => {
  // location is an object like window.location
  console.log('history', action, location.pathname, location.state)
  //每次变化执行
  Modal.destroyAll();
  //使用 Modal.destroyAll() 可以销毁弹出的确认窗（即 Modal.info、Modal.success、Modal.error、Modal.warning、Modal.confirm）。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭（modal.destroy() 适用于主动关闭，而不是路由这样被动关闭）
  //注意无法销毁<Modal></Modal>创建的模态框
})

// 可以读取localstorage中的数据, 保存到内存中
// memoryUtils.user = user


// 将App组件标签渲染到index页面的div上
ReactDOM.render(<Router history={history}>
  <App />
</Router>, document.getElementById('root'))