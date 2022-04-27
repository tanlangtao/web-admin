import React, { useRef, useState } from "react";

import { Table, message, Card, Button, Select } from "antd";

import { IMsystem } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";
import _ from "lodash-es";

export default () => {
	const customer_service_type_list = [
		{ value: "1", word: "充值未到账" },
		{ value: "2", word: "兑换未到账" },
		{ value: "3", word: "活动问题" },
		{ value: "4", word: "其 他" },
		{ value: "", word: "未定义" },
	];
	const [data, setdata] = useState([]);
	const ref = useRef({});
	const fetchData = async () => {
		const { start_time, end_time, brand } = ref.current;
		if (!start_time || !end_time || !brand) {
			message.info("请选择搜索条件");
			return;
		}
		const res = await IMsystem("askCount", {
			start_time,
			end_time,
			brand,
		});
		if (res.code === 200 || res.data) {
			message.success("更新列表成功");
			_.forEach(res.data, (value, key) => {
				_.forEach(customer_service_type_list, (ele, i) => {
					if (key === ele.value) {
						customer_service_type_list[i].brand = brand;
						customer_service_type_list[i].count = value.count;
					}
				});
			});
			setdata(customer_service_type_list);
		} else {
			setdata([]);
			message.info(res.msg || JSON.stringify(res));
		}
	};
	// useEffect(() => {
	// 	fetchData(1, 20);
	// }, []);
	// customer_service_type_list.find(ele => ele.value === parseInt(text))?.word,
	const initColumns = [
		{
			title: "询前分类",
			dataIndex: "word",
		},
		{
			title: "所属渠道",
			dataIndex: "brand",
		},
		{
			title: "计数",
			dataIndex: "count",
		},
	];
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
						placeholder="请选择"
						onSelect={value => (ref.current.brand = value)}
						style={{ width: 150 }}
					>
						<Select.Option value="特斯特">特斯特</Select.Option>
						<Select.Option value="德比">德比</Select.Option>
						<Select.Option value="杏吧">杏吧</Select.Option>
						<Select.Option value="漁魚">漁魚</Select.Option>
					</Select>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => fetchData()}>
						搜索
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
				dataSource={data}
				columns={initColumns}
				size="small"
				pagination={false}
			/>
		</Card>
	);
};
