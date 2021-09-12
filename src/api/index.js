import axios from "axios";
import ajax from "./ajax";
import Promise_any from "p-any";
import { message } from "antd";
import _ from "lodash-es";

let BASE = localStorage.BASE || "";
var token = localStorage.token || "";
//登陆成功后赋值token
export const setToken = () => {
	token = localStorage.token;
};
//并发后台登录请求，判断最快节点
export const raceURL = (username, password) => {
	const instance2 = axios.create({
		header: {
			"Content-Type": "application/json",
		},
	});
	// axios.defaults.headers.post["Content-Type"] = "application/json";
	let URLs = process.env.REACT_APP_HOST.split(",");
	console.log(URLs);
	let promises = URLs.map(value => {
		return instance2.get(value + "/api/check");
	});
	Promise_any(promises)
		.then(result => {
			localStorage.BASE = result.config.url.replace("/api/check", "/admin");
			BASE = localStorage.BASE;
			console.log("选线成功", result, BASE);
		})
		.catch(error => {
			message.info("网络状况不佳");
		});
};

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
export const getAuthCode = () => ajax(BASE + "/user/getAuthCode", null, "POST");
//修改密码
export const editPass = password => ajax(BASE + "/user/editPass", { password }, "POST");
//用户列表
export const reqUsers = (page, limit, start, end, inputKey, inputValue) => {
	return ajax(BASE + "/user/index", { page, limit, start, end, [inputKey]: inputValue }, "POST");
};
export const user_table_data = reqData => {
	return ajax(BASE + "/user/index", { ...reqData }, "POST");
};

export const setGameUserPhone = reqData => {
	return ajax(BASE + "/Operation/Api/setGameUserPhone", { ...reqData }, "POST", {
		content_type_is_formdata: true,
	});
};
export const downloadUserList = reqData => {
	let { start_time, end_time, inputKey, inputValue, packages } = reqData;
	if (inputKey === "id" || inputKey === "proxy_pid") {
		inputValue = parseInt(inputValue);
	}
	let dealInput = "";
	if (inputKey && inputValue) {
		dealInput = "&" + inputKey + "=" + inputValue;
	}
	let params =
		"authorization=" +
		token +
		"&start=" +
		start_time +
		"&end=" +
		end_time +
		"&packages=" +
		packages;
	let url = BASE + "/user/userList?page=1&limit=10000&" + params + dealInput;
	console.log(url);
	window.open(url);
};

//舊下載連結,2021/6/23改成下載時,前端組裝data與轉換為excel格式
// export const downloadGoldList = reqData => {
// 	let { start_time, end_time, id } = reqData;
// 	let params =
// 		"authorization=" + token + "&start=" + start_time + "&end=" + end_time + "&id=" + id;
// 	let url = BASE + "/user/userDetail?page=1&limit=20000&" + params;
// 	console.log(url);
// 	window.open(url);
// };
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
				amount: parseFloat(value.gold),
				reason: value.desc,
			},
		},
		"POST",
	);
};
export const reqLoadGold = id => {
	return ajax(
		BASE + "/user/getGameUser",
		{
			page: 1,
			limit: 10,
			id,
		},
		"POST",
	);
};
export const userDetail = (page, limit, id, goldDetails) => {
	return ajax(
		BASE + "/user/userDetail",
		{
			page,
			limit,
			id,
			...goldDetails,
		},
		"POST",
	);
};
export const bindInfo = (page, limit, id) => {
	return ajax(
		BASE + "/user/bindInfo",
		{
			page,
			limit,
			user_id: id,
		},
		"POST",
	);
};
export const saveUserBlack = (user_id, action) => {
	return ajax(
		BASE + "/trade/saveUserBlack",
		{
			type: 1,
			user_id,
			action,
		},
		"POST",
	);
};
export const createTask = (user_id, resetpwd) => {
	return ajax(
		BASE + "/tasks/createTask",
		{
			task_type: 2,
			params: {
				id: user_id,
				account_pass: resetpwd,
			},
		},
		"POST",
	);
};
export const setCustomer = id => {
	return ajax(
		BASE + "/user/setCustomer ",
		{
			id,
		},
		"POST",
	);
};
export const resetAlipayOrBankcard = (account_id, account_type, id) => {
	return ajax(
		BASE + "/tasks/createTask",
		{
			task_type: 3,
			account_id,
			account_type,
			id,
		},
		"POST",
	);
};

//用户列表-限制玩家登录
export const setgameuserstatus = (id, status) => {
	return ajax(
		BASE + "/Operation/Api/setgameuserstatus",
		{
			platform_key: 654321,
			id,
			status,
		},
		"POST",
		{
			content_type_is_formdata: true,
		},
	);
};

