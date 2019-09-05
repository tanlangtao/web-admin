import React, { Component } from "react";
import { Table, Button } from "antd";
// import { Table, Button } from 'element-react';

// import 'element-theme-default';
import { formateDate } from "../../../utils/dateUtils";

class MoreDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props.reportData;
    return (
      <Table
        border={true}
        showSummary={true}
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={this.initColumns()}
        size="small"
        scroll={{ x: 3000 }}
        footer={this.footerData}
      />
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
          dataIndex: "regin_user_number",
          width: 80
        },
        {
          title: "活跃用户",
          dataIndex: "active_user_number",
          width: 80
        },
        {
          title: "官方首充用户",
          dataIndex: "first_pay_user_number",
          width: 150
        },
        {
          title: "官方首充金额",
          dataIndex: "first_pay_money_total",
          width: 150
        },
        {
          title: "官方充值用户",
          dataIndex: "pay_user_number",
          width: 150
        },
        {
          title: "官方充值金额",
          dataIndex: "pay_money_total",
          width: 150
        },
        {
          title: "人工首充用户",
          dataIndex: "first_pay_user_number_res",
          width: 150
        },
        {
          title: "人工首充金额",
          dataIndex: "first_pay_money_total_res",
          width: 150
        },
        {
          title: "人工充值用户",
          dataIndex: "pay_user_number_res",
          width: 150
        },
        {
          title: "人工充值金额",
          dataIndex: "pay_money_total_res",
          width: 150
        },
        {
          title: "官方兑换用户",
          dataIndex: "exchange_user_number",
          width: 150
        },
        {
          title: "官方兑换金额",
          dataIndex: "exchange_money_total",
          width: 150
        },
        {
          title: "人工兑换用户",
          dataIndex: "exchange_user_number_res",
          width: 150
        },
        {
          title: "人工兑换金额",
          dataIndex: "exchange_money_total_res",
          width: 150
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
          width: 150
        },
        {
          title: "盈亏比",
          dataIndex: "statement_ratio",
          width: 150
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
    // else {
    //   return [
    //     {
    //       title: "备注人",
    //       dataIndex: "remark_name"
    //     },
    //     {
    //       title: "内容",
    //       dataIndex: "content"
    //     },
    //     {
    //       title: "备注时间",
    //       dataIndex: "created_at",
    //       render: formateDate
    //     }
    //   ];
    // }
  };
  footerData = page => {
    console.log(page);
    // page.map(item=>{
    //   return 
    // })
    return <tr>
      <td>合计</td>
      <td style={{width:80}}>regin_user_number</td>
      <td>regin_user_number</td>
      <td>regin_user_number</td>
      <td>regin_user_number</td>
      <td>regin_user_number</td>
    </tr>;
  };
  // getDateReport = async record => {
  //   const res = await dateReport(1, 20, record.package_id);
  //   const reportData = this.parseDateData(res);
  //   this.reportData = reportData;
  //   this.action='getDateReport'
  //   this.setState({ reportTable: true });
  // };
}

export default MoreDetail;
