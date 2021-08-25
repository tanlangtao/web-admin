import React, { Component } from "react";
import { Card, Modal, message, Icon, Select, Input, Popconfirm, Button } from "antd";

// import _ from "lodash-es";

import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
	reqUsers,
	setGameUserNickName,
	changeGold,
	reqLoadGold,
	saveUserBlack,
	createTask,
	setCustomer,
	downloadUserList,
	setgameuserstatus,
	setGameUserPhone,
	getipdetail,
	getteldetail,
} from "../../api/index";
import WrappedNormalLoginForm from "././user-nick";
import WrappedComponent from "./gold_details";
import MyDatePicker from "../../components/MyDatePicker";
import Mytable from "../../components/MyTable";
import { throttle } from "../../utils/commonFuntion";

const { Option } = Select;

const init_state = {
	current: 1,
	pageSize: 20,
	data: [],
	count: 0,
	isNickShow: false,
	isGoldShow: false,
	isGoldDetailShow: false,
	isBindInfoShow: false,
	isResetPwdShow: false,
	resetpwd: "",
	game_nick: "",
	startTime: "",
	endTime: "",
	MyDatePickerValue: null,
	inputKey: "id",
	inputValue: "",
	loading: true,
	change_phone_number_password: "",
	new_phone_number: "",
	changeGoldButtonLoading: false,
	packages: "",
};
export default class User extends Component {
	constructor(props) {
		super(props);
		this.state = init_state;
		this.handleInputThrottled = throttle(this.onChangeGold, 3000);
	}

