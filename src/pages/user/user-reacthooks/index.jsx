import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Card, Modal, message, Icon, Select, Input, Popconfirm, Button } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button/index";
import {
	user_table_data,
	setGameUserNickName,
	changeGold,
	reqLoadGold,
	saveUserBlack,
	createTask,
	setCustomer,
	downloadUserList,
	setgameuserstatus
} from "../../../api/index";
import { ChangeGold } from "./ChangeGold";
import WrappedComponent from "../gold_details";
import MyDatePicker from "../../../components/MyDatePicker";
import { reverseNumber } from "../../../utils/commonFuntion";
import Mytable from "../../../components/MyTable";
import { throttle } from "../../../utils/commonFuntion";
import initcol from "./initcolumns";

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
	startTime: "",
	endTime: "",
	loading: true,
	MyDatePickerValue: null,
	inputKey: "id",
	inputValue: null,
	init: true
};
function reducer(state, action) {
	switch (action.type) {
		case "update":
			return { ...state, ...action.values };
		case "reset":
			return { ...init_state, init: !state.init };
		default:
			return state;
	}
}

// 定义 context函数，子组件层级比较深且需要使用该组件state和dispatch的时候用useContext
// export const UserContext = React.createContext();

//定义函数和render组件中使用的公共变量
let game_nick, row_id, row_index, row_record, new_nick_name, isBindInfo, moreModal;