//资金明细
export const reqGameData = str => {
	return ajax(process.env.REACT_APP_GAME_HOST + str, {}, "GET", { needAuth: false });
};
//资金明细-多福多财
export const reqDuofuduocaiGameData = str => {
	return ajax(process.env.REACT_APP_GAME_HOST + str, {}, "GET", { needAuth: false });
};
//用户列表-查看ip
export const getipdetail = ip => {
	return ajax(`https://ipwhois.app/json/${ip}?lang=zh-CN`, {}, "GET", { needAuth: false });
};

//用户列表-查看手机号归属地
export const getteldetail = tel => {
	// window.open(`http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=${tel}`);
	/*add by jil 2020.08.05 用户列表界面增加电话号码归属地查询功能*/
	return ajax(
		BASE + "/mobile",
		{
			tel: tel,
		},
		"GET",
	);
};
//用户-银行卡反查

export const queryAccount = reqData => {
	return ajax(
		BASE + "/user/queryAccount",
		{
			...reqData,
			token: "e40f01afbb1b9ae3dd6747ced5bca532",
		},
		"GET",
	);
};
//后台管理-账户列表
export const reqAdminList = (page, limit) => {
	return ajax(
		BASE + "/acl/index",
		{
			page,
			limit,
		},
		"POST",
	);
};
export const searchAdminData = name => {
	return ajax(
		BASE + "/acl/index",
		{
			page: 1,
			limit: 20,
			name,
		},
		"POST",
	);
};

export const roleList = () => {
	return ajax(BASE + "/acl/roleList", null, "POST");
};
export const packageList = () => {
	return ajax(BASE + "/user/packageList", null, "POST");
};
export const userPackageList = () => {
	return ajax(BASE + "/user/userPackageList", null, "POST");
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
		repass: formValue.confirmPssword,
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
		newobj.pass = formValue.editPassword;
	}
	return ajax(BASE + "/acl/editUser", newobj, "POST");
};
export const resetAuthCode = id => {
	return ajax(
		BASE + "/acl/resetAuthCode",
		{
			id,
		},
		"POST",
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
			...value,
		},
		"POST",
	);
};
export const editRule = (id, value) => {
	return ajax(BASE + "/acl/editRule", { ...value, id }, "POST");
};
export const ruleDel = id => {
	return ajax(
		BASE + "/acl/ruleDel",
		{
			id,
		},
		"POST",
	);
};
//后台管理-角色管理
export const getRoleList = (page, limit) => {
	return ajax(
		BASE + "/acl/roleList",
		{
			page,
			limit,
		},
		"POST",
	);
};
export const getRuleList = () => {
	return ajax(
		BASE + "/acl/ruleList",
		{
			page: 1,
			limit: 10,
			flag: 1,
		},
		"POST",
	);
};
export const getUserRuleList = () => {
	return ajax(
		BASE + "/acl/ruleList",
		{
			page: 1,
			limit: 10,
			flag: 1,
		},
		"POST",
	);
};
export const addRole = (role_name, rules, desc) => {
	return ajax(BASE + "/acl/addRole", { role_name, rules, desc }, "POST");
};
//编辑角色
export const editRole = (role_name, rules, desc, role_id) => {
	return ajax(BASE + "/acl/editRole", { role_name, rules, desc, role_id }, "POST");
};
//编辑账户权限
export const editUserRules = (id, rules, desc) => {
	return ajax(BASE + "/acl/editUserRules", { id, rules, desc }, "POST");
};
//编辑权限后发送该请求

// export const afterEditRole = () => {
//     console.log(process.env.REACT_APP_HOST);
//     //todo 只在ol的时候修改权限后才跑该接口,而部署到集团服务器的话不用判断
//     if (process.env.REACT_APP_HOST !== "http://prdweb.539316.com") return;
//     return ajax("http://admin.miamirra.com/api/assignRule", {}, "GET", { needAuth: false });
// };
//客服-公告设置
export const getList = (page, limit) => {
	return ajax(
		BASE + "/notice/getNoticeList",
		{
			page,
			limit,
		},
		"POST",
	);
};
export const addNotice = formData => {
	return ajax(
		BASE + "/notice/addNotice",
		{
			...formData,
		},
		"POST",
	);
};
export const updateNotice = (formData, id) => {
	return ajax(
		BASE + "/notice/updateNotice",
		{
			id,
			...formData,
		},
		"POST",
	);
};
export const delNotice = id => {
	return ajax(
		BASE + "/notice/delNotice",
		{
			id,
		},
		"POST",
	);
};
//客服-代充账号
export const customerList = (page, limit, user_id) => {
	return ajax(
		BASE + "/customer/customerList",
		{
			page,
			limit,
			user_id: user_id ? user_id : "",
		},
		"POST",
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
			action,
		},
		"POST",
	);
};
//客服账号
export const IMsystem = (router, reqData, type = "GET") => {
	return ajax(
		`${process.env.REACT_APP_IM_HOST}/im/api/${router}`,
		_.omitBy(reqData, _.isNil),
		type,
		{
			content_type_is_formdata: true,
			needAuth: false,
		},
	);
};

