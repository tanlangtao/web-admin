import React, { useState, useEffect } from "react";
import { Card, message,  Table,  Button } from "antd";
import { getb2bregister } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";

export default function B2bconfig(props) {
	const [ data, setData ] = useState([]);
	const [ count, setCount ] = useState(0);

	const fetchData = async (page, limit) => {
		const res = await getb2bregister(page, limit);
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
	const initColumns = [
		{
			title     : "第三方平台账号",
			dataIndex : "platform_account"
		},
		{
			title     : "注册对应中心服账号",
			dataIndex : "center_account"
		},
		{
			title     : "中心服账号对应上级代理",
			dataIndex : "center_prev_proxy"
		},
		{
			title     : "第三方平台账号登录密码",
			dataIndex : "platform_password"
		},
		{
			title     : "创建时间",
			dataIndex : "create_time",
			render    : (text, record, index) => formateDate(text / 1000)
		}
	];
	return (
		<Card extra={<Button type="primary" icon="reload" onClick={()=>fetchData(1, 20)} />}>
			<Table
				bordered
				size="small"
				rowKey={(record, index) => `${index}`}
				dataSource={data}
				columns={initColumns}
				pagination={{
					defaultCurrent  : 1,
					defaultPageSize : 20,
					showQuickJumper : true,
					showTotal       : (total, range) => `共${total}条`,
					total           : count,
					onChange        : (page, pageSize) => {
						fetchData(page, pageSize);
					}
				}}
			/>
		</Card>
	);
}
