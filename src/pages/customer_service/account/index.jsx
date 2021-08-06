import React, { useRef, useState, useEffect } from "react";

import { Table, message, Card, Input, Button, Modal, Select } from "antd";
import styled from "styled-components";

import { IMsystem } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button/index";

const Span = styled.span`
		width: 80px;
		display: inline-block;
		text-align: right;
		padding-right: 20px;
	`;
export default () => {
	const [table, setTable] = useState({ data: [], count: 0, current: 1 });
	const [is_modal_show, setis_modal_show] = useState(false);
	const [is_history_show, setis_history_show] = useState(false);

	const customer_service_type_list = [
		{ value: 1, word: "充值未到账" },
		{ value: 2, word: "兑换未到账" },
		{ value: 3, word: "活动问题" },
		{ value: 4, word: "其 他" },
	];
	const ref = useRef({});
	const fetchData = async (page, limit, user_id) => {
		const res = await IMsystem("getCustomerServiceList", {
			skip: (page - 1) * limit,
			limit,
			user_id,
		});
		setTable({ data: res.data || [], count: res.count || 0, current: page });
		if (res.code === 200) {
			message.success(res.msg);
		} else {
			message.info(res.msg || JSON.stringify(res));
		}
	};
	useEffect(() => {
		fetchData(1, 20);
	}, []);

	const initColumns = [
		{
			title: "客服账号id",
			dataIndex: "user_id",
		},
		{
			title: "昵称",
			dataIndex: "nick_name",
		},
		{
			title: "客服类型",
			dataIndex: "customer_service_type",
			render: text =>
				customer_service_type_list.find(ele => ele.value === parseInt(text))?.word,
		},
		{
			title: "创建时间",
			dataIndex: "create_time",
			render: text => formateDate(text / 1000),
		},

		{
			title: "修改时间",
			dataIndex: "update_time",
			render: text => formateDate(text / 1000),
		},
		{
			title: "操作",
			dataIndex: "",
			render: (text, record) => {
				return (
					<>
						<LinkButton onClick={() => onAddButtonHandled(2, record)}>编辑</LinkButton>
						<LinkButton type="danger" onClick={() => onAddButtonHandled(3, record)}>
							删除
						</LinkButton>
					</>
				);
			},
		},
	];
	const onSearchButtonHandled = async value => {
		if (!value) {
			message.info("请输入user_id");
			return;
		}
		ref.current.search_value = value;
		fetchData(1, 20, value);
	};
	const onAddButtonHandled = (buttonStatus, record) => {
		ref.current.buttonStatus = buttonStatus;
		ref.current.user_id = record?.user_id;
		ref.current.nick_name = record?.nick_name;
		ref.current.customer_service_type = record?.customer_service_type;
		ref.current.key_id = record?.key_id;
		switch (buttonStatus) {
			case 1:
				ref.current.modaltitle = "添加";
				break;
			case 2:
				ref.current.modaltitle = "编辑";
				break;
			case 3:
				ref.current.modaltitle = "确定要删除吗?";
				break;
			default:
				break;
		}
		setis_modal_show(true);
	};
	const onSubmitHandled = async () => {
		const {
			key_id,
			user_id,
			nick_name,
			customer_service_type,
			buttonStatus,
			search_value,
		} = ref.current;
		if (!user_id || !nick_name || !customer_service_type) {
			message.info("所有输入项为必填");
			return;
		}
		let res;
		if (buttonStatus === 1) {
			res = await IMsystem(
				"addCustomerService",
				{ user_id, nick_name, customer_service_type },
				"POST",
			);
		} else if (buttonStatus === 2) {
			res = await IMsystem(
				"uptCustomerService",
				{ key_id, user_id, nick_name, customer_service_type },
				"POST",
			);
		} else if (buttonStatus === 3) {
			res = await IMsystem("delCustomerService", { key_id }, "POST");
		}
		if (res.code === 200) {
			message.success(res.msg);
			fetchData(1, 20, search_value);
			setis_modal_show(false);
		} else {
			message.info(res.msg || JSON.stringify(res));
		}
	};
	return (
		<Card
			title={
				<div>
					<Input.Search
						style={{ width: 200 }}
						placeholder="请输入客服账号"
						enterButton
						onSearch={value => onSearchButtonHandled(value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => onAddButtonHandled(1)}>
						添加
					</Button>
				</div>
			}
			extra={
				<Button
					type="primary"
					style={{ float: "right" }}
					onClick={() => fetchData(1, 20)}
					icon="reload"
					size="default"
				/>
			}
		>
			<Table
				bordered
				rowKey={(record, index) => `${index}`}
				dataSource={table.data}
				columns={initColumns}
				size="small"
				pagination={{
					defaultPageSize: 20,
					// showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => `共${total}条`,
					current: table.current,
					total: table.count,
					onChange: (page, pageSize) => {
						fetchData(page, pageSize);
					},
				}}
				scroll={{ x: "max-content" }}
			/>
			{is_modal_show && (
				<Modal
					title={ref.current.modaltitle}
					visible={is_modal_show}
					onCancel={() => setis_modal_show(false)}
					footer={null}
					maskClosable={false}
				>
					<Span>账号:</Span>
					<Input
						type="text"
						style={{ width: "80%" }}
						placeholder="请输入账号"
						defaultValue={ref.current.buttonStatus !== 1 ? ref.current.user_id : ""}
						disabled={ref.current.buttonStatus !== 1}
						onChange={e => (ref.current.user_id = e.target.value)}
					/>
					<br />
					<br />
					<Span>昵称:</Span>
					<Input
						type="text"
						style={{ width: "80%" }}
						placeholder="请输入昵称"
						defaultValue={ref.current.buttonStatus !== 1 ? ref.current.nick_name : ""}
						onChange={e => (ref.current.nick_name = e.target.value)}
					/>
					<br />
					<br />
					{/* <Span>是否显示:</Span>
					<Radio.Group onChange={e => (ref.current.isShow = e.target.value)}>
						<Radio value={1}>是</Radio>
						<Radio value={2}>否</Radio>
					</Radio.Group> */}
					<Span>客服类型:</Span>
					<Select
						style={{ width: 120 }}
						placeholder="选择类型"
						defaultValue={
							ref.current.buttonStatus !== 1
								? parseInt(ref.current.customer_service_type)
								: undefined
						}
						onChange={value => (ref.current.customer_service_type = value)}
					>
						{customer_service_type_list.map(ele => (
							<Select.Option value={ele.value}>{ele.word}</Select.Option>
						))}
					</Select>

					<div style={{ textAlign: "right", paddingRight: 10 }}>
						<Button type="primary" onClick={onSubmitHandled}>
							{ref.current.buttonStatus !== 3 ? "提交" : "确定删除"}
						</Button>
					</div>
				</Modal>
			)}
			{is_history_show && (
				<Modal
					title="操控详情"
					visible={is_history_show}
					onCancel={() => setis_history_show(false)}
					footer={null}
					maskClosable={false}
				>
					<Table
						bordered
						rowKey={(record, index) => `${index}`}
						dataSource={ref.current.historyData || []}
						columns={[
							{
								title: "操作人",
								dataIndex: "upd_user",
							},
							{
								title: "操作",
								dataIndex: "do_what",
							},
							{
								title: "操作时间",
								dataIndex: "updated_at",
								render: formateDate,
							},
						]}
						size="small"
						pagination={false}
						scroll={{ x: "max-content" }}
					/>
				</Modal>
			)}
		</Card>
	);
};
