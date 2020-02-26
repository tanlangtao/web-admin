import axios from "axios";
import ajax from "./ajax";
import Promise_any from "p-any";
import { message } from "antd";

let BASE = localStorage.BASE || ""
var token = localStorage.token || "";
//登陆成功后赋值token
export const setToken = () => {
    token = localStorage.token;
};
//并发后台登录请求，判断最快节点
export const raceURL = (username, password) => {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    let URLs = process.env.REACT_APP_HOST.split(",")
    console.log(URLs);
    let promises = URLs.map((value) => {
        return axios.get(value + "/api/check");
    })
    Promise_any(promises).then((result) => {
        localStorage.BASE = result.config.url.replace("/api/check", "/admin")
        BASE = localStorage.BASE
        console.log("选线成功", result, BASE)
    })
        .catch((error) => {
            message.error("网络状况不佳")
        })
}

// 登陆
export const reqLogin = (username, password, authcode) =>
    ajax(BASE + "/login/login", { username, password, authcode }, "POST");

// 获取authCode
export const reqAuthCode = (username, password) =>
    ajax(BASE + "/login/authCode", { username, password }, "POST");

// 获取菜单
export const navList = () => {
    // const token = localStorage.token;
    return ajax(BASE + "/acl/navList", null, "POST");
};
//安全码设置
export const getAuthCode = () =>
    ajax(BASE + "/user/getAuthCode", null, "POST");
//修改密码
export const editPass = password =>
    ajax(BASE + "/user/editPass", { password }, "POST");
//用户列表
export const reqUsers = (page, limit, start, end, inputKey, inputValue) => {
    return ajax(
        BASE + "/user/index",
        { page, limit, start, end, [inputKey]: inputValue },
        "POST"
    );
};
export const downloadUserList = (reqData) => {
    let {
        start_time,
        end_time,
        inputKey,
        inputValue
    } = reqData;
    if (inputKey === "id" || inputKey === "proxy_pid") {
        inputValue = parseInt(inputValue)
    }
    let dealInput
    if (inputKey !== "" && inputValue !== "") {
        dealInput = "&" + inputKey + "=" + inputValue;
    }
    let params =
        "authorization=" + token +
        "&start_time=" + start_time +
        "&end_time=" + end_time;
    let url = BASE + "/user/userList?page=1&limit=10000&" + params + dealInput
    console.log(url);
    window.open(url);
};

export const downloadGoldList = (reqData) => {
    let {
        start_time,
        end_time,
        id
    } = reqData;
    let params =
        "authorization=" + token +
        "&start=" + start_time +
        "&end=" + end_time +
        "&id=" + id;
    let url = BASE + "/user/userDetail?page=1&limit=10000&" + params;
    console.log(url);
    window.open(url);
};
export const setGameUserNickName = (id, game_nick) =>
    ajax(BASE + "/user/setGameUserNickName", { id, game_nick }, "POST");
export const changeGold = (record, value) => {
    return ajax(
        BASE + "/user/changeGold",
        {
            task_type: 0,
            params: {
                user_id: record.id,
                user_name: record.game_nick,
                proxy_user_id: record.proxy_user_id,
                package_id: record.package_id,
                amount: +value.gold,
                reason: value.desc
            }
        },
        "POST"
    );
};
export const reqLoadGold = id => {
    return ajax(
        BASE + "/user/getGameUser",
        {
            page: 1,
            limit: 10,
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
            user_id: id
        },
        "POST"
    );
};
export const saveUserBlack = (user_id, action) => {
    return ajax(
        BASE + "/trade/saveUserBlack",
        {
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
            task_type: 2,
            params: {
                id: user_id,
                account_pass: resetpwd
            }
        },
        "POST"
    );
};
export const setCustomer = id => {
    return ajax(
        BASE + "/user/setCustomer ",
        {
            id
        },
        "POST"
    );
};
export const resetAlipayOrBankcard = (account_id, account_type, id) => {
    return ajax(
        BASE + "/tasks/createTask",
        {
            task_type: 3,
            account_id,
            account_type,
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
            limit
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
            name
        },
        "POST"
    );
};

