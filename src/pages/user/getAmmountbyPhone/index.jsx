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
    for (let i = 1; i < Math.ceil((criteria.length + 1) / 12); i++) {
      console.log("i", i);
      let newnumber;
      if (i === 1) {
        newnumber = "," + criteria.slice(12, 23);
      } else {
        newnumber = "," + criteria.slice(12 * i, 12 * (i + 1) - 1);
      }
      number += newnumber;
    }
    // console.log("criteria", criteria);
    // console.log("criteria1", criteria.slice(12, 23));
    // console.log("criteria2", criteria.slice(24, 35));
    // console.log("criteria3", criteria.slice(36, 47));
    const res = await getAmmountbyPhone({ phone_number: number });
    if (res.status === 0) {
      message.info(res.msg || "请求成功");
      setData(res.data.user?.game_user || []);
      const newA = res.data.user.game_user.map((e) => {
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
            <Input.TextArea
              placeholder="单次批量查询時，电话号码不能超过 100个，并请换行输入"
              maxLength={1100}
              height={150}
              type="text"
              rows={10}
              value={criteria}
              // onChange={(e) => setcriteria(e.target.value)}
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
