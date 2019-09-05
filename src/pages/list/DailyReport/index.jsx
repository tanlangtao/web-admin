import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Select,
  ConfigProvider,
  DatePicker,
  Button
} from "antd";
import LinkButton from "../../../components/link-button/index";
import {
  dailyReport,
  packageList,
  dateReport,
  gameReport
} from "../../../api/index";
import MoreDetail from "./details";
import { formateDate } from "../../../utils/dateUtils";
import "moment/locale/zh-cn";
import zh_CN from "antd/lib/locale-provider/zh_CN";
const { RangePicker } = DatePicker;
class DailyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      packageList: [],
      count: 0,
      pageSize: 20,
      reportTable: false
    };
  }
  getInitialData = async () => {
    const res = await packageList();
    if (res.status === 0) {
      this.setState({
        packageList: res.data
      });
    } else {
      message.error("网络问题:" + res.msg);
    }
  };
  componentDidMount() {
    this.getInitialData();
  }
  render() {
    const packageNode = this.state.packageList.map(item => {
      return (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      );
    });
    return (
      <Card
        title={
          <div>
            <div>
              <ConfigProvider locale={zh_CN}>
                <RangePicker
                  // defaultValue={[moment().locale("zh-cn")]}
                  // showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD"
                  placeholder={["开始日期", "结束日期"]}
                  onChange={this.dataPickerOnChange}
                />
              </ConfigProvider>
              &nbsp; &nbsp;
              <Select
                placeholder="请选择"
                style={{ width: 120 }}
                onSelect={value => (this.package_id = value)}
              >
                {packageNode}
              </Select>
              &nbsp; &nbsp;
              <button onClick={this.onSearchData}>
                <Icon type="search" />
              </button>
              &nbsp; &nbsp;
            </div>
          </div>
        }
      >
        <div style={{ marginBottom: 20, backgroundColor: "#ddd" }}>
          <span style={{ border: "1px solid #ddd" }}>
            <b>默认所选品牌7天的统计数据</b>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span style={{ border: "1px solid #ddd" }}>
            <b>总流水=玩家赢额+(abs)玩家输额</b>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span style={{ border: "1px solid #ddd" }}>
            <b>盈亏比=(玩家输额(abs) - 玩家赢额) /(玩家输额(abs) + 玩家赢额)</b>
          </span>
        </div>
        <Table
          bordered
          rowKey="package_id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
              this.setState({
                pageSize: pageSize
              });
            },
            onShowSizeChange: (current, size) => {
              this.getUsers(current, size);
            }
          }}
          scroll={{ x: 3000, y: "60vh" }}
        />
        <Modal
          title={this.action === "getDateReport" ? "按日期查看" : "游戏数据"}
          width="80%"
          visible={this.state.reportTable}
          // onOk={this.handleAddData}
          onCancel={() => {
            this.setState({ reportTable: false });
          }}
          footer={null}
        >
          <MoreDetail reportData={this.reportData} action={this.action} />
        </Modal>
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "品牌",
      dataIndex: "package_nick",
      width: 120
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
      // render: (text, record) => (
      //   <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
      //     {text}
      //   </div>
      // )
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
          <LinkButton 
          // onClick={() => this.getDateReport(record)}
          >
            日期
          </LinkButton>
          <LinkButton onClick={() => this.getGameReport(record)}>
            游戏
          </LinkButton>
        </span>
      )
    }
  ];
  dataPickerOnChange = (date, dateString) => {
    this.startTime = dateString[0] + " 00:00:00";
    this.endTime = dateString[1] + " 00:00:00";
  };
  onSearchData = async () => {
    const res = await dailyReport(
      1,
      20,
      this.package_id,
      this.startTime,
      this.endTime
    );
    const newRes = this.parseData(res);
    console.log("newRes", newRes);
    this.setState({ data: newRes.data, count: newRes.count });
  };
  parseData = res => {
    console.log("res:", res);
    var length = 0;
    var format_data = [];
    if (res.status === 0 && res.data) {
      //用户  (e.active_user_number = e.login_user_number - e.regin_user_number),
      if (res.data.user) {
        res.data.user
          .filter(e => e && e._id)
          .map(
            e => ((e.package_id = parseInt(e._id.package_id)), delete e._id)
          );
      }
      //充提交易所
      if (res.data.order) {
        res.data.order
          .filter(e => e && e._id)
          .map(
            e => (
              (e.first_pay_user_number = e.first_pay_user.length),
              (e.pay_user_number = e.pay_user.length),
              (e.first_pay_user_number_res = e.first_pay_user_res.length),
              (e.pay_user_number_res = e.pay_user_res.length),
              (e.exchange_user_number = e.exchange_user.length),
              (e.exchange_user_number_res = e.exchange_user_res.length),
              (e.package_id = parseInt(e._id.package_id)),
              delete e._id
            )
          );
        // 合并
        res.data.user.map(e =>
          Object.assign(
            e,
            res.data.order.find(d => d.package_id === e.package_id)
          )
        );
      }

      //游戏
      if (res.data.game) {
        res.data.game
          .filter(e => e && e._id)
          .map(
            e => (
              (e.statement_ratio = (
                (Math.abs(e.lose_statement_total) - e.win_statement_total) /
                (e.win_statement_total + Math.abs(e.lose_statement_total))
              ).toFixed(4)),
              (e.win_statement_total =
                Math.round(e.win_statement_total * 10000) / 10000),
              (e.lose_statement_total =
                Math.round(e.lose_statement_total * 10000) / 10000),
              (e.statement_total =
                Math.round(
                  (e.win_statement_total + Math.abs(e.lose_statement_total)) *
                    10000
                ) / 10000),
              (e.package_id = parseInt(e._id.package_id)),
              delete e._id
            )
          );

        // 合并
        res.data.user.map(e =>
          Object.assign(
            e,
            res.data.game.find(d => d.package_id === e.package_id)
          )
        );
      }

      length = res.data.user.length;
      format_data = res.data.user;
      console.log("res.data.user assign后", res.data.user);
    }

    return {
      code: res.code,
      msg: res.msg,
      count: length,
      data: format_data
    };
  };
  parseDateData = res => {
    console.log(res);
    var length = 0;
    var format_data = [];
    if (res.status === 0 && res.data) {
      //用户 (e.active_user_number = e.login_user_number - e.regin_user_number),
      if (res.data.user) {
        res.data.user.map(e => ((e.date = e._id.create_time), delete e._id));
      }
      //充提交易所
      if (res.data.order) {
        //res.data.order.filter(e => (e && e._id)).map(e => ((e.exchange_money_total = Math.abs(e.exchange_money_total)), (e.date = e._id.create_time), delete e._id));
        res.data.order
          .filter(e => e && e._id)
          .map(
            e => (
              (e.first_pay_user_number = e.first_pay_user.length),
              (e.pay_user_number = e.pay_user.length),
              (e.first_pay_user_number_res = e.first_pay_user_res.length),
              (e.pay_user_number_res = e.pay_user_res.length),
              (e.exchange_user_number = e.exchange_user.length),
              (e.exchange_user_number_res = e.exchange_user_res.length),
              (e.date = e._id.create_time),
              delete e._id
            )
          );
        // 合并
        res.data.user.map(e =>
          Object.assign(e, res.data.order.find(d => d.date === e.date))
        );
      }
      //游戏
      if (res.data.game) {
        //四舍五入保留四位小数
        res.data.game
          .filter(e => e && e._id)
          .map(
            e => (
              (e.statement_ratio = (
                (Math.abs(e.lose_statement_total) - e.win_statement_total) /
                (e.win_statement_total + Math.abs(e.lose_statement_total))
              ).toFixed(4)),
              (e.win_statement_total =
                Math.round(e.win_statement_total * 10000) / 10000),
              (e.lose_statement_total =
                Math.round(e.lose_statement_total * 10000) / 10000),
              (e.statement_total =
                Math.round(
                  (e.win_statement_total + Math.abs(e.lose_statement_total)) *
                    10000
                ) / 10000),
              (e.date = e._id.create_time),
              delete e._id
            )
          );

        // 合并
        res.data.user.map(e =>
          Object.assign(e, res.data.game.find(d => d.date === e.date))
        );
      }

      // 排序
      res.data.user.sort(
        (a, b) =>
          parseInt(b.date.replace(/-/g, "")) -
          parseInt(a.date.replace(/-/g, ""))
      );
      length = res.data.user.length;
      format_data = res.data.user;
      console.log(res.data.user);
    }
    return {
      code: res.code,
      msg: res.msg,
      count: length,
      data: format_data
    };
  };
  getDateReport = async record => {
    const res = await dateReport(
      1,
      20,
      record.package_id,
      this.startTime,
      this.endTime
    );
    const reportData = this.parseDateData(res);
    this.reportData = reportData;
    console.log("reportData", reportData);
    this.action = "getDateReport";
    this.setState({ reportTable: true });
  };
  getGameReport = record => {};
}

export default DailyReport;
