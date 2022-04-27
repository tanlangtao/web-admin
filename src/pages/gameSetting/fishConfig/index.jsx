import React, { useState, useEffect } from "react";
import { Card, message, Button, Form, Radio, InputNumber } from "antd";
import { getBuYuConfig, setBuYuConfig } from "../../../api/index";

import _ from "lodash-es";

function Fishconfigform(props) {
	const [data, setData] = useState([]);
	const { getFieldDecorator } = props.form;
	async function fetchData() {
		const res = await getBuYuConfig();
		if (res.status === 0 && res.data) {
			// res.data.sort(
			//     function (a, b) {
			//         return a["Index"] - b["Index"]
			//     });
			let newdata = _.sortBy(res.data, ["Level","Index"]);
			console.log(newdata, res.data);
			setData(newdata);
		} else {
			message.info(res.msg);
		}
	}
	useEffect(() => {
		fetchData();
	}, []);
	function handleSubmit(e, roomNum) {
		e.preventDefault();
		props.form.validateFields(async (err, value) => {
			console.log(value, roomNum);
			let reqData = {
				RoomIndex: roomNum,
				PlaceType: value[`FCType${roomNum}`],
				Level: value[`FCLevel${roomNum}`],
				Difficult: value[`FCDifficult${roomNum}`],
				ChouFang: value[`FCChouFang${roomNum}`],
			};
			console.log(reqData);
			if (!err) {
				const res = await setBuYuConfig(reqData);
				if (res.status === 0) {
					message.success("提交成功:" + res.msg);
					fetchData();
				} else {
					message.info("出错了：" + res.msg);
				}
			} else {
				message.info("提交失败");
			}
		});
	}
	return (
		<Card
			size="small"
			extra={
				<span>
					<Button
						style={{ float: "right" }}
						icon="reload"
						onClick={() => {
							props.form.resetFields();
							fetchData();
						}}
					/>
				</span>
			}
		>
			{data.map(room => {
				let roomLevel;
				switch (room.Level) {
					case 1:
						roomLevel = 0.001;
						break;
					case 2:
						roomLevel = 0.01;
						break;
					case 3:
						roomLevel = 0.1;
						break;
					case 4:
						roomLevel = 1;
						break;
					default:
						break;
				}
				return (
					<Form
						key={room.Index}
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}
						onSubmit={e => handleSubmit(e, room.Index)}
					>
						<div style={{ paddingLeft: "30px", backgroundColor: "#eee" }}>
							房间号：{room.Index}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{roomLevel}
							元房&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;玩家总赢：
							{room.TotalWin.toFixed(4)}
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;玩家总输：
							{room.TotalLose.toFixed(4)}
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;差额(玩家总输-玩家总赢):&nbsp;&nbsp;
							<span
								style={
									room.TotalLose - room.TotalWin < 0
										? { color: "red" }
										: { color: "black" }
								}
							>
								{(room.TotalLose - room.TotalWin).toFixed(4)}
							</span>
						</div>
						<Form.Item label="场景类型" style={{ marginBottom: "5px" }}>
							{getFieldDecorator(`FCType${room.Index}`, {
								initialValue: room.FCType,
							})(
								<Radio.Group>
									<Radio value={0}>小</Radio>
									<Radio value={1}>中</Radio>
									<Radio value={2}>大</Radio>
								</Radio.Group>,
							)}
							<span
								style={{
									color: "#aaa",
									fontWeight: "normal",
									fontSize: "12px",
								}}
							>
								&nbsp;&nbsp;*控制起伏度，小，中，大起伏
							</span>
						</Form.Item>
						<Form.Item label="档位" style={{ marginBottom: "5px" }}>
							{getFieldDecorator(`FCLevel${room.Index}`, {
								initialValue: room.FCLevel,
							})(
								<Radio.Group>
									<Radio value={0}>小</Radio>
									<Radio value={1}>中</Radio>
									<Radio value={2}>大</Radio>
									<Radio value={3}>超大</Radio>
								</Radio.Group>,
							)}
							<span style={{ color: "#aaa", fontWeight: "normal", fontSize: "12px" }}>
								&nbsp;&nbsp;*越大越难打中鱼
							</span>
						</Form.Item>
						<Form.Item label="困难程度" style={{ marginBottom: "5px" }}>
							{getFieldDecorator(`FCDifficult${room.Index}`, {
								initialValue: room.FCDifficult,
							})(
								<Radio.Group>
									<Radio value={0}>1档</Radio>
									<Radio value={1}>2档</Radio>
									<Radio value={2}>3档</Radio>
									<Radio value={3}>4档</Radio>
									<Radio value={4}>5档</Radio>
								</Radio.Group>,
							)}
							<span
								style={{
									color: "#aaa",
									fontWeight: "normal",
									fontSize: "12px",
								}}
							>
								&nbsp;&nbsp;*越大越难打中鱼
							</span>
						</Form.Item>
						<Form.Item label="抽放水" style={{ marginBottom: "5px" }}>
							{getFieldDecorator(`FCChouFang${room.Index}`, {
								rules: [
									{
										required: true,
										message: "该项不能为空",
									},
									{
										pattern: /^(-|\+)?\d+(\.\d+)?$/,
										message: "请输入有效数字",
									},
									{
										validator: (rule, value, callback) => {
											if (!value) {
												callback(); //如果还没填写，则不进行验证
											} else if (parseFloat(value) > 2147483) {
												callback("最多不超过2147483!");
											} else if (parseFloat(value) < -2147483) {
												callback("最多不超过-2147483!");
											} else {
												callback();
											}
										},
									},
								],
								initialValue: room.FCChouFang,
							})(<InputNumber style={{ width: 150 }}></InputNumber>)}
							<span
								style={{
									color: "#aaa",
									fontWeight: "normal",
									fontSize: "12px",
								}}
							>
								&nbsp;&nbsp;*负值抽水，正值放水 &nbsp;&nbsp;&nbsp;&nbsp;注:单位
								元，最多不超过正负2147483
							</span>
						</Form.Item>

						<Form.Item wrapperCol={{ offset: 4 }} style={{ marginBottom: "5px" }}>
							<Button type="primary" htmlType="submit" className="login-form-button">
								提交
							</Button>
						</Form.Item>
					</Form>
				);
			})}
		</Card>
	);
}
export default Form.create()(Fishconfigform);
