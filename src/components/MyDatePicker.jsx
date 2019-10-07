import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import moment from "moment";
const { RangePicker } = DatePicker;
export default function MyDatePicker(props) {
  return (
    <ConfigProvider locale={zh_CN}>
      <RangePicker
        // defaultValue={[moment().locale("zh-cn")]}
        style={{ width: 300 }}
        showTime={{
          format: "HH:mm",
          defaultValue: [
            moment("00:00", "HH:mm"),
            moment("00:00", "HH:mm")
          ]
        }}
        format="YYYY-MM-DD HH:mm:00"
        placeholder={["开始日期", "结束日期"]}
        onChange={(data, dateString) => {
          props.handleValue(dateString);
        }}
        // disabledDate={disabledDate}
        // disabledTime={disabledRangeTime}
        {...props}
      />
    </ConfigProvider>
  );
}
