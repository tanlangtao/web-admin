import React, { useState, useEffect } from "react";
import { Card, message, Input, Table, Button } from "antd";
import { getAmmountbyPhone } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import { array } from "prop-types";
export default () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [criteria, setcriteria] = useState();
  const onButtonClick = async () => {
    //將輸入的電話號碼每11位數加,
    let number = criteria.slice(0, 11);
    for (let i = 1; i < Math.ceil((criteria.length + 1) / 12); i++) {
      let newnumber;
      newnumber = "," + criteria.slice(12 * i, 12 * (i + 1) - 1);
      number += newnumber;
    }
    // 分 100 筆電話號碼請求
    let sliceArray = [];
    let sliceArrayNumber = number.split(",");
    let perNumber = 100;
    for (
      let i = 0;
      i < Math.ceil(number.split(",").length / perNumber) * perNumber;
      i = i + perNumber
    ) {
      sliceArray.push({
        phone_number: sliceArrayNumber.slice(i, (i + 1) * perNumber).join(","),
      });
      console.log("sliceArray", sliceArray);
    }
    let resTest;
    //存取 data.user.game_user
    let gameUserArray1 = [];
    //存取 data.order
    let orderArray1 = [];
    //每100筆分一組 做分次請求
    for (const player of sliceArray) {
      resTest = await getAmmountbyPhone(player);
      if (resTest.status === 0) {
        gameUserArray1 = gameUserArray1.concat(resTest?.data.user.game_user);
        orderArray1 = orderArray1.concat(resTest?.data.order);
      }
    }
    if (resTest.status === 0 || resTest.status === -1) {
      message.info(resTest.msg || "请求成功");
      const objectAssignData = gameUserArray1.map((e) => {
        return Object.assign(
          e,
          orderArray1.find((d) => d.id === e.id)
        );
      });
      //輸入返回沒有數據的電話號碼
      const newNumberData = number
        .split(",")
        .filter((item) => {
          return !objectAssignData.some(
            (object) => object.phone_number === item
          );
        })
        .map((item) => {
          return { phone_number: item };
        });
      let newobjectAssignData = objectAssignData.concat(newNumberData);
      setData(newobjectAssignData || []);
    } else {
      message.info(resTest.msg || "请求失败");
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
              placeholder="单次批量查询時，电话号码不能超过 1000个，并请换行输入"
              // maxLength={11000}
              height={150}
              type="text"
              rows={10}
              value={criteria}
              onChange={(e) => setcriteria(e.target.value.replace(/[, ]/g, ""))}
            />
          </div>
          <div style={{ marginTop: 15 }}>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                if (
                  criteria.length === 11 ||
                  (criteria.length - 11) % 12 === 0
                ) {
                  onButtonClick();
                } else {
                  message.info(
                    "请输入正确格式，每行电话号码11码，每行不得为空"
                  );
                }
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
          // total: count,
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
