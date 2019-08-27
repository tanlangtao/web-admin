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
//用户列表
export const reqUsers = (page, limit) =>
  ajax(BASE + "/user/index", { token, page, limit }, "POST");
export const setGameUserNickName = (id, game_nick) =>
  ajax(BASE + "/user/setGameUserNickName", { token, id, game_nick }, "POST");
export const changeGold = (record, value) => {
  let obj = {};
  let str = "params[user_id]";
  obj[str] = record.id;
  str = "params[amount]";
  obj[str] = value.gold;
  str = "params[reason]";
  obj[str] = value.desc;
  str = "params[user_name]";
  obj[str] = record.game_nick;
  str = "params[proxy_user_id]";
  obj[str] = record.proxy_user_id;
  str = "params[package_id]";
  obj[str] = record.package_id;
  return ajax(
    BASE + "/user/changeGold",
    { token, task_type: 0, ...obj },
    "POST"
  );
};

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
export const userDetail = (page, limit, id) => {
  return ajax(
    BASE + "/user/userDetail",
    {
      page,
      limit,
      token,
      id
    },
    "POST"
  );
};
export const bindInfo = (page, limit, id) => {
  return ajax(
    BASE + "/user/bindInfo",
    {
      page,
      limit,
      token,
      user_id: id
    },
    "POST"
  );
};
export const saveUserBlack = (user_id, action) => {
  return ajax(
    BASE + "/trade/saveUserBlack",
    {
      token,
      type: 1,
      user_id,
      action
    },
    "POST"
  );
};
export const createTask = (user_id, resetpwd) => {
  return ajax(
    BASE + "/tasks/createTask",
    {
      token,
      task_type: 2,
      "params[id]": user_id,
      "params[account_pass]": resetpwd
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
export const getRuleList = () => {
  return ajax(
    BASE + "/acl/ruleList",
    {
      page: 1,
      limit: 10,
      token,
      flag: 1
    },
    "POST"
  );
};

export const addRole = (name, rules, desc) => {
  let obj = {};
  rules.forEach(element => {
    let str = "rules[" + element + "]";
    obj[str] = element;
  });
  let newobj = {
    name,
    ...obj,
    desc,
    token
  };
  return ajax(BASE + "/acl/addRole", newobj, "POST");
};
export const editRole = (name, rules, desc, id) => {
  let obj = {};
  rules.forEach(element => {
    let str = "rules[" + element + "]";
    obj[str] = element;
  });
  let newobj = {
    role_name: name,
    role_id: id,
    ...obj,
    desc,
    token
  };
  return ajax(BASE + "/acl/editRole", newobj, "POST");
};
//客服-公告设置
export const getList = (page, limit) => {
  return ajax(
    BASE + "/notice/getList",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};
export const addNotice = (formData) => {
  return ajax(
    BASE + "/notice/addNotice",
    {
      token,
      ...formData
    },
    "POST"
  );
};
export const updateNotice = (formData,id) => {
  return ajax(
    BASE + "/notice/updateNotice",
    {
      token,
      id,
      ...formData
    },
    "POST"
  );
};
export const delNotice = (id) => {
  return ajax(
    BASE + "/notice/delNotice",
    {
      token,
      id
    },
    "POST"
  );
};
//客服-代充账号
//充值-充值订单
export const reqOrder_list = (page, limit, searchData) => {
  if (searchData) {
    let {
      start_time,
      end_time,
      order_status,
      type,
      inputParam,
      paramKey,
      order_id,
      user_id
    } = searchData;
    //处理输入关键字和选择关键字，组合成传输参数
    let obj = {};
    if (paramKey === "1" || paramKey === "2") {
      obj.time_type = paramKey;
    } else {
      let str = paramKey;
      obj[str] = inputParam;
    }
    return ajax(
      BASE + "/order/recharge",
      {
        page,
        limit,
        token,
        start_time,
        end_time,
        order_status,
        type,
        order_id,
        user_id,
        ...obj
      },
      "POST"
    );
  } else {
    return ajax(
      BASE + "/order/recharge",
      {
        page,
        limit,
        token
      },
      "POST"
    );
  }
};
export const downloadList = searchData => {
  let {
    start_time,
    end_time,
    order_status,
    type,
    inputParam,
    paramKey
  } = searchData;
  if (!paramKey || paramKey === "") {
    paramKey = 0;
  }
  let params =
    "token=" +
    token +
    "&filed=" +
    paramKey +
    "&keyword=" +
    inputParam +
    "&start_time=" +
    start_time +
    "&end_time=" +
    end_time +
    "&order_status=" +
    order_status +
    "&type=" +
    type;
  let url = BASE + "/order/recharge/?export=2&" + params;
  if (paramKey) {
    switch (paramKey) {
      case "user_id":
        url = url + "&user_id=" + inputParam;
        break;
      case "order_id":
        url = url + "&order_id=" + inputParam;
        break;
      case "create_time":
        url = url + "&time_type=1";
        break;
      case "arrival_time":
        url = url + "&time_type=2";
        break;
      default:
        break;
    }
  }
  window.open(url);
};
export const getChannelList = (page, limit, name) => {
  return ajax(
    BASE + "/order/channelList",
    {
      page,
      limit,
      token,
      name: name ? name : ""
    },
    "POST"
  );
};
export const addChannel = value => {
  return ajax(
    BASE + "/order/addChannel",
    {
      ...value,
      token,
      action: "add"
    },
    "POST"
  );
};
export const editPayChannel = (value, id) => {
  return ajax(
    BASE + "/order/editPayChannel",
    {
      ...value,
      token,
      id,
      action: "edit"
    },
    "POST"
  );
};
//充值-古都银行卡
export const bankList = (page, limit) => {
  return ajax(
    BASE + "/order/bankList",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};

export const saveBankCard = (searchData, id) => {
  if (id) {
    searchData.id = id;
  }
  return ajax(
    BASE + "/order/saveBankCard",
    {
      ...searchData,
      action: id ? "edit" : "add",
      token
    },
    "POST"
  );
};
export const deleteBankCard = id => {
  return ajax(
    BASE + "/order/saveBankCard",
    {
      id,
      action: "del",
      token
    },
    "POST"
  );
};
//充值-代充订单
export const rechargeOrder = (page, limit) => {
  return ajax(
    BASE + "/order/rechargeOrder",
    {
      page,
      limit,
      token,
      type: 14
    },
    "POST"
  );
};
//充值-渠道配置
export const getChannel = (page, limit) => {
  return ajax(
    BASE + "/order/getChannel",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};
export const getChannelInfo = channel_id => {
  return ajax(
    BASE + "/order/getChannelInfo",
    {
      page: 1,
      limit: 20,
      token,
      channel_id
    },
    "POST"
  );
};

export const editChannelInfo = (id, pay_code) => {
  return ajax(
    BASE + "/order/editChannelInfo",
    {
      id,
      token,
      pay_code
    },
    "POST"
  );
};
