
import React from "react";

export default () => {
	return (
		<iframe
			title="sbiframe"
			src="http://aposvr.com/#/login"
			id="agiframe"
			scrolling="no"
			allowtransparency="true"
			style={{ height: "100%", width: "100%" }}
		/>
    );
};

// import React, { useReducer } from "react";

// import ExportJsonExcel from "js-export-excel";
// import { Card, message, Icon, Select, Button, Table, Input } from "antd";
// import moment from "moment";

// import { getPCCP_project, getPCCP_fundList } from "../../../api/index";
// import MyDatePicker from "../../../components/MyDatePicker";

// const { Option } = Select;

//建立table字段转化词典
// const dics = {
// 	table1 : {
// 		codetype : {
// 			digital : "数字类型",
// 			dxds    : "大小单双类型",
// 			input   : "输入类型",
// 		},
// 		modes    : {
// 			1 : "1元模式",
// 			2 : "1角模式",
// 			3 : "1分模式",
// 			4 : "1厘模式",
// 			5 : "2元模式",
// 			6 : "2角模式",
// 		},
// 	},
// };
// const init_state = {
// 	data              : [],
// 	count             : 0,
// 	resetpwd          : "",
// 	start_time        : null,
// 	end_time          : null,
// 	gametype          : undefined,
// 	MyDatePickerValue : null,
// 	tableType         : 1,
// 	type              : undefined,
// 	key               : undefined,
// 	value             : null,
// 	method_lotteryid  : null,
// 	issue_lotteryid   : null,
// 	issue_methodid    : null,
// };
// function reducer(state, action) {
// 	return { ...state, ...action };
// }

// export default () => {
// 	const [ state, dispatch ] = useReducer(reducer, init_state);

// 	let fetchData = async (page) => {
// 		let { key, value, method_lotteryid, issue_lotteryid, issue_methodid } = state;
// 		let res;
// 		if (state.tableType === 1) {
// 			let filter_string = "";
// 			if (key) {
// 				filter_string = `&${key}=${value}`;
// 			}
// 			if (key === "methodid") {
// 				filter_string += `&lotteryid=${method_lotteryid}`;
// 			} else if (key === "issue") {
// 				filter_string += `&lotteryid=${issue_lotteryid}&methodid=${issue_methodid}`;
// 			}
// 			res = await getPCCP_project(page, state.start_time, state.end_time, filter_string);
// 		}
// 		if (state.tableType === 2)
// 			res = await getPCCP_fundList(page, state.start_time, state.end_time, state.type);
// 		if (res.status === 0 && res.data) {
// 			dispatch({ data: res.data.list, count: parseInt(res.data.totalcount) });
// 		} else {
// 			dispatch({ data: [], count: 0 });
// 			message.info(res.msg || "无数据");
// 		}
// 	};
// 	const initColumns = () => {
// 		if (state.tableType === 1) {
// 			return [
// 				{
// 					title     : "用户名",
// 					dataIndex : "username",
// 				},
// 				{
// 					title     : "注单ID",
// 					dataIndex : "projectid",
// 				},
// 				{
// 					title     : "奖期",
// 					dataIndex : "issue",
// 				},
// 				{
// 					title     : "彩种ID",
// 					dataIndex : "lotteryid",
// 				},
// 				{
// 					title     : "彩种名称",
// 					dataIndex : "lotteryName",
// 				},
// 				{
// 					title     : "玩法ID",
// 					dataIndex : "methodid",
// 				},
// 				{
// 					title     : "玩法名称",
// 					dataIndex : "methodName",
// 				},
// 				{
// 					title     : "下注号码",
// 					dataIndex : "code",
// 				},
// 				{
// 					title     : "下注号码类型",
// 					dataIndex : "codetype",
// 					render    : (text) => dics.table1.codetype[text],
// 				},
// 				{
// 					title     : "总金额",
// 					dataIndex : "totalprice",
// 				},
// 				{
// 					title     : "投注金额模式",
// 					dataIndex : "modes",
// 					render    : (text) => dics.table1.modes[text],
// 				},
// 				{
// 					title     : "奖金",
// 					dataIndex : "bonus",
// 				},