//报表-日常运营
export const dailyReportInit = (page, limit) => {
	return ajax(
		BASE + "/report/dailyReport",
		{
			page,
			limit,
		},
		"POST",
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
			end,
		},
		"POST",
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
			group_by: "date",
		},
		"POST",
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
			group_by: "game_id",
		},
		"POST",
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
			group_by: "game_id",
		},
		"POST",
	);
};
//报表-游戏数据
export const getGameDataList = str => {
	return ajax(process.env.REACT_APP_GAME_HOST + str, {}, "GET", {
		needAuth: false,
		// timeout: 30000,
	});
};
export const getGameUserStatementTotalList = reqData => {
	return ajax(
		BASE + `/Operation/Api/GetGameUserStatementTotalList`,
		{ ...reqData, platform_key: 654321 },
		"GET",
	);
};
//游戏设置-配置项
export const configList = (page, limit, conf_key) => {
	return ajax(
		BASE + "/config/list",
		{
			page,
			limit,
			conf_key: conf_key ? conf_key : "",
		},
		"POST",
	);
};
export const saveConf = (value, action) => {
	return ajax(
		BASE + "/config/saveConf",
		{
			...value,
			action,
		},
		"POST",
	);
};
export const getprofitpool = str => {
	return ajax(process.env.REACT_APP_GAME_HOST + str, {}, "GET", { needAuth:false });
};
//更新盈余池 -> go-admin -> 控制角色权限
export const uptprofitpool = (str, formdata) => {
	/*return ajax(process.env.REACT_APP_GAME_HOST + str, formdata, "POST", {
		needAuth: false,
		content_type_is_formdata: true,
	});*/
	return ajax(
		process.env.REACT_APP_GAME_HOST + str,
		{
			...formdata,
		},
		"POST",
		{
			needAuth: false,
			content_type_is_formdata: true,
		},
	);
};
export const addOperatorLog = data => {
	return ajax(BASE + "/acl/addOperatorLog", data, "POST", { content_type_is_formdata: true });
};
//捕鱼设置
export const getBuYuConfig = () => {
	return ajax(BASE + "/config/getBuYuConfig", {}, "GET");
};
export const setBuYuConfig = reqData => {
	let { RoomIndex, PlaceType, Level, Difficult, ChouFang } = reqData;
	return ajax(
		BASE +
		`/config/setBuYuConfig?RoomIndex=${RoomIndex}&PlaceType=${PlaceType}&Level=${Level}&Difficult=${Difficult}&ChouFang=${ChouFang}`,
		{},
		"GET",
	);
};
//cylhd开启与关闭游戏房间
export const changeRoomStatus = ({ game_id, room_id, room_status, subgame }) => {
	return ajax(
		`${process.env.REACT_APP_GAME_HOST}${subgame !== "cycdx"
			? "/cylhd/api/changeRoomStatus"
			: "/caidaxiao/api/changeRoomStatus"
		}`,
		{ game_id, room_id, room_status },
		"GET",
		{ needAuth: false },
	);
};
//cylhd&cycdx玩家限红设定与查询
export const getUserLimitRangeRecord = ({ game_id, user_id, subgame }) => {
	return ajax(
		`${process.env.REACT_APP_GAME_HOST}${subgame !== "cycdx"
			? "/cylhd/api/getUserLimitRangeRecord"
			: "/caidaxiao/api/getUserLimitBet"
		}`,
		{ game_id, user_id },
		"GET",
		{ needAuth: false },
	);
};
export const setUserLimitRangeBet = ({ game_id, user_id, max_bet, min_bet, subgame }) => {
	return ajax(
		`${process.env.REACT_APP_GAME_HOST}${subgame !== "cycdx"
			? "/cylhd/api/setUserLimitRangeBet"
			: "/caidaxiao/api/setUserLimitBet"
		}`,
		{ game_id, user_id, max_bet, min_bet },
		"POST",
		{ needAuth: false, content_type_is_formdata: true },
	);
};
//cylhd&cycdx房间限红设定与查询
export const getRoomLimitRangeRecord = ({ game_id, room_id, subgame }) => {
	return ajax(
		`${process.env.REACT_APP_GAME_HOST}${subgame !== "cycdx"
			? "/cylhd/api/getRoomLimitBet"
			: "/caidaxiao/api/getRoomLimitBet"
		}`,
		{ game_id, room_id },
		"POST",
		{ needAuth: false, content_type_is_formdata: true },
	);
};
export const setRoomLimitBet = ({ game_id, room_id, max_bet, min_bet, subgame }) => {
	return ajax(
		`${process.env.REACT_APP_GAME_HOST}${subgame !== "cycdx"
			? "/cylhd/api/setRoomLimitBet"
			: "/caidaxiao/api/setRoomLimitBet"
		}`,
		{ game_id, room_id, max_bet, min_bet },
		"POST",
		{ needAuth: false, content_type_is_formdata: true },
	);
};

