import React, { useState, useEffect } from "react";
import { Table, Modal, message, Card } from "antd";
import LinkButton from "../../../components/link-button/index";
import { getOnlineTotal, getOnlineGame } from "../../../api/index";
import { switchPackageId } from "../../../utils/switchType";
import DemoLine from "../OnlineNumberLineGraph/index";
import OnlineGame from "./onlineGame";
import "./index.less";

export default () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setloading] = useState(false);
  const [packageID, setpackageId] = useState("");
  const getOnlineNumber = async () => {
    try {
      message.loading("正在统计中.....", 20);
      let res = await getOnlineTotal({ package_id: packageID });
      if (res.status === 0 && res.data) {
        message.destroy();
        message.info(res.msg);
        let dataBrack = Object.entries(res.data).map(
          ([dataName, dataValue]) => {
            return { name: dataName, value: dataValue, id: dataName };
          }
        );
        console.log("dataBrack", dataBrack);
        const push1 = dataBrack
          .filter((item, index) => {
            return index % 2 === 1;
          })
          .map((item) => {
            return {
              name1: item.name,
              value1: item.value,
              id1: item.id,
            };
          });
        const push2 = dataBrack
          .filter((item, index) => {
            return index % 2 === 0;
          })
          .map((item) => {
            return {
              name2: item.name,
              value2: item.value,
              id2: item.id,
            };
          });
        setData1(push1);
        setData2(push2);
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
  }, [loading]);

  let initColumns = [
    {
      title: "渠道组名称",
      dataIndex: "name1",
      render: (record, text, index) => {
        return switchPackageId(record);
      },
    },
    {
      title: "在线人数",
      dataIndex: "value1",
    },
    {
      title: "操作",
      dataIndex: "id1",
      height: 0,
      render: (record, text, index) => (
        <span>
          <LinkButton type="default" onClick={() => getSubGameNumber(record)}>
            查看
          </LinkButton>
        </span>
      ),
    },
  ];
  let initColumn2s = [
    {
      title: "渠道组名称",
      dataIndex: "name2",
      render: (record, text, index) => {
        return switchPackageId(record);
      },
    },
    {
      title: "在线人数",
      dataIndex: "value2",
    },
    {
      title: "操作",
      dataIndex: "id2",
      height: 0,
      render: (record, text, index) => (
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
        const newResult = result.data.map((item) => {
          return {
            ...item,
            id: item.count,
          };
        });
        Modal.info({
          title: "在线人数",
          okText: "关闭",
          content: <OnlineGame data={newResult} />,
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
    <Card>
      <DemoLine changeLoading={setloading} loading={loading} />
      &nbsp; &nbsp;
      <div className="testCss">
        <div className="tabletest">
          <Table
            bordered
            size="small"
            rowKey={(record, index) => `${index}`}
            dataSource={data2}
            columns={initColumn2s}
            pagination={false}
          />
        </div>
        <div className="tabletest">
          <Table
            bordered
            size="small"
            rowKey={(record, index) => `${index}`}
            dataSource={data1}
            columns={initColumns}
            pagination={false}
          />
        </div>
      </div>
    </Card>
  );
};
