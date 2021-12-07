import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { getPaymentInfo } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";

import { reverseNumber2 } from "../../../utils/commonFuntion";

let initstate = {
  start_time: null,
  end_time: null,
};

export default () => {
  const [data, setData] = useState([]);
  const initColumns = [
    {
      title: "日期",
      dataIndex: "date",
    },
    {
      title: "玩家ID",
      dataIndex: "proxy_user_id",
    },

    {
      title: "当日分红",
      dataIndex: "payment_income",
    },
    {
      title: "渠道ID",
      dataIndex: "package_id",
      render: (text) => {
        switch (text) {
          case 1:
            return "特斯特娱乐";
          case 2:
            return "德比游戏";
          case 3:
            return "杏吧娱乐";
          case 6:
            return "91游戏";
          case 8:
            return "大喜发";
          case 9:
            return "新贵游戏";
          case 10:
            return "富鑫II游戏";
          case 11:
            return "新豪游戏";
          case 12:
            return "新隆游戏";
          case 13:
            return "皇室游戏";
          case 15:
            return "聚鼎娱乐";
          default:
            return "";
        }
      },
    },
    {
      title: "当日兑换金额",
      dataIndex: "withdraw_total",
      render: (text, record) => {
        let result = Math.abs(record.withdraw_total);
        if (!isNaN(result)) {
          return reverseNumber2(result);
        }
      },
    },
    {
      title: "当日兑换笔数",
      dataIndex: "withdraw_times",
    },
  ];

  //搜寻代理个人玩家流水
  const proxySearch = async (value) => {
    const { start_time, end_time } = initstate;
    if (!value) {
      message.info("请输入玩家ID");
      return;
    }
    if (!start_time || !end_time) {
      message.info("请选择时间范围");
      return;
    }
    var oDate1 = new Date(start_time);
    var oDate2 = new Date(end_time);
    var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
    if (iDays > 30) {
      message.info("最多查询31天数据");
      return;
    }
    let reqData = {
      start_time: Math.floor(start_time / 1000),
      end_time: Math.floor(end_time / 1000),
      account_name: value,
      id: value,
    };
    const res = await getPaymentInfo(reqData);
    if (res.code === 200) {
      message.success(res.status);
      console.log(res.msg);
      setData(res.msg || []);
    } else {
      message.info(res.status || JSON.stringify(res));
    }
  };

  return (
    <Card
      title={
        <div>
          <MyDatePicker
            handleValue={(date, dateString) => {
              initstate.start_time = date[0] ? date[0].valueOf() : null;
              initstate.end_time = date[1] ? date[1].valueOf() : null;
            }}
          />
          &nbsp; &nbsp;
          <Input.Search
            style={{ width: 200 }}
            placeholder="请输入玩家ID"
            enterButton
            onSearch={(value) => proxySearch(value)}
          />
        </div>
      }
    >
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{
          defaultPageSize: 30,
          showQuickJumper: true,
          showTotal: (total, range) => `共${total}条`,
          defaultCurrent: 1,
          total: data?.length || 0,
        }}
      />
    </Card>
  );
};
