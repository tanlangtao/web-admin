import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Select, Button, Icon, Modal } from "antd";
import _ from "lodash-es";
import LinkButton from "../../../components/link-button/index";

export default (props) => {
  const [data, setData] = useState([]);
  let initialState = {
    10: 1,
    11: 49,
    15: 6,
    6: 29,
  };
  //   const getOnlineNumber = async () => {
  //     let res = await getOnlineNumberList();
  //     if (res.status === 0 && res.data) {
  //       let dataBrack = Object.entries(initialState).map(
  //         ([dataName, dataValue]) => {
  //           return { name: dataName, value: dataValue, id: dataName };
  //         }
  //       );
  //       setData(dataBrack);
  //     }
  //   };
  let dataBrack = Object.entries(initialState).map(([dataName, dataValue]) => {
    return { name: dataName, value: dataValue, id: dataName };
  });
  console.log("dataBrack", dataBrack);
  let initColumns = [
    {
      title: "游戏名称",
      dataIndex: "name",
      render: (record, text) => {
        console.log("record", record);
        switch (record) {
          case "1":
          case 1:
            return "特斯特娱乐";
          case 2:
          case "2":
            return "德比游戏";
          case 3:
          case "3":
            return "杏吧娱乐";
          case 6:
          case "6":
            return "91游戏";
          case 8:
          case "8":
            return "新盛游戏";
          case 9:
          case "9":
            return "新贵游戏";
          case 10:
          case "10":
            return "富鑫II游戏";
          case 11:
          case "11":
            return "新豪游戏";
          case 12:
          case "12":
            return "新隆游戏";
          case 13:
          case "13":
            return "皇室游戏";
          case 15:
          case "15":
            return "聚鼎娱乐";
          case 16:
          case "16":
            return "92游戏";
          case 18:
          case "18":
            return "华兴娱乐";
          default:
            return;
        }
      },
    },
    {
      title: "在线人数",
      dataIndex: "value",
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (record, text) => (
        <span>
          <LinkButton type="default" onClick={() => getLoadGold(record)}>
            查看
          </LinkButton>
        </span>
      ),
    },
  ];

  const getLoadGold = async (record) => {
    console.log("record", record);
    // const result = await reqLoadGold(id);
    // result.status === 0

    if (true) {
      Modal.success({
        title: "实时余额",
        // content: `用户${record.id}实时余额是 : ${result.data.game_gold.toFixed(
        //   6
        // )}`,
      });
    } else {
      //   message.info(result.msg || JSON.stringify(result));
    }
  };

  return (
    <Table
      bordered
      size="small"
      rowKey={(record, index) => `${index}`}
      dataSource={data}
      columns={initColumns}
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 50,
        // showSizeChanger: true,
        showQuickJumper: true,
        // total: count,
        showTotal: (total) => `共${total}条`,
        // onChange: (page, pageSize) => {
        //   setCurrent(page);
        //   fetchData(page, pageSize);
        // },
      }}
    />
  );
};
