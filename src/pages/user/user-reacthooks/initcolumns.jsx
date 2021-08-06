import React from "react";
import { formateDate } from "../../../utils/dateUtils";

export default (dispatch, functions) => {
	const { game_nick_oncell, game_gold_oncell, handle_render, checkLoad_render } = functions;
	return [
		{
			title: "user_id",
			dataIndex: "id",
			key: "id",
			fixed: "left",
			width: 120
		},
		{
			title: "昵称",
			dataIndex: "game_nick",
			key: "game_nick",
			fixed: "left",
			width: 120,
			onCell: game_nick_oncell
		},
		{
			title: "账户余额",
			dataIndex: "game_gold",
			key: "game_gold",
			sorter: (a, b) => a.game_gold - b.game_gold,
			width: 100,
			onCell: game_gold_oncell,
			render: (text, record) => {
				let sum = record.game_gold + record.bank_gold - record.lock_gold;
				return (Math.round(sum * 1000000) / 1000000).toFixed();
			}
		},
		{
			title: "所属品牌",
			dataIndex: "package_nick",
			key: "package_nick",
			width: 100
		},
		{
			title: "所属代理",
			dataIndex: "proxy_nick",
			key: "proxy_nick",
			width: 150
		},
		{
			title: "手机",
			dataIndex: "phone_number",
			key: "phone_number"
		},
		{
			title: "账号",
			dataIndex: "role_name",
			key: "role_name",
			width: 100
		},
		{
			title: "注册IP",
			dataIndex: "regin_ip",
			key: "regin_ip",
			width: 150
		},
		{
			title: "注册时间",
			dataIndex: "regin_time",
			render: formateDate,
			key: "regin_time",
			sorter: (a, b) => a.regin_time - b.regin_time,
			width: 200
		},
		{
			title: "登录IP",
			dataIndex: "login_ip",
			key: "login_ip",
			width: 150
		},
		{
			title: "登陆时间",
			dataIndex: "login_time",
			render: formateDate,
			sorter: (a, b) => a.login_time - b.login_time,
			width: 200
		},
		{
			title: "操作",
			dataIndex: "",
			width: 200,
			render: handle_render
		},
		{
			title: "实时余额",
			width: 100,
			render: checkLoad_render
		},
		{
			title: "是否为客服账号",
			dataIndex: "game_user_type",
			width: 150,
			render: (text, record, index) => <span>{parseInt(text) === 4 ? "是" : ""}</span>
		},
		{
			title: "是否被限制登录",
			dataIndex: "status",
			render: (text, record, index) => <span>{parseInt(text) === 0 ? "是" : ""}</span>
		}
	];
};
