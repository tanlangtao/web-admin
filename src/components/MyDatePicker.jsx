import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
// import "moment/locale/zh-cn";
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
          今天: [moment().startOf("day"), moment().endOf("day")],
          昨天: [
            moment().startOf("day").subtract(1, "days"),
            moment().endOf("day").subtract(1, "days"),
          ],
          最近一周: [
            moment().startOf("day").subtract(1, "weeks"),
            moment().startOf("day"),
          ],
          最近一年: [
            moment().startOf("day").subtract(1, "years"),
            moment().startOf("day"),
          ],
        }}
        showTime={{
          format: "HH:mm",
          defaultValue: [moment("00:00", "HH:mm"), moment("00:00", "HH:mm")],
        }}
        format="YYYY-MM-DD HH:mm:ss"
        placeholder={["开始日期", "结束日期"]}
        onChange={(date, dateString) => {
          props.handleValue(date, dateString);
        }}
        // disabledDate={disabledDate}
        // disabledTime={disabledRangeTime}
        {...props}
      />
    </ConfigProvider>
  );
}
