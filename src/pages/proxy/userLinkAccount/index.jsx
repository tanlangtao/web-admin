import React, { useState } from "react";
import { Card, Input, message } from "antd";
import { getUserLinkAccountsTotal } from "../../../api/index";

export default () => {
  const [data, setData] = useState([]);
  //查询代理链实时余额
  const proxySearch = async (value) => {
    let reg = new RegExp("^[0-9]*$");
    if (!value) {
      message.info("请输入玩家ID");
      return;
    } else if (!reg.test(value)) {
      message.info("请输入有效ID");
      return;
    }
    let reqData = {
      id: value,
    };
    const res = await getUserLinkAccountsTotal(reqData);
    if (res.code === 200) {
      message.success(res.Status);
      let sortData = JSON.stringify(res);
      setData(sortData || []);
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
            placeholder="请输入玩家ID"
            enterButton
            onSearch={(value) => {
              proxySearch(value);
            }}
          />
        </div>
      }
    >
      <div>{data || "-"}</div>
    </Card>
  );
};
