import React, { useState, useRef } from "react";
import { Card, message, Input, Table, Icon } from "antd";
import { getProxyBaseDividendInfo2 } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button";
import moment from "moment";
import { reverseNumber } from "../../../utils/commonFuntion";

let initstate = {
  start_time: null,
  end_time: null,
  proxy_id: "",
  game_tags: "",
};

export default () => {
  const [data, setData] = useState([]);
  const ref = useRef(initstate);
  const initColumns = [
    {
      title: "日期",
      dataIndex: "date",
    },
    {
      title: "玩家ID",
      dataIndex: "id",
    },
    {
      title: "上级ID",
      dataIndex: "proxy_user_id",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) =>
        text === -1 ? "作废" : text === 0 ? "未发" : text === 1 ? "已发" : "",
    },
    {
      title: "团队业绩",
      dataIndex: "amount",
      render: reverseNumber,
    },
    {
      title: "团队返佣",
      dataIndex: "money",
      render: reverseNumber,
    },
    {
      title: "我的返佣",
      dataIndex: "grant",
      render: reverseNumber,
    },
    {
      title: "每万返佣",
      dataIndex: "income",
      render: reverseNumber,
    },
    {
      title: "级差",
      dataIndex: "award",
    },
    {
      title: "游戏类型",
      dataIndex: "game_tag",
      render: (text, record) => {
        switch (text) {
          case 1:
            return "棋牌类型";
          case 2:
            return "彩票类型";
          case 3:
            return "体育类型";
          case 4:
            return "视讯类型";
          case 5:
            return "电子类型";
          default:
            return;
        }
      },
    },
  ];

  //搜寻代理个人玩家流水
  const proxySearch = async () => {
    const { start_time, end_time } = initstate;
    const { proxy_id, game_tags } = ref.current;
    if (!proxy_id) {
      message.info("请输入玩家ID");
      return;
    }
    if (!game_tags) {
      message.info("请输入游戏类型");
      return;
    }
    if (!start_time || !end_time) {
      message.info("请选择时间范围");
      return;
    }
    let reqData = {
      first_date: start_time,
      last_date: end_time,
      account_name: proxy_id,
      game_tag: game_tags,
    };
    const res = await getProxyBaseDividendInfo2(reqData);
    if (res.code === 200) {
      message.success(res.status);
      if (res.msg) {
        const newData = Object.values(res.msg).map((ele) => {
          return ele[0];
        });
        let sortData = newData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setData(sortData || []);
      } else setData([]);
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
              initstate.start_time = date[0]
                ? moment(date[0].valueOf()).format("YYYY-MM-DD")
                : null;
              initstate.end_time = date[1]
                ? moment(date[1].valueOf()).format("YYYY-MM-DD")
                : null;
            }}
          />
          &nbsp; &nbsp;
          <Input
            style={{ width: 200 }}
            placeholder="请输入玩家ID"
            onChange={(e) => {
              ref.current.proxy_id = e.target.value;
            }}
          />
          &nbsp; &nbsp;
          <Input
            style={{ width: 200 }}
            placeholder="请输入游戏类型"
            onChange={(e) => {
              ref.current.game_tags = e.target.value;
            }}
          />
          &nbsp; &nbsp;
          <LinkButton onClick={() => proxySearch()} size="default">
            <Icon type="search" />
          </LinkButton>
        </div>
      }
    >
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        size="small"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};
