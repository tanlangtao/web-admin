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
        defaultPickerValue={[moment().subtract(1, "month"), moment()]}
        style={{ width: 300 }}
        // defaultPickerValue={null}
        ranges={{
          今天: [moment().startOf("day"), moment()],
          昨天: [
            moment()
              .startOf("day")
              .subtract(1, "days"),
            moment()
              .endOf("day")
              .subtract(1, "days")
          ],
          最近一周: [
            moment()
              .startOf("day")
              .subtract(1, "weeks"),
            moment()
          ]
        }}
        showTime={{
          format: "HH:mm",
          defaultValue: [moment("00:00", "HH:mm"), moment("00:00", "HH:mm")]
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
