import React, { useRef, useState } from "react";

import {  message, Card, Input, Button} from "antd";

import { applyReimburse, getApplyReimburseUser,applyFristPay,getApplyFristPayUser } from "../../../api";

export const Yonghubaopei = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id, activity_id, package_id } = ref.current;
		if (!user_id || !activity_id ||!package_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await applyReimburse(user_id, activity_id, package_id);
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
					<Input
						style={{ width: 200 }}
						placeholder="请输入package_id"
						onChange={e => (ref.current.package_id = e.target.value)}
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
export const Yonghubaopeichaxun = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id } = ref.current;
		if (!user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getApplyReimburseUser(user_id);
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
export const OldYonghubaopei = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id, activity_id } = ref.current;
		if (!user_id || !activity_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await applyReimburse(user_id, activity_id, null, true);
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
export const OldYonghubaopeichaxun = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id } = ref.current;
		if (!user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getApplyReimburseUser(user_id, true);
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
export const ApplyFristPay = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id, activity_id } = ref.current;
		if (!user_id || !activity_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await applyFristPay(user_id, activity_id);
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
export const GetApplyFristPayUser = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { user_id } = ref.current;
		if (!user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getApplyFristPayUser(user_id);
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