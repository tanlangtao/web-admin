import React, { Component } from "react";
import { Table } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import GoldDetailorRiskControl from "../../../components/golddetailorRiskcontrol"

class GoldDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props.detailRecord;
    console.log(data);
    if (this.props.action === "risk") {
      return <GoldDetailorRiskControl detailRecord={data} />
    } else {
      return <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={this.initColumns()}
        size="small"
      />
    }
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