//fkxwby设置
export const getThirdAlgStatus = serverId => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + "/xwby/api/getThirdAlgStatus",
		{ serverName: "smxw", tid: -1, serverId },
		"GET",
		{ needAuth: false },
	);
};
export const getTableScore = serverId => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + "/xwby/api/getTableScore",
		{ serverName: "smxw", tid: -1, serverId },
		"GET",
		{ needAuth: false },
	);
};
export const setchouFangThirdAlg = ({ serverId, tid, num }) => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + "/xwby/api/chouFangThirdAlg",
		{ serverName: "smxw", serverId, tid, num },
		"GET",
		{ needAuth: false },
	);
};
export const updateThirdAlg = ({ serverId, tid, diff, level, place }) => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + "/xwby/api/updateThirdAlg",
		{ serverName: "smxw", serverId, tid, diff, level, place },
		"GET",
		{ needAuth: false },
	);
};
//代理系统
export const getProxyUserList = data => {
	return ajax(
		BASE + "/user/getProxyUserList",
		{
			...data,
		},
		"POST",
	);
};
export const changeProxyUserProxyPid = data => {
	return ajax(
		BASE + "/user/changeProxyUserProxyPid",
		{
			...data,
		},
		"POST",
	);
};
export const proxy_changeGold = data => {
	return ajax(
		BASE + "/user/changeGold",
		{
			...data,
		},
		"POST",
	);
};
export const getProxyUser = data => {
	return ajax(
		BASE + "/user/getProxyUser",
		{
			...data,
		},
		"POST",
	);
};
export const getDividendRule = id => {
	return ajax(BASE + "/Operation/Api/GetDividendRule", { id }, "GET");
};
//代理链详情查询
export const getProxyUserLink = id => {
	return ajax(BASE + "/Operation/Api/GetProxyUserLink", { id }, "GET");
};
//代理查询
export const getProxy = (id, start_time, end_time) => {
	return ajax(
		BASE + `/Operation/Api/GetProxyLinkStatementAndPay`,
		{ id, start_time, end_time },
		"GET",
	);
};
export const getProxyChild = (id, start_time, end_time) => {
	return ajax(
		BASE +
		`/Operation/Api/GetChildrenIncome?id=${id}&start_time=${start_time}&end_time=${end_time}`,
		{},
		"GET",
	);
};
//查询代理连的充提数据
export const getProxyLinkPayLeaderboard = (id, start_time, end_time) => {
	return ajax(
		BASE + `/Operation/Api/GetProxyLinkPayLeaderboard`,
		{ id, start_time, end_time },
		"GET",
	)
}

export const getDeficitDividend = reqData => {
	return ajax(
		BASE + `/Operation/Api/GetDeficitDividend`,
		{ platform_key: 654321, ...reqData },
		"GET",
	);
};
export const getPaymentDividend = reqData => {
	return ajax(
		BASE + `/Operation/Api/GetPaymentDividend`,
		{ platform_key: 654321, ...reqData },
		"GET",
	);
};
export const getPaymentDividendInfo = reqData => {
	return ajax(
		// process.env.REACT_APP_CENTER_HOST + `/operation/api/GetPaymentDividendInfo`,
		// { platform_key: 654321, game_tag: 0, ...reqData },
		BASE + `/Operation/Api/GetPaymentDividendInfo`,
		{ game_tag: 0, ...reqData },
		"GET",
		// { needAuth: false },
	);
};
// 查询玩家分红数据总额
export const getPaymentInfo = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST  + `/proxy/proxy/GetPaymentInfo`,
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};

