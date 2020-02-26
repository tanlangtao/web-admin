import React from "react";
import { Table} from "antd";
// import {  Table,Button} from 'element-react';
// import "element-theme-default";

const DateGameReport = props => {
  let initColumns = () => [
    {
      title: "游戏",
      dataIndex: "game_name"
    },
    {
      title: "玩家总赢额",
      dataIndex: "win_statement_total",
      width: 150
    },
    {
      title: "玩家总输额",
      dataIndex: "lose_statement_total",
      width: 150
    },
    {
      title: "玩家总流水",
      dataIndex: "statement_total",
      width: 150,
      defaultSortOrder:"descend",
      sorter: (a, b) => a.statement_total - b.statement_total,
    },
    {
      title: "盈亏比",
      dataIndex: "statement_ratio",
      width: 150
    }
  ];
  return (
    <Table
      bordered
      rowKey={(record, index) => `${index}`}
      dataSource={props.data}
      columns={initColumns()}
      size="small"
      // scroll={{ x: 3000 }}
      // footer={this.footerData}
    />
  );
};

export default DateGameReport;
