import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { GetBaseDividend, packageList } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";
import { result } from "lodash-es";

export default () => {
  const [data, setData] = useState([]);
  const [List, setList] = useState([]);
  const initColumns = [
    {
      title: "品牌",
      dataIndex: "package_id",
      render: (text) => {
        let resulttext = text;
        if (List && List.length !== 0) {
          List.map((ele) => {
            if (ele.value === parseInt(text)) {
              resulttext = ele.label;
            }
          });
        }
        return resulttext;
      },
    },
    {
      title: "代理级别",
      dataIndex: "name",
    },
    {
      title: "业绩区间（小）",
      dataIndex: "min",
      render: reverseNumber,
    },
    {
      title: "业绩区间（大）",
      dataIndex: "max",
      render: reverseNumber,
    },
    {
      title: "每万返佣",
      dataIndex: "income",
      render: reverseNumber,
    },
  ];
  //搜寻代理个人玩家流水
  const proxySearch = async (value) => {
    if (!value) {
      message.info("品牌ID");
      return;
    }
    let reqData = {
      package_id: value,
    };
    const res = await GetBaseDividend(reqData);
    const list = await packageList();
    if (res.code === 200 && res.msg) {
      message.success(res.status);
      const ressort = res.msg.sort(function (a, b) {
        return a.min - b.min;
      });
      setData(ressort || []);
      if (list.status === 0) {
        const newList = list.data.list?.map((ele) => {
          return {
            label: ele.name,
            value: ele.id,
          };
        });
        setList(newList);
      }
    } else {
      message.info(res.status || JSON.stringify(res));
      setData([]);
    }
  };

  return (
    <Card
      title={
        <div>
          <Input.Search
            style={{ width: 200 }}
            placeholder="品牌ID"
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
        pagination={false}
        scroll={{ x: "max-content" }}
      />{" "}
    </Card>
  );
};
