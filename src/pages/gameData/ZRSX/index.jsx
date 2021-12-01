import React, { useState } from "react";

import ExportJsonExcel from "js-export-excel";
import moment from "moment";
import { Card, message, Icon, Select, Button, Table, DatePicker, TimePicker } from "antd";

import { getZRSXdata, getAGdata } from "../../../api/index";
import MyDatePicker from "../../../components/MyDatePicker";

const { Option } = Select;
// 游戏类型代码  游戏类型名称  备注
// BAC  百家乐
// CBAC  包桌百家乐
// LINK  连环百家乐
// DT  龙虎
// SHB  骰宝
// ROU  轮盘
// FT  番摊
// LBAC  竞咪百家乐
// ULPK  终极德州扑克
// SBAC  保险百家乐  在百家乐的基础上新增加
// 了不同玩法
// NN  牛牛
// BJ  Blackjack
// ZJH  扎金花
// BF  斗牛
let inputData = {
	date: null,
	start_time: null,
	end_time: null,
	gametype: undefined,
	pageSize: 20,
};
let searchData = {};
export default () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [tableType, setTableType] = useState(1);
	// 解决当用户改变输入或选择的option的时候,虽然未点击搜索按钮,但是搜索条件改变的问题
	let searchButtonOnclick = () => {
		let { date, start_time, end_time, gametype } = inputData;
		let start = start_time;
		let end = end_time;
		if (tableType === 1) {
			start = date + " " + start_time;
			end = date + " " + end_time;
			let difftime = moment(end).diff(start, "minutes");
			if (!start_time || !date || !end_time) {
				message.info("请选择时间");
				return;
			}
			if (difftime > 9 || difftime < 0) {
				message.info("请选择时间范围小于10分钟");
				return;
			}
		}
		if (!gametype) {
			message.info("请选择游戏类型");
			return;
		}
		searchData = {
			start,
			end,
			gametype,
			tableType,
		};
		fetchData(1, inputData.pageSize);
	};
	let fetchData = async (page, limit) => {
		let { start, end, gametype } = searchData;
		let res;
		if (searchData.tableType === 1) res = await getZRSXdata(page, limit, start, end, gametype);
		if (searchData.tableType === 2) res = await getAGdata(page, limit, start, end, gametype);
		if (res.status === 0 && res.data && res.data.Row) {
			setData(res.data.Row);
			setCount(parseInt(res.data.Addition.Total));
		} else {
			setData([]);
			setCount(0);
			message.info(res.msg || "无数据");
		}
	};
	//参数说明gmcode:局号
	// begintime:开始时间
	// closetime:结束时间dealer:荷官名称gametype:游戏类型shoecode:靴号
	// flag:结果状态,0 为无效 ,1 为有效bankerpoint: 庄分数，附录庄分数结果说明playerpoint: 闲分数，附录闲分数结果说明
	// cardnum:牌的张数,可用于判断百家乐的大小玩法 pair:对子结果(0 没有对子,1 庄对,2 闲对,3 庄对闲对) dragonpoint:龙点数
	// tigerpoint:虎点数
	// cardlist: 牌结果描述,格式说明请参考，附录发牌资料 cardlist 结果说明vid:视频 id
	// platformType:平台类型为 AGIN
	const initColumns = () => {
		if (tableType === 1) {
			return [
				{
					title: "局号",
					dataIndex: "GameCode",
				},
				{
					title: "开始时间",
					dataIndex: "Begintime",
				},
				{
					title: "结束时间",
					dataIndex: "Closetime",
				},
				{
					title: "荷官名称",
					dataIndex: "Dealer",
				},
				{
					title: "靴号",
					dataIndex: "Shoecode",
				},
				{
					title: "结果状态",
					dataIndex: "Flag",
					render: (text, record, index) => {
						return <div>{text === "0" ? "无效" : text === "1" ? "有效" : text}</div>;
					},
				},
				{
					title: "庄分数",
					dataIndex: "Bankerpoint",
				},
				{
					title: "闲分数",
					dataIndex: "Playerpoint",
				},
				{
					title: "牌张数",
					dataIndex: "Cardnum",
				},

				{
					title: "对子结果",
					dataIndex: "Pair",
					render: (text, record, index) => {
						let restext = "";
						switch (parseInt(text)) {
							case 0:
								restext = "没有对子";
								break;
							case 1:
								restext = "庄对";
								break;
							case 2:
								restext = "闲对";
								break;
							case 3:
								restext = "庄对闲对";
								break;
							default:
								break;
						}
						return <div>{restext}</div>;
					},
				},
				{
					title: "龙点数",
					dataIndex: "Drgonpoint",
				},
				{
					title: "虎点数",
					dataIndex: "Tigerpoint",
				},

				{
					title: "牌结果",
					dataIndex: "Cardlist",
				},
				{
					title: "视频id",
					dataIndex: "Vid",
				},
				{
					title: "平台类型",
					dataIndex: "Platformtype",
				},
				{
					title: "游戏类型",
					dataIndex: "Gametype",
					render: (text, record) =>
						text === "BAC" ? "百家乐" : text === "DT" ? "龙虎" : text,
				},
				// {
				//     title: "操作",
				//     dataIndex: "",
				//     render: (text, record, index) => {
				//         return (
				//             <Popconfirm
				//                 title="确定要删除吗?"
				//                 onConfirm={() => deleteIPconfig(record._id)}
				//                 okText="确定"
				//                 cancelText="取消"
				//             >
				//                 <LinkButton type="danger" size="small">
				//                     删除
				//         </LinkButton>
				//             </Popconfirm>
				//         );
				//     }
				// },
			];
		} else {
			//billNo:订单号
			// playName:用户名gameCode:局号
			// netAmount :派彩额度betTime:下注时间gameType:游戏类型betAmount:投注额度
			// validBetAmount:有效投注额度
			// flag : 订单状态,0 为异常(请联系客服) ,1 为已派彩, -8 为取消指定局注单, -9 为取消指定注单
			// playType:玩法类型currency :投注币种
			// tableCode :桌台号 (此處為虛擬桌號，非實際桌號。) recalcuTime:派彩时间
			// beforeCredit:余额betIP :投注 IP
			// platformType:平台类型为 AGIN
			// remark:注示
			// devicetype: 0 是 PC, 大于等于 1 是手机
			// Seat:  座位號(只顯示於遊戲類型為 BJ)
			return [
				{
					title: "订单号",
					dataIndex: "BillNo",
				},
				{
					title: "用户名",
					dataIndex: "PlayName",
				},
				{
					title: "局号",
					dataIndex: "GameCode",
				},
				{
					title: "派彩额度",
					dataIndex: "NetAmount",
				},
				{
					title: "下注时间",
					dataIndex: "BetTime",
				},
				{
					title: "游戏类型",
					dataIndex: "GameType",
				},
				{
					title: "投注额度",
					dataIndex: "BetAmount",
				},
				{
					title: "有效投注额度",
					dataIndex: "ValidBetAmount",
				},
				{
					title: "订单状态",
					dataIndex: "Flag",
					render: (text) => {
						let result = text;
						switch (parseInt(text)) {
							case 0:
								result = "异常(请联系客服)";
								break;
							case 1:
								result = "已派彩";
								break;
							case -8:
								result = "取消指定局注单";
								break;
							case -9:
								result = "取消指定注单";
								break;
							default:
								break;
						}
						return result;
					},
				},

				{
					title: "玩法类型",
					dataIndex: "PlayType",
				},
				{
					title: "投注币种",
					dataIndex: "Currency",
				},
				{
					title: "桌台号",
					dataIndex: "TableCode",
				},

				{
					title: "派彩时间",
					dataIndex: "RecalcuTime",
				},
				{
					title: "余额",
					dataIndex: "BeforeCredit",
				},
				{
					title: "投注IP",
					dataIndex: "BetIP",
				},
				{
					title: "平台类型",
					dataIndex: "PlatformType",
				},
				{
					title: "注释",
					dataIndex: "Remark",
				},
				{
					title: "设备类型",
					dataIndex: "Devicetype",
					render: (text) => (parseInt(text) === 0 ? "PC" : "手机"),
				},
				{
					title: "座位号",
					dataIndex: "Seat",
				},
			];
		}
	};

	const downloadExcel = () => {
		let { start, end } = searchData;
		let option = {};
		let dataTable = [];
		let columns = initColumns();
		data.forEach((ele) => {
			let obj = {};
			columns.forEach((item) => {
				obj[item.title] = ele[item.dataIndex];
				if (searchData.tableType === 1) {
					if (item.dataIndex === "Flag") {
						ele[item.dataIndex] === "0"
							? (obj[item.title] = "无效")
							: (obj[item.title] = "有效");
					}
					if (item.dataIndex === "Pair") {
						switch (parseInt(ele[item.dataIndex])) {
							case 0:
								obj[item.title] = "没有对子";
								break;
							case 1:
								obj[item.title] = "庄对";
								break;
							case 2:
								obj[item.title] = "闲对";
								break;
							case 3:
								obj[item.title] = "庄对闲对";
								break;
							default:
								break;
						}
					}
				}
				if (searchData.tableType === 2) {
					if (item.dataIndex === "flag") {
						switch (parseInt(ele[item.dataIndex])) {
							case 0:
								obj[item.title] = "异常(请联系客服)";
								break;
							case 1:
								obj[item.title] = "已派彩";
								break;
							case -8:
								obj[item.title] = "取消指定局注单";
								break;
							case -9:
								obj[item.title] = "取消指定注单";
								break;
							default:
								break;
						}
					}
					if (item.dataIndex === "devicetype") {
						switch (parseInt(ele[item.dataIndex])) {
							case 0:
								obj[item.title] = "PC";
								break;
							case 1:
								obj[item.title] = "手机";
								break;
							default:
								break;
						}
					}
				}
			});
			dataTable.push(obj);
		});
		console.log(dataTable);
		let sheetFilter = [];
		columns.forEach((item) => {
			if (item.title && item.dataIndex) {
				sheetFilter.push(item.title);
			}
		});
		let type = tableType === 1 ? "游戏" : "订单";
		option.fileName = `${start};${end};${searchData.gametype}${type}数据`;
		option.datas = [
			{
				sheetData: dataTable,
				sheetName: "sheet",
				sheetFilter: sheetFilter,
				sheetHeader: sheetFilter,
			},
		];
		var toExcel = new ExportJsonExcel(option); //new
		toExcel.saveExcel();
	};
	let title =
		tableType === 1 ? (
			<div>
				<div>
					<Select
						style={{ width: 100 }}
						onChange={(val) => {
							setTableType(val);
						}}
						value={tableType}
					>
						<Option value={1}>游戏结果</Option>
						<Option value={2}>查询订单</Option>
					</Select>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<DatePicker
						onChange={(date, dateString) => {
							inputData.date = dateString;
						}}
						placeholder="选择日期"
					/>
					&nbsp; &nbsp;
					<TimePicker
						onChange={(time, timeString) => {
							inputData.start_time = timeString;
						}}
						format={"HH:mm:00"}
						placeholder="开始时间"
					/>
					&nbsp; &nbsp;
					<TimePicker
						onChange={(time, timeString) => {
							inputData.end_time = timeString;
						}}
						format={"HH:mm:59"}
						placeholder="结束时间"
					/>
					&nbsp; &nbsp;
					<Select
						style={{ width: 120 }}
						placeholder="游戏类型"
						onChange={(val) => {
							inputData.gametype = val;
						}}
					>
						<Option value="BAC">BAC百家乐</Option>
						<Option value="DT">DT龙虎</Option>
					</Select>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Button
						type="primary"
						onClick={() => {
							searchButtonOnclick();
						}}
					>
						<Icon type="search" />
					</Button>
				</div>
				<div style={{ color: "#aaa", fontSize: 12, marginLeft: 10, marginTop: 10 }}>
					*请选择时间范围小于10分钟
				</div>
			</div>
		) : (
			<div>
				<Select
					style={{ width: 100 }}
					onChange={(val) => {
						setTableType(val);
					}}
					value={tableType}
				>
					<Option value={1}>游戏结果</Option>
					<Option value={2}>查询订单</Option>
				</Select>
				&nbsp;&nbsp;
				<MyDatePicker
					handleValue={(data, val) => {
						inputData.start_time = val[0];
						inputData.end_time = val[1];
					}}
				/>
				&nbsp;&nbsp;
				<Select
					style={{ width: 120 }}
					placeholder="游戏类型"
					onChange={(val) => {
						inputData.gametype = val;
					}}
				>
					<Option value="BAC">BAC百家乐</Option>
					<Option value="DT">DT龙虎</Option>
				</Select>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<Button
					type="primary"
					onClick={() => {
						searchButtonOnclick();
					}}
				>
					<Icon type="search" />
				</Button>
			</div>
		);

	return (
		<Card
			title={title}
			extra={
				<Button
					type="primary"
					onClick={() => {
						downloadExcel();
					}}
				>
					导出当前页数据
				</Button>
			}
		>
			<Table
				bordered
				size="small"
				rowKey={(record, index) => `${index}`}
				dataSource={data}
				columns={initColumns()}
				pagination={{
					defaultCurrent: 1,
					defaultPageSize: 20,
					total: count,
					showQuickJumper: true,
					showSizeChanger: true,
					pageSizeOptions: ["10", "20", "30", "50", "500"],
					showTotal: (total, range) => `共${total}条`,
					onChange: (page, pageSize) => {
						fetchData(page, pageSize);
					},
					onShowSizeChange: (current, size) => {
						inputData.pageSize = size;
						fetchData(current, size);
					},
				}}
			/>
		</Card>
	);
};
