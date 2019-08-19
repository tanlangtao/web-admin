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
    BASE + "/user/getGameUser",
    {
      page: 1,
      limit: 10,
      token,
      id
    },
    "POST"
  );
};

//后台管理-账户列表
export const reqAdminList = (page, limit) => {
  return ajax(
    BASE + "/acl/index",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};
export const searchAdminData = name => {
  return ajax(
    BASE + "/acl/index",
    {
      page: 1,
      limit: 20,
      token,
      name
    },
    "POST"
  );
};

export const roleList = () => {
  return ajax(
    BASE + "/acl/roleList",
    {
      token
    },
    "POST"
  );
};
export const packageList = () => {
  return ajax(
    BASE + "/user/packageList",
    {
      token
    },
    "POST"
  );
};
export const addUser = formValue => {
  let obj = {};
  formValue.packageList.forEach(element => {
    let str = "group[" + element + "]";
    obj[str] = element;
  });
  let newobj = {
    username: formValue.username,
    status: formValue.userStatus,
    group_id: formValue.userGroup,
    source: formValue.proxy ? formValue.proxy : [],
    ...obj,
    user_money: formValue.loadGold,
    pass: formValue.password,
    repass: formValue.confirmPssword,
    token
  };
  return ajax(BASE + "/acl/addUser", newobj, "POST");
};
export const editUser = (formValue, id) => {
  let obj = {};
  formValue.packageList.forEach(element => {
    let str = "group[" + element + "]";
    obj[str] = element;
  });
  let newobj = {
    id,
    username: formValue.username,
    status: formValue.userStatus,
    group_id: formValue.userGroup,
    source: formValue.proxy ? formValue.proxy : [],
    ...obj,
    user_money: formValue.loadGold,
    pass: formValue.password ? formValue.password : [],
    token
  };
  return ajax(BASE + "/acl/editUser", newobj, "POST");
};
export const resetAuthCode = id => {
  return ajax(
    BASE + "/acl/resetAuthCode",
    {
      id,
      token
    },
    "POST"
  );
};

//后台管理-角色管理
export const getRoleList = (page, limit) => {
  return ajax(
    BASE + "/acl/roleList",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};
