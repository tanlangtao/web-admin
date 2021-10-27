import React, { useState, useEffect } from "react";

import { Card, message, Input, Table, Select, Button, Icon, Modal } from "antd";
import _ from "lodash-es";
const OnlineGame = (props) => {
  let initColumns = [
    {
      title: "遊戲名稱",
      dataIndex: "gamename",
    },
    {
      title: "人数",
      dataIndex: "count",
    },
  ];

  return (
    <Table
      bordered
      size="small"
      rowKey={(record, index) => `${index}`}
      dataSource={props.data}
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
export default OnlineGame;