export const roleList = () => {
    return ajax(BASE + "/acl/roleList", null, "POST");
};
export const packageList = () => {
    return ajax(BASE + "/user/packageList", null, "POST");
};
export const addUser = formValue => {
    let newobj = {
        username: formValue.username,
        status: formValue.userStatus,
        group_id: formValue.userGroup,
        proxy: formValue.proxy ? formValue.proxy : null,
        group: formValue.packageList.join(","),
        use_balance: parseFloat(formValue.loadGold),
        pass: formValue.password,
        repass: formValue.confirmPssword
    };
    return ajax(BASE + "/acl/addUser", newobj, "POST");
};
export const editUser = (formValue, id) => {
    let newobj = {
        id,
        username: formValue.username,
        status: formValue.userStatus,
        group_id: formValue.userGroup,
        proxy: formValue.proxy ? formValue.proxy : null,
        group: formValue.packageList.join(","),
        use_balance: formValue.loadGold,
    };
    if (formValue.editPassword) {
        newobj.pass = formValue.editPassword
    }
    return ajax(BASE + "/acl/editUser", newobj, "POST");
};
export const resetAuthCode = id => {
    return ajax(
        BASE + "/acl/resetAuthCode",
        {
            id
        },
        "POST"
    );
};
//后台管理-权限列表
export const ruleList = () => {
    return ajax(BASE + "/acl/ruleList", null, "POST");
};
export const addRule = value => {
    return ajax(
        BASE + "/acl/addRule",
        {
            ...value
        },
        "POST"
    );
};
export const editRule = (id, value) => {
    return ajax(BASE + "/acl/editRule", { ...value, id }, "POST");
};
export const ruleDel = id => {
    return ajax(
        BASE + "/acl/ruleDel",
        {
            id
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
            limit
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
            flag: 1
        },
        "POST"
    );
};

export const addRole = (role_name, rules, desc) => {
    return ajax(BASE + "/acl/addRole", { role_name, rules, desc }, "POST");
};
export const editRole = (role_name, rules, desc, role_id) => {
    return ajax(
        BASE + "/acl/editRole",
        { role_name, rules, desc, role_id },
        "POST"
    );
};
//客服-公告设置
export const getList = (page, limit) => {
    return ajax(
        BASE + "/notice/getNoticeList",
        {
            page,
            limit
        },
        "POST"
    );
};
export const addNotice = formData => {
    return ajax(
        BASE + "/notice/addNotice",
        {
            ...formData
        },
        "POST"
    );
};
export const updateNotice = (formData, id) => {
    return ajax(
        BASE + "/notice/updateNotice",
        {
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
            limit
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
            action
        },
        "POST"
    );
};
//捕鱼设置
export const getBuYuConfig = () => {
    return ajax(BASE + "/config/getBuYuConfig", {}, "GET");
};
export const setBuYuConfig = reqData => {
    let { RoomIndex, PlaceType, Level, Difficult, ChouFang } = reqData
    return ajax(BASE + `/config/setBuYuConfig?RoomIndex=${RoomIndex}&PlaceType=${PlaceType}&Level=${Level}&Difficult=${Difficult}&ChouFang=${ChouFang}`,
        {},
        "GET");
};
//代理系统
export const getProxyUserList = data => {
    return ajax(
        BASE + "/user/getProxyUserList",
        {
            ...data
        },
        "POST"
    );
};
export const changeProxyUserProxyPid = data => {
    return ajax(
        BASE + "/user/changeProxyUserProxyPid",
        {
            ...data
        },
        "POST"
    );
};
export const proxy_changeGold = data => {
    return ajax(
        BASE + "/user/changeGold",
        {
            ...data
        },
        "POST"
    );
};
export const getProxyUser = data => {
    return ajax(
        BASE + "/user/getProxyUser",
        {
            ...data
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
            ...value
        },
        "POST"
    );
};

export const changeUserBalance = value => {
    return ajax(
        BASE + "/tasks/changeUserBalance",
        {
            ...value
        },
        "POST"
    );
};
export const reviewTask = value => {
    return ajax(
        BASE + "/tasks/reviewTask",
        {
            ...value
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
            ...value
        },
        "POST"
    );
};
export const resetPassword = user_id => {
    return ajax(
        BASE + "/trade/resetPassword",
        {
            user_id
        },
        "POST"
    );
};
export const accountList = user_id => {
    return ajax(BASE + "/trade/accountList", { user_id }, "POST");
};

