/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import axios from "axios";
import { message } from "antd";

//设置axios为form-data
export default function ajax(
  url,
  data = {},
  type = "GET",
  { content_type_is_formdata = false, timeout, needAuth = true } = {}
) {
  const instance = axios.create();
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.token;
      if (token && needAuth) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers["Authorization"] = token;
        // console.log("interceptors config=", config);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return new Promise((resolve, reject) => {
    let promise;
    // 1. 执行异步ajax请求
    //设置超时时间
    if (timeout) {
      instance.defaults.timeout = timeout;
    }
    if (type === "GET") {
      promise = instance.get(url, {
        params: data, // 指定请求参数
      });
    } else {
      if (!content_type_is_formdata) {
        instance.defaults.headers.post["Content-Type"] = "application/json";
        instance.defaults.transformRequest = [];
      } else {
        instance.defaults.headers.post["Content-Type"] =
          "application/x-www-form-urlencoded";
        instance.defaults.transformRequest = [
          function (data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          },
        ];
      }
      promise = instance.post(url, data);
    }
    // 2. 如果成功了, 调用resolve(value)
    promise
      .then((response) => {
        resolve(response.data);
      })
      // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
      .catch((error) => {
        //由于一些接口需要捕获异常后进行一些操作,所以reject(error)
        reject(error);
        if (error.response && error.response.status === 401) {
          message.info("token过期，请退出重新登录");
          // localStorage.clear();
          // window.location.href = "/";
        }
        if (error.message.includes("timeout")) {
          message.info("服务响应超时");
        } else {
          message.info(
            (error.response && error.response.data.msg) ||
              "请求出错了: " + error.message
          );
        }
      });
  });
}
