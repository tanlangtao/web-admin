import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
export default function MyDatePicker(props) {
	return (
		<ConfigProvider locale={zh_CN}>
			<DatePicker defaultValue={moment().startOf("day")}
				onChange={(date, dateString) => {
					props.handleValue(date, dateString);
				}} />
		</ConfigProvider>
	);
}
