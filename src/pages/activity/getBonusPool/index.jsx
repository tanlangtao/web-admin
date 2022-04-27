import React, { useRef, useState } from "react";
import { Table, message, Card, Input } from "antd";
import MyDatePicker from "../../../components/MyDatePicker";
import { activityGetBonusPool } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";
import moment from "moment";

export default () => {
  const [table_data, set_table_data] = useState([]);
  const [other_data, set_other_data] = useState([]);
  const initstates = useRef({
    // start_time: "",
    // end_time: "",
    activity_id: "",
  });
  const initColumns = [
    {
      title: "奖金池金额",
      width: 200,
      dataIndex: "bonus_pool",
    },
    {
      title: "用户有效投注",
      width: 200,

      dataIndex: "player_bet_total",
    },
    {
      title: "用户奖金池占比",
      width: 200,
      dataIndex: "player_bonus_pool_ratio",
      render: reverseNumber,
    },
    {
      title: "用户奖金",
      dataIndex: "",
      width: 200,
      render: (text, record) =>
        reverseNumber(record.bonus_pool * record.player_bonus_pool_ratio),
    },
  ];

  const onSearchButtonHandled = async (value) => {
    let { activity_id } = initstates.current;
    if (!value || !activity_id) {
      message.info("请选择时间范围并输入玩家ID與活动ID");
      return;
    }
    const res = await activityGetBonusPool({
      user_id: value,
      // start_time,
      // end_time,
      activity_id,
      package_id: 16,
      //   action: 1,
    });
    if (res.status === 0 && res.data) {
      set_table_data([res.data.currentweek]);
      set_other_data([res.data.lastweek]);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };
  return (
    <Card
      title={
        <div>
          {/* <MyDatePicker
            handleValue={(date, val) => {
              let diffDays = moment(val[1]).diff(moment(val[0]), "days");
              if (diffDays > 7) {
                message.info("请选择时间范围不超过7天");
              } else if (date && date.length !== 0) {
                initstates.current.start_time = date[0].valueOf() / 1000;
                initstates.current.end_time =
                  Math.ceil(date[1].valueOf() / 1000) - 1;
              } else {
                initstates.current.start_time = "";
                initstates.current.end_time = "";
              }
            }}
          /> */}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Input
            style={{ width: 200 }}
            placeholder="活動ID"
            onChange={(e) => (initstates.current.activity_id = e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Input.Search
            style={{ width: 200 }}
            placeholder="请输入玩家id"
            enterButton
            onSearch={(value) => onSearchButtonHandled(value)}
          />
        </div>
      }
    >
      <div>这周</div>
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={table_data}
        columns={initColumns}
        size="small"
        pagination={false}
      />
      <div>上周</div>
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={other_data}
        columns={initColumns}
        size="small"
        pagination={false}
      />
    </Card>
  );
};
