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
          dataIndex: "total_balance",
          render: (text, record) => {
						if (record) {
							return <div>{(record.balance + record.banker_balance).toFixed(6)}</div>;
						} else {
							return <div />;
						}
					}
        },
        {
          title: "变动金额",
          dataIndex: "final_pay",
          render: (text, record) => {
						return <span>{text.toFixed(6)}</span>;
					}
        },
        {
          title: "税收",
          dataIndex: "tax",
          render: (text, record) => {
            return <span>{record.final_pay > 0 ? text.toFixed(6) : ""}</span>
          }
        },
        {
          title: "余额(变动后)",
          dataIndex: "total_final_balance",
          render: (text, record) => {
            if (record) {
              return <div>{(record.final_banker_balance + record.final_balance).toFixed(6)}</div>
            } else {
              return <div />
            }
          }
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
