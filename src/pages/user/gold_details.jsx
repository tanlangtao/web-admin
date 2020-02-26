import React, { Component } from "react";
import { Table, Card, Icon, message, Modal } from "antd";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import { userDetail, bindInfo, downloadGoldList, resetAlipayOrBankcard } from "../../api/index";
import { formateDate } from "../../utils/dateUtils";
class GoldDetail extends Component {
	constructor(props) {
		super(props);
		this.startTime = "";
		this.endTime = "";
		this.state = {
			data: [],
			count: 0
		};
	}
	getUsers = async (page, limit) => {
		let isBindInfo = this.props.isBindInfo;
		let id = this.props.recordID;
		const res = !isBindInfo ? await userDetail(page, limit, id) : await bindInfo(page, limit, id);
		if (!isBindInfo && res.data.account_change) {
			this.setState({
				data: res.data.account_change,
				count: res.data.count
			});
		}
		if (isBindInfo && res.data) {
			let data = JSON.parse(res.data);
			console.log(data);
			this.bindInfo = data;
			let newData = [];
			if (data.length === 1) {
				if (data[0].type === "2") {
					newData = [
						{
							...JSON.parse(data[0].info),
							created_at0: formateDate(data[0].created_at)
						}
					];
				}
				if (data[0].type === "3") {
					newData = [
						{
							...JSON.parse(data[0].info),
							created_at1: formateDate(data[0].created_at)
						}
					];
				}
			}
			if (data.length === 2) {
				if (data[0].type === "2") {
					newData = [
						{
							...JSON.parse(data[0].info),
							...JSON.parse(data[1].info),
							created_at0: formateDate(data[0].created_at),
							created_at1: formateDate(data[1].created_at)
						}
					];
				}
				if (data[0].type === "3") {
					newData = [
						{
							...JSON.parse(data[0].info),
							...JSON.parse(data[1].info),
							created_at0: formateDate(data[1].created_at),
							created_at1: formateDate(data[0].created_at)
						}
					];
				}
			}
			console.log("newData:", newData);
			this.setState({
				data: newData,
				count: 1
			});
		}
	};
	componentDidMount() {
		this.getUsers(1, 20);
	}
	onSearchData = async (page, limit) => {
		this.isOnSearch = true;
		let reqData = {
			start: this.startTime,
			end: this.endTime,
			funds_type: 0
		};
		let id = this.props.recordID;
		const res = await userDetail(page, limit, id, reqData);
		if (res.data && res.data.account_change) {
			this.setState({
				data: res.data.account_change,
				count: res.data.count
			});
		} else {
			message.info("没有数据");
		}
	};
	download = () => {
		let reqdata = {
			start_time: this.startTime,
			end_time: this.endTime,
			id: this.props.recordID
		};
		downloadGoldList(reqdata);
	};
	render() {
		// const { data } = this.props.GoldDetailRecord;
		let title;
		if (!this.props.isBindInfo) {
			title = (
				<span>
					<MyDatePicker
						handleValue={(val) => {
							let diffDays = moment(val[1]).diff(moment(val[0]), "days");
							if (diffDays > 31) {
								message.error("请选择时间范围不大于31天");
							} else {
								this.startTime = val[0];
								this.endTime = val[1];
							}
						}}
					/>
					&nbsp; &nbsp;
					<LinkButton onClick={() => this.onSearchData(1, 20)} size="default">
						<Icon type="search" />
					</LinkButton>
				</span>
			);
		}
		return (
			<Card
				title={title}
				extra={
					!this.props.isBindInfo ? (
						<LinkButton size="default" style={{ float: "right" }} onClick={this.download} icon="download" />
					) : (
						""
					)
				}
			>
				<Table
					bordered
					size="small"
					rowKey={(record, index) => `${index}`}
					dataSource={this.state.data}
					columns={this.initColumns()}
					pagination={{
						defaultPageSize: 20,
						showSizeChanger: true,
						showQuickJumper: true,
						pageSizeOptions: [ "10", "20", "30", "50" ],
						showTotal: (total, range) => `共${total}条`,
						defaultCurrent: 1,
						total: this.state.count,
						onChange: (page, pageSize) => {
							if (this.isOnSearch && this.startTime) {
								this.onSearchData(page, pageSize);
							} else {
								this.getUsers(page, pageSize);
							}
						},
						onShowSizeChange: (current, size) => {
							if (this.isOnSearch && this.startTime) {
								this.onSearchData(current, size);
							} else {
								this.getUsers(current, size);
							}
						}
					}}
				/>
			</Card>
		);
	}
	initColumns = () => {
		if (this.props.isBindInfo) {
			return [
				{
					title: "支付宝账号",
					dataIndex: "account_card",
					render: (text, record) => {
						if (text) {
							return (
								<div>
									{text[0] + text[1] + "*******" + text[text.length - 2] + text[text.length - 1]}
								</div>
							);
						} else {
							return <div />;
						}
					}
				},
				{
					title: "绑定支付宝时间",
					dataIndex: "created_at0"
				},

				{
					title: "开户人姓名",
					dataIndex: "card_name",
					render: (text, record) => {
						if (text) {
							return <div>{text[0] + "**"}</div>;
						} else {
							return <div />;
						}
					}
				},
				{
					title: "银行名称",
					dataIndex: "bank_name"
				},
				{
					title: "银行卡号",
					dataIndex: "card_num",
					render: (text, record) => {
						if (text) {
							return (
								<div>
									{text[0] +
										text[1] +
										text[2] +
										"*******" +
										text[text.length - 4] +
										text[text.length - 3] +
										text[text.length - 2] +
										text[text.length - 1]}
								</div>
							);
						} else {
							return <div />;
						}
					}
				},
				{
					title: "绑定银行卡时间",
					dataIndex: "created_at1"
				},
				{
					title: "是否灰名单",
					dataIndex: "is_gray"
				},
				{
					title: "灰名单备注",
					dataIndex: "black_remark"
				},
				{
					title: "备注人",
					dataIndex: "remark_name"
				},
				{
					title: "备注时间",
					dataIndex: "remark_at"
				},
				{
					title: "操作",
					dataIndex: "option",
					render: (record) => (
						<span>
							<LinkButton type="default" onClick={() => this.reset(record, 2)}>
								解绑支付宝
							</LinkButton>
							<LinkButton type="default" onClick={() => this.reset(record, 3)}>
								解绑银行卡
							</LinkButton>
						</span>
					)
				}
			];
		} else {
			return [
				{
					title: "user_id",
					dataIndex: "id"
				},
				{
					title: "产生来源",
					dataIndex: "pay_account_name"
				},

				{
					title: "余额(变动前)",
					dataIndex: "total_balance",
					render: (text, record) => {
						if (record) {
							return <div>{(record.balance + record.banker_balance).toFixed(6)}</div>;
						} else {
							return <div />;
						}
					}
				},
				{
					title: "变动金额",
					dataIndex: "final_pay",
					render: (text, record) => {
						return <span>{text.toFixed(6)}</span>;
					}
				},
				{
					title: "税收",
					dataIndex: "tax",
					render: (text, record) => {
						return <span>{record.final_pay > 0 ? text.toFixed(6) : ""}</span>;
					}
				},
				{
					title: "余额(变动后)",
					dataIndex: "total_final_balance",
					render: (text, record) => {
						if (record) {
							return <div>{(record.final_banker_balance + record.final_balance).toFixed(6)}</div>;
						} else {
							return <div />;
						}
					}
				},
				{
					title: "备注",
					dataIndex: "pay_reason"
				},
				{
					title: "创建时间",
					dataIndex: "create_time",
					render: formateDate
				}
			];
		}
	};
	reset = (record, type) => {
		let account_id, id;
		this.bindInfo.forEach((element) => {
			if (parseInt(element.type) === type) {
				account_id = parseInt(element.id);
				id = parseInt(element.user_id);
				Modal.confirm({
					title: "信息",
					content: "确定要解绑吗?",
					async onOk() {
						const res = await resetAlipayOrBankcard(account_id, type, id);
						if (res.status === 0) {
							message.success(res.msg);
						} else {
							message.error(res.msg);
						}
					}
				});
			} else {
				message.info("用户没有绑定信息！");
			}
		});
	};
}

export default GoldDetail;
