import React, { useState } from "react";

import _ from "lodash-es";
import { Card, message, Row, Col, Statistic, Select, Button, Form, InputNumber } from "antd";

import { getprofitpool, uptprofitpool, addOperatorLog } from "../../../api/";
import { gameRouter } from "../../../utils/public_variable";
import { reverseDecimal } from "../../../utils/commonFuntion";

let initstate = {
	game_id: null,
};
let new_gameRouter = {
	...gameRouter,
	"5b1f3a3cb76a591e7f25179": { path: "/shabaty/api", name: "沙巴体育" },
	"569a62be7ff123m117d446aa": { path: "/paicai/api", name: "派彩" },
	"5b1f3a3cb76a591e7f25173": { path: "/zhenrensx/api", name: "真人视讯" },
	"5b1f3a3cb76a591e7f251726": { path: "/caiyuanqp/api", name: "彩源棋牌" },
	"5b1f3a3cb76a591e7f251729": { path: "/castcraft/api", name: "城堡争霸" },
	"5b1f3a3cb76a591e7f251735": { path: "/cq9/api", name: "CQ9" },
	"5b1f3a3cb76a591e7f251736": { path: "/ag/api", name: "AG" },
	"5b1f3a3cb76a591e7f251737": { path: "/pt/api", name: "PT" },
	"5b1f3a3cb76a451e7f251739": { path: "/jdb/api", name: "JDB" },
	"5b1f3a3cb1005251736": { path: "/pg/api", name: "PG" },
	"5b1f3a3cb76a451e210629": { path: "/pg2/api", name: "PG2" },
};
let thirdparty_gameRouter = {
	"5b1f3a3cb76a591e7f25179": { name: "沙巴体育" },
	"569a62be7ff123m117d446aa": { name: "派彩" },
	"5b1f3a3cb76a591e7f25173": { name: "真人视讯" },
	"5b1f3a3cb76a591e7f251726": { name: "彩源棋牌" },
};
const Profit_pool = props => {
	const { getFieldDecorator } = props.form;
	const [data, setData] = useState();
	const [is_player_win_rate_show, set_is_player_win_rate_show] = useState(true);
	const arr = [
		{ title: "玩家历史总输", dataIndex: "player_total_lose" },
		{ title: "玩家历史总赢", dataIndex: "player_total_win" },
		{ title: "历史实际的玩家总数", dataIndex: "total_player" },
		{ title: "历史总赢乘的百分比", dataIndex: "percentage_to_total_win", is_changeable: true },
		{
			title: "玩家总数所乘的系数",
			dataIndex: "coefficient_to_total_player",
			is_changeable: true,
		},
		{ title: "最后百分比", dataIndex: "final_percentage", is_changeable: true },
		{
			title: "盈余池后的玩家输百分比",
			dataIndex: "player_lose_rate_after_surplus_pool",
			is_changeable: true,
		},
		{ title: "盈余池", dataIndex: "surplus_pool" },
		{ title: "玩家输赢差额", dataIndex: "player_total_lose_win" },
		{ title: "异常数据修正", dataIndex: "data_correction", is_changeable: true },
		{
			title: "赢钱时随机生成牌型的机率",
			dataIndex: "random_percentage_after_win",
			is_changeable: true,
			is_dependent: true,
		},
		{
			title: "赢钱时随机生成牌型的最大次数",
			dataIndex: "random_count_after_win",
			is_changeable: true,
			is_dependent: true,
		},
		{
			title: "输钱时随机生成牌型的机率",
			dataIndex: "random_percentage_after_lose",
			is_changeable: true,
			is_dependent: true,
		},
		{
			title: "输钱时随机生成牌型的最大次数",
			dataIndex: "random_count_after_lose",
			is_changeable: true,
			is_dependent: true,
		},
	];
	let fetchData = async () => {
		let { game_id } = initstate;
		if (!game_id) {
			message.info("请选择子游戏");
			return;
		}
		let reqStr = `${new_gameRouter[game_id].path}/getSurplusOne?game_id=${game_id}`;
		const res = await getprofitpool(reqStr);
		if (res.code === 0 && res.data) {
			message.success(res.msg || "查询成功");
			for (const key in res.data) {
				res.data[key] = reverseDecimal(res.data[key]);
				if (res.data[key] === 0) {
					res.data[key] = "0";
				}
			}
			setData(res.data);
			//FOR 疯狂旋渦
		} else if (res.code === 200) {
			let xwbyData = JSON.parse(res.detail).data
			for (const key in xwbyData) {
				xwbyData[key] = reverseDecimal(xwbyData[key]);
				if (xwbyData[key] === 0) {
					xwbyData[key] = "0";
				}
			}
			setData(xwbyData)
		} else {
			message.info(res.msg || JSON.stringify(res));
			setData(null);
		}
	};
	const handleSubmit = e => {
		e.preventDefault();
		let { game_id } = initstate;
		if (!game_id) {
			message.info("请选择子游戏");
			return;
		}
		props.form.validateFields(async (err, value) => {
			if (!err) {
				let newvalue = _.omitBy(value, _.isNil);
				let reqStr = `${new_gameRouter[game_id].path}/uptSurplusConf`;
				let formdata = { game_id, ...newvalue };
				// go-admin 检查可更新的权限
				const res = await uptprofitpool(reqStr, formdata);
				// 检查游戏是否来自第三方
				if (thirdparty_gameRouter.hasOwnProperty(game_id)) {
					message.info(
						`${thirdparty_gameRouter[game_id].name}，盈余池资讯來自第三方，不能更改!`,
					);
					return;
				}
				if (game_id === "5b1f3a3cb76a591e7f251733") {
					message.info(`无法更改!`);
					return;
				}
				if (res.code === 0) {
					message.success(res.msg || "更新成功");
					await addOperatorLog(formdata);
				} else {
					message.info(res.msg || JSON.stringify(res));
				}
				fetchData();
			} else {
				message.info("参数验证失败");
			}
		});
	};
	return (
		<Card
			title={
				<>
					<Select
						placeholder="请选择"
						style={{ width: 200, marginRight: 20 }}
						onChange={value => {
							initstate.game_id = value;
							if (thirdparty_gameRouter.hasOwnProperty(value)) {
								set_is_player_win_rate_show(false);
							} else {
								set_is_player_win_rate_show(true);
							}
						}}
					>
						{_.map(new_gameRouter, (value, key) => {
							if (key !== "5b1f3a3cb76alkje7f25170") {
								return (
									<Select.Option key={key} value={key}>
										{value.name}
									</Select.Option>
								);
							}
						})}
					</Select>
					<Button type="primary" onClick={fetchData}>
						查看
					</Button>
				</>
			}
		>
			<Row gutter={[8, 8]} style={{ background: "#ececec", padding: 30 }}>
				{arr.map((ele, i) => {
					return (
						<Col
							key={i}
							span={6}
							style={
								ele.is_dependent
									? is_player_win_rate_show
										? {}
										: { display: "none" }
									: {}
							}
						>
							<Card>
								<Statistic
									title={ele.title}
									value={data?.[ele.dataIndex] || "--"}
								/>
							</Card>
						</Col>
					);
				})}
			</Row>

			{/* <div hidden={!filter}> */}
			<div>
				<h3 style={{ marginTop: 20 }}>子游戏盈余池数据修改</h3>
				<Form
					onSubmit={handleSubmit}
					labelCol={{ span: 6 }}
					wrapperCol={{ offset: 6 }}
					labelAlign="right"
				>
					{arr.map((ele, i) => {
						if (ele.is_changeable) {
							return (
								<Form.Item
									key={i}
									label={ele.title}
									style={
										ele.is_dependent
											? is_player_win_rate_show
												? {}
												: { display: "none" }
											: {}
									}
								>
									{getFieldDecorator(ele.dataIndex)(
										<InputNumber style={{ width: 300 }} />,
									)}
								</Form.Item>
							);
						}
						return null;
					})}
					<Form.Item>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Card>
	);
};
const WrappedForm = Form.create()(Profit_pool);

export default WrappedForm;