// 查询玩家分红数据详情
export const getPaymentInfoDetail = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST  + `/proxy/proxy/GetPaymentInfoDetail`,
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
export const getProxyUserMoneyFlow = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/proxy/proxy/GetGameUserInductions",
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
export const getGameUserInductionsSortByGameTag = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/proxy/proxy/GetGameUserInductionsSortByGameTag",
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
export const getProxyUserLinkBet = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/operation/api/GetProxyUserLinkBet",
		{ platform_key: 654321, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
//查询代理链流水数据
export const GetProxyUserLinkstatement = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/operation/api/GetProxyUserLinkstatement?",
		{ platform_key: 654321, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
//查询保底分成规则
export const GetBaseDividendRule = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/proxy/proxy/GetBaseDividendRule",
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
//查询保底分成渠道
export const GetBaseDividend = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/operation/api/GetBaseDividend",
		{ platform_key: 654321, ...reqData },
		"GET",
		{ needAuth: false },
	);
};
// 
export const getProxyBaseDividend = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/proxy/proxy/GetBaseDividendInfo",
		{ platform_key: 123456, ...reqData },
		"GET",
		{ needAuth: false },
	);
};

// 查询渠道配置信息
export const getProxyGetGlobal = reqData => {
	return ajax(
		process.env.REACT_APP_CENTER_HOST + "/operation/api/GetGlobal",
		{ platform_key: 654321 },
		"GET",
		{ needAuth: false },
	);
};


//游戏设置-注册配置
export const getIPconfig = () => {
	return ajax(BASE + `/Operation/Api/getGlobal?platform_key=654321`, {}, "GET", {
		content_type_is_formdata: true,
	});
};
export const getIPlist = (page, limit, ip) => {
	return ajax(
		BASE +
		`/Operation/Api/getBlackList?page=${page}&limit=${limit}&platform_key=654321&ip=${ip}`,
		{},
		"GET",
		{
			content_type_is_formdata: true,
		},
	);
};
export const addIP = ip => {
	return ajax(BASE + "/Operation/Api/addblacklist", { platform_key: 654321, ip }, "POST", {
		content_type_is_formdata: true,
	});
};
export const deleteIP = ip => {
	return ajax(BASE + "/Operation/Api/deleteblacklist", { platform_key: 654321, ip }, "POST", {
		content_type_is_formdata: true,
	});
};
export const setLimit = (field, value) => {
	return ajax(BASE + "/Operation/Api/setglobal", { platform_key: 654321, field, value }, "POST", {
		content_type_is_formdata: true,
	});
};
//游戏设置-白名单设置
export const getwhiteIPlist = (page, limit, ip) => {
	return ajax(
		BASE +
		`/Operation/Api/GetWhiteList?page=${page}&limit=${limit}&platform_key=654321&ip=${ip}`,
		{},
		"GET",
		{
			content_type_is_formdata: true,
		},
	);
};
export const AddWhiteList = ip => {
	return ajax(BASE + "/Operation/Api/AddWhiteList", { platform_key: 654321, ip }, "POST", {
		content_type_is_formdata: true,
	});
};
export const DeleteWhiteList = ip => {
	return ajax(BASE + "/Operation/Api/DeleteWhiteList", { platform_key: 654321, ip }, "POST", {
		content_type_is_formdata: true,
	});
};
//消息中心-任务列表
export const tasksList = (page, limit, value) => {
	return ajax(
		BASE + "/tasks/tasksList",
		{
			page,
			limit,
			...value,
		},
		"POST",
	);
};

export const changeUserBalance = value => {
	return ajax(
		BASE + "/tasks/changeUserBalance",
		{
			...value,
		},
		"POST",
	);
};
export const reviewTask = value => {
	return ajax(
		BASE + "/tasks/reviewTask",
		{
			...value,
		},
		"POST",
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
		},
		"POST",
	);
};
export const resetPassword = user_id => {
	return ajax(
		BASE + "/trade/resetPassword",
		{
			user_id,
		},
		"POST",
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
			...value,
		},
		"POST",
	);
};
export const tradeRemark = value => {
	return ajax(
		BASE + "/trade/tradeRemark",
		{
			...value,
		},
		"POST",
	);
};
export const sellGoldInfoList = (page, limit, user_id) => {
	return ajax(
		BASE + "/order/sellGoldInfoList",
		{
			page,
			limit,
			user_id,
		},
		"POST",
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
		},
		"POST",
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
		},
		"POST",
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
		},
		"POST",
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
		},
		"POST",
	);
};
export const saveActivityConfig = value => {
	return ajax(
		BASE + "/activity/saveActivityConfig",
		{
			...value,
		},
		"POST",
	);
};
export const delActivityConfig = id => {
	return ajax(
		BASE + "/activity/delActivityConfig",
		{
			id,
		},
		"POST",
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
		},
		"POST",
	);
};
//活动-活动领取列表
export const activityList = (page, limit, value) => {
	return ajax(
		BASE + "/activity/activityList",
		{
			page,
			limit,
			...value,
		},
		"POST",
	);
};
//活动-注册金活动设置
export const activitySetting = reqData => {
	return ajax(BASE + "/api/activity/getProxyInfoList", reqData, "GET");
};
export const registerCode = reqData => {
	//proxy_pid,num
	return ajax(BASE + "/api/activity/registerCode", reqData, "POST", {
		content_type_is_formdata: true,
	});
};
//活动-免费领水果及签到查询
export const getUserAddress = reqData => {
	return ajax(BASE + "/api/activity/getUserAddress", reqData, "GET");
};