//交易所-申请上架历史
export const sellGoldApplyList = (page, limit, value) => {
    return ajax(
        BASE + "/trade/sellGoldApplyList",
        {
            page,
            limit,
            ...value
        },
        "POST"
    );
};
export const tradeRemark = value => {
    return ajax(
        BASE + "/trade/tradeRemark",
        {
            ...value
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
            user_id
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
            type: 3
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
            type: 6
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
            ...value
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
            ...value
        },
        "POST"
    );
};
export const saveActivityConfig = value => {
    return ajax(
        BASE + "/activity/saveActivityConfig",
        {
            ...value
        },
        "POST"
    );
};
export const delActivityConfig = id => {
    return ajax(
        BASE + "/activity/delActivityConfig",
        {
            id
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
            ...value
        },
        "POST"
    );
};
//活动-活动领取列表
export const activityList = (page, limit, value) => {
    return ajax(
        BASE + "/activity/activityList",
        {
            page,
            limit,
            ...value
        },
        "POST"
    );
};
//充值-充值订单
export const reqOrder_list = (page, limit, reqData) => {
    return ajax(BASE + "/order/recharge", { page, limit, ...reqData }, "POST");
};
export const reqLostOrder_list = (page, limit, user_id, order_id) => {
    return ajax(
        BASE + "/order/recharge",
        { page, limit, order_id, user_id },
        "POST"
    );
};
export const orderReview = (user_id, order_id) => {
    return ajax(
        BASE + "/order/orderReview",
        { user_id, order_id, status: 7, review_type: 1 },
        "POST"
    );
};
export const orderReviewEdit = reqData => {
    return ajax(
        BASE + "/order/orderReview",
        // { user_id, order_id, status: 8, review_type: 2, type },
        { ...reqData },
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
        "authorization=" +
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
            case "1":
                url = url + "&time_type=1";
                break;
            case "2":
                url = url + "&time_type=2";
                break;
            case "package_nick":
                url = url + "&package_nick=" + inputParam;
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
            limit
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
            action: id ? "edit" : "add"
        },
        "POST"
    );
};
export const deleteBankCard = id => {
    return ajax(
        BASE + "/order/saveBankCard",
        {
            id,
            action: "del"
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
        BASE + "/order/recharge",
        {
            page,
            limit,
            type: "14",
            start_time,
            end_time,
            order_status,
            [inputKey]: inputValue
        },
        "POST"
    );
};
export const cancelOrder = reqData => {
    return ajax(
        BASE + "/order/cancelOrder",
        {
            ...reqData
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
            limit
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
            pay_code
        },
        "POST"
    );
};
//兑换-兑换订单&代提设置
export const withDraw = (page, limit, data) => {
    return ajax(
        BASE + "/order/withDraw",
        {
            page,
            limit,
            ...data
        },
        "POST"
    );
};
export const reviewInfo = (page, limit, id) => {
    return ajax(
        BASE + "/order/reviewInfo",
        {
            page,
            limit,
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
        inputValue,
        inputKey,
        flag
    } = searchData;
    let params =
        "flag=" +
        flag +
        "&authorization=" +
        token +
        "&filed=" +
        inputKey +
        "&keyword=" +
        inputValue +
        "&start_time=" +
        start_time +
        "&end_time=" +
        end_time +
        "&order_status=" +
        order_status +
        "&type=" +
        type;
    let url = BASE + "/order/withDraw/?export=2&" + params;
    if (inputKey) {
        switch (inputKey) {
            case "user_id":
                url = url + "&user_id=" + inputValue;
                break;
            case "order_id":
                url = url + "&order_id=" + inputValue;
                break;
            case "1":
                url = url + "&time_type=1";
                break;
            case "2":
                url = url + "&time_type=2";
                break;
            case "replace_id":
                url = url + "&replace_id=" + inputValue;
                break;
            default:
                break;
        }
    }
    console.log(url);
    window.open(url);
};
export const withDrawRemark = (order_id, temarks, remark_type) => {
    return ajax(
        BASE + "/order/withDrawRemark",
        {
            order_id,
            temarks,
            remark_type,
            type: 2
        },
        "POST"
    );
};
export const auditOrder = reqData => {
    return ajax(
        BASE + "/order/withDraw",
        {
            ...reqData
        },
        "POST"
    );
};
export const orderWithDrawReview = reqData => {
    return ajax(
        BASE + "/order/withDrawReview",
        {
            ...reqData
        },
        "POST"
    );
};

//兑换-第三方提款设置
export const getConfigList = reqData => {
    return ajax(
        BASE + "/config/list",
        {
            ...reqData
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
            action: "edit"
        },
        "POST"
    );
};
//赠送-赠送订单
export const withDrawReview = (order_id, user_id, review_status) => {
    return ajax(
        BASE + "/order/withDraw",
        {
            order_id,
            review_status: review_status,
            user_id: user_id,
            review_type: 1,
            is_pass: 1
        },
        "POST"
    );
};
export const setGiftConfig = reqData => {
    return ajax(
        BASE + "/config/setGiftConfig",
        {
            ...reqData
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
            ...value
        },
        "POST"
    );
};
export const changeInternalUserBalance = (user_id, amount) => {
    return ajax(
        BASE + "/user/changeInternalUserBalance",
        {
            user_id,
            amount
        },
        "POST"
    );
};
