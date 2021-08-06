import React, { useState, useEffect } from "react";
import { Card, message, Input, Table, Button } from "antd";
import { queryAccount, userPackageList } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";

export default () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [tableStatus, settableStatus] = useState({ page: 1, limit: 10 });
	const [criteria, setcriteria] = useState();
	const [packageList, setpackageList] = useState();
	const getPackageList = async () => {
		const res = await userPackageList();
		if (res.status === 0) {
			setpackageList(res.data.list);
		}
	};
	useEffect(() => {
		getPackageList();
	}, []);
	const onButtonClick = async (page, limit) => {
		const res = await queryAccount({ page, limit, criteria });
		if (res.status === 0) {
			let data = JSON.parse(res?.data || null);
			message.info(res.msg || "请求成功");
			setCount(data?.count || 0);
			setData(data?.list || []);
		} else {
			message.info(res.msg || "请求失败");
		}
	};
	const resetstatus = () => {
		settableStatus({ ...tableStatus, page: 1 });
		setcriteria("");
		setCount(0);
		setData([]);
	};
	const initColumns = [
		{
			title: "用户id",
			dataIndex: "user_id",
		},
		{
			title: "昵称",
			dataIndex: "user_name",
			// render: formateDate,
		},
		{
			title: "银行卡号码",
			dataIndex: "",
			render: (text, record, index) => {
				let res;
				if (parseInt(record.type) === 2) {
					res = JSON.parse(record.info || null)?.account_card;
				} else {
					res = JSON.parse(record.info || null)?.card_num;
				}
				if (res) {
					return (
						res[0] +
						res[1] +
						res[2] +
						"*******" +
						res[res.length - 4] +
						res[res.length - 3] +
						res[res.length - 2] +
						res[res.length - 1]
					);
				}
				return null;
			},
		},
		{
			title: "开户名",
			dataIndex: "",
			render: (text, record, index) => {
				let res;
				if (parseInt(record.type) === 2) {
					res = JSON.parse(record.info || null)?.account_name;
				} else {
					res = JSON.parse(record.info || null)?.card_name;
				}
				if (res) {
					return res[0] + res[1] + "*******";
				}
				return null;
			},
		},
		{
			title: "银行名称",
			dataIndex: "",
			render: (text, record, index) => {
				return JSON.parse(record.info || null)?.bank_name;
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			render: (text, record, index) => {
				let res;
				switch (parseInt(text)) {
					case 1:
						res = "未审核";
						break;
					case 2:
						res = "审核成功";
						break;
					case 3:
						res = "审核拒绝";
						break;
					default:
						break;
				}
				return res;
			},
		},
		{
			title: "所属品牌",
			dataIndex: "package_id",
			render: (text, record, index) => {
				let res;
				packageList.forEach(ele => {
					if (ele.id == text) {
						res = ele.name;
						return;
					}
				});
				return res;
			},
		},
		{
			title: "创建时间",
			dataIndex: "created_at",
			render: formateDate,
		},
	];
	return (
		<Card
			title={
				<>
					<div style={{ width: "80%", display: "inline-block" }}>
						<span>银行卡号或用户名 :</span>
						<Input.TextArea
							autoSize={{ maxRows: 20, minRows: 3 }}
							placeholder="可一次查询多个银行卡/用户名,用逗号隔开"
							type="text"
							value={criteria}
							onChange={e => setcriteria(e.target.value)}
						/>
					</div>
					<div style={{ marginTop: 15 }}>
						<Button
							type="primary"
							icon="search"
							onClick={() => {
								onButtonClick(1, tableStatus.limit);
								settableStatus({ ...tableStatus, page: 1 });
							}}
						>
							查询
						</Button>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Button type="primary" icon="search" onClick={resetstatus}>
							重置
						</Button>
					</div>
				</>
			}
		>
			<Table
				bordered
				size="small"
				rowKey={(record, index) => `${index}`}
				dataSource={data}
				columns={initColumns}
				pagination={{
					current: tableStatus.page,
					pageSize: tableStatus.limit,
					showSizeChanger: true,
					showQuickJumper: true,
					total: count,
					showTotal: (total, range) => `共${total}条`,
					onChange: (page, pageSize) => {
						settableStatus({ ...tableStatus, page });
						onButtonClick(page, pageSize);
					},
					onShowSizeChange: (current, size) => {
						settableStatus({  ...tableStatus,limit: size });
						onButtonClick(current, size);
					},
				}}
			/>
		</Card>
	);
};