export const editLogisticsInfo = reqData => {
	return ajax(
		BASE + "/api/activity/editLogisticsInfo",
		{ ...reqData, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"POST",
		{
			content_type_is_formdata: true,
		},
	);
};

export const getChlidrenInfo = user_id => {
	return ajax(
		BASE + "/api/activity/getChlidrenInfo",
		{ user_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"GET",
	);
};
export const applyReimburse = (user_id, activity_id, package_id = null, is_old = false) => {
	return ajax(
		!is_old
			? `${BASE}/api/activity/applyReimburse`
			: `${BASE}/api/activity/oldUserApplyReimburse`,
		!is_old
			? { user_id, activity_id, package_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" }
			: { user_id, activity_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"POST",
		{ content_type_is_formdata: true },
	);
};
export const getApplyReimburseUser = (user_id, is_old = false) => {
	return ajax(
		!is_old
			? `${BASE}/api/activity/getApplyReimburseUser`
			: `${BASE}/api/activity/getApplyReimburseOldUser`,
		{ user_id },
		"GET",
	);
};
export const applyFristPay = (user_id, activity_id, is_old = false) => {
	return ajax(
		!is_old
			? `${BASE}/api/activity/applyFristPay `
			: `${BASE}/api/activity/oldUserApplyReimburse`,
		{ user_id, activity_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"POST",
		{ content_type_is_formdata: true },
	);
};
export const getApplyFristPayUser = (user_id, is_old = false) => {
	return ajax(
		!is_old
			? `${BASE}/api/activity/getApplyFristPayUser`
			: `${BASE}/api/activity/getApplyReimburseOldUser`,
		{ user_id },
		"GET",
	);
};

//15送58元活动
export const applyRewardByDays = (user_id, activity_id) => {
	return ajax(
		`${BASE}/api/activity/applyRewardByDays`,
		{ user_id, activity_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"POST",
		{ content_type_is_formdata: true },
	);
};
export const getApplyRewardByDays = user_id => {
	return ajax(
		BASE + "/api/activity/getApplyRewardByDays",
		{ user_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"GET",
	);
};
//分分彩包赔活动
export const applyHandleHeNeiPay = (user_id, activity_id) => {
	return ajax(
		`${BASE}/api/activity/applyHandleHeNeiPay`,
		{ user_id, activity_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"POST",
		{ content_type_is_formdata: true },
	);
};
export const getApplyHeNei = user_id => {
	return ajax(
		BASE + "/api/activity/getApplyHeNei",
		{ user_id, token: "e40f01afbb1b9ae3dd6747ced5bca532" },
		"GET",
	);
};
//充值-充值订单
export const reqOrder_list = (page, limit, reqData) => {
	return ajax(BASE + "/order/recharge", { page, limit, ...reqData }, "POST");
};
export const reqLostOrder_list = (page, limit, user_id, order_id) => {
	return ajax(BASE + "/order/recharge", { page, limit, order_id, user_id }, "POST");
};
export const orderReview = (user_id, order_id) => {
	return ajax(
		BASE + "/order/orderReview",
		{ user_id, order_id, status: 7, review_type: 1 },
		"POST",
	);
};
export const orderReviewEdit = reqData => {
	return ajax(
		BASE + "/order/orderReview",
		// { user_id, order_id, status: 8, review_type: 2, type },
		{ ...reqData },
		"POST",
	);
};
export const getSubOrderRemark = order_id => {
	return ajax(BASE + "/order/subOrder", { order_id }, "POST");
};
export const downloadList = searchData => {
	let { start_time, end_time, order_status, type, inputParam, paramKey } = searchData;
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
			case "proxy_pid":
				url = url + "&proxy_pid=" + inputParam;
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
			name: name ? name : "",
		},
		"POST",
	);
};
export const addChannel = value => {
	return ajax(
		BASE + "/order/addChannel",
		{
			...value,
			action: "add",
		},
		"POST",
	);
};
export const editPayChannel = (value, id) => {
	return ajax(
		BASE + "/order/editPayChannel",
		{
			...value,
			id,
			action: "edit",
		},
		"POST",
	);
};
//人工代充
export const bankCardTransfer = reqData => {
	return ajax(
		BASE + "/api/payment/bankCardTransfer",
		{
			...reqData,
		},
		"POST",
		{ content_type_is_formdata: true },
	);
};
export const UCAlipaytocard = reqData => {
	let str = "";
	for (const key in reqData) {
		if (reqData.hasOwnProperty(key)) {
			str += `&${key}=${reqData[key]}`;
		}
	}
	let newstr = str.slice(1) + "&authorization=" + localStorage.token;
	console.log(`${BASE}/api/payment/payment?${newstr}`);
	window.open(`${BASE}/api/payment/payment?${newstr}`);
};
//充值-古都银行卡
export const bankList = (page, limit) => {
	return ajax(
		BASE + "/order/bankList",
		{
			page,
			limit,
		},
		"POST",
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
		},
		"POST",
	);
};
export const deleteBankCard = id => {
	return ajax(
		BASE + "/order/saveBankCard",
		{
			id,
			action: "del",
		},
		"POST",
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
	inputValue,
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
			[inputKey]: inputValue,
		},
		"POST",
	);
};
export const cancelOrder = reqData => {
	return ajax(
		BASE + "/order/cancelOrder",
		{
			...reqData,
		},
		"POST",
	);
};
//充值-渠道配置
export const getChannel = (page, limit) => {
	return ajax(
		BASE + "/order/getChannel",
		{
			page,
			limit,
		},
		"POST",
	);
};
export const getChannelInfo = channel_id => {
	return ajax(
		BASE + "/order/getChannelInfo",
		{
			page: 1,
			limit: 20,
			channel_id,
		},
		"POST",
	);
};

export const editChannelInfo = (id, pay_code) => {
	return ajax(
		BASE + "/order/editChannelInfo",
		{
			id,
			pay_code,
		},
		"POST",
	);
};
//兑换-兑换订单&代提设置
export const withDraw = (page, limit, data) => {
	return ajax(
		BASE + "/order/withDraw",
		{
			page,
			limit,
			...data,
		},
		"POST",
	);
};
export const withdrawClaim = () => {
	return ajax(
		BASE + "/api/with_draw/WithdrawClaim",
		{},
		"GET",
	);
};
export const reviewInfo = (page, limit, id) => {
	return ajax(
		BASE + "/order/reviewInfo",
		{
			page,
			limit,
			id,
			type: 2,
		},
		"POST",
	);
};
export const remarkInfo = (page, limit, id) => {
	return ajax(
		BASE + "/order/remarkInfo",
		{
			page,
			limit,
			id,
			type: 2,
		},
		"POST",
	);
};
export const downloadWithdrawList = searchData => {
	let { start_time, end_time, order_status, type, inputValue, inputKey, flag } = searchData;
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
			case "package_nick":
				url = url + "&package_nick=" + inputValue;
				break;
			case "proxy_pid":
				url = url + "&proxy_pid=" + inputValue;
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
export const downloadActivityReceive = searchData => {
	let { user_id, activity_id, start_time, end_time, packages } = searchData;
	if (!start_time || start_time === "") {
		start_time = "";
	}
	if (!end_time || end_time === "") {
		end_time = "";
	}
	let params =
		"authorization=" +
		token +
		"&user_id=" +
		user_id +
		"&activity_id=" +
		activity_id +
		"&start_time=" +
		start_time +
		"&end_time=" +
		end_time +
		"&packages=" +
		packages;
	let url = BASE + "/activity/activityReceive/?" + params;

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
			type: 2,
		},
		"POST",
	);
};
export const auditOrder = reqData => {
	return ajax(BASE + "/order/withDraw", reqData, "POST");
};
export const orderWithDrawReview = reqData => {
	return ajax(BASE + "/order/withDrawReview", reqData, "POST", { timeout: 10000 });
};
export const getriskcontrol = reqData => {
	return ajax(BASE + `/api/payment/userDetailStatistics`, reqData, "GET");
};
export const getSaveCodeList = reqData => {
	return ajax(
		BASE + `/Operation/Api/GetSaveCodeList`,
		{ ...reqData, platform_key: 654321 },
		"GET",
	);
};
//兑换-第三方提款设置
export const getConfigList = reqData => {
	return ajax(BASE + "/config/list", reqData, "POST");
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
		},
		"POST",
	);
};
//官方兑换-兑换黑名单
export const withdrawBlack = (api, reqData, type = "GET") =>
	ajax(`${BASE}/withdraw/${api}`, reqData, type);
//赠送-赠送订单
export const withDrawReview = (order_id, user_id, review_status) => {
	return ajax(
		BASE + "/order/withDraw",
		{
			order_id,
			review_status: review_status,
			user_id: user_id,
			review_type: 1,
			is_pass: 1,
		},
		"POST",
	);
};
export const setGiftConfig = reqData => {
	return ajax(
		BASE + "/config/setGiftConfig",
		{
			...reqData,
		},
		"POST",
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
		},
		"POST",
	);
};
export const changeInternalUserBalance = (user_id, amount) => {
	return ajax(
		BASE + "/user/changeInternalUserBalance",
		{
			user_id,
			amount,
		},
		"POST",
	);
};
//风控or资金明细
export const GoldDetailorRiskControlSUMdata = (id, start, end) => {
	let url = `/user/userStatistics?id=${id}`;
	if (start && end) {
		url += `&start=${start}&end=${end}`;
	}
	return ajax(BASE + url, {}, "GET");
};
//B2B

