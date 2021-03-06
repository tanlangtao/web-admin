import React, { Component } from "react";

import { Card, Table, Modal, message, Icon, Input, Select, Popover } from "antd";
import "moment/locale/zh-cn";

import LinkButton from "../../../components/link-button/index";
import riskcontrolfn from "../../../components/riskcontrol";
import { formateDate } from "../../../utils/dateUtils";
import MyDatePicker from "../../../components/MyDatePicker";
import {
	withDraw,
	downloadWithdrawList,
	userDetail,
	reviewInfo,
	remarkInfo,
	auditOrder,
} from "../../../api";
import WrappedComponent from "./details";
import WrappedEdit from "./edit";
import { GoldDetailorRiskControlSUMdata } from "../../../api/index";
import GoldDetailorRiskControl from "../../../components/golddetailorRiskcontrol";

class Daiti extends Component {
	constructor(props) {
		super(props);
		this.reqData = {
			start_time: "",
			end_time: "",
			order_status: null,
			type: "3",
		};
		this.inputKey = "user_id";
		this.inputValue = null;
		this.index = null;
		this.state = {
			data: [],
			count: 0,
			page: 1,
			pageSize: 20,
			isBindInfoShow: false,
			isGoldDetailShow: false,
			isEditShow: false,
			goldDetail_data: [],
			goldDetail_count: 0,
			goldDetail_sumData: null,
		};
	}
	getUsers = async (page, pageSize, reqData) => {
		const result = await withDraw(page, pageSize, reqData);
		if (result.status === 0) {
			this.setState({
				data: result.data && result.data.list,
				count: parseInt(result.data && result.data.count),
			});
		}
		if (result.status === -1) {
			this.setState({
				data: [],
				count: 0,
			});
		}
	};
	onSearchData = (page, limit) => {
		//处理要发送的数据
		let reqData = {
			flag: 1,
			...this.reqData,
		};
		if (this.inputKey) {
			reqData[this.inputKey] = this.inputValue;
		}
		this.getUsers(page, limit, reqData);
	};
	onAfterCloseSearchData = async () => {
		let index = this.index,
			previousCount = this.state.count,
			newCount = 0;
		let reqData = {
			flag: 3,
			...this.reqData,
		};
		if (this.inputKey === "1" || this.inputKey === "2") {
			reqData.time_type = this.inputKey;
		} else if (this.inputKey) {
			if (this.inputKey === "user_id") {
				reqData[this.inputKey] = this.inputValue;
			} else {
				reqData[this.inputKey] = this.inputValue;
			}
		}
		const result = await withDraw(1, 20, reqData);
		if (result.status === 0) {
			newCount = parseInt(result.data && result.data.count);
			if (newCount - previousCount + index < this.state.pageSize) {
				this.getUsers(this.state.page, this.state.pageSize, reqData);
			} else {
				this.setState({
					page:
						this.state.page +
						parseInt((newCount - previousCount + index) / this.state.pageSize),
				});
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				this.getUsers(
					this.state.page +
						parseInt((newCount - previousCount + index) / this.state.pageSize),
					this.state.pageSize,
					reqData,
				);
			}
		}
	};
	download = () => {
		let data = {
			flag: 1,
			...this.reqData,
			inputValue: this.inputValue,
			inputKey: this.inputKey,
		};
		downloadWithdrawList(data);
	};
	componentDidMount() {
		this.getUsers(1, 20, { flag: 1, type: "3" });
	}
	render() {
		return (
			<Card
				title={
					<div>
						<MyDatePicker
							handleValue={(data, val) => {
								this.reqData.start_time = val[0];
								this.reqData.end_time = val[1];
							}}
						/>
						&nbsp; &nbsp;
						<Select
							placeholder="请选择"
							style={{ width: 150 }}
							onSelect={value => (this.inputKey = value)}
							defaultValue="user_id"
						>
							<Select.Option value="order_id">订单id</Select.Option>
							<Select.Option value="user_id">user_id</Select.Option>
							<Select.Option value="replace_id">代提ID</Select.Option>
							<Select.Option value="package_nick">所属品牌</Select.Option>
							<Select.Option value="1">创建时间</Select.Option>
							<Select.Option value="2">到账时间</Select.Option>
						</Select>
						&nbsp; &nbsp;
						<Input
							type="text"
							placeholder="请输入关键字"
							style={{ width: 150 }}
							onChange={e => (this.inputValue = e.target.value)}
						/>
						&nbsp; &nbsp;
						<Select
							defaultValue=""
							style={{ width: 150 }}
							onSelect={value => (this.reqData.order_status = value)}
						>
							<Select.Option value="">订单状态</Select.Option>
							<Select.Option value="1">待审核</Select.Option>
							<Select.Option value="2">处理中</Select.Option>
							<Select.Option value="3">已提交</Select.Option>
							<Select.Option value="4">已成功</Select.Option>
							<Select.Option value="5">已失败</Select.Option>
						</Select>
						&nbsp; &nbsp;
						<LinkButton
							onClick={() => this.onSearchData(this.state.page, this.state.pageSize)}
							size="default"
						>
							<Icon type="search" />
						</LinkButton>
					</div>
				}
				extra={
					<span>
						<LinkButton
							style={{ float: "right" }}
							onClick={() => {
								window.location.reload();
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
				}
			>
				<Table
					bordered
					size="small"
					rowKey="id"
					dataSource={this.state.data}
					columns={this.initColumns()}
					pagination={{
						defaultPageSize: this.state.pageSize,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) => `共${total}条`,
						defaultCurrent: 1,
						total: this.state.count,
						onChange: (page, pageSize) => {
							this.setState({
								page,
							});
							this.onSearchData(page, pageSize);
						},
						onShowSizeChange: (current, size) => {
							this.setState({
								pageSize: size,
							});
							this.onSearchData(current, size);
						},
					}}
					scroll={{ x: "max-content" }}
				/>
				{this.state.isDetailShow && (
					<Modal
						title={this.action === "check" ? "审核信息" : "运营备注"}
						visible={this.state.isDetailShow}
						onCancel={() => {
							this.setState({ isDetailShow: false });
						}}
						footer={null}
						width="70%"
					>
						<WrappedComponent detailRecord={this.detailRecord} action={this.action} />
					</Modal>
				)}
				{this.state.isGoldDetailShow && (
					<Modal
						title="资金明细"
						visible={this.state.isGoldDetailShow}
						onCancel={() => {
							this.setState({ isGoldDetailShow: false });
						}}
						footer={null}
						width="70%"
					>
						<GoldDetailorRiskControl
							goldDetailData={{
								data: this.state.goldDetail_data,
								count: this.state.goldDetail_count,
								sumData: this.state.goldDetail_sumData,
							}}
							tableOnchange={(page, pageSize) => {
								this.getGoldDetail(page, pageSize);
							}}
							tableOnShowSizeChange={(current, size) => {
								this.getGoldDetail(current, size);
							}}
						/>
					</Modal>
				)}

				{this.state.isEditShow && (
					<Modal
						title="编辑"
						visible={this.state.isEditShow}
						onCancel={() => {
							this.setState({ isEditShow: false });
						}}
						footer={null}
						width="50%"
					>
						<WrappedEdit
							editData={this.editData}
							onclose={() => {
								this.setState({ isEditShow: false });
								this.onAfterCloseSearchData();
							}}
						/>
					</Modal>
				)}
			</Card>
		);
	}
	initColumns = () => [
		{
			title: "操作",
			dataIndex: "",
			render: (text, record, index) => (
				<span>
					<LinkButton onClick={() => this.edit(record, index)}>编辑</LinkButton>
				</span>
			),
		},

		{
			title: "状态",
			dataIndex: "status",
			render: (text, record, index) => {
				let word;
				switch (text) {
					case "1":
						word = "待审核";
						break;
					case "2":
						word = "处理中";
						break;
					case "3":
						word = "已提交";
						break;
					case "4":
						word = "已成功";
						break;
					case "5":
						word = "已失败";
						break;
					default:
						word = "";
						break;
				}
				return <span>{word}</span>;
			},
		},
		{
			title: "风控",
			dataIndex: "",
			render: (text, record) => (
				<span>
					<LinkButton
						onClick={() => {
							riskcontrolfn(record);
						}}
						type="default"
					>
						风控
					</LinkButton>
				</span>
			),
		},
		{
			title: "审核详情",
			dataIndex: "",
			render: record => (
				<span>
					<LinkButton onClick={() => this.getDetail(record, "check")} type="default">
						查看
					</LinkButton>
				</span>
			),
		},
		{
			title: "订单ID",
			dataIndex: "order_id",
		},
		{
			title: "user_id",
			dataIndex: "user_id",
		},
		{
			title: "昵称",
			dataIndex: "user_name",
		},
		{
			title: "所属品牌",
			dataIndex: "package_nick",
		},
		{
			title: "所属代理",
			dataIndex: "proxy_user_id",
		},
		{
			title: "下单金额",
			dataIndex: "amount",
			sorter: (a, b) => a.amount - b.amount,
		},
		{
			title: "实际费率",
			dataIndex: "platform_rate",
		},
		{
			title: "到账金额",
			dataIndex: "arrival_amount",
			sorter: (a, b) => a.arrival_amount - b.arrival_amount,
		},
		{
			title: "兑换方式",
			dataIndex: "order_type",
		},
		{
			title: "兑换账号",
			dataIndex: "pay_account",
		},
		{
			title: "账号名称",
			dataIndex: "pay_name",
		},

		{
			title: "代提ID",
			dataIndex: "replace_id",
		},
		{
			title: "创建时间",
			dataIndex: "created_at",
			render: formateDate,
			sorter: (a, b) => a.created_at - b.created_at,
		},
		{
			title: "到账时间",
			dataIndex: "arrival_at",
			render: (text, record, index) => {
				if (text === "0" || !text) {
					return "";
				} else return formateDate(text);
			},
			sorter: (a, b) => a.arrival_at - b.arrival_at,
		},

		{
			title: "备注内容",
			dataIndex: "",
			render: record => (
				<span>
					<Popover
						content={record.user_remark}
						title={record.user_id + "用户备注"}
						trigger="click"
					>
						<LinkButton type="default">用户备注</LinkButton>
					</Popover>
					<LinkButton
						onClick={() => this.getDetail(record, "operatorRemark")}
						type="default"
					>
						运营备注
					</LinkButton>
				</span>
			),
		},
	];
	getgetGoldDetailSumData = async () => {
		const res = await GoldDetailorRiskControlSUMdata(this.user_id);
		if (res.data) {
			this.setState({
				goldDetail_sumData: res.data,
			});
		} else {
			message.info(res.msg || "请求合计数据失败");
		}
	};
	getGoldDetail = async (page, limit) => {
		this.setState({ isGoldDetailShow: true });
		const res = await userDetail(page, limit, this.user_id);
		if (res.status === 0) {
			this.setState({
				goldDetail_data: res.data.account_change || [],
				goldDetail_count: res.data.count,
			});
		} else {
			message.info(res.msg || "请求表格数据失败");
		}
	};
	getDetail = async (record, action) => {
		this.action = action;
		this.detailRecord = {
			data: [],
			count: 0,
			id: record.user_id,
		};
		const res =
			action === "check"
				? await reviewInfo(1, 20, record.order_id)
				: await remarkInfo(1, 20, record.order_id);
		if (res.data && action !== "risk") {
			this.detailRecord.data = res.data.list;
			this.detailRecord.count = res.data.count;
		}
		this.setState({ isDetailShow: true });
	};
	edit = async (record, index) => {
		this.index = index;
		let reqData = {
			flag: 1,
			type: "3",
			order_id: record.order_id,
		};
		const res = await auditOrder(reqData);
		if (res.status === 0 && res.data && res.data.list) {
			this.editData = res.data && res.data.list[0];
			this.setState({ isEditShow: true });
		} else {
			message.info(res.msg || "操作失败");
		}
	};
}

export default Daiti;
