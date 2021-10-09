import React, { useState, useRef, useEffect } from "react";
import { Card, message, Input, Table, Icon } from "antd";
import { GetBaseDividendRule1 } from "../../../api";
import LinkButton from "../../../components/link-button";
import { reverseNumber } from "../../../utils/commonFuntion";

let initstate = {
  proxy_id: '',
  game_tags: ''
};

export default () => {
  const [data, setData] = useState([])
  const ref = useRef(initstate)
  const initColumns = [
    {
      title: "玩家ID",
      dataIndex: "id",
    },
    {
      title: "上级ID",
      dataIndex: "proxy_user_id",
    },
    {
      title: "游戏类型",
      dataIndex: "game_tag",
      render: (text, record) => {
        switch (text) {
          case 1:
            return "棋牌类型"
          case 2:
            return "彩票类型"
          case 3:
            return "体育类型"
          case 4:
            return "视讯类型"
          case 5:
            return "电子类型"
          default:
            return
        }
      },
    },
    {
      title: "每万返佣",
      dataIndex: "income",
      render: reverseNumber,
    },
  ]

  //查询保底分红规则
  const proxySearch = async () => {
    const { proxy_id, game_tags } = ref.current
    if (!proxy_id) {
      message.info("请输入玩家ID");
      return;
    }
    if (!game_tags) {
      message.info("请输入游戏类型");
      return;
    }
    let reqData = {
      account_name: proxy_id,
      id: proxy_id,
      game_tag: game_tags,
    }
    const res = await GetBaseDividendRule1(reqData)
    if (res.code === 200) {
      message.success(res.status)
      setData(res.msg ? [res.msg] : [])
    } else {
      message.info(res.status || JSON.stringify(res))
      setData([])
    }
  }

  return (
    <Card
      title={
        <div>
          <Input
            style={{ width: 200 }}
            placeholder="请输入玩家ID"
            onChange={e => {
              ref.current.proxy_id = e.target.value
            }}
          />
          &nbsp; &nbsp;
          <Input
            style={{ width: 200 }}
            placeholder="请输入游戏类型"
            onChange={e => {
              ref.current.game_tags = e.target.value
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
  )

}