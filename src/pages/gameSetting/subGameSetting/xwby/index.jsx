import React, { useState, useEffect } from "react";
import { Card, message, Button, Form, Radio, InputNumber, Table } from "antd";
import LinkButton from "../../../../components/link-button";
import {
	getThirdAlgStatus,
	getTableScore,
	setchouFangThirdAlg,
	updateThirdAlg,
	switchChouFang,
	getRoomsChouFangStatus
} from "../../../../api";

import _ from "lodash-es";

function Fishconfigform(props) {
	console.log(props);
	const [data, setData] = useState([]);
	const { getFieldDecorator } = props.form;
	const { serverId } = props;
	async function fetchData() {
		const req1 = getThirdAlgStatus(serverId);
		const req2 = getTableScore(serverId);
		const res1 = await req1;
		if (res1.code === 200) {
			let info = JSON.parse(res1.detail || null)?.info;
			let tableArr = []
			let data1 = info.map((ele, index) => {
				tableArr.push(index + 1)
				return JSON.parse(ele || null);
			});
			console.log("data1:", data1);
			//如果成功然后发第二个请求
			const res2 = await req2;
			if (res2.code === 200) {
				let info2 = JSON.parse(res2.detail || null)?.info;
				let data2 = info2.map(ele => {
					return JSON.parse(ele || null);
				});
				console.log("data2:", data2);
				//如果成功然後發第三個請求(每個桌子單獨發送api請求取得當前抽放值)
				let data3 = []
				let proArr = []
				//map出所有的promise請求到一個陣列
				tableArr.map(index => {
					let reqData = {
						serverId: serverId,
						tid: index,
						num: 0,
					}
					let p = new Promise((resolve, reject) => {
						setchouFangThirdAlg(reqData).then(res => {
							if (res.code === 200) {
								let chouFangVal = JSON.parse(res.detail || null)?.msg.split('当前量:')[1]
								let info3 = { tid: index, chouFangVal: Number(chouFangVal) }
								data3.push(info3)
							} else {
								message.info(res.status || `请求失败，失败桌号${index}`)
								let info3 = { tid: index, chouFangVal: 0 }
								data3.push(info3)
							}
							resolve()
						}).catch(err => {
							console.log(err)
							reject()
						})
					})
					proArr.push(p)
				})
				await Promise.all(proArr).then(res => {
					console.log('data3:', data3)
				})
				//合并多个data
				data1.forEach(e => {
					data2.forEach(e2 => {
						if (e.tid == e2.table_id.split("-")?.[1]) {
							e.TotalWin = e2.player_total_win;
							e.TotalLose = e2.player_total_lose;
						}
					});
				});
				data1.forEach(e => {
					data3.forEach(e3 => {
						if (e.tid == e3.tid) {
							e.chouFangVal = e3.chouFangVal;
						}
					});
				});
				//排序
				let newdata = _.sortBy(data1, ["tid"]);
				console.log(newdata);
				setData(newdata);
			} else {
				message.info(res2.status || "请求失败");
			}
		} else {
			message.info(res1.status || "请求失败");
		}
	}
	useEffect(() => {
		fetchData();
	}, []);
	function handleSubmit(e, tid, index) {
		e.preventDefault();
		props.form.validateFields(async (err, value) => {
			let place = value[`place${index}`];
			let level = value[`level${index}`];
			let diff = value[`diff${index}`];
			let num = value[`num${index}`];
			console.log("value:", value, num);
			if (!err) {
				const res = await updateThirdAlg({ serverId, tid, place, level, diff });
				if (res.code === 200) {
					message.success("提交成功:" + res.status);
					fetchData();
				} else {
					message.info("出错了：" + res.status);
				}
				if (num) {
					const res2 = await setchouFangThirdAlg({ serverId, tid, num })
					if (res2.code === 200) {
						message.success("提交成功:" + res2.detail);
					} else {
						message.info("出错了：" + res2.detail);
					}
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
			{data.map((room, index) => {
				let roomLevel;
				switch (serverId) {
					case 3000:
						roomLevel = 0.01;
						break;
					case 3001:
						roomLevel = 0.1;
						break;
					case 3002:
						roomLevel = 1;
						break;
					case 3003:
						roomLevel = 10;
						break;
					default:
						break;
				}
				return (
					<Form
						key={index}
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}
						onSubmit={e => handleSubmit(e, room.tid, index)}
					>
						<div style={{ paddingLeft: "30px", backgroundColor: "#eee" }}>
							房间号：{room.tid}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
							{getFieldDecorator(`place${index}`, {
								initialValue: room.place,
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
							{getFieldDecorator(`level${index}`, {
								initialValue: room.level,
							})(
								<Radio.Group>
									<Radio value={0}>小</Radio>
									<Radio value={1}>中</Radio>
									<Radio value={2}>大</Radio>
									<Radio value={3}>超大</Radio>
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
						<Form.Item label="困难程度" style={{ marginBottom: "5px" }}>
							{getFieldDecorator(`diff${index}`, {
								initialValue: room.diff,
							})(
								<Radio.Group>
									<Radio value={0}>0档</Radio>
									<Radio value={1}>1档</Radio>
									<Radio value={2}>2档</Radio>
									<Radio value={3}>3档</Radio>
									<Radio value={4}>4档</Radio>
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
							{getFieldDecorator(`num${index}`, {
								rules: [
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
							})(<InputNumber style={{ width: 150 }}></InputNumber>)}
							<span
								style={{
									color: "#aaa",
									fontWeight: "normal",
									fontSize: "12px",
								}}
							>
								&nbsp;&nbsp;*负值抽水，正值放水 &nbsp;&nbsp;&nbsp;&nbsp;注:单位
								元，当前桌号抽放水值{" "}
								{serverId == 3000 && `${room.chouFangVal}分`}
								{serverId == 3001 && `${room.chouFangVal}角`}
								{serverId == 3002 && `${room.chouFangVal}元`}
								{serverId == 3003 && `${room.chouFangVal}元`}
							</span>
						</Form.Item>

						<Form.Item wrapperCol={{ offset: 4 }} style={{ marginBottom: "5px" }}>
							<Button
								type="primary"
								htmlType="submit"
								className="login-form-button"
							>
								提交
							</Button>
						</Form.Item>
					</Form>
				);
			})}
		</Card>
	);
}
const XWBYcomponent = Form.create()(Fishconfigform);
export const XWBYcomponent1 = XWBYcomponent;
export const XWBYcomponent2 = XWBYcomponent;
export const XWBYcomponent3 = XWBYcomponent;
export const XWBYcomponent4 = XWBYcomponent;

export const SwitchChouFang = () => {
	const [roomStatus, setRoomStatus] = useState([])

	const getRoomStatus = async () => {
		const res = await getRoomsChouFangStatus()
		if (res.code === 200) {
			setRoomStatus(JSON.parse(res.detail).data)
		} else {
			message.info(res.status || JSON.stringify(res))
		}
	}

	useEffect(() => {
		getRoomStatus()
	}, [])

	const toggleSwitch = async (roomId, status) => {
		const res = await switchChouFang(roomId, status ? 1 : 0)
		const resParse = JSON.parse(res.detail)
		if (resParse.code === 0) {
			message.success("提交成功:" + res.detail);
			getRoomStatus()
		} else {
			message.info("出错了：" + res.detail);
		}
	}

	const initColumns = [
		{
			title: "序号",
			dataIndex: "",
			align: "center",
			render: (text, record, index) => {
				return `${index + 1}`
			}
		},
		{
			title: "房间类型",
			dataIndex: "roomId",
			align: "center",
			render: (text, record, index) => {
				let word;
				switch (text) {
					case 3000:
						word = "初级房";
						break;
					case 3001:
						word = "中级房";
						break;
					case 3002:
						word = "高级房";
						break;
					case 3003:
						word = "大师房";
						break;
					default:
						word = "";
						break;
				}
				return <span>{word}</span>;
			}
		},
		{
			title: "自动抽水状态",
			dataIndex: "isChouFangOpen",
			align: "center",
			render: (text, record) => text ? '开启' : '关闭',
		},
		{
			title: "操作",
			dataIndex: "",
			render: (record) => (
				<span>
					<LinkButton onClick={() => toggleSwitch(record.roomId, !record.isChouFangOpen)}>修改</LinkButton>
				</span>
			),
		},
	];
	return (
		<Card>
			<Table
				bordered
				rowKey={(record, index) => `${index}`}
				dataSource={roomStatus}
				columns={initColumns}
				size="small"
				pagination={false}
			// style={{ width: '500px' }}
			/>
		</Card>
	)
}
