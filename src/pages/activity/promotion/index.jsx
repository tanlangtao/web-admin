import React, { useRef, useState } from "react";

import {  message, Card, Input, Button} from "antd";

import { applyRewardByDays,getApplyRewardByDays,applyHandleHeNeiPay,getApplyHeNei} from "../../../api";

export const ApplyPromotion = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id, activity_id } = ref.current;
		if (!user_id || !activity_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await applyRewardByDays(user_id, activity_id);
		setstate(res);
	};
	return (
		<Card
			title={
				<div>
					<Input
						style={{ width: 200 }}
						placeholder="请输入user_id"
						onChange={e => (ref.current.user_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Input
						style={{ width: 200 }}
						placeholder="请输入activity_id"
						onChange={e => (ref.current.activity_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => apply()}>
						申请
					</Button>
				</div>
			}
		>
			{JSON.stringify(state)}
		</Card>
	);
};
export const GetPromotionCheck = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id } = ref.current;
		if (!user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getApplyRewardByDays(user_id);
		if (res.status === 0) {
			message.success("申请成功");
		}
		if (res.status === -1) {
			message.info("申请失败");
		}
		setstate(res);
	};
	return (
		<Card
			title={
				<div>
					<Input
						style={{ width: 200 }}
						placeholder="请输入user_id"
						onChange={e => (ref.current.user_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => apply()}>
						查询
					</Button>
				</div>
			}
		>
			<div style={{ fontSize: 18 }}>{JSON.stringify(state)}</div>
		</Card>
	);
};
export const ApplyHandleHeNeiPay = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id, activity_id } = ref.current;
		if (!user_id || !activity_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await applyHandleHeNeiPay(user_id, activity_id);
		setstate(res);
	};
	return (
		<Card
			title={
				<div>
					<Input
						style={{ width: 200 }}
						placeholder="请输入user_id"
						onChange={e => (ref.current.user_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Input
						style={{ width: 200 }}
						placeholder="请输入activity_id"
						onChange={e => (ref.current.activity_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => apply()}>
						申请
					</Button>
				</div>
			}
		>
			{JSON.stringify(state)}
		</Card>
	);
};
export const GetApplyHeNei = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id } = ref.current;
		if (!user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getApplyHeNei(user_id);
		if (res.status === 0) {
			message.success("申请成功");
		}
		if (res.status === -1) {
			message.info("申请失败");
		}
		setstate(res);
	};
	return (
		<Card
			title={
				<div>
					<Input
						style={{ width: 200 }}
						placeholder="请输入user_id"
						onChange={e => (ref.current.user_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => apply()}>
						查询
					</Button>
				</div>
			}
		>
			<div style={{ fontSize: 18 }}>{JSON.stringify(state)}</div>
		</Card>
	);
};
