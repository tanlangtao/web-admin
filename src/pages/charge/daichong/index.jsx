import React, { useState } from "react";
import { Card, message, InputNumber, Input, Divider, Descriptions } from "antd";
import { reqLoadGold, bankCardTransfer, UCAlipaytocard } from "../../../api/index";
import LinkButton from "../../../components/link-button";

let prepareData;
function Daichong(props) {
	const [ amount, setAmount ] = useState();
	const [ user_name, setuser_name ] = useState();
	const [ data, setData ] = useState({});
	async function handleUser(value) {
		const res = await reqLoadGold(value);
		if (res.status === 0) {
			setuser_name(res.data.game_nick);
			prepareData = res.data;
		} else {
			setuser_name();
			message.info("获取ID信息失败" + JSON.stringify(res));
			prepareData = null;
		}
	}
	async function handleConfirm(channel_id) {
		if (prepareData) {
			let reqData = {
				user_id       : prepareData.id,
				user_name     : prepareData.game_nick,
				channel_id,
				pay_type      : 17,
				amount        : amount,
				client        : "admin_web",
				proxy_user_id : prepareData.proxy_user_id,
				proxy_name    : prepareData.proxy_user_id,
				package_id    : prepareData.package_id,
				order_type    : 1,
				token         : "e40f01afbb1b9ae3dd6747ced5bca532"
			};
			const res = await bankCardTransfer(reqData);
			if (res.status === 0) {
				setData(res.data);
			} else {
				message.info(res.msg || JSON.stringify(res));
			}
		}
	}
	function handleUC() {
		if (prepareData) {
			let reqData = {
				user_id        : prepareData.id,
				user_name      : prepareData.game_nick,
				pay_name       : "支付宝转卡",
				channel_type   : 5,
				pay_type       : 22,
				channel_name   : "UC",
				payment_amount : amount,
				client         : "admin_web",
				proxy_user_id  : prepareData.proxy_user_id,
				proxy_name     : prepareData.proxy_user_id,
				package_id     : prepareData.package_id,
				token          : "e40f01afbb1b9ae3dd6747ced5bca532"
			};
			UCAlipaytocard(reqData);
		}
	}
	return (
		<Card size="small">
			<Input.Search
				placeholder="请输入玩家ID"
				onSearch={handleUser}
				enterButton="确定"
				style={{ width: 250, display: "block" }}
			/>
			{user_name && <div style={{ fontSize: 16, marginTop: 20 }}>玩家昵称是:{user_name}&nbsp;&nbsp;请核对!</div>}
			<InputNumber
				onChange={(val) => setAmount(val)}
				style={{ width: 150, marginTop: 20, marginBottom: 20 }}
				placeholder="请输入金额"
			/>
			<br />
			<LinkButton onClick={() => handleConfirm(11)} size="default">
				古都银行卡
			</LinkButton>
			<LinkButton onClick={() => handleConfirm(12)} size="default">
				onepay
			</LinkButton>
			<LinkButton onClick={() => handleUC()} size="default">
				uc支付宝转卡
			</LinkButton>
			<Divider dashed />
			<Descriptions title="订单信息" bordered column={1} size="default">
				<Descriptions.Item label="充值方式">银行卡转账</Descriptions.Item>
				<Descriptions.Item label="用户昵称">{data.user_name || ""}</Descriptions.Item>
				<Descriptions.Item label="专享快付，现在很简单，自由度很高" />
				<Descriptions.Item label="收款银行">{data.bank_name || ""}</Descriptions.Item>
				<Descriptions.Item label="收款账号">{data.card_num || ""}</Descriptions.Item>
				<Descriptions.Item label="收款姓名">{data.card_name || ""}</Descriptions.Item>
				<Descriptions.Item label="转账金额">{data.amount}</Descriptions.Item>
				<Descriptions.Item label="备注">{data.remark || ""}</Descriptions.Item>
			</Descriptions>
		</Card>
	);
}
export default Daichong;
