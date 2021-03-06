import React, { Component } from "react";
import { Card, Table, Icon, Input, Select, Popconfirm, message } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import "moment/locale/zh-cn";
import { rechargeOrder, downloadList, cancelOrder } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";

class Recharge_order extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			data: [],
			count: 0,
			pageSize: 20,
			start_time: "",
			end_time: "",
			type: "14",
			paramKey: "",
			inputParam: "",
			user_id: "",
			order_id: ""
		};
		this.inputKey = "user_id";
		this.inputValue = null;
		this.order_status = null;
	}
	getUsers = async (page, limit) => {
		const result = await rechargeOrder(
			page,
			limit,
			this.state.start_time,
			this.state.end_time,
			this.order_status,
			this.inputKey,
			this.inputValue
		);
		if (result.status === 0) {
			this.setState({
				data: result.data && result.data.list,
				count: result.data && result.data.count
			});
		}
		if (result.status === -1) {
			message.info(result.msg);
			this.setState({
				data: [],
				count: 0
			});
		}
	};
	handleChange(event) {
		this.setState({ inputParam: event.target.value });
	}
	download = () => {
		let data = {
			start_time: this.state.start_time,
			end_time: this.state.end_time,
			order_status: this.order_status,
			type: "14",
			inputParam: this.inputValue,
			paramKey: this.inputKey
		};
		downloadList(data);
	};
	componentDidMount() {
		this.getUsers(1, 20);
	}
	render() {
		return (
			<Card
				title={
					<div>
						<div>
							<MyDatePicker
								handleValue={(data, dateString) => {
									this.setState({
										start_time: dateString[0],
										end_time: dateString[1],
										MyDatePickerValue: data
									});
								}}
								value={this.state.MyDatePickerValue}
							/>
							&nbsp; &nbsp;
							<Select
								placeholder="?????????"
								style={{ width: 120 }}
								onSelect={(value) => (this.inputKey = value)}
								defaultValue="user_id"
							>
								<Select.Option value="order_id">??????id</Select.Option>
								<Select.Option value="user_id">user_id</Select.Option>
								<Select.Option value="package_nick">????????????</Select.Option>
								<Select.Option value="proxy_pid">????????????</Select.Option>
							</Select>
							&nbsp; &nbsp;
							<Input
								type="text"
								placeholder="??????????????????"
								style={{ width: 150 }}
								ref={(Input) => (this.input = Input)}
							/>
							&nbsp; &nbsp;
							<Select
								defaultValue=""
								style={{ width: 100 }}
								onSelect={(value) => (this.order_status = value)}
							>
								<Select.Option value="">??????</Select.Option>
								<Select.Option value="1">?????????</Select.Option>
								<Select.Option value="4">?????????</Select.Option>
								<Select.Option value="5">?????????</Select.Option>
								<Select.Option value="6">?????????</Select.Option>
							</Select>
							&nbsp; &nbsp;
							<LinkButton
								onClick={() => {
									this.inputValue = this.input.input.value;
									this.getUsers(1, this.state.pageSize);
								}}
								size="default"
							>
								<Icon type="search" />
							</LinkButton>
							&nbsp; &nbsp;
						</div>
					</div>
				}
				extra={
					<span>
						<LinkButton
							style={{ float: "right" }}
							onClick={() => window.location.reload()}
							icon="reload"
							size="default"
						/>
						<br />
						<br />
						<LinkButton size="default" style={{ float: "right" }} onClick={this.download} icon="download" />
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
						showTotal: (total, range) => `???${total}???`,
						defaultCurrent: 1,
						total: this.state.count,
						onChange: (page, pageSize) => {
							this.getUsers(page, pageSize);
						},
						onShowSizeChange: (current, size) => {
							this.setState({
								pageSize: size
							});
							this.getUsers(current, size);
						}
					}}
					scroll={{x: "max-content" }}
				/>
			</Card>
		);
	}
	initColumns = () => [
		{
			title: "??????ID",
			dataIndex: "order_id",
		},
		{
			title: "user_id",
			dataIndex: "user_id",
		},
		{
			title: "??????",
			dataIndex: "user_name",
		},
		{
			title: "????????????",
			dataIndex: "package_nick",
		},
		{
			title: "????????????",
			dataIndex: "proxy_user_id",
		},
		{
			title: "??????ID",
			dataIndex: "replace_id",
		},
		{
			title: "????????????",
			dataIndex: "replace_name",
		},
		{
			title: "????????????",
			dataIndex: "amount",
			sorter: (a, b) => a.amount - b.amount
		},
		{
			title: "????????????",
			dataIndex: "arrival_amount",
			sorter: (a, b) => a.arrival_amount - b.arrival_amount
		},
		{
			title: "??????",
			dataIndex: "status",
			render: (text, record, index) => {
				let word;
				switch (text) {
					case "1":
						word = "?????????";
						break;
					case "2":
						word = "?????????";
						break;
					case "3":
						word = "?????????";
						break;
					case "4":
						word = "?????????";
						break;
					case "5":
						word = "?????????";
						break;
					case "6":
						word = "?????????";
						break;
					case "7":
						word = "??????????????????";
						break;
					case "8":
						word = "????????????";
						break;
					case "9":
						word = "??????????????????";
						break;
					case "10":
						word = "????????????";
						break;
					case "11":
						word = "????????????";
						break;
					case "12":
						word = "????????????";
						break;
					default:
						word = "";
						break;
				}
				return <span>{word}</span>;
			}
		},
		{
			title: "????????????",
			dataIndex: "created_at",
			render: formateDate,
			sorter: (a, b) => a.created_at - b.created_at
		},
		{
			title: "????????????",
			dataIndex: "arrival_at",
			render: (text, record, index) => {
				if (text === "0" || !text) {
					return "";
				} else return formateDate(text);
			},
			sorter: (a, b) => a.arrival_at - b.arrival_at
		},
		{
			title: "??????",
			dataIndex: "",
			render: (text, record, index) => {
				// eslint-disable-next-line
				if (record.status == 1 || record.status == 5) {
					return (
						<Popconfirm
							title="???????????????????"
							onConfirm={() => this.handleWithdraw(record)}
							okText="??????"
							cancelText="??????"
						>
							<LinkButton>??????????????????</LinkButton>
						</Popconfirm>
					);
				} else {
					return;
				}
			}
		}
	];
	handleWithdraw = async (record) => {
		let reqData = {
			order_id: record.order_id,
			user_id: record.user_id,
			form_type: 2
		};
		const res = await cancelOrder(reqData);
		if (res.status === 0) {
			message.info(res.msg || "????????????");
			window.location.reload();
		} else {
			message.info(res.msg || "????????????");
		}
	};
}

export default Recharge_order;
