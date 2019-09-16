import React from "react";
import { Table } from "antd";
import { formateDate } from "../../../utils/dateUtils";
const EditForm = props => {
  const data = props.record||[];
  const action = props.action;
  let initColumns = [];
  switch (action) {
    case "detail":
      initColumns = [
        {
          title: "user_id",
          dataIndex: "user_id"
        },
        {
          title: "申请数量",
          dataIndex: ""
        },
        {
          title: "成交数量",
          dataIndex: ""
        },
        {
          title: "创建时间",
          dataIndex: ""
        }
      ];
      break;
    case "check":
      initColumns = [
        {
          title: "审核人",
          dataIndex: "review_name"
        },
        {
          title: "审核时间",
          dataIndex: "review_at",
          render: formateDate
        }
      ];
      break;
    case "operatorRemark":
      initColumns = [
        {
          title: "备注人",
          dataIndex: "remark_name"
        },
        {
          title: "内容",
          dataIndex: "content"
        },
        {
          title: "备注时间",
          dataIndex: "created_at",
          render: formateDate
        }
      ];
      break;
    default:
      break;
  }
  return (
    <Table
      bordered
      rowKey={(record, index) => `${index}`}
      dataSource={data}
      columns={initColumns}
      size="small"
    />
  );
};

export default EditForm;