// 				{
// 					title     : "是否中奖",
// 					dataIndex : "isgetprize",
// 					render    : (text, record, index) => {
// 						let restext = "";
// 						switch (text) {
// 							case 0:
// 								restext = "未处理";
// 								break;
// 							case 1:
// 								restext = "中奖";
// 								break;
// 							case 2:
// 								restext = "未中奖";
// 								break;
// 							default:
// 								break;
// 						}
// 						return <div>{restext}</div>;
// 					},
// 				},
// 				{
// 					title     : "是否撤单",
// 					dataIndex : "iscannel",
// 					render    : (text, record, index) => {
// 						let restext = "";
// 						switch (text) {
// 							case 0:
// 								restext = "未撤单";
// 								break;
// 							case 1:
// 								restext = "用户撤单";
// 								break;
// 							case 2:
// 								restext = "未中奖";
// 								break;
// 							case 3:
// 								restext = "系统后台撤单";
// 								break;
// 							default:
// 								break;
// 						}
// 						return <div>{restext}</div>;
// 					},
// 				},

// 				{
// 					title     : "投注时间",
// 					dataIndex : "writetime",
// 				},
// 				{
// 					title     : "投注设备",
// 					dataIndex : "devicetype",
// 					render    : (text, record, index) => {
// 						let restext = "";
// 						switch (text) {
// 							case 0:
// 								restext = "pc web 端";
// 								break;
// 							case 1:
// 								restext = "移动手机端";
// 								break;
// 							default:
// 								break;
// 						}
// 						return <div>{restext}</div>;
// 					},
// 				},
// 				// {
// 				//     title: "操作",
// 				//     dataIndex: "",
// 				//     render: (text, record, index) => {
// 				//         return (
// 				//             <Popconfirm
// 				//                 title="确定要删除吗?"
// 				//                 onConfirm={() => deleteIPconfig(record._id)}
// 				//                 okText="确定"
// 				//                 cancelText="取消"
// 				//             >
// 				//                 <LinkButton type="danger" size="small">
// 				//                     删除
// 				//         </LinkButton>
// 				//             </Popconfirm>
// 				//         );
// 				//     }
// 				// },
// 			];
// 		} else {
// 			return [
// 				{
// 					title     : "用户名",
// 					dataIndex : "username",
// 				},
// 				{
// 					title     : "账变ID",
// 					dataIndex : "entry",
// 				},
// 				{
// 					title     : "game游戏类型",
// 					dataIndex : "ordertypeid",
// 					render    : (text, record, index) => {
// 						let restext = "";
// 						switch (text) {
// 							case 3:
// 								restext = "[-]加入游戏";
// 								break;
// 							case 4:
// 								restext = "[+]投注返点";
// 								break;
// 							case 5:
// 								restext = "[+]奖金派送";
// 								break;
// 							case 6:
// 								restext = "6[-]追号扣款";
// 								break;
// 							case 7:
// 								restext = "[+]当期追号返款";
// 								break;
// 							case 8:
// 								restext = "[-]游戏扣款";
// 								break;
// 							case 9:
// 								restext = "[+]撤单返款";
// 								break;
// 							case 11:
// 								restext = "[-]撤销返点";
// 								break;
// 							case 12:
// 								restext = "[-]撤销派奖";
// 								break;
// 							case 170:
// 								restext = "[+]转入平台";
// 								break;
// 							case 171:
// 								restext = "[-]转出平台";
// 								break;
// 							default:
// 								break;
// 						}
// 						return <div>{restext}</div>;
// 					},
// 				},
// 				{
// 					title     : "变动前金额",
// 					dataIndex : "prechannel",
// 				},
// 				{
// 					title     : "变动前可用余额",
// 					dataIndex : "preavailable",
// 				},
// 				{
// 					title     : "变动前冻结余额",
// 					dataIndex : "prehold",
// 				},
// 				{
// 					title     : "账变金额",
// 					dataIndex : "amount",
// 				},
// 				{
// 					title     : "变动后金额",
// 					dataIndex : "channelbalance",
// 				},
// 				{
// 					title     : "变动后可用余额",
// 					dataIndex : "availablebalance",
// 				},
// 				{
// 					title     : "变动后冻结余额",
// 					dataIndex : "holdbalance",
// 				},
// 				{
// 					title     : "账变时间",
// 					dataIndex : "writetime",
// 				},
// 			];
// 		}
// 	};
// 	const downloadExcel = () => {
// 		let { start, end } = { start: state.start_time, end: state.end_time };
// 		let option = {};
// 		let dataTable = [];
// 		let columns = initColumns();
// 		state.data.forEach((ele) => {
// 			let obj = {};
// 			columns.forEach((item) => {
// 				obj[item.title] = ele[item.dataIndex];
// 				if (state.tableType === 1) {
// 					if (item.dataIndex === "isgetprize") {
// 						switch (ele[item.dataIndex]) {
// 							case 0:
// 								obj[item.title] = "未处理";
// 								break;
// 							case 1:
// 								obj[item.title] = "中奖";
// 								break;
// 							case 2:
// 								obj[item.title] = "未中奖";
// 								break;
// 							default:
// 								break;
// 						}
// 					}
// 					if (item.dataIndex === "iscannel") {
// 						switch (ele[item.dataIndex]) {
// 							case 0:
// 								obj[item.title] = "未撤单";
// 								break;
// 							case 1:
// 								obj[item.title] = "用户撤单";
// 								break;
// 							case 2:
// 								obj[item.title] = "未中奖";
// 								break;
// 							case 3:
// 								obj[item.title] = "系统后台撤单";
// 								break;
// 							default:
// 								break;
// 						}
// 					}
// 					//循环dics
// 					for (const key in dics.table1) {
// 						if (item.dataIndex === key) {
// 							obj[item.title] = dics.table1[key][ele[item.dataIndex]];
// 						}
// 					}
// 					if (item.dataIndex === "devicetype") {
// 						switch (ele[item.dataIndex]) {
// 							case 0:
// 								obj[item.title] = "pc web 端";
// 								break;
// 							case 1:
// 								obj[item.title] = "移动手机端";
// 								break;
// 							default:
// 								break;
// 						}
// 					}
// 				}
// 				if (state.tableType === 2) {
// 					if (item.dataIndex === "ordertypeid") {
// 						let restext = "";
// 						switch (ele[item.dataIndex]) {
// 							case 3:
// 								restext = "[-]加入游戏";
// 								break;
// 							case 4:
// 								restext = "[+]投注返点";
// 								break;
// 							case 5:
// 								restext = "[+]奖金派送";
// 								break;
// 							case 6:
// 								restext = "6[-]追号扣款";
// 								break;
// 							case 7:
// 								restext = "[+]当期追号返款";
// 								break;
// 							case 8:
// 								restext = "[-]游戏扣款";
// 								break;
// 							case 9:
// 								restext = "[+]撤单返款";
// 								break;
// 							case 11:
// 								restext = "[-]撤销返点";
// 								break;
// 							case 12:
// 								restext = "[-]撤销派奖";
// 								break;
// 							case 170:
// 								restext = "[+]转入平台";
// 								break;
// 							case 171:
// 								restext = "[-]转出平台";
// 								break;
// 							default:
// 								break;
// 						}
// 						obj[item.title] = restext;
// 					}
// 				}
// 			});
// 			dataTable.push(obj);
// 		});
// 		console.log(dataTable);
// 		let sheetFilter = [];
// 		columns.forEach((item) => {
// 			if (item.title && item.dataIndex) {
// 				sheetFilter.push(item.title);
// 			}
// 		});
// 		let type = state.tableType === 1 ? "投注记录" : "账变记录";
// 		option.fileName = `${start};${end};${type}数据`;
// 		option.datas = [
// 			{
// 				sheetData   : dataTable,
// 				sheetName   : "sheet",
// 				sheetFilter : sheetFilter,
// 				sheetHeader : sheetFilter,
// 			},
// 		];
// 		var toExcel = new ExportJsonExcel(option); //new
// 		toExcel.saveExcel();
// 	};
// 	const title = (
// 		<div>
// 			<div>
// 				<Select
// 					style={{ width: 150 }}
// 					defaultValue={1}
// 					onChange={(val) => {
// 						dispatch({ tableType: val, data: [] });
// 					}}
// 				>
// 					<Option value={1}>投注记录</Option>
// 					<Option value={2}>账变记录</Option>
// 				</Select>
// 				&nbsp;&nbsp;&nbsp;&nbsp;
// 				{state.tableType === 2 && (
// 					<Select
// 						style={{ width: 100 }}
// 						placeholder="类型"
// 						value={state.type}
// 						onChange={(val) => {
// 							dispatch({ type: val });
// 						}}
// 					>
// 						<Option value="game">游戏</Option>
// 						<Option value="fund">资金</Option>
// 					</Select>
// 				)}
// 				&nbsp;&nbsp;&nbsp;&nbsp;
// 				<MyDatePicker
// 					handleValue={(data, dateString) => {
// 						if (data && data.length !== 0) {
// 							dispatch({
// 								start_time : moment(data[0].valueOf()).format(
// 									"YYYY-MM-DD HH:mm:ss",
// 								),
// 								end_time   : moment(data[1].valueOf() - 1).format(
// 									"YYYY-MM-DD HH:mm:ss",
// 								),
// 								// MyDatePickerValue: data
// 							});
// 						} else {
// 							dispatch({
// 								start_time : null,
// 								end_time   : null,
// 							});
// 						}
// 					}}
// 					// value={state.MyDatePickerValue}
// 				/>
// 				&nbsp;&nbsp;&nbsp;&nbsp;
// 				<Button
// 					type="primary"
// 					onClick={() => {
// 						fetchData(1);
// 					}}
// 				>
// 					<Icon type="search" />
// 				</Button>
// 			</div>
// 			{state.tableType === 1 && (
// 				<div style={{ marginTop: 10 }}>
// 					<Select
// 						style={{ width: 150 }}
// 						placeholder="查询字段"
// 						value={state.key}
// 						onChange={(val) => {
// 							dispatch({ key: val });
// 						}}
// 					>
// 						<Option value="projectid">注单ID</Option>
// 						<Option value="methodid">玩法ID </Option>
// 						<Option value="issue">奖期</Option>
// 						{/* <Option value="lotteryid">彩种ID</Option> */}
// 					</Select>
// 					&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
// 					<Input
// 						style={{ width: 150 }}
// 						placeholder="请输入关键字"
// 						value={state.value}
// 						onChange={(e) => dispatch({ value: e.target.value })}
// 					/>
// 					&nbsp;&nbsp;&nbsp;&nbsp;
// 					{state.key === "methodid" && (
// 						<Input
// 							style={{ width: 150 }}
// 							placeholder="请输入彩种id"
// 							value={state.method_lotteryid}
// 							onChange={(e) => dispatch({ method_lotteryid: e.target.value })}
// 						/>
// 					)}
// 					{state.key === "issue" && (
// 						<React.Fragment>
// 							<Input
// 								style={{ width: 150 }}
// 								placeholder="请输入彩种id"
// 								value={state.issue_lotteryid}
// 								onChange={(e) => dispatch({ issue_lotteryid: e.target.value })}
// 							/>
// 							&nbsp;&nbsp;&nbsp;&nbsp;
// 							<Input
// 								style={{ width: 150 }}
// 								placeholder="请输入玩法id"
// 								value={state.issue_methodid}
// 								onChange={(e) => dispatch({ issue_methodid: e.target.value })}
// 							/>
// 						</React.Fragment>
// 					)}
// 					<div style={{ color: "#aaa", fontSize: 12, marginLeft: 10, marginTop: 10 }}>
// 						*按玩法ID查询必须带彩种id &nbsp;&nbsp;*按奖期查询必须带彩种id和玩法id
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);

// 	return (
// 		<Card
// 			title={title}
// 			extra={
// 				<Button
// 					type="primary"
// 					onClick={() => {
// 						downloadExcel();
// 					}}
// 				>
// 					导出当前页数据
// 				</Button>
// 			}
// 		>
// 			<Table
// 				bordered
// 				size="small"
// 				rowKey={(record, index) => `${index}`}
// 				dataSource={state.data}
// 				columns={initColumns()}
// 				pagination={{
// 					defaultPageSize : 100,
// 					showQuickJumper : true,
// 					showTotal       : (total, range) => `共${total}条`,
// 					defaultCurrent  : 1,
// 					total           : state.count,
// 					onChange        : (page, pageSize) => {
// 						fetchData(page);
// 					},
// 				}}
// 			/>
// 		</Card>
// 	);
// };
