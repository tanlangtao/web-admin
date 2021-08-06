// import axios from "axios";
// import { message } from "antd";
// let BASE = localStorage.BASE
// //游戏设置-注册配置
// function ajax1(url, data = {}, type = "GET") {
//     const instance1 = axios.create({
//         header: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         }
//     })
//     instance1.interceptors.request.use(
//         config => {
//             const token = localStorage.token;
//             if (token) {
//                 // 判断是否存在token，如果存在的话，则每个http header都加上token
//                 config.headers["Authorization"] = token;
//                 // console.log("interceptors config=", config);
//             }
//             return config;
//         },
//         error => {
//             return Promise.reject(error);
//         }
//     );
//     return new Promise((resolve, reject) => {
//         let promise;
//         // 1. 执行异步ajax请求
//         if (type === "GET") {
//             promise = instance1.get(url, {
//                 params: data // 指定请求参数
//             });
//         } else {
//             // 发POST请求
//             instance1.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
//             instance1.defaults.transformRequest = [
//                 function (data) {
//                     let ret = "";
//                     for (let it in data) {
//                         ret +=
//                             encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
//                     }
//                     return ret;
//                 }
//             ];
//             promise = instance1.post(url, data);
//         }
//         // 2. 如果成功了, 调用resolve(value)
//         promise.then(response => {
//             resolve(response.data);
//         })
//             // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
//             .catch(error => {
//                 // reject(error)
//                 if (error.response && error.response.status === 401) {
//                     message.info("token过期，请重新登录")
//                     localStorage.removeItem("menuList");
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("name");
//                     localStorage.removeItem("BASE");
//                     window.location.href = "/"
//                 }
//                 message.info(
//                     (error.response && error.response.data.msg) ||
//                     "请求出错了: " + error.message
//                 );
//             });

//     });

// }

// export const getIPconfig = () => {
//     return ajax1(
//         BASE + `/Operation/Api/getGlobal?platform_key=654321`,
//         {},
//         "GET",
//         1
//     );
// };
// export const getIPlist = (page, limit) => {
//     return ajax1(
//         BASE + `/Operation/Api/getBlackList?page=${page}&limit=${limit}&platform_key=654321`,
//         {},
//         "GET",
//         1
//     );
// };
// export const addIP = (ip) => {
//     return ajax1(
//         BASE + "/Operation/Api/addblacklist",
//         { platform_key: 654321, ip },
//         "POST",
//         1
//     );
// };
// export const deleteIP = (ip) => {
//     return ajax1(
//         BASE + "/Operation/Api/deleteblacklist",
//         { platform_key: 654321, ip },
//         "POST",
//         1
//     );
// };
// export const setLimit = (field, value) => {
//     return ajax1(
//         BASE + "/Operation/Api/setglobal",
//         { platform_key: 654321, field, value },
//         "POST",
//         1
//     );
// };