export default function User(props) {
	const [ state, dispatch ] = useReducer(reducer, init_state);
	
	let getUsers = async (page, limit) => {
		console.log("getUsers!!");

		dispatch({
			type: "update",
			values: {
				loading: true
			}
		});
		let reqData = { page, limit };
		if (state.startTime) {
			Object.assign(reqData, {
				start: state.startTime,
				end: state.endTime
			});
		}
		if (state.inputValue) {
			Object.assign(reqData, {
				[state.inputKey]: state.inputValue
			});
		}
		const result = await user_table_data(reqData);
		if (result.status === 0) {
			const { game_user, proxy_user } = result.data;
			game_user.forEach((element) => {
				proxy_user.forEach((item) => {
					if (element.id === item.id) {
						element.proxy_nick = item.proxy_pid;
						// element.proxy_user_type = item.proxy_user_type;
					}
				});
			});
			dispatch({
				type: "update",
				values: {
					data: game_user,
					count: result.data && result.data.count,
					loading: false
				}
			});
		} else {
			message.info(result.msg || "未检索到数据");
		}
	};
	useEffect(
		() => {
			getUsers(1, 20);
		},
		[ state.init ]
	);

	//为table中的按钮点击事件做准备
	const getMoreDetail = (record) => {
		moreModal = Modal.info({
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
			)
		});
	};
	const getLoadGold = async (record) => {
		const id = record.id;
		const result = await reqLoadGold(id);
		if (result.status === 0) {
			Modal.success({
				title: "实时余额",
				// content: `用户${record.id}实时余额是 : ${reverseNumber(result.data.game_gold)}`
				content: `用户${record.id}实时余额是 : ${result.data.game_gold.toFixed(6)}`
			});
		} else {
			message.info(result.msg || JSON.stringify(result));
		}
	};
	const download = () => {
		let reqdata = {
			start_time: state.startTime,
			end_time: state.endTime,
			inputKey: state.inputKey,
			inputValue: state.inputValue
		};
		downloadUserList(reqdata);
	};

	//准备render
	// let handleInputThrottled = throttle(getUsers, 3000)
	const { data, count, current, pageSize, loading } = state;
	const functions = {
		game_nick_oncell: (record, rowIndex) => {
			return {
				onClick: (event) => {
					console.log(record);

					game_nick = record.game_nick;
					row_id = record.id;
					row_index = rowIndex;
					dispatch({
						type: "update",
						values: {
							isNickShow: true
						}
					});
				}, // 点击行
				// onDoubleClick: (event) => { },
				// onContextMenu: (event) => { },
				onMouseEnter: (event) => {
					event.target.style.cursor = "pointer";
				} // 鼠标移入行
				// onMouseLeave: (event) => { }
			};
		},
		game_gold_oncell: (record, rowIndex) => {
			return {
				onClick: (event) => {
					row_record = record;
					dispatch({
						type: "update",
						values: {
							isGoldShow: true
						}
					});
				},
				onMouseEnter: (event) => {
					event.target.style.cursor = "pointer";
				}
			};
		},
		handle_render: (record) => (
			<span>
				<LinkButton
					onClick={() => {
						isBindInfo = false;
						row_record = record;
						dispatch({
							type: "update",
							values: {
								isGoldDetailShow: true
							}
						});
					}}
					type="default"
				>
					资金明细
				</LinkButton>
				<LinkButton onClick={() => getMoreDetail(record)}>更多</LinkButton>
			</span>
		),
		checkLoad_render: (record) => (
			<span>
				<LinkButton type="default" onClick={() => getLoadGold(record)}>
					查看
				</LinkButton>
			</span>
		)
	};

	const title = (
		<span>
			<MyDatePicker
				handleValue={(data, dateString) => {
					dispatch({
						type: "update",
						values: {
							startTime: dateString[0],
							endTime: dateString[1],
							MyDatePickerValue: data
						}
					});
				}}
				value={state.MyDatePickerValue}
			/>
			&nbsp; &nbsp;
			<Select
				style={{ width: 200 }}
				placeholder="Select a person"
				value={state.inputKey}
				onChange={(val) => {
					dispatch({
						type: "update",
						values: {
							inputKey: val
						}
					});
				}}
			>
				<Option value="id">user_id</Option>
				<Option value="game_nick">昵称</Option>
				<Option value="phone_number">手机号</Option>
				<Option value="role_name">账号</Option>
				<Option value="proxy_pid">所属代理</Option>
				<Option value="package_nick">所属品牌</Option>
				<Option value="regin_ip">注册IP</Option>
			</Select>
			&nbsp; &nbsp;
			<Input
				type="text"
				placeholder="请输入关键字搜索"
				style={{ width: 150 }}
				onChange={(e) => {
					dispatch({
						type: "update",
						values: {
							inputValue: e.target.value
						}
					});
				}}
				value={state.inputValue}
			/>
			&nbsp; &nbsp;
			<LinkButton
				onClick={() => {
					dispatch({
						type: "update",
						values: {
							current: 1
						}
					});
					getUsers(1, state.pageSize);
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
					dispatch({
						type: "reset"
					});
				}}
				icon="reload"
				size="default"
			/>
			<br />
			<br />
			<LinkButton size="default" style={{ float: "right" }} onClick={download} icon="download" />
		</span>
	);

	return (
		<Card title={title} extra={extra}>
			<Mytable
				tableData={{
					data,
					count,
					columns: initcol(dispatch, functions),
					x: 2100,
					y: "65vh",
					current,
					pageSize,
					loading
				}}
				paginationOnchange={(page, limit) => {
					getUsers(page, limit);
				}}
				setPagination={(current, pageSize) => {
					if (pageSize) {
						dispatch({
							type: "update",
							values: {
								current,
								pageSize
							}
						});
					} else {
						dispatch({
							type: "update",
							values: {
								current
							}
						});
					}
				}}
			/>

			{/* 各种弹窗 */}
			{state.isNickShow && (
				<Modal
					title="修改昵称"
					visible={state.isNickShow}
					onOk={async (e) => {
						console.log("修改后的昵称：", new_nick_name);
						if (!new_nick_name || game_nick === new_nick_name) {
							message.info("请输入修改后的昵称");
						} else {
							const res = await setGameUserNickName(row_id, new_nick_name);
							if (res.status === 0) {
								message.success("修改成功");
								state.data[row_index]["game_nick"] = new_nick_name;
								dispatch({
									type: "update",
									values: {
										isNickShow: false,
										data: state.data
									}
								});
							} else {
								message.info(JSON.stringify(res));
							}
						}
					}}
					onCancel={() => {
						dispatch({
							type: "update",
							values: {
								isNickShow: false
							}
						});
					}}
				>
					<Input maxLength={16} defaultValue={game_nick} onBlur={(e) => (new_nick_name = e.target.value)} />
				</Modal>
			)}
			{state.isGoldShow && <ChangeGold state={state} dispatch={dispatch} record={row_record} />}
			{/*  <UserContext.Provider value={{ state, dispatch }}>
			</UserContext.Provider>}*/}
			{state.isGoldDetailShow && (
				<Modal
					title={isBindInfo ? "查看绑定信息" : `[用户user_id:${row_record.id}]资金明细`}
					visible={state.isGoldDetailShow}
					onCancel={() => {
						dispatch({
							type: "update",
							values: {
								isGoldDetailShow: false
							}
						});
					}}
					footer={null}
					width="80%"
				>
					<WrappedComponent recordID={row_record.id} isBindInfo={isBindInfo} />
				</Modal>
			)}
			{/* {state.isResetPwdShow && (
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
							onChange={(e) => this.setState({ resetpwd: e.target.value })}
						/>
					</Modal>
				)}  */}
		</Card>
	);
}
