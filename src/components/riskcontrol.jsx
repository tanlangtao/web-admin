import React from "react";

import { Table, Modal, message } from "antd";
import _ from "lodash-es";
import { getriskcontrol, GoldDetailorRiskControlSUMdata, getProxyUserLink } from "../api";
import { reverseNumber } from "../utils/commonFuntion";

const columns = [
	{
		title: "游戏",
		dataIndex: "name",
	},
	{
		title: "盈利局数",
		dataIndex: "winround",
	},
	{
		title: "盈利金额",
		dataIndex: "wingold",
		render: reverseNumber,
	},
	{
		title: "亏损局数",
		dataIndex: "loseround",
	},

	{
		title: "亏损金额",
		dataIndex: "losegold",
		render: reverseNumber,
	},

	{
		title: "总局数",
		dataIndex: "",
		render: (text, record) => (record.winround || 0) + (record.loseround || 0),
	},
	{
		title: "总盈亏",
		dataIndex: "",
		render: (text, record) => reverseNumber((record.wingold || 0) + (record.losegold || 0)),
	},
];

export default async record => {
	const { user_id, order_id, created_at, status } = record;
	let reactnode;
	const res = await getriskcontrol({ user_id, order_id, end_time: created_at, status });
	const userStatistics = await GoldDetailorRiskControlSUMdata(user_id)
	const userLink = await getProxyUserLink(user_id)
	if (res.status === 0 && res.data) {
		try {
			let riskData = [],
				// extraData = [],
				sumround = 0,
				sumgold = 0;
			_.forEach(res.data, (value, key) => {
				if (_.has(value, "game_id") && key !== "Proxy") {
					riskData.push(value);
				} else if (_.has(value, "totalgold")) {
					// extraData.push({ name: key, totalgold: value.totalgold });
					value.totalgold = reverseNumber(value.totalgold);
				}
			});
			_.forEach(riskData, value => {
				sumround = sumround + (value.winround || 0) + (value.loseround || 0);
				sumgold = sumgold + (value.wingold || 0) + (Math.abs(value.losegold) || 0);
			});
			let charge = [
				res.data["人工充值订单增加金币"]?.totalgold,
				res.data["人工充值订单补单增加金币"]?.totalgold,
				res.data["银行卡充值增加金币"]?.totalgold,
				res.data["银行卡充值订单补单增加金币"]?.totalgold,
				res.data["渠道充值增加金币"]?.totalgold,
				res.data["渠道充值订单补单增加金币"]?.totalgold,
			];
			var afterdeal_charge = _.compact(charge);
			let sumcharge = _.sumBy(afterdeal_charge, _.toNumber);
			console.log(charge, sumcharge);
			// reactnode = <pre>{JSON.stringify(res.data, null, 2)}</pre>;
			reactnode = (
				<React.Fragment>
					<Table
						bordered
						rowKey={(record, index) => `${index}`}
						dataSource={riskData}
						columns={columns}
						size="small"
						pagination={false}
					/>
					<div>当前玩家代理链详情:{userLink.msg ? userLink.msg.join('>>') : "-"}</div>
					<div>历史总充值:{userStatistics.data ? reverseNumber(userStatistics.data.total_payment_arrival_amount) : "-"}</div>
					<div>历史总兑换:{userStatistics.data ? reverseNumber(userStatistics.data.total_with_draw_amount) : "-"}</div>
					<div>充值兑换差:{userStatistics.data ? reverseNumber(userStatistics.data.total_payment_arrival_amount - userStatistics.data.total_with_draw_amount) : "-"}</div>
					<div>总流水:{reverseNumber(sumgold)}</div>
					<div>
						充值流水比:
						{sumcharge ? reverseNumber(sumgold / sumcharge) : "-"}
					</div>
					<div>有效投注:{userStatistics.data ? reverseNumber(userStatistics.data.all_bet_total) : "-"}</div>
					<br />
					<div>总充值:{sumcharge || "-"}</div>
					<div>人工充值订单增加金币:{charge[0] || "-"}</div>
					<div>人工充值订单补单增加金币:{charge[1] || "-"}</div>
					<div>银行卡充值增加金币:{charge[2] || "-"}</div>
					<div>银行卡充值订单补单增加金币:{charge[3] || "-"}</div>
					<div>渠道充值增加金币:{charge[4] || "-"}</div>
					<div>渠道充值订单补单增加金币:{charge[5] || "-"}</div>
					<div>
						不同名笔数:
						{res.data.bypayname && res.data.bypayname["不同名笔数"]
							? res.data.bypayname["不同名笔数"]
							: "-"}
					</div>
					<div>
						不同名金额:
						{res.data.bypayname && res.data.bypayname["不同名金额"]
							? reverseNumber(res.data.bypayname["不同名金额"])
							: "-"}
					</div>
					<div>
						同名笔数:
						{res.data.bypayname && res.data.bypayname["同名笔数"]
							? res.data.bypayname["同名笔数"]
							: "-"}
					</div>
					<div>
						同名金额:
						{res.data.bypayname && res.data.bypayname["同名金额"]
							? reverseNumber(res.data.bypayname["同名金额"])
							: "-"}
					</div>
					<br />
					<div>提现：</div>
					<div>
						提现扣减金币:
						{res.data["提现扣减金币"]
							? reverseNumber(res.data["提现扣减金币"].totalgold)
							: "-"}
					</div>
					<div>
						提现拒绝增加金币:
						{res.data["提现拒绝增加金币"]
							? reverseNumber(res.data["提现拒绝增加金币"].totalgold)
							: "-"}
					</div>
					<div>
						代理提现：{res.data["代理提现"] ? res.data["代理提现"].totalgold : "-"}
					</div>
					<br />
					<div>
						每日任务 :
						{res.data["每日任务领取增加金币"]
							? res.data["每日任务领取增加金币"].totalgold
							: "-"}
					</div>
					<div>
						流水闯关 :
						{res.data["流水闯关增加金币"]
							? res.data["流水闯关增加金币"].totalgold
							: "-"}
					</div>
					<div>
						USDT存款赠金增加金币 :
						{res.data["USDT存款赠金增加金币"]
							? res.data["USDT存款赠金增加金币"].totalgold
							: "-"}
					</div>
					<div>
						开业注册送增加金币 :
						{res.data["开业注册送增加金币"]
							? res.data["开业注册送增加金币"].totalgold
							: "-"}
					</div>
					<div>
						首充赠金增加金币 :
						{res.data["首充赠金增加金币"]
							? res.data["首充赠金增加金币"].totalgold
							: "-"}
					</div>
					<div>
						每日任务增加金币：
						{res.data["每日任务增加金币"]
							? res.data["每日任务增加金币"].totalgold
							: "-"}
					</div>
					<div>
						积分抽奖增加金币：
						{res.data["积分抽奖增加金币"]
							? res.data["积分抽奖增加金币"].totalgold
							: "-"}
					</div>
					<div>
						红包雨增加金币：
						{res.data["红包雨增加金币"] ? res.data["红包雨增加金币"].totalgold : "-"}
					</div>
					{/* <div>
						包赔活动增加金币：
						{res.data["包赔活动增加金币"]
							? res.data["包赔活动增加金币"].totalgold
							: "-"}
					</div> */}
					<div>
						老用户包赔增加金币：
						{res.data["老用户包赔增加金币"]
							? res.data["老用户包赔增加金币"].totalgold
							: "-"}
					</div>
					<div>
						新用户包赔增加金币：
						{res.data["新用户包赔增加金币"]
							? res.data["新用户包赔增加金币"].totalgold
							: "-"}
					</div>
					<div>
						老用户当日充值赠金增加金币：
						{res.data["老用户当日充值赠金增加金币"]
							? res.data["老用户当日充值赠金增加金币"].totalgold
							: "-"}
					</div>
					<div>
						活动余额清空：
						{res.data["活动余额清空"] ? res.data["活动余额清空"].totalgold : "-"}
					</div>
					<div>
						新用户首存活动余额清空：
						{res.data["新用户首存活动余额清空"] ? res.data["新用户首存活动余额清空"].totalgold : "-"}
					</div>
					<div>
						老用户首存活动余额清空
						{res.data["老用户首存活动余额清空"] ? res.data["老用户首存活动余额清空"].totalgold : "-"}
					</div>
					<div>
						HNFFC包赔增加金币：
						{res.data["HNFFC包赔增加金币"] ? res.data["HNFFC包赔增加金币"].totalgold : "-"}
					</div>
					<div>
						PTXFFC包赔增加金币:
						{res.data["PTXFFC包赔增加金币"]
							? reverseNumber(res.data["PTXFFC包赔增加金币"].totalgold)
							: "-"}
					</div>
					<div>
						奇趣连赢活动10增加金币：
						{res.data["奇趣连赢活动10增加金币"] ? res.data["奇趣连赢活动10增加金币"].totalgold : "-"}
					</div>
					<div>
						河内连赢活动10增加金币：
						{res.data["河内连赢活动10增加金币"] ? res.data["河内连赢活动10增加金币"].totalgold : "-"}
					</div>
					<div>
						日业绩活动领取增加金币：
						{res.data["日业绩活动领取增加金币"] ? res.data["日业绩活动领取增加金币"].totalgold : "-"}
					</div>
					<div>
						百万扶持奖励领取增加金币：
						{res.data["百万扶持奖励领取增加金币"] ? res.data["百万扶持奖励领取增加金币"].totalgold : "-"}
					</div>
					<div>
						捕鱼通关豪礼领取增加金币：
						{res.data["捕鱼通关豪礼领取增加金币"] ? res.data["捕鱼通关豪礼领取增加金币"].totalgold : "-"}
					</div>
					<div>
						豪礼流水活动发放奖金:
						{res.data["豪礼流水活动发放奖金"] ? res.data["豪礼流水活动发放奖金"].totalgold : "-"}
					</div>
					<div>
						昨日赢金榜增加金币:
						{res.data["昨日赢金榜增加金币"] ? res.data["昨日赢金榜增加金币"].totalgold : "-"}
					</div>
					{/* <div>
					每周佣金奖励领取增加金币：
                        {res.data["每周佣金奖励领取增加金币"]
                            ? res.data["每周佣金奖励领取增加金币"].totalgold
                            : "-"}
                    </div> */}
					<br />
					<div>
						后台增加：{" "}
						{res.data["运营后台用户增加金币"]
							? res.data["运营后台用户增加金币"].totalgold
							: "-"}
					</div>
					<div>
						后台减少：
						{res.data["运营后台用户减少金币"]
							? res.data["运营后台用户减少金币"].totalgold
							: "-"}
					</div>
				</React.Fragment>
			);
		} catch (error) {
			console.log(error);
		}
		Modal.info({
			title: "风控",
			okText: "关闭",
			content: reactnode,
			width: "50%",
		});
	} else {
		message.info(res.msg || JSON.stringify(res));
	}
};
