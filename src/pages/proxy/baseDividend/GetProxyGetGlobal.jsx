import React, { useState, useEffect } from "react";
import { Card, message, Table } from "antd";
import { getProxyGetGlobal, packageList } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";

export default () => {
  const [data, setData] = useState([]);
  const [packageLIst, setpackageList] = useState([]);
  const initColumns = [
    {
      title: "品牌ID",
      dataIndex: "package_id",
      render: (text) => {
        let result = text;
        if (packageLIst && packageLIst.length !== 0) {
          packageLIst.map((ele) => {
            if (ele.value === parseInt(text)) {
              result = ele.label;
            }
          });
        }
        return result;
      },
    },
    {
      title: "平台注册金 ",
      dataIndex: "platform_regin_gold",
      render: reverseNumber,
    },
    {
      title: "平台税收比例 ",
      dataIndex: "platform_tax_percent",
      render: (text) => text + "%",
    },
    {
      title: "流水收入比例",
      dataIndex: "statement_income_proportion",
      render: (text) => text + "%",
    },
    {
      title: "收入类型",
      dataIndex: "statement_income_type",
      render: (text) =>
        text === 1
          ? "无限代"
          : text === 2
            ? "无限代有收益（35%）"
            : text === 3
              ? "无限代 无收益"
              : "",
    },
    {
      title: "提现手续费收入比例",
      dataIndex: "pay_income_proportion",
      render: reverseNumber,
    },
    {
      title: "提现手续费5级分红",
      dataIndex: "pay_income_type",
      render: (text) => (text === 1 ? "不分成" : text === 2 ? "五级分红" : ""),
    },
    {
      title: "注册限制",
      dataIndex: "regin_times_limit",
      render: reverseNumber,
    },
    {
      title: "注册间隔",
      dataIndex: "regin_interval_limit",
      render: reverseNumber,
    },
    {
      title: "无限代保底分红统计游戏类型",
      dataIndex: "base_dividend_game_tag",
      render: (text) =>
        text === 1
          ? "棋牌"
          : text === 2
            ? "彩票"
            : text === 3
              ? "体育"
              : text === 4
                ? "视讯"
                : text === 5
                  ? "电子"
                  : "",
    },
    {
      title: "保底分红扣除比例",
      dataIndex: "payment_base_dividend_percent",
      render: (text) => text + "%",
    },
    {
      title: "充值渠道费用比例",
      dataIndex: "payment_top_up_percent",
      render: (text) => text + "%",
    },
    {
      title: "活动成本费用比例",
      dataIndex: "payment_activity_cost_percent",
      render: (text) => text + "%",
    },
  ];
  useEffect(() => {
    proxySearch();
  }, []);
  //搜寻代理个人玩家流水
  const proxySearch = async (value) => {
    const res = await getProxyGetGlobal();
    const getpackageList = await packageList();
    if (res.code === 200) {
      message.success(res.status);
      const ressort = res.msg.sort(function (a, b) {
        return a.package_id - b.package_id;
      });
      setData(ressort || []);
      console.log(getpackageList);
      if (getpackageList.status === 0) {
        const newlist = getpackageList.data.list?.map((ele) => {
          return {
            label: ele.name,
            value: ele.id,
          };
        });
        setpackageList(newlist);
      }
    } else {
      message.info(res.status || JSON.stringify(res));
    }
  };

  return (
    <Card>
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
