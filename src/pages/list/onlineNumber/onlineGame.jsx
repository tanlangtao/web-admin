import React from "react";
import { Table } from "antd";
const OnlineGame = (props) => {
  let initColumns = [
    {
      title: "游戏名称",
      dataIndex: "gamename",
    },
    {
      title: "人数",
      dataIndex: "count",
      render: (record, text) => record.length,
    },
    {
      title: "玩家ID",
      dataIndex: "id",
      width: 200,
      render: (record, text) => {
        return record.join();
      },
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
