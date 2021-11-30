import React, { useRef, useState, useEffect } from "react";
import { Table, message, Card, Input, Button, Modal, Select, Pagination } from "antd";
import moment from "moment";
import _ from "lodash-es";
import { IMsystem } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button/index";
import MyDatePicker from "../../../components/MyDatePicker";

export const History = () => {
	const [table, setTable] = useState({ data: [], count: 0, current: 1 });
	const [contentData, setContentData] = useState({ data: [], count: 0, current: 1 });
	const [is_modal_show, setis_modal_show] = useState(false);

	const customer_service_type_list = [
		{ value: 1, word: "充值未到账" },
		{ value: 2, word: "兑换未到账" },
		{ value: 3, word: "活动问题" },
		{ value: 4, word: "其 他" },
	];
	const ref = useRef({ field: {}, content: {}, search_key: "user_id" });
	const fetchData = async (page, limit, search_data) => {
		const res = await IMsystem("msgHistory", {
			skip: (page - 1) * limit,
			limit,
			...search_data,
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
			title: "玩家ID",
			dataIndex: "user_id",
		},
		{
			title: "所属品牌",
			dataIndex: "brand",
		},
		{
			title: "客服名称",
			dataIndex: "customer_service_id",
		},
		{
			title: "客服名称",
			dataIndex: "customer_service_name",
		},
		{
			title: "询前分类",
			dataIndex: "customer_service_type",
			render: text =>
				customer_service_type_list.find(ele => ele.value === parseInt(text))?.word,
		},
		{
			title: "进线时间",
			dataIndex: "start_time",
			render: text => formateDate(text / 1000),
		},

		{
			title: "结束时间",
			dataIndex: "end_time",
			render: text => formateDate(text / 1000),
		},
		{
			title: "对话内容",
			dataIndex: "",
			render: (text, record) => {
				return (
					<>
						<LinkButton onClick={() => onCheckButtonHandled(record)}>查看</LinkButton>
					</>
				);
			},
		},
	];
	const onSearchButtonHandled = async value => {
		if (value) ref.current.search_value = value;
		let { start_time, end_time } = ref.current;
		fetchData(1, 20, {
			[ref.current.search_key]: ref.current.search_value,
			start_time,
			end_time,
		});
	};
	const onCheckButtonHandled = async record => {
		ref.current.field = record;
		ref.current.modaltitle = "对话内容";
		ref.current.content = {
			start_time: moment().subtract(7, "day").unix(),
			end_time: moment().unix(),
		};
		checkContentHistory(1, 10, ref.current.content.start_time, ref.current.content.end_time);
		setis_modal_show(true);
	};
	const checkContentHistory = async (page, limit, start_time, end_time) => {
		const { user_id, customer_service_id, conversion_id } = ref.current.field;
		const res = await IMsystem("chatMsgList", {
			skip: (page - 1) * limit,
			limit,
			user_id,
			customer_service_id,
			conversion_id,
		});
		if (res.code === 200 && res.data) {
			message.success("获取聊天内容成功");
			const newData = _.reverse(res.data);
			setContentData({ data: newData || [], count: res.count || 0, current: page });
		} else {
			setContentData({ data: [], count: 0 });
			message.info("时间范围内没有聊天记录");
		}
	};
	return (
		<Card
			title={
				<div>
					<MyDatePicker
						handleValue={(date, dateString) => {
							if (date && date.length !== 0) {
								ref.current.start_time = date[0].valueOf();
								ref.current.end_time = date[1].valueOf();
							} else {
								ref.current.start_time = null;
								ref.current.end_time = null;
							}
						}}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Select
						defaultValue="user_id"
						onSelect={value => (ref.current.search_key = value)}
						style={{ width: 100 }}
					>
						<Select.Option value="user_id">user_id</Select.Option>
						<Select.Option value="brand">品牌</Select.Option>
						<Select.Option value="customer_service_id">客服id</Select.Option>
					</Select>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Input.Search
						style={{ width: 200 }}
						placeholder="请输入关键字搜索"
						enterButton
						onSearch={value => onSearchButtonHandled(value)}
					/>
					{/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => onAddButtonHandled(1)}>
							添加
						</Button> */}
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
					title={`询前分类  ${customer_service_type_list.find(
						ele => ele.value === parseInt(ref.current.field.customer_service_type),
					)?.word || ""
						}`}
					visible={is_modal_show}
					onCancel={() => setis_modal_show(false)}
					footer={null}
					maskClosable={false}
					style={{ padding: 10 }}
					width="60%"
				>
					<div style={{ border: "1px solid #686262", marginTop: 10, paddingBottom: 10 }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div style={{ fontSize: 20, padding: 10 }}>
								用户:{ref.current.field.user_id}
							</div>
							<div style={{ fontSize: 20, padding: 10 }}>
								客服:{ref.current.field.customer_service_id}
							</div>
						</div>
						<div style={{ overflowY: "scroll" }}>
							{contentData.data.map((ele, i) => (
								<div
									key={i}
									style={{
										marginTop: 10,
										textAlign:
											ele.user_id === ref.current.field.user_id
												? "left"
												: "right",
									}}
								>
									<div>{formateDate(ele.send_time)}</div>
									<div
										style={{
											display: "inline-block",
											backgroundColor:
												ele.user_id === ref.current.field.user_id
													? "#ddd"
													: "lightgreen",
											width: "fit-content",
											maxWidth: "40%",
											padding: 5,
											wordBreak: "break-all",
											borderRadius: 10,
										}}
									>
										{ele.content_type === 1 ? (
											ele.content
										) : (
											<img
												src={`${process.env.REACT_APP_IM_HOST}/im/api/file/${ele.content}`}
												alt=''
											/>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<Pagination
						current={contentData.current}
						total={contentData.count}
						onChange={(page, pageSize) => {
							const { start_time, end_time } = ref.current.content;
							checkContentHistory(page, pageSize, start_time, end_time);
						}}
						style={{ display: "block", textAlign: "right", marginTop: 10 }}
					/>
				</Modal>
			)}
		</Card>
	);
};
