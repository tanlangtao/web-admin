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

	const customer_service_type_list = [
		{ value: 1, word: "充值未到账" },
		{ value: 2, word: "兑换未到账" },
		{ value: 3, word: "活动问题" },
		{ value: 4, word: "其 他" },
	];
	const ref = useRef({ field: {} });
	let { buttonStatus, search_value, modaltitle } = ref.current;
	let { content, customer_service_type, key_id } = ref.current.field;
	// console.log(ref.current);
	const fetchData = async (page, limit, search_data) => {
		const res = await IMsystem("getQuickReplyList", {
			skip: (page - 1) * limit,
			limit,
			customer_service_type: search_data,
		});
		setTable({ data: res.data || [], count: res.count || 0, current: page });
		if (res.code === 200) {
			message.success("更新列表成功");
		} else {
			message.info(res.msg || JSON.stringify(res));
		}
	};
	useEffect(() => {
		fetchData(1, 20);
	}, []);

	const initColumns = [
		{
			title: "分类",
			dataIndex: "customer_service_type",
			render: text =>
				customer_service_type_list.find(ele => ele.value === parseInt(text))?.word,
		},
		{
			title: "快捷回复内容",
			dataIndex: "content",
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
	// const onSearchButtonHandled = async value => {
	// 	if (!value) {
	// 		message.info("请输入user_id");
	// 		return;
	// 	}
	// 	ref.current.search_value = value;
	// 	fetchData(1, 20, value);
	// };
	const onAddButtonHandled = (buttonStatus, record) => {
		ref.current.buttonStatus = buttonStatus;
		if (record) ref.current.field = record;
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
		if (!content || !customer_service_type) {
			message.info("所有输入项为必填");
			return;
		}
		let res;
		if (buttonStatus === 1) {
			res = await IMsystem("addQuickReply", { content, customer_service_type }, "POST");
		} else if (buttonStatus === 2) {
			res = await IMsystem(
				"uptQuickReply",
				{ key_id, content, customer_service_type },
				"POST",
			);
		} else if (buttonStatus === 3) {
			res = await IMsystem("delQuickReply", { key_id }, "POST");
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
					{/* <Input.Search
						style={{ width: 200 }}
						placeholder="请输入客服账号"
						enterButton
						onSearch={value => onSearchButtonHandled(value)}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
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
					title={modaltitle}
					visible={is_modal_show}
					onCancel={() => setis_modal_show(false)}
					footer={null}
					maskClosable={false}
				>
					<Span>内容:</Span>
					<Input.TextArea
						type="text"
						style={{ width: "80%" }}
						placeholder="请输入快捷回复内容"
						defaultValue={buttonStatus !== 1 ? content : ""}
						onChange={e => (content = e.target.value)}
						disabled={buttonStatus === 3}
					/>
					<br />
					<br />
					<Span>类型:</Span>
					<Select
						style={{ width: 120 }}
						placeholder="选择类型"
						defaultValue={
							buttonStatus !== 1 ? parseInt(customer_service_type) : undefined
						}
						onChange={value => (customer_service_type = value)}
						disabled={buttonStatus === 3}
					>
						{customer_service_type_list.map((ele, i) => (
							<Select.Option key={i} value={ele.value}>
								{ele.word}
							</Select.Option>
						))}
					</Select>

					<div style={{ textAlign: "right", paddingRight: 10 }}>
						<Button type="primary" onClick={onSubmitHandled}>
							{buttonStatus !== 3 ? "提交" : "确定删除"}
						</Button>
					</div>
				</Modal>
			)}
		</Card>
	);
};
