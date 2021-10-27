import React, { useState, useEffect } from "react";

import { Table, Modal, message, Card, Input, Icon } from "antd";
import _ from "lodash-es";
import LinkButton from "../../../components/link-button/index";
import { getOnlineTotal, getOnlineGame } from "../../../api/index";
import OnlineGame from "./onlineGame";
export default (props) => {
  const [data, setData] = useState([]);
  const getOnlineNumber = async () => {
    try {
      message.loading("正在统计中.....", 20);
      let res = await getOnlineTotal();
      if (res.status === 0 && res.data) {
        message.destroy();
        message.info(res.msg);
        let dataBrack = Object.entries(res.data).map(
          ([dataName, dataValue]) => {
            return { name: dataName, value: dataValue, id: dataName };
          }
        );
        setData(dataBrack);
      } else {
        message.destroy();
        message.info(res.msg || JSON.stringify(res));
      }
    } catch (error) {
      message.destroy();
      message.info(JSON.stringify(error.response.data));
    }
  };

  useEffect(() => {
    getOnlineNumber();
  }, []);
  // let dataBrack = Object.entries(initialState).map(([dataName, dataValue]) => {
  //   return { name: dataName, value: dataValue, id: dataName };
  // });
  let initColumns = [
    {
      title: "游戏名称",
      dataIndex: "name",
      render: (record, text) => {
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
          <LinkButton type="default" onClick={() => getSubGameNumber(record)}>
            查看
          </LinkButton>
        </span>
      ),
    },
  ];

  const getSubGameNumber = async (record) => {
    try {
      message.loading("正在统计中.....", 5);
      const result = await getOnlineGame(record);
      if (result.status === 0) {
        message.destroy();
        message.info(result.msg);
        Modal.info({
          title: "在线人数",
          okText: "关闭",
          content: <OnlineGame data={result.data} />,
          width: "50%",
        });
      } else {
        message.destroy();
        message.info(result.msg || JSON.stringify(result));
      }
    } catch (error) {
      message.destroy();
      message.info(JSON.stringify(error.response.data));
    }
  };

  return (
    <Card
      extra={
        <LinkButton onClick={() => window.location.reload()} size="default">
          <Icon type="reload" />
        </LinkButton>
      }
    >
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
    </Card>
  );
};
