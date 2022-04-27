import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Button } from "antd";

import { getDeficitDividend, getPaymentDividend } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";

export default () => {
	const [data, setData] = useState([]);
	const ref = useRef({ searchValue: null });
	const initColumns = [
		{
			title: "周期",
			dataIndex: "date",
		},
		{
			title: "分红类型",
			dataIndex: "type",
			render: text =>
				text === 1
					? "流水分红"
					: text === 2
					? "亏损分红（输赢差）"
					: text === 3
					? "亏损分红（充提差）"
					: "",
		},
		{
			title: "统计方式",
			dataIndex: "demand_type",
			render: text =>
				text === 1
					? "按流水统计"
					: text === 2
					? "按亏损统计"
					: text === 3
					? "亏损（充提差）"
					: "",
		},
		{
			title: "统计范围",
			dataIndex: "demand_tag",
			render: text => (text === 1 ? "当前游戏类型" : text === 2 ? "所有游戏类型" : ""),
		},
		{
			title: "下级ID",
			dataIndex: "id",
		},
		{
			title: "游戏类型",
			dataIndex: "game_tag",
			render: text =>
				text === 1
					? "棋牌类型游戏"
					: text === 2
					? "彩票类型游戏"
					: text === 3
					? "体育类型游戏"
					: text === 4
					? "视讯类型游戏"
					: text === 5
					? "所有游戏类型"
					: "",
		},
		{
			title: "总充值",
			dataIndex: "top_up",
			render: reverseNumber,
		},
		{
			title: "总兑换",
			dataIndex: "withdraw",
			render: reverseNumber,
		},
		{
			title: "期初金额",
			dataIndex: "first_balance",
			render: reverseNumber,
		},
		{
			title: "期末金额",
			dataIndex: "last_balance",
			render: reverseNumber,
		},
		{
			title: "周期量",
			dataIndex: "amount",
			render: reverseNumber,
		},
		{
			title: "团队亏损",
			dataIndex: "deficit",
			render: text => (text > 0 ? 0 : Math.abs(reverseNumber(text))),
		},
		{
			title: "档位比例(%)",
			dataIndex: "percent",
		},
		{
			title: "流水分红扣除",
			dataIndex: "statement_cost_money",
			render: reverseNumber,
		},
		{
			title: "渠道费用扣除",
			dataIndex: "cost_money",
			render: reverseNumber,
		},
		{
			title: "应发分红",
			dataIndex: "money",
			render: reverseNumber,
		},
		{
			title: "状态",
			dataIndex: "status",
			render: text => (text === -1 ? "作废" : text === 0 ? "未发" : text === 1 ? "已发" : ""),
		},
	];
	const proxySearch = async value => {
		if (!value) {
			message.info("请输入玩家ID");
			return;
		}
		const res = await getDeficitDividend({ proxy_user_id: value });
		if (res.code === 200) {
			message.success(res.status);
			setData(res.msg || []);
		} else {
			message.info(res.status || JSON.stringify(res));
		}
	};
	const proxySearch2 = async value => {
		if (!value) {
			message.info("请输入玩家ID");
			return;
		}
		const res = await getPaymentDividend({ id: value });
		// let res={"status":"SUCCESS","code":200,"msg":[{"_id":"18a06c46d1d60a17027d3316d0cfdfb1","date":"2021-01-16:2021-01-31","id":287136446,"proxy_user_id":319010216,"type":3,"demand_type":3,"demand_tag":2,"game_tag":5,"money":487.95,"grant":0,"amount":2140.5,"percent":30,"statement":0,"deficit":0,"statement_type":3,"statement_percent":0,"deficit_percent":0,"cost_percent":5,"cost_type":3,"cost_money":14,"statement_cost_money":36,"deficit_cost_money":0,"status":0,"first_balance":0,"last_balance":7823.5,"top_up":10000,"withdraw":0}]}
		if (res.code === 200) {
			message.success(res.status);
			setData(res.msg || []);
		} else {
			message.info(res.status || JSON.stringify(res));
		}
	};
	return (
		<Card
			title={
				<div>
					<Input
						style={{ width: 200 }}
						placeholder="请输入玩家ID信息"
						onChange={e => {
							ref.current.searchValue = e.target.value;
						}}
					/>
					<div style={{ marginTop: 10 }}>
						<Button type="primary" onClick={() => proxySearch(ref.current.searchValue)}>
							亏损分红（输赢差）
						</Button>
						<span style={{ color: "#dc143c", fontSize: 14 }}>
							&nbsp;*查询数据显示为当前ID未发放亏损分红(输赢差)明细
						</span>
					</div>
					<div style={{ marginTop: 10 }}>
						<Button
							type="primary"
							onClick={() => proxySearch2(ref.current.searchValue)}
						>
							亏损分红（充提差）
						</Button>
						<span style={{ color: "#dc143c", fontSize: 14 }}>
							&nbsp;*查询数据显示为当前ID未发放亏损分红(充提差)明细
						</span>
					</div>
				</div>
			}
		>
			<Table
				bordered
				rowKey={(record, index) => `${index}`}
				dataSource={data}
				columns={initColumns}
				size="small"
				pagination={false}
				scroll={{ x: "max-content" }}
			/>
		</Card>
	);
};
