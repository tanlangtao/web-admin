import React, { Component } from "react";
import { Table } from "antd";
import { formateDate } from "../../../utils/dateUtils";

class GoldDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props.detailRecord;
    console.log(data);

    return (
      <Table
        bordered
        rowKey={(record,index)=>`${index}`}
        dataSource={data}
        columns={this.initColumns()}
        size="small"
      />
    );
  }
  initColumns = () => {
    if (this.props.action === "check") {
      return [
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
    } else if (this.props.action === "risk") {
      return [
        {
          title: "user_id",
          dataIndex: "id"
        },
        {
          title: "产生来源",
          dataIndex: "pay_account_name"
        },

        {
          title: "余额(变动前)",
          dataIndex: "total_balance"
        },
        {
          title: "变动金额",
          dataIndex: "final_pay",

          sorter: (a, b) => a.total_balance - b.total_balance
        },
        {
          title: "税收",
          dataIndex: "tax"
        },
        {
          title: "余额(变动后)",
          dataIndex: "total_final_balance"
        },
        {
          title: "备注",
          dataIndex: "pay_reason"
        },
        {
          title: "创建时间",
          dataIndex: "create_time"
        }
      ];
    } else {
      return [
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
    }
  };
}

export default GoldDetail;
