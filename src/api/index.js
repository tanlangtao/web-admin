import ajax from "./ajax";
//import storageUtils from "../utils/storageUtils";
// import token from '../pages/login'
//import memory from

const BASE = process.env.REACT_APP_HOST;

var token = localStorage.token || "";
//登陆成功后赋值token
export const setToken = () => {
  token = localStorage.token;
};

// 登陆
export const reqLogin = (username, password, authcode) =>
  ajax(BASE + "/login/login", { username, password, authcode }, "POST");

// 获取authCode
export const reqAuthCode = (username, password) =>
  ajax(BASE + "/login/authCode", { username, password }, "POST");

// 获取菜单
export const navList = () => {
  const token = localStorage.token;
  return ajax(BASE + "/acl/navList", { token }, "POST");
};
//安全码设置
export const getAuthCode = () =>
  ajax(BASE + "/index/getAuthCode", { token }, "POST");
//修改密码
export const editPass = password =>
  ajax(BASE + "/acl/editPass", { token, password }, "POST");
//用户列表
export const reqUsers = (page, limit, start, end, inputKey, inputValue) => {
  return ajax(
    BASE + "/user/index",
    { page, limit, start, end, [inputKey]: inputValue, token },
    "POST"
  );
};

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
export const userDetail = (page, limit, id, goldDetails) => {
  return ajax(
    BASE + "/user/userDetail",
    {
      page,
      limit,
      token,
      id,
      ...goldDetails
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
    use_money: formValue.loadGold,
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
    use_money: formValue.loadGold,
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
//后台管理-权限列表
export const ruleList = () => {
  return ajax(
    BASE + "/acl/ruleList",
    {
      token
    },
    "POST"
  );
};
export const addRule = value => {
  return ajax(
    BASE + "/acl/addRule",
    {
      ...value,
      token
    },
    "POST"
  );
};
export const editRule = (rule_id, value) => {
  console.log(value);

  return ajax(BASE + "/acl/editRule", { ...value, rule_id, token }, "POST");
};
export const ruleDel = id => {
  return ajax(
    BASE + "/acl/ruleDel",
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
export const addNotice = formData => {
  return ajax(
    BASE + "/notice/addNotice",
    {
      token,
      ...formData
    },
    "POST"
  );
};
export const updateNotice = (formData, id) => {
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
export const delNotice = id => {
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
export const customerList = (page, limit, user_id) => {
  return ajax(
    BASE + "/customer/customerList",
    {
      page,
      limit,
      token,
      user_id: user_id ? user_id : ""
    },
    "POST"
  );
};
export const saveCustomerService = (formData, action, user_id) => {
  if (user_id) {
    formData.user_id = user_id;
  }
  return ajax(
    BASE + "/customer/saveCustomerService",
    {
      token,
      ...formData,
      action
    },
    "POST"
  );
};
//报表-日常运营
export const dailyReportInit = (page, limit) => {
  return ajax(
    BASE + "/report/dailyReport",
    {
      page,
      limit,
      token
    },
    "POST"
  );
};
export const dailyReport = (page, limit, package_id, start = "", end = "") => {
  return ajax(
    BASE + "/report/dailyReport",
    {
      page,
      limit,
      token,
      package_id,
      start,
      end
    },
    "POST"
  );
};
export const dateReport = (page, limit, package_id, start = "", end = "") => {
  return ajax(
    BASE + "/report/dateReport",
    {
      page,
      limit,
      token,
      package_id,
      start,
      end,
      group_by: "date"
    },
    "POST"
  );
};
export const gameReport = (page, limit, package_id, start = "", end = "") => {
  return ajax(
    BASE + "/report/gameReport",
    {
      page,
      limit,
      token,
      package_id,
      start,
      end,
      group_by: "game_id"
    },
    "POST"
  );
};
export const oneDayGameReport = (page, limit, package_id, date) => {
  return ajax(
    BASE + "/report/gameReport",
    {
      page,
      limit,
      token,
      package_id,
      date,
      group_by: "game_id"
    },
    "POST"
  );
};
//游戏设置-配置项
export const configList = (page, limit, conf_key) => {
  return ajax(
    BASE + "/config/list",
    {
      page,
      limit,
      token,
      conf_key: conf_key ? conf_key : ""
    },
    "POST"
  );
};
export const saveConf = (value, action) => {
  return ajax(
    BASE + "/config/saveConf",
    {
      ...value,
      action,
      token
    },
    "POST"
  );
};
//消息中心-任务列表
export const tasksList = (page, limit, value) => {
  return ajax(
    BASE + "/tasks/tasksList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};

export const changeUserBalance = value => {
  return ajax(
    BASE + "/tasks/changeUserBalance",
    {
      ...value,
      token
    },
    "POST"
  );
};
//交易所-收付款管理
export const allAccountList = (page, limit, value) => {
  return ajax(
    BASE + "/trade/allAccountList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};
export const resetPassword = user_id => {
  return ajax(
    BASE + "/trade/resetPassword",
    {
      user_id,
      token
    },
    "POST"
  );
};
export const accountList = user_id => {
  return ajax(BASE + "/trade/accountList", { user_id, token }, "POST");
};

//交易所-申请上架历史
export const sellGoldApplyList = (page, limit, value) => {
  return ajax(
    BASE + "/trade/sellGoldApplyList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};
export const tradeRemark = value => {
  return ajax(
    BASE + "/trade/tradeRemark",
    {
      ...value,
      token
    },
    "POST"
  );
};
export const sellGoldInfoList = (page, limit, user_id) => {
  return ajax(
    BASE + "/order/sellGoldInfoList",
    {
      page,
      limit,
      user_id,
      token
    },
    "POST"
  );
};
export const reviewInfo2 = (page, limit, id) => {
  return ajax(
    BASE + "/order/reviewInfo",
    {
      page,
      limit,
      id,
      type: 3,
      token
    },
    "POST"
  );
};
export const remarkInfo2 = (page, limit, id) => {
  return ajax(
    BASE + "/order/remarkInfo",
    {
      page,
      limit,
      id,
      type: 6,
      token
    },
    "POST"
  );
};
//交易所-交易订单
export const sellGoldOrderList = (page, limit, value) => {
  return ajax(
    BASE + "/trade/sellGoldOrderList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};
//活动-活动列表
export const activityConfigList = (page, limit, value) => {
  return ajax(
    BASE + "/activity/activityConfigList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};
export const saveActivityConfig = value => {
  return ajax(
    BASE + "/activity/saveActivityConfig",
    {
      ...value,
      token
    },
    "POST"
  );
};
export const delActivityConfig = id => {
  return ajax(
    BASE + "/activity/delActivityConfig",
    {
      id,
      token
    },
    "POST"
  );
};

//活动-礼金券领取列表
export const giftVoucherList = (page, limit, value) => {
  return ajax(
    BASE + "/activity/giftVoucherList",
    {
      page,
      limit,
      ...value,
      token
    },
    "POST"
  );
};

//充值-充值订单
export const reqOrder_list = (
  page,
  limit,
  start_time,
  end_time,
  order_status,
  type,
  inputKey,
  inputValue
) => {
  if (inputKey === "1" || inputKey === "2") {
    inputValue = inputKey;
    inputKey = "time_type";
  }
  return ajax(
    BASE + "/order/recharge",
    { start_time, end_time, order_status, type, token, [inputKey]: inputValue },
    "POST"
  );
};
export const reqLostOrder_list = (page, limit, user_id, order_id) => {
  return ajax(
    BASE + "/order/recharge",
    { page, limit, order_id, user_id, token },
    "POST"
  );
};
export const orderReview = (user_id, order_id) => {
  return ajax(
    BASE + "/order/orderReview",
    { user_id, order_id, status: 7, review_type: 1, token },
    "POST"
  );
};
export const orderReviewEdit = (user_id, order_id, type) => {
  return ajax(
    BASE + "/order/orderReview",
    { user_id, order_id, status: 8, review_type: 2, token, type },
    "POST"
  );
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
export const rechargeOrder = (
  page,
  limit,
  start_time,
  end_time,
  order_status,
  inputKey,
  inputValue
) => {
  return ajax(
    BASE + "/order/rechargeOrder",
    {
      page,
      limit,
      token,
      type: 14,
      start_time,
      end_time,
      order_status,
      [inputKey]: inputValue
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
//兑换-兑换订单&代提设置
export const withDraw = (page, limit, flag, searchData) => {
  if (searchData) {
    let {
      start_time,
      end_time,
      order_status,
      type,
      inputParam,
      filed
    } = searchData;
    //处理输入关键字和选择关键字，组合成传输参数
    let obj = {};
    if (filed !== "create_time" && filed !== "arrival_time") {
      obj[filed] = inputParam;
    } else if (filed !== "create_time") {
      obj.time_type = 1;
    } else if (filed !== "arrival_time") {
      obj.time_type = 2;
    }
    return ajax(
      BASE + "/order/withDraw",
      {
        page,
        limit,
        token,
        start_time,
        end_time,
        order_status,
        type,
        ...obj,
        flag
      },
      "POST"
    );
  } else {
    return ajax(
      BASE + "/order/withDraw",
      {
        page,
        limit,
        token,
        flag
      },
      "POST"
    );
  }
};
export const reviewInfo = (page, limit, id) => {
  return ajax(
    BASE + "/order/reviewInfo",
    {
      page,
      limit,
      token,
      id,
      type: 2
    },
    "POST"
  );
};
export const remarkInfo = (page, limit, id) => {
  return ajax(
    BASE + "/order/remarkInfo",
    {
      page,
      limit,
      token,
      id,
      type: 2
    },
    "POST"
  );
};
export const downloadWithdrawList = searchData => {
  let {
    start_time,
    end_time,
    order_status,
    type,
    inputParam,
    filed
  } = searchData;
  let params =
    "token=" +
    token +
    "&filed=" +
    filed +
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
  let url = BASE + "/order/withDraw/?export=2&flag=2&" + params;
  if (filed) {
    switch (filed) {
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
      case "replace_id":
        url = url + "&replace_id=" + inputParam;
        break;
      default:
        break;
    }
  }
  window.open(url);
};
export const withDrawRemark = (id, temarks, remark_type) => {
  return ajax(
    BASE + "/order/withDrawRemark",
    {
      token,
      id,
      temarks,
      remark_type,
      type: 2
    },
    "POST"
  );
};
//兑换-第三方提款设置
export const getConfigList = () => {
  return ajax(
    BASE + "/config/list",
    {
      conf_key: "withdraw_channel_info",
      get_val: 1,
      token
    },
    "POST"
  );
};
export const saveWithDrawChannel = (id, name, value) => {
  return ajax(
    BASE + "/config/saveWithDrawChannel",
    {
      id,
      name,
      ...value,
      "alipay[name]": "支付宝",
      "alipay[withdraw_type]": 1,
      "bankcard[name]": "银行卡",
      "bankcard[withdraw_type]": 2,
      conf_key: "withdraw_channel_info",
      action: "edit",
      token
    },
    "POST"
  );
};
//赠送-赠送订单
export const withDrawReview = (order_id, user_id, review_status) => {
  return ajax(
    BASE + "/order/withDraw",
    {
      token,
      order_id,
      review_status,
      user_id,
      review_type: 1,
      is_pass: 1
    },
    "POST"
  );
};
//AI
export const getAIList = (page, limit, package_id, value) => {
  return ajax(
    BASE + "/user/index",
    {
      page,
      limit,
      package_id,
      ...value,
      token
    },
    "POST"
  );
};
export const changeInternalUserBalance = (user_id, amount) => {
  return ajax(
    BASE + "/user/changeInternalUserBalance",
    {
      user_id,
      amount,
      token
    },
    "POST"
  );
};