export const getb2bconfig = (skip, limit) => {
	return ajax( process.env.REACT_APP_B2B_HOST + `/b2b/api/platform/list`, {skip: `${skip - 1}`, limit: limit, token: 982083}, "GET", { needAuth: false });
};
export const postb2bconfig = (reqData, action) => {
	return ajax( process.env.REACT_APP_B2B_HOST + `/b2b/api/platform/${action}`, { ...reqData, token: 982083 }, "POST", {
		needAuth: false,
		content_type_is_formdata: true,
	});
};
export const getb2bregister = (skip, limit) => {
	return ajax( process.env.REACT_APP_B2B_HOST + `/b2b/api/register_recode/list`, { skip: `${skip - 1}`, limit: limit, token: 982083}, "GET", { needAuth: false });
};

//真人视讯，彩票派彩游戏数据
export const getZRSXdata = (page, limit, start_time, end_time, gametype) => {
	return ajax(
		BASE +
		`/ag/gameRoundsRes?start_time=${start_time}&page=${page}&gametype=${gametype}&end_time=${end_time}&limit=${limit}`,
		{},
		"GET",
	);
};
export const getAGdata = (page, limit, start_time, end_time, gametype) => {
	return ajax(
		BASE +
		`/ag/OrdersRes?start_time=${start_time}&page=${page}&gametype=${gametype}&end_time=${end_time}&limit=${limit}`,
		{},
		"GET",
	);
};
export const getPCCP_project = (page, start_time, end_time, filter_string) => {
	return ajax(
		BASE +
		`/apcaipiao/projectList?start_time=${start_time}&page=${page}&end_time=${end_time}${filter_string}`,
		{},
		"GET",
	);
};
export const getPCCP_fundList = (page, start_time, end_time, type) => {
	return ajax(
		BASE +
		`/apcaipiao/fundList?start_time=${start_time}&page=${page}&end_time=${end_time}&type=${type}`,
		{},
		"GET",
	);
};

