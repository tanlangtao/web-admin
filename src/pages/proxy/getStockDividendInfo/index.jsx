import React, { useRef, useState } from "react";
import { Table, message, Card, Input } from "antd";
import MyDatePicker from "../../../components/MyDatePicker";
import { getStockDividendInfo } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";
import moment from "moment";

export default () => {
  const [table_data, set_table_data] = useState([]);
  const initstates = useRef({
    first_date: "",
    last_date: "",
  });
  const initColumns = [
    {
      title: "玩家ID",
      width: 100,
      dataIndex: "id",
    },
    {
      title: "上级ID",
      width: 100,
      dataIndex: "proxy_user_id",
    },
    {
      title: "团队份额",
      width: 100,
      dataIndex: "amount",
      render: reverseNumber,
    },
    {
      title: "分红类型",
      width: 100,
      dataIndex: "bonustype",
      render: () => {
        return "全盘分红";
      },
    },
    {
      title: "平台应发分红",
      dataIndex: "net_profit",
      width: 100,
      render: (text, record) => {
        if (record.net_profit > 0) {
          return reverseNumber(record.net_profit * 0.5);
        } else return 0;
      },
    },
    {
      title: "平台总股份",
      width: 100,
      dataIndex: "master_amount",
      render: reverseNumber,
    },
    {
      title: "我的有效业绩",
      width: 100,
      dataIndex: "shareCount",
      render: (text, record) => {
        if (record.shareCount) {
          return reverseNumber(record.shareCount);
        } else return "-";
      },
    },
    {
      title: "我的股份份额",
      width: 100,
      dataIndex: "myShares",
      render: (text, record) => {
        if (record.myShares) {
          return reverseNumber(record.myShares);
        } else return "-";
      },
    },
    {
      title: "股份单价",
      width: 100,
      dataIndex: "price",
      render: (text, record) => {
        if (record.price > 0) {
          return reverseNumber(record.price);
        } else return 0;
      },
    },
    {
      title: "股东分红",
      width: 100,
      dataIndex: "bonus",
    },
    {
      title: "应发金额",
      width: 100,
      dataIndex: "money",
      render: (text, record) => {
        if (record.money > 0) {
          return reverseNumber(record.money);
        } else return 0;
      },
    },
    {
      title: "是否已经领取",
      width: 100,
      dataIndex: "status",
      render: (text, record) => {
        if (record.status === 0) {
          return "未领取";
        } else if (record.status === 1) {
          return "领取";
        } else return "-";
      },
    },
  ];

  const onSearchButtonHandled = async (value) => {
    let { first_date, last_date } = initstates.current;
    if (!value || !first_date || !last_date) {
      message.info("请选择时间范围并输入玩家ID與活动ID");
      return;
    }
    message.loading("正在统计中.....", 20);
    const res = await getStockDividendInfo({
      account_name: value,
      first_date,
      last_date,
    });
    if (res.code === 200 && res.msg) {
      message.destroy();
      message.info(res.status);
      let totalPlayerBonusPoolRatio, totalShare;
      if (res.msg[`${first_date + ":" + last_date}`]) {
        totalPlayerBonusPoolRatio =
          res.msg[`${first_date + ":" + last_date}`][0]["amount"];
        totalShare =
          (res.msg[`${first_date + ":" + last_date}`][0]["amount"] /
            res.msg[`${first_date + ":" + last_date}`][0]["share"]) *
          10000;
        res.msg[`${first_date + ":" + last_date}`].forEach((ele, index) => {
          if (index > 0) {
            totalPlayerBonusPoolRatio -= ele.amount;
          }
        });
        res.msg[`${first_date + ":" + last_date}`][0]["myShares"] =
          totalPlayerBonusPoolRatio;
        res.msg[`${first_date + ":" + last_date}`][0]["shareCount"] =
          totalShare;
      }
      set_table_data(res.msg[`${first_date + ":" + last_date}`]);
    } else {
      message.destroy();
      message.info(res.status || JSON.stringify(res));
    }
  };
  return (
    <Card
      title={
        <div>
          <MyDatePicker
            handleValue={(date, val) => {
              let diffDays = moment(val[1]).diff(moment(val[0]), "days");
              if (diffDays > 7) {
                message.info("请选择时间范围不超过7天");
              } else if (date && date.length !== 0) {
                initstates.current.first_date = date[0]
                  ? moment(date[0].valueOf()).format("YYYY-MM-DD")
                  : null;
                initstates.current.last_date = date[1]
                  ? moment(date[1].valueOf()).format("YYYY-MM-DD")
                  : null;
              } else {
                initstates.current.start_time = "";
                initstates.current.last_date = "";
              }
            }}
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
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={table_data}
        columns={initColumns}
        size="small"
        pagination={false}
      />
    </Card>
  );
};
