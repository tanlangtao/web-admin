import React, { Component } from "react";
import { Table, Button, Modal } from "antd";
// import {  Table,Button} from 'element-react';
// import "element-theme-default";
import { oneDayGameReport } from "../../../api/index";
import DateGameReport from "./dateGameReport";

class MoreDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      isGameReportShow: false,
      nextLevelData: ""
    };
  }
  render() {
    const { data } = this.props.reportData;
    return (
      <div>
        <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={data}
          columns={this.initColumns()}
          size="small"
          scroll={{ x: 2000 }}
          // footer={this.footerData}
        />
        <Modal
          title={this.state.date + "/游戏数据"}
          width="80%"
          visible={this.state.isGameReportShow}
          onCancel={() => {
            this.setState({ isGameReportShow: false });
          }}
          footer={null}
        >
          <DateGameReport data={this.state.nextLevelData} />
        </Modal>
      </div>
    );
  }
  initColumns = () => {
    if (this.props.action === "getDateReport") {
      let tableHeader = [
        {
          title: "日期",
          dataIndex: "date"
        },
        {
          title: "新增用户",
          dataIndex: "regin_user_number"
        },
        {
          title: "活跃用户",
          dataIndex: "active_user_number"
        },
        {
          title: "官方首充用户",
          dataIndex: "first_pay_user_number"
        },
        {
          title: "官方首充金额",
          dataIndex: "first_pay_money_total"
        },
        {
          title: "官方充值用户",
          dataIndex: "pay_user_number"
        },
        {
          title: "官方充值金额",
          dataIndex: "pay_money_total"
        },
        {
          title: "人工首充用户",
          dataIndex: "first_pay_user_number_res"
        },
        {
          title: "人工首充金额",
          dataIndex: "first_pay_money_total_res"
        },
        {
          title: "人工充值用户",
          dataIndex: "pay_user_number_res"
        },
        {
          title: "人工充值金额",
          dataIndex: "pay_money_total_res"
        },
        {
          title: "官方兑换用户",
          dataIndex: "exchange_user_number"
        },
        {
          title: "官方兑换金额",
          dataIndex: "exchange_money_total"
        },
        {
          title: "人工兑换用户",
          dataIndex: "exchange_user_number_res"
        },
        {
          title: "人工兑换金额",
          dataIndex: "exchange_money_total_res"
        },
        {
          title: "玩家总赢额",
          dataIndex: "win_statement_total"
        },
        {
          title: "玩家总输额",
          dataIndex: "lose_statement_total"
        },
        {
          title: "玩家总流水",
          dataIndex: "statement_total"
        },
        {
          title: "盈亏比",
          dataIndex: "statement_ratio"
        },
        {
          title: "操作",
          dataIndex: "",
          render: (text, record, index) => (
            <span>
              <Button size="small" onClick={() => this.getGameReport(record)}>
                游戏
              </Button>
            </span>
          )
        }
      ];
      return tableHeader;
    }
  };
  footerData = page => {
    console.log(page);
    return (
      <tr>
        <td>合计</td>
        <td style={{ width: 80 }}>regin_user_number</td>
        <td>regin_user_number</td>
        <td>regin_user_number</td>
        <td>regin_user_number</td>
        <td>regin_user_number</td>
      </tr>
    );
  };
  getGameReport = async record => {
    const res = await oneDayGameReport(
      1,
      20,
      this.props.package_id,
      record.date
    );
    this.props.parse(res);
    this.setState({
      date: record.date,
      isGameReportShow: true,
      nextLevelData: res.data
    });
  };
}

export default MoreDetail;
