import React, { useState, useEffect } from "react";
import { Card, message, Table, Popconfirm, Modal, Button } from "antd";
import { getb2bconfig, postb2bconfig } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button";
import WrappedDataForm from "./add_or_edit";

let recordData;
export default function B2bconfig(props) {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [dataForm, setdataForm] = useState(false);
	const [dataFormTitle, setdataFormTitle] = useState("");

	const fetchData = async (page, limit) => {
		const res = await getb2bconfig(page, limit);
		if (res.code === 200) {
			setData(res.data);
			setCount(res.count);
		} else {
			message.info(res.msg || "请求失败");
		}
	};
	useEffect(() => {
		fetchData(1, 20);
	}, []);
	const deleteConfig = async (id) => {
		const res = await postb2bconfig({ id }, "del");
		if (res.code === 200) {
			message.success(res.msg || "删除成功");
			fetchData(1, 20);
		} else {
			message.info("出错了:" + res.msg);
		}
	};
	const initColumns = [
		{
			title: "平台码",
			dataIndex: "platform_code"
		},
		{
			title: "平台名称",
			dataIndex: "name"
		},
		{
			title: "平台环境包名",
			dataIndex: "package_name"
		},
		{
			title: "平台验证token",
			dataIndex: "token"
		},
		{
			title: "平台上级代理ID",
			dataIndex: "superior_agent"
		},
		{
			title: "充值开关",
			dataIndex: ["item_status", "open_chongzhi"],
			render: (text, record) => text == 1 ? '开' : '关'
		},
		{
			title: "提现开关",
			dataIndex: ["item_status", "open_tixian"],
			render: (text, record) => text == 1 ? '开' : '关'
		},
		{
			title: "返回大厅开关",
			dataIndex: ["item_status", "open_tixian"],

			dataIndex: "open_back_hall",
			render: (text, record) => text == 1 ? '开' : '关'
		},
		{
			title: "客服开关",
			dataIndex: ["item_status", "open_im"],
			render: (text, record) => text == 1 ? '开' : '关'
		},
		{
			title: "代理系统开关",
			dataIndex: ["item_status", "open_proxyor_agent"],
			render: (text, record) => text == 1 ? '开' : '关'
		},
		{
			title: "创建时间",
			dataIndex: "create_time",
			render: (text, record, index) => formateDate(text / 1000)
		},
		{
			title: "更新时间",
			dataIndex: "update_time",
			render: (text, record, index) => formateDate(text / 1000)
		},
		{
			title: "操作",
			dataIndex: "",
			render: (text, record, index) => {
				return (
					<div>
						<LinkButton
							size="small"
							onClick={() => {
								setdataForm(true);
								setdataFormTitle(record.platform_code);
								recordData = record;
							}}
						>
							编辑
						</LinkButton>
						<Popconfirm
							title="确定要删除吗?"
							onConfirm={() => deleteConfig(record.id)}
							okText="确定"
							cancelText="取消"
						>
							<LinkButton type="danger" size="small">
								删除
							</LinkButton>
						</Popconfirm>
					</div>
				);
			}
		}
	];
	return (
		<Card
			title={
				<div>
					<Button
						type="primary"
						onClick={() => {
							setdataForm(true);
							setdataFormTitle("add");
						}}
					>
						添加平台
					</Button>
				</div>
			}
		>
			<Table
				bordered
				size="small"
				rowKey={(record, index) => `${index}`}
				dataSource={data}
				columns={initColumns}
				pagination={{
					defaultCurrent: 1,
					defaultPageSize: 20,
					showQuickJumper: true,
					showTotal: (total, range) => `共${total}条`,
					total: count,
					onChange: (page, pageSize) => {
						fetchData(page, pageSize);
					}
				}}
			/>
			{dataForm && (
				<Modal
					title={dataFormTitle === "add" ? "添加" : `编辑${dataFormTitle}`}
					visible={dataForm}
					onCancel={() => {
						setdataForm(false);
					}}
					footer={null}
				>
					<WrappedDataForm
						data={recordData}
						action={dataFormTitle === "add" ? "add" : "upt"}
						cancel={() => {
							setdataForm(false);
							fetchData(1, 20);
						}}
					/>
				</Modal>
			)}
		</Card>
	);
}