//提现流水要求
export const get_moneyfloat_detail = reqData => {
	// page, limit, user_id, start_time, end_time, link_id
	return ajax(BASE + `/api/backend/getMoneyFlowDetail`, reqData, "GET");
};
export const post_moneyfloat_detail = values => {
	return ajax(BASE + `/api/backend/saveMoneyFlowDetail`, { ...values }, "POST", {
		content_type_is_formdata: true,
	});
};
export const getTotalMoneyFlow = reqData => {
	return ajax(BASE + `/api/backend/getTotalMoneyFlow`, reqData, "GET");
};

//直播
//获取直播子游戏清单
export const getZhiboGameList = () => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + `/zhibo/api/getGameList`,
		{ game_id: '5b1f3a3cb76a451e210726' },
		"GET",
		{ needAuth: false, content_type_is_formdata: true },
	)
}
//获取打赏明细
export const getDonateList = (page, limit, reqData) => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + `/zhibo/api/getRewardDetail`,
		{
			game_id: '5b1f3a3cb76a451e210726',
			page,
			limit,
			...reqData
		},
		"GET",
		{ needAuth: false, content_type_is_formdata: true },
	)
}
//获取子游戏打赏详情
export const getLiveData = (reqData) => {
	return ajax(
		process.env.REACT_APP_GAME_HOST + `/zhibo/api/getRewardSummary`,
		{
			game_id: '5b1f3a3cb76a451e210726',
			...reqData
		},
		"GET",
		{ needAuth: false, content_type_is_formdata: true },
	)
}
