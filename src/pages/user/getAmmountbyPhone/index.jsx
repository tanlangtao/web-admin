import React, { useState, useEffect } from "react";
import { Card, message, Input, Table, Button } from "antd";
import { queryAccount, userPackageList } from "../../../api";
import { getAmmountbyPhone } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import { forEach } from "lodash";

export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  // const [arrivalData, setarrivalData] = useState([]);
  const [criteria, setcriteria] = useState();
  const onButtonClick = async () => {
    let number = criteria.slice(0, 11);
    for (let i = 1; i < criteria.length / 11; i++) {
      let newnumber;
      if (i === 1) {
        newnumber = "," + criteria.slice(11, 22);
      } else {
        newnumber = "," + criteria.slice(11 * i, 11 * (i + 1));
      }
      number += newnumber;
    }

    console.log("number", number);
    const res = await getAmmountbyPhone({ phone_number: number });
    if (res.status === 0) {
      message.info(res.msg || "请求成功");
      // setCount(res.data.user?.count || 0);
      // setarrivalData(res.data?.order || []);

      setData(res.data.user?.game_user || []);
      const newA = res.data.user.game_user.map((e) => {
        // console.log("e", e);
        // console.log(
        //   "e2",
        //   res.data.order.find((d) => d.id === e.id)
        // );
        return Object.assign(
          e,
          res.data.order.find((d) => d.id === e.id)
        );
      });
      setCount(newA || 0);
      console.log("newA", newA);
    } else {
      message.info(res.msg || "请求失败");
    }
  };

  const initColumns = [
    {
      title: "电话号码",
      dataIndex: "phone_number",
    },
    {
      title: "品牌ID",
      dataIndex: "package_id",
      render: (text) => {
        switch (text) {
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
            return "大喜发";
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
            return "乐派游戏";
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
            return "";
        }
      },
    },
    {
      title: "玩家ID",
      dataIndex: "id",
    },
    {
      title: "注册时间",
      dataIndex: "regin_time",
      render: formateDate,
    },
    {
      title: "充值金额",
      dataIndex: "arrival_amount",
    },
  ];
  return (
    <Card
      title={
        <>
          <div style={{ width: "80%", display: "inline-block" }}>
            <span>批量电话号码查询:</span>
            <Input
              placeholder="单次批量查询時，电话号码不能超过 100个"
              maxLength={1100}
              type="text"
              value={criteria}
              onChange={(e) => setcriteria(e.target.value.replace(/[, ]/g, ""))}
            />
          </div>
          <div style={{ marginTop: 15 }}>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                onButtonClick();
              }}
            >
              查询
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </>
      }
    >
      <Table
        bordered
        size="small"
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        pagination={{
          //   current: tableStatus.page,
          //   pageSize: tableStatus.limit,
          // showSizeChanger: true,
          // showQuickJumper: true,
          total: count,
          showTotal: (total, range) => `共${total}条`,
          // onChange: (page, pageSize) => {
          //   settableStatus({ ...tableStatus, page });
          //   onButtonClick(page, pageSize);
          // },
          // onShowSizeChange: (current, size) => {
          //   settableStatus({ ...tableStatus, limit: size });
          //   onButtonClick(current, size);
          // },
        }}
      />
    </Card>
  );
};
