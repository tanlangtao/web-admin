import React, { useRef, useState } from "react";

import { message, Card, Input, Button } from "antd";

import {
	changeRoomStatus,
	getUserLimitRangeRecord,
	setUserLimitRangeBet,
	setRoomLimitBet,
	getRoomLimitRangeRecord,
} from "../../../../api";

export const CycdxChangeRoomStatus = () => {
	const [state, setstate] = useState();
	const ref = useRef({});
	const apply = async () => {
		const { game_id, room_id, room_status } = ref.current;
		if (!game_id || !room_id || !room_status) {
			message.info("请输入关键字");
			return;
		}
		const res = await changeRoomStatus({ game_id, room_id, room_status,subgame:"cycdx" });
		setstate(res);
	};
	return (
		<Card
			title={
				<div>
					<div>
						game_id: 彩源猜大小 5b1f3a3cb76a591e7f251734 <br />
						room_id： 房间ID， 01为河内分分彩，02为奇趣分分彩 <br />
						room_status： 0为关闭，1为开启 <br />
						返回字段说明： "RoomNumber": "01", //房間ID
						<br />
						"Status": 1, //房間狀態
						<br />
						"Type": "hn60", //彩源類型 hn60=河内分分彩， ptxffc=奇趣分分彩
						<br />
					</div>
					<br />
					<Input
						style={{ width: 200 }}
						placeholder="请输入game_id"
						onChange={e => (ref.current.game_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Input
						style={{ width: 200 }}
						placeholder="请输入room_id"
						onChange={e => (ref.current.room_id = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Input
						style={{ width: 200 }}
						placeholder="请输入room_status"
						onChange={e => (ref.current.room_status = e.target.value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => apply()}>
						提交
					</Button>
				</div>
			}
		>
			<pre>{JSON.stringify(state, null, 2)}</pre>
		</Card>
	);
};
export const CycdxUserLimitRangeBet = () => {
	const [state, setstate] = useState();
	const [state2, setstate2] = useState();
	const ref = useRef({});
	const ref2 = useRef({});
	const apply = async () => {
		const { game_id, user_id, max_bet, min_bet } = ref.current;
		if (!game_id || !user_id || !max_bet || !min_bet) {
			message.info("请输入关键字");
			return;
		}
		const res = await setUserLimitRangeBet({ game_id, user_id, max_bet, min_bet,subgame:"cycdx" });
		setstate(res);
	};
	const check = async () => {
		const { game_id, user_id } = ref2.current;
		if (!game_id || !user_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getUserLimitRangeRecord({ game_id, user_id ,subgame:"cycdx"});
		setstate2(res);
	};
	return (
		<>
			<Card
				title={
					<div>
						<div>
							玩家限红设定：
							<br />
							game_id: 彩源猜大小 5b1f3a3cb76a591e7f251734
							<br />
							user_id : 玩家ID <br />
							max_bet : 最大可下注区间(设0 无限制)
							<br />
							min_bet : 最小可下注区间(设0 无限制)
							<br />
						</div>
						<Input
							style={{ width: 200 }}
							placeholder="请输入game_id"
							onChange={e => (ref.current.game_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入user_id"
							onChange={e => (ref.current.user_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入max_bet"
							onChange={e => (ref.current.max_bet = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入min_bet"
							onChange={e => (ref.current.min_bet = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => apply()}>
							提交
						</Button>
					</div>
				}
			>
				<pre>{JSON.stringify(state, null, 2)}</pre>
			</Card>
			<Card
				title={
					<div>
						<div>
							玩家限红查询：
							<br />
							game_id: 彩源猜大小 5b1f3a3cb76a591e7f251734
							<br />
							user_id : 玩家ID
							<br />
						</div>
						<Input
							style={{ width: 200 }}
							placeholder="请输入game_id"
							onChange={e => (ref2.current.game_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入user_id"
							onChange={e => (ref2.current.user_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => check()}>
							查询
						</Button>
					</div>
				}
			>
				<pre>{JSON.stringify(state2, null, 2)}</pre>
			</Card>
		</>
	);
};
export const CycdxRoomLimitRangeBet = () => {
	const [applyData, setApplyData] = useState();
	const [checkData, setCheckData] = useState();
	const ref = useRef({});
	const ref2 = useRef({});
	const apply = async () => {
		const { game_id, room_id, max_bet, min_bet } = ref.current;
		if (!game_id || !room_id || !max_bet || !min_bet) {
			message.info("请输入关键字");
			return;
		}
		const res = await setRoomLimitBet({ game_id, room_id, max_bet, min_bet,subgame:"cycdx" });
		setApplyData(res);
	};
	const check = async () => {
		const { game_id, room_id } = ref2.current;
		if (!game_id || !room_id) {
			message.info("请输入关键字");
			return;
		}
		const res = await getRoomLimitRangeRecord({ game_id, room_id ,subgame:"cycdx"});
		setCheckData(res);
	};
	return (
		<>
			<Card
				title={
					<div>
						<div>
							房间限红设定：
							<br />
							game_id: 彩源猜大小 5b1f3a3cb76a591e7f251734
							<br />
							room_id : 房間ID，1为河内分分彩，2为奇趣分分彩<br />
							max_bet : 最大可下注区间(设0 无限制)
							<br />
							min_bet : 最小可下注区间(设0 无限制)
							<br />
						</div>
						<Input
							style={{ width: 200 }}
							placeholder="请输入game_id"
							onChange={e => (ref.current.game_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入room_id"
							onChange={e => (ref.current.room_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入max_bet"
							onChange={e => (ref.current.max_bet = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入min_bet"
							onChange={e => (ref.current.min_bet = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => apply()}>
							提交
						</Button>
					</div>
				}
			>
				<pre>{JSON.stringify(applyData, null, 2)}</pre>
			</Card>
			<Card
				title={
					<div>
						<div>
							房间限红查询：
							<br />
							game_id: 彩源猜大小 5b1f3a3cb76a591e7f251734
							<br />
							room_id : 房間ID，1为河内分分彩，2为奇趣分分彩
							<br />
						</div>
						<Input
							style={{ width: 200 }}
							placeholder="请输入game_id"
							onChange={e => (ref2.current.game_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Input
							style={{ width: 200 }}
							placeholder="请输入room_id"
							onChange={e => (ref2.current.room_id = e.target.value)}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => check()}>
							查询
						</Button>
					</div>
				}
			>
				<pre>{JSON.stringify(checkData, null, 2)}</pre>
			</Card>
		</>
	);
};
