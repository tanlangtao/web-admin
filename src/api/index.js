import ajax from "./ajax";
import storageUtils from "../utils/storageUtils";

const BASE = process.env.REACT_APP_HOST;
const token = storageUtils.getUser().token;

// 登陆
export const reqLogin = (username, password, authcode) =>
  ajax(BASE + "/login/login", { username, password, authcode }, "POST");

// 获取authCode
export const reqAuthCode = (username, password) =>
  ajax(BASE + "/login/authCode", { username, password }, "POST");

// 获取菜单
export const navList = () => {
  const token = storageUtils.getUser().token;
  return ajax(BASE + "/acl/navList", { token }, "POST");
};
// ajax(BASE + "/acl/navList", { token }, "POST");

//user界面
export const reqUsers = (page, limit) =>
  ajax(BASE + "/user/index", { token, page, limit }, "POST");
export const setGameUserNickName = (id, game_nick) =>
  ajax(BASE + "/user/setGameUserNickName", { token, id, game_nick }, "POST");
// export const changeGold = (params) =>
//   ajax(
//     "https://operation.0717996.com/admin/user/changeGold",
//     { token, task_type: 0, params },
//     "POST"
//   );
export const searchData = (page, limit, start, end, param) => {
  let key = param.key;
  let obj = { page, limit, token, start, end };
  obj[key] = param.val ? param.val : "";
  return ajax(BASE + "/user/index", obj, "POST");
};
export const reqLoadGold = id => {
  return ajax(
    BASE +"/user/getGameUser",
    {
      page: 1,
      limit: 10,
      token,
      id
    },
    "POST"
  );
};