	initColumns = () => [
		{
			title: "user_id",
			dataIndex: "id",
			key: "id",
			fixed: "left",
			width: 100,
		},
		{
			title: "昵称",
			dataIndex: "game_nick",
			key: "game_nick",
			fixed: "left",
			width: 100,
			onCell: (record, rowIndex) => {
				return {
					onClick: event => {
						this.game_nick = record.game_nick;
						this.id = record.id;
						this.rowIndex = rowIndex;
						this.setState({
							isNickShow: true,
						});
					}, // 点击行
					onDoubleClick: event => {},
					onContextMenu: event => {},
					onMouseEnter: event => {
						event.target.style.cursor = "pointer";
					}, // 鼠标移入行
					onMouseLeave: event => {},
				};
			},
		},

		{
			title: "账户余额",
			dataIndex: "game_gold",
			key: "game_gold",
			sorter: (a, b) => a.game_gold - b.game_gold,
			// width: 100,
			onCell: (record, rowIndex) => {
				return {
					onClick: event => {
						this.goldRecord = record;
						this.setState({
							isGoldShow: true,
						});
					}, // 点击行
					onDoubleClick: event => {},
					onContextMenu: event => {},
					onMouseEnter: event => {
						event.target.style.cursor = "pointer";
					}, // 鼠标移入行
					onMouseLeave: event => {},
				};
			},
			render: (text, record) => {
				let sum = record.game_gold + record.bank_gold - record.lock_gold;
				// console.log("game_gold",record.game_gold);
				// console.log("bank_gold",record.bank_gold);
				// console.log("lock_gold",record.lock_gold);
				// console.log("sum",sum);
				return (Math.round(sum * 1000000) / 1000000).toFixed();
			},
		},
		{
			title: "所属品牌",
			dataIndex: "package_nick",
			key: "package_nick",
			// width: 100,
		},
		{
			title: "所属代理",
			dataIndex: "proxy_nick",
			key: "proxy_nick",
			// width: 150,
		},
		{
			title: "手机",
			dataIndex: "phone_number",
			key: "phone_number",
			// width: 150,
			onCell: (record, rowIndex) => {
				return {
					onClick: event => {
						this.record = record;
						this.setState({
							isPhoneNumberShow: true,
						});
					},
				};
			},
		},
		{
			title: "手机归属地",
			dataIndex: "phone_number_detail",
			// width: 120,
			render: (text, record, index) => {
				if (!text && record.phone_number) {
					return (
						<Button size="small" onClick={() => this.check_tel_detail(record, index)}>
							点击查看
						</Button>
					);
				} else {
					return text;
				}
			},
		},
		{
			title: "账号",
			dataIndex: "role_name",
			key: "role_name",
			// width: 150,
		},
		{
			title: "注册IP",
			dataIndex: "regin_ip",
			key: "regin_ip",
			// width: 150,
		},
		{
			title: "注册IP区域",
			dataIndex: "regin_ip_area",
			// width: 200,
			render: (text, record, index) => {
				if (!text) {
					return (
						<Button
							size="small"
							onClick={() => this.check_ip_detail(record, index, "regin_ip")}
						>
							点击查看
						</Button>
					);
				} else {
					return text;
				}
			},
		},
		{
			title: "注册时间",
			dataIndex: "regin_time",
			render: formateDate,
			key: "regin_time",
			sorter: (a, b) => a.regin_time - b.regin_time,
			// width: 200,
		},
		{
			title: "登录IP",
			dataIndex: "login_ip",
			key: "login_ip",
			// width: 200,
		},
		{
			title: "登录IP区域",
			dataIndex: "login_ip_area",
			// width: 200,
			render: (text, record, index) => {
				if (!text) {
					return (
						<Button
							size="small"
							onClick={() => this.check_ip_detail(record, index, "login_ip")}
						>
							点击查看
						</Button>
					);
				} else {
					return text;
				}
			},
		},
		{
			title: "登陆时间",
			dataIndex: "login_time",
			render: formateDate,
			sorter: (a, b) => a.login_time - b.login_time,
			// width: 200,
		},
		{
			title: "操作",
			dataIndex: "",
			// width: 200,
			render: record => (
				<span>
					<LinkButton onClick={() => this.getGoldDetail(record)} type="default">
						资金明细
					</LinkButton>
					<LinkButton onClick={() => this.getMoreDetail(record)}>更多</LinkButton>
				</span>
			),
		},
		{
			title: "实时余额",
			// width: 100,
			render: record => (
				<span>
					<LinkButton type="default" onClick={() => this.getLoadGold(record)}>
						查看
					</LinkButton>
				</span>
			),
		},
		{
			title: "是否为客服账号",
			dataIndex: "game_user_type",
			// width: 150,
			render: (text, record, index) => <span>{parseInt(text) === 4 ? "是" : ""}</span>,
		},
		{
			title: "是否被限制登录",
			dataIndex: "status",
			render: (text, record, index) => <span>{parseInt(text) === 0 ? "是" : ""}</span>,
		},
	];
	check_ip_detail = async (record, i, type) => {
		this.setState({ loading: true });
		console.log(record, i, type);
		let newdata = this.state.data;
		let ip = record[type];
		const res = await getipdetail(ip);
		// if (res.status === "success") {
		if (res.success === true) {
			newdata.forEach(element => {
				if (record.id === element.id) {
					// element[`${type}_area`] = `${res.country}.${res.regionName}`;
					element[`${type}_area`] = `${res.country}.${res.region}`;
					this.setState({ data: newdata, loading: false });
				}
			});
		} else {
			message.info(res.message);
			this.setState({ loading: false });
		}
	};
	check_tel_detail = async (record, index) => {
		this.setState({ loading: true });
		let newdata = this.state.data;
		try {
			const result = await reqLoadGold(record.id);
			if (result.status === 0 && result.data?.phone_number) {
				const res = await getteldetail(result.data.phone_number);
				// let newres = res.replace("__GetZoneResult_ = ", "");
				// console.log(newres);
				// let str = res
				//     ?.split("carrier")?.[1]
				//     .replace(":", "")
				//     .replace(/'/g, "")
				//     .replace("}", "");
				//newdata[index][`phone_number_detail`] = str || "";
				//this.setState({ data: newdata, loading: false });
				/*add by jil 2020.08.05*/
				if (res.status === 0) {
					newdata.forEach(element => {
						if (record.id === element.id) {
							element[`phone_number_detail`] = `${res.msg}`;
							this.setState({ data: newdata, loading: false });
						}
					});
				} else {
					message.info(res.msg);
					this.setState({ loading: false });
				}
				/*add by jil 2020.08.05 用户列表界面增加电话号码归属地查询功能*/
			} else {
				message.info("获取电话号码失败" || JSON.stringify(result));
			}
		} finally {
			this.setState({ loading: false });
			console.log(this.state.data);
		}
		/*2020.08.05原先Javier是marked，打開來測試看看，結果admin-web Fail to compile*/
		// if (res.status === "success") {
		//     newdata[i][`${type}_area`] = `${res.country}.${res.regionName}`;
		//     this.setState({ data: newdata, loading: false });
		// } else {
		//     message.info(res.message);
		//     this.setState({ loading: false });
		// }
	};
	getUsers = async (page, limit) => {
		this.setState({ loading: true });
		const result = await reqUsers(
			page,
			limit,
			this.state.startTime,
			this.state.endTime,
			this.state.inputKey,
			this.state.inputValue,
		);
		if (result.status === 0) {
			const { game_user, proxy_user } = result.data;
			game_user.forEach(element => {
				proxy_user.forEach(item => {
					if (element.id === item.id) {
						element.proxy_nick = item.proxy_pid;
						// element.proxy_user_type = item.proxy_user_type;
					}
				});
			});
			this.setState({
				data: game_user,
				count: result.data && result.data.count,
				loading: false,
				packages: result.data && result.data.packages,
			});
		} else {
			message.info(result.msg || "未检索到数据");
		}
	};
	changeNickName = () => {
		let form = this.refs.getFormValue; //通过refs属性可以获得对话框内form对象
		form.validateFields(async (err, value) => {
			if (!err) {
				this.setState({ isNickShow: false });
				if (value.name !== this.game_nick) {
					const result = await setGameUserNickName(this.id, value.name);
					if (result.status === 0) {
						message.success("修改成功!");
						// 首先拿到索引, 也可以从参数中传递过来
						let index = this.rowIndex;
						// 然后根据索引修改
						this.state.data[index][`game_nick`] = value.name;
						// 这个时候并不会更新视图, 需要 setState更新 arr
						this.setState({
							data: this.state.data,
						});
					}
				}
			}
			form.resetFields();
		});
	};
	onChangeGold = () => {
		this.setState({ changeGoldButtonLoading: true });
		//这里直接复用了user-nick的模态框，所以取input的值时用value.name
		let form = this.refs.getFormValue;
		let goldRecord = this.goldRecord;
		form.validateFields(async (err, value) => {
			if (!err) {
				const res = await changeGold(goldRecord, value);
				if (res.status === 0) {
					message.success(JSON.stringify(res.msg));
					// this.setState({ isGoldShow: false });
				} else {
					message.info(JSON.stringify(res.msg));
				}
				setTimeout(() => {
					this.setState({ changeGoldButtonLoading: false, isGoldShow: false });
				}, 2000);
			} else {
				this.setState({ changeGoldButtonLoading: false });
			}
		});
	};
	getLoadGold = async record => {
		const id = record.id;
		const result = await reqLoadGold(id);
		if (result.status === 0) {
			Modal.success({
				title: "实时余额",
				// content: `用户${record.id}实时余额是 : ${reverseNumber(result.data.game_gold)}`
				content: `用户${record.id}实时余额是 : ${result.data.game_gold.toFixed(6)}`,
			});
		} else {
			message.info(result.msg || JSON.stringify(result));
		}
	};
	getGoldDetail = async (record, isBindInfo) => {
		if (this.moreModal) {
			this.moreModal.destroy();
		}
		this.isBindInfo = isBindInfo;
		this.recordID = record.id;
		this.setState({ isGoldDetailShow: true });
	};
	saveUserBlack = async (record, isAdd) => {
		let action = isAdd ? "add" : "remove";
		const res = await saveUserBlack(record.id, action);
		if (res.status === 0) {
			message.success("操作成功！");
		} else {
			message.success("操作失败:" + res.msg);
		}
	};
	resetPwd = record => {
		if (this.moreModal) {
			this.moreModal.destroy();
		}
		this.setState({ isResetPwdShow: true });
		this.resetPwdId = record.id;
	};
	handleResetpwd = async () => {
		const res = await createTask(this.resetPwdId, this.state.resetpwd);
		if (res.status === 0) {
			message.success("操作成功！");
			this.setState({ resetpwd: "", isResetPwdShow: false });
		} else {
			message.success("操作失败:" + res.msg);
		}
	};
	getMoreDetail = record => {
		this.moreModal = Modal.info({
			title: "更多",
			okText: "关闭",
			width: "70%",
			content: (
				<div>
					<LinkButton onClick={() => this.getGoldDetail(record, true)} size="small">
						查看绑定信息
					</LinkButton>
					<Popconfirm
						title="交易所黑名单"
						onConfirm={() => this.saveUserBlack(record, true)}
						onCancel={() => this.saveUserBlack(record, false)}
						okText="添加"
						cancelText="移除"
					>
						<LinkButton size="small">交易所黑名单</LinkButton>
					</Popconfirm>
					<LinkButton onClick={() => this.resetPwd(record)} size="small">
						重置密码
					</LinkButton>
					<Popconfirm
						title="确定要设置为客服账号吗？"
						onConfirm={() => this.setCustomerAccount(record)}
						okText="确定"
						cancelText="取消"
					>
						<LinkButton size="small">设置客服账号</LinkButton>
					</Popconfirm>
					<Popconfirm
						title="要限制玩家登陆吗"
						onConfirm={() => this.setuserstatus(record, 0)}
						onCancel={() => this.setuserstatus(record, 1)}
						okText="增加限制"
						cancelText="取消限制"
					>
						<LinkButton size="small">限制玩家登陆</LinkButton>
					</Popconfirm>
				</div>
			),
		});
	};
	setuserstatus = async (record, status) => {
		let id = record.id;
		const res = await setgameuserstatus(id, status);
		if (res.code === 200) {
			message.success(res.status);
		} else {
			message.info(res.status);
		}
	};
	setCustomerAccount = async (record, status) => {
		let id = record.id;
		const res = await setCustomer(id, status);
		if (res.status === 0) {
			message.success(res.msg || "操作成功");
		} else {
			message.info(res.msg || "操作失败");
		}
	};
	download = () => {
		let reqdata = {
			start_time: this.state.startTime,
			end_time: this.state.endTime,
			inputKey: this.state.inputKey,
			inputValue: this.state.inputValue,
			packages: this.state.packages,
		};
		downloadUserList(reqdata);
	};
	componentDidMount() {
		this.getUsers(1, 20);
	}
	render() {
		const { data, count, current, pageSize, loading } = this.state;
		const title = (
			<span>
				<MyDatePicker
					handleValue={(data, dateString) => {
						this.setState({
							startTime: dateString[0],
							endTime: dateString[1],
							MyDatePickerValue: data,
						});
					}}
					value={this.state.MyDatePickerValue}
				/>
				&nbsp; &nbsp;
				<Select
					style={{ width: 200 }}
					placeholder="Select a person"
					value={this.state.inputKey}
					onChange={val => {
						this.setState({ inputKey: val });
					}}
				>
					<Option value="id">user_id</Option>
					<Option value="game_nick">昵称</Option>
					<Option value="phone_number">手机号</Option>
					<Option value="role_name">账号</Option>
					<Option value="proxy_pid">所属代理</Option>
					<Option value="package_nick">所属品牌</Option>
					<Option value="regin_ip">注册IP</Option>
					<Option value="login_ip">登陆IP</Option>
				</Select>
				&nbsp; &nbsp;
				<Input
					type="text"
					placeholder="请输入关键字搜索"
					style={{ width: 150 }}
					onChange={e => {
						this.setState({ inputValue: e.target.value });
					}}
					value={this.state.inputValue}
				/>
				&nbsp; &nbsp;
				<LinkButton
					onClick={() => {
						this.setState({ current: 1 });
						this.getUsers(1, this.state.pageSize);
					}}
					size="default"
				>
					<Icon type="search" />
				</LinkButton>
			</span>
		);
		const extra = (
			<span>
				<LinkButton
					style={{ float: "right" }}
					onClick={() => {
						this.setState(init_state, () => {
							this.getUsers(1, 20);
						});
					}}
					icon="reload"
					size="default"
				/>
				<br />
				<br />
				<LinkButton
					size="default"
					style={{ float: "right" }}
					onClick={this.download}
					icon="download"
				/>
			</span>
		);

		return (
			<Card title={title} extra={extra}>
				<Mytable
					tableData={{
						data,
						count,
						columns: this.initColumns(),
						x: "max-content",
						// y: "65vh",
						current,
						pageSize,
						loading,
					}}
					paginationOnchange={(page, limit) => {
						this.getUsers(page, limit);
					}}
					setPagination={(current, pageSize) => {
						if (pageSize) {
							this.setState({ current, pageSize });
						} else {
							this.setState({ current });
						}
					}}
				/>
				{this.state.isNickShow && (
					<Modal
						title="修改昵称"
						visible={this.state.isNickShow}
						onOk={this.changeNickName}
						onCancel={() => {
							this.setState({ isNickShow: false });
						}}
					>
						<WrappedNormalLoginForm
							ref="getFormValue"
							val={this.game_nick}
							isNickModal
						/>
					</Modal>
				)}
				{this.state.isGoldShow && (
					<Modal
						title={`[用户user_id:${this.goldRecord.id}]资金变动`}
						visible={this.state.isGoldShow}
						onCancel={() => {
							this.setState({ isGoldShow: false });
						}}
						footer={[
							<Button
								key="back"
								onClick={() => {
									this.setState({ isGoldShow: false });
								}}
							>
								取消
							</Button>,
							<Button
								key="submit"
								type="primary"
								loading={this.state.changeGoldButtonLoading}
								onClick={this.handleInputThrottled}
							>
								确定
							</Button>,
						]}
					>
						<WrappedNormalLoginForm ref="getFormValue" goldRecord={this.goldRecord} />
					</Modal>
				)}
				{this.state.isPhoneNumberShow && (
					<Modal
						title="修改手机号码"
						visible={this.state.isPhoneNumberShow}
						onOk={async () => {
							console.log(
								"修改手机号码数据准备：",
								this.record.id,
								this.phone_password,
								this.new_phone_number,
							);
							if (!this.phone_password || !this.new_phone_number) {
								message.info("请输入有效值");
							} else {
								if (!/^[0-9]*$/.test(this.new_phone_number)) {
									message.info("电话号码只能为数字");
								} else {
									const res = await setGameUserPhone({
										id: this.record.id,
										password: this.phone_password,
										phone_number: this.new_phone_number,
										platform_key: 654321,
									});
									if (res.code === 200) {
										message.success(res.msg || "修改成功");
										this.setState({ isPhoneNumberShow: false });
										this.phone_password = null;
										this.new_phone_number = null;
									} else if (res.code === 404) {
										message.info(res.msg || "电话号码已存在!");
									} else {
										message.info(res.msg || JSON.stringify(res));
									}
								}
							}
						}}
						onCancel={() => {
							console.log(
								"修改手机号码数据准备：",
								this.phone_password,
								this.new_phone_number,
							);
							this.setState({ isPhoneNumberShow: false });
							this.phone_password = null;
							this.new_phone_number = null;
						}}
					>
						<div>密码：(必填，6-18位)</div>
						<Input.Password
							maxLength={18}
							onBlur={e => (this.phone_password = e.target.value)}
						/>
						<div>手机号：(必填)</div>
						<Input
							maxLength={18}
							onBlur={e => (this.new_phone_number = e.target.value)}
						/>
					</Modal>
				)}
				{this.state.isGoldDetailShow && (
					<Modal
						title={
							this.isBindInfo
								? "查看绑定信息"
								: `[用户user_id:${this.recordID}]资金明细`
						}
						visible={this.state.isGoldDetailShow}
						onCancel={() => {
							this.setState({ isGoldDetailShow: false });
						}}
						footer={null}
						width="85%"
						maskClosable={false}
						style={{ top: 10 }}
					>
						<WrappedComponent recordID={this.recordID} isBindInfo={this.isBindInfo} />
					</Modal>
				)}
				{this.state.isResetPwdShow && (
					<Modal
						title="重置密码"
						visible={this.state.isResetPwdShow}
						onOk={this.handleResetpwd}
						onCancel={() => {
							this.setState({ isResetPwdShow: false });
						}}
					>
						<span>重置密码</span>
						<Input
							value={this.state.resetpwd}
							onChange={e => this.setState({ resetpwd: e.target.value })}
						/>
					</Modal>
				)}
			</Card>
		);
	}
}
