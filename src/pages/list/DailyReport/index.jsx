import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Select } from "antd";
import {
  dailyReport,
  userPackageList,
  dateReport,
  gameReport,
} from "../../../api/index";

import moment from "moment";
import _, { isArray } from "lodash-es";

import LinkButton from "../../../components/link-button/index";
import MoreDetail from "./details";
import MyDatePicker from "../../../components/MyDatePicker";
import DateGameReport from "./dateGameReport";
import { reverseNumber } from "../../../utils/commonFuntion";

class DailyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      packageList: [],
      count: 0,
      pageSize: 20,
      isDateReportShow: false,
      isGameReportShow: false,
      package_id_for_nextpage: null,
      reportData: {},
      isLoading: false,
    };
    this.package_id = 0;
  }
  getInitialData = async () => {
    const res = await userPackageList();
    if (res.status === 0) {
      this.setState({
        packageList: res.data.list,
      });
    }
  };

  componentDidMount() {
    this.getInitialData();
  }
  render() {
    let packageNode;
    if (this.state.packageList) {
      packageNode = this.state.packageList.map((item) => {
        return (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        );
      });
    }

    return (
      <Card
        title={
          <div>
            <div>
              <MyDatePicker
                handleValue={(data, val) => {
                  let diffDays = moment(val[1]).diff(moment(val[0]), "days");
                  if (diffDays > 31) {
                    message.info("请选择时间范围小于31天");
                  } else if (data && data.length !== 0) {
                    this.startTime = moment(data[0].valueOf()).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                    this.endTime = moment(data[1].valueOf() - 1).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                  } else {
                    this.startTime = "";
                    this.endTime = "";
                  }
                }}
              />
              &nbsp; &nbsp;
              <Select
                placeholder="请选择"
                style={{ width: 120 }}
                defaultValue={0}
                onSelect={(value) => (this.package_id = value)}
              >
                <Select.Option value={0} key={0}>
                  全部
                </Select.Option>
                {packageNode}
              </Select>
              &nbsp; &nbsp;
              <LinkButton onClick={this.onSearchData} size="default">
                <Icon type="search" />
              </LinkButton>
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
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          scroll={{ x: "max-content" }}
          loading={this.state.isLoading}
          pagination={{
            defaultPageSize: 20,
            defaultCurrent: 1,
          }}
        />
        {this.state.isDateReportShow && (
          <Modal
            title="按日期查看"
            width="80%"
            visible={this.state.isDateReportShow}
            onCancel={() => {
              this.setState({ isDateReportShow: false });
            }}
            footer={null}
          >
            <MoreDetail
              reportData={this.state.reportData}
              action={this.action}
              package_id={this.state.package_id_for_nextpage}
              parse={this.parseGameData}
            />
          </Modal>
        )}

        {this.state.isGameReportShow && (
          <Modal
            title="游戏数据"
            width="80%"
            visible={this.state.isGameReportShow}
            onCancel={() => {
              this.setState({ isGameReportShow: false });
            }}
            footer={null}
          >
            <DateGameReport
              data={this.state.reportData}
              start_time={moment(this.startTime).valueOf() / 1000}
              end_time={moment(this.endTime).valueOf() / 1000}
              package_id={this.state.package_id_for_nextpage}
              timefortitle={`${this.startTime}-${this.endTime}`}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "品牌",
      dataIndex: "name",
      fixed: "left",
      width: 100,
    },
    {
      title: "新增用户",
      dataIndex: "regin_user_number",
      render: (text) => text || 0,
    },
    {
      title: "活跃用户",
      dataIndex: "active_user_number",
      render: (text) => text || 0,
    },
    {
      title: "官方首充用户",
      dataIndex: "first_pay_user_number",
    },
    {
      title: "官方首充金额",
      dataIndex: "first_pay_money_total",
      render: reverseNumber,
    },
    {
      title: "官方充值用户",
      dataIndex: "pay_user_number",
    },
    {
      title: "官方充值金额",
      dataIndex: "pay_money_total",
      render: reverseNumber,
    },
    {
      title: "人工首充用户",
      dataIndex: "first_pay_user_number_res",
    },
    {
      title: "人工首充金额",
      dataIndex: "first_pay_money_total_res",
      render: reverseNumber,
    },
    {
      title: "人工充值用户",
      dataIndex: "pay_user_number_res",
    },
    {
      title: "人工充值金额",
      dataIndex: "pay_money_total_res",
      render: reverseNumber,
    },
    {
      title: "官方兑换用户",
      dataIndex: "exchange_user_number",
    },
    {
      title: "官方兑换金额",
      dataIndex: "exchange_money_total",
      render: reverseNumber,
    },
    {
      title: "人工兑换用户",
      dataIndex: "exchange_user_number_res",
    },
    {
      title: "人工兑换金额",
      dataIndex: "exchange_money_total_res",
      render: reverseNumber,
    },
    {
      title: "玩家总赢额",
      dataIndex: "win_statement_total",
      render: (text) => reverseNumber(text) || 0,
    },
    {
      title: "玩家总输额",
      dataIndex: "lose_statement_total",
      render: (text) => reverseNumber(text) || 0,
    },
    {
      title: "玩家总流水",
      dataIndex: "statement_total",
      render: (text) => reverseNumber(text) || 0,
    },
    {
      title: "盈亏比",
      dataIndex: "statement_ratio",
      render: (text) => reverseNumber(text) || 0,
    },
    {
      title: "有效投注",
      dataIndex: "bet_money_total",
      render: (text) => reverseNumber(text) || 0,
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.getDateReport(record)}>
            日期
          </LinkButton>
          <LinkButton onClick={() => this.getGameReport(record)}>
            游戏
          </LinkButton>
        </span>
      ),
    },
  ];
  onSearchData = async () => {
    this.setState({ isLoading: true });
    if (!this.startTime) {
      message.info("请选择时间日期");
      return;
    }
    const res = await dailyReport(
      1,
      20,
      parseInt(this.package_id),
      this.startTime,
      this.endTime
    );
    if (res.status !== 0) {
      message.info(res.msg || JSON.stringify(res));
      return;
    }
    let newGameData = this.state.packageList.map((e) => {
      return {
        package_id: parseInt(e.id),
        win_statement_total: 0,
        lose_statement_total: 0,
        bet_money_total: 0,
      };
    });
    if (res?.data?.game) {
      res.data.game.forEach((e1) => {
        e1.forEach((e2) => {
          newGameData.forEach((target_e) => {
            if (e2.package_id === target_e.package_id) {
              target_e.win_statement_total += e2.win_statement_total;
              target_e.lose_statement_total += e2.lose_statement_total;
              target_e.bet_money_total += e2.bet_money_total;
            }
          });
        });
      });
      res.data.game = newGameData;
    }
    const newRes = this.parseData(res);
    this.setState({
      data: newRes.data || [],
      count: newRes.count,
      isLoading: false,
    });
  };
  parseData = (res) => {
    var length = 0;
    var format_data = [];
    if (!res.data.game) {
      res.data.game = [];
    }
    if (!res.data.user) {
      res.data.user = [];
    }
    if (res.status === 0 && res.data) {
      if (res.data.user) {
        res.data.user
          .filter((e) => e && e.package_id)
          .map(
            (e) => (
              (e.active_user_number =
                // eslint-disable-next-line
                e.login_user_number - e.regin_user_number),
              (e.package_id = parseInt(e.package_id))
            )
          );
      }
      //充提交易所
      if (res.data.order) {
        res.data.order
          .filter((e) => e && e.package_id)
          .map(
            (e) => (
              // eslint-disable-next-line
              (e.first_pay_user_number = e.first_pay_user.length),
              (e.pay_user_number = e.pay_user.length),
              (e.first_pay_user_number_res = e.first_pay_user_res.length),
              (e.pay_user_number_res = e.pay_user_res.length),
              (e.exchange_user_number = e.exchange_user.length),
              (e.exchange_user_number_res = e.exchange_user_res.length)
              //(e.package_id = parseInt(e._id.package_id)),
              //delete e._id
            )
          );
        // 合并
        res.data.order.map((e) =>
          Object.assign(
            e,
            res.data.user.find((d) => d.package_id === e.package_id)
          )
        );
      }

      //游戏
      if (res.data.game) {
        res.data.game
          .filter((e) => e && e.package_id)
          .map(
            (e) => (
              (e.statement_ratio = // eslint-disable-next-line
              (
                (Math.abs(e.lose_statement_total) - e.win_statement_total) /
                (e.win_statement_total + Math.abs(e.lose_statement_total))
              )
                // eslint-disable-next-line
                .toFixed(4)),
              // eslint-disable-next-line
              (e.win_statement_total =
                Math.round(e.win_statement_total * 10000) / 10000),
              (e.lose_statement_total =
                Math.round(e.lose_statement_total * 10000) / 10000),
              (e.statement_total =
                Math.round(
                  (e.win_statement_total + Math.abs(e.lose_statement_total)) *
                    10000
                ) / 10000)
              //(e.package_id = parseInt(e._id.package_id)),
              //delete e._id
            )
          );
        // 合并
        res.data.order.forEach((e) => {
          Object.assign(
            e,
            res.data.game.find((d) => d.package_id === e.package_id)
          );
          Object.assign(
            e,
            this.state.packageList.find((d) => parseInt(d.id) === e.package_id)
          );
        });
      }
      length = res.data.order.length;
      format_data = _.orderBy(res.data.order, "package_id");
      if (parseInt(this.package_id) === 0) {
        //对子品牌做排序
        let new_data = _.orderBy(res.data.order, "package_id");
        let robot_rowdata = _.remove(new_data, function (n) {
          return n.package_id === 5;
        });
        if (robot_rowdata[0]) format_data = new_data.concat(robot_rowdata);
        // console.log("robot_rowdata:", robot_rowdata);
      }
      //增加总计栏
      let sum_row = {};
      let arr = this.initColumns();
      arr.forEach((element) => {
        sum_row[element.dataIndex] = 0;
      });
      format_data.forEach((ele) => {
        for (const key in sum_row) {
          sum_row[key] += ele[key] || 0;
        }
      });
      sum_row.name = "合计";
      if (parseInt(this.package_id) === 0) {
        sum_row.package_id = 0;
      } else {
        sum_row.package_id = parseInt(this.package_id);
      }

      sum_row.statement_ratio = (
        (Math.abs(sum_row.lose_statement_total) - sum_row.win_statement_total) /
        (sum_row.win_statement_total + Math.abs(sum_row.lose_statement_total))
      ).toFixed(4);
      format_data.push(sum_row);
      // console.log("res.data.user assign后", format_data, length);
    } else {
      message.info(res.msg);
    }
    return {
      code: res.code,
      msg: res.msg,
      count: length,
      data: format_data,
    };
  };
  parseDateData = (res) => {
    // console.log(res);
    var length = 0;
    var format_data = [];
    if (res.status === 0 && res.data) {
      if (res.data.user) {
        res.data.user.map(
          (e) => (
            (e.active_user_number =
              // eslint-disable-next-line
              e.login_user_number - e.regin_user_number),
            (e.date = e.login_time),
            delete e.login_time
          )
        );
      }
      //充提交易所
      if (res.data.order) {
        //res.data.order.filter(e => (e && e._id)).map(e => ((e.exchange_money_total = Math.abs(e.exchange_money_total)), (e.date = e._id.create_time), delete e._id));
        res.data.order
          .filter((e) => e && e.create_time)
          .map(
            (e) => (
              // eslint-disable-next-line
              (e.first_pay_user_number = e.first_pay_user.length),
              (e.pay_user_number = e.pay_user.length),
              (e.first_pay_user_number_res = e.first_pay_user_res.length),
              (e.pay_user_number_res = e.pay_user_res.length),
              (e.exchange_user_number = e.exchange_user.length),
              (e.exchange_user_number_res = e.exchange_user_res.length),
              (e.date = e.create_time)
              //delete e._id
            )
          );
        // 合并
        res.data.user.map((e) =>
          Object.assign(
            e,
            res.data.order.find((d) => d.date === e.date)
          )
        );
      }
      //游戏
      if (res.data.game) {
        //四舍五入保留四位小数
        res.data.game.map(
          (e) => (
            (e.statement_ratio = (
              (Math.abs(e.lose_statement_total) - e.win_statement_total) /
              (e.win_statement_total + Math.abs(e.lose_statement_total))
            )
              // eslint-disable-next-line
              .toFixed(4)),
            (e.win_statement_total =
              Math.round(e.win_statement_total * 10000) / 10000),
            (e.lose_statement_total =
              Math.round(e.lose_statement_total * 10000) / 10000),
            (e.statement_total =
              Math.round(
                (e.win_statement_total + Math.abs(e.lose_statement_total)) *
                  10000
              ) / 10000),
            (e.date = e.create_time)
            //delete e._id
          )
        );
        // 合并
        res.data.user.map((e) =>
          Object.assign(
            e,
            res.data.game.find((d) => d.date === e.date)
          )
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
      // console.log(res.data.user);
      // console.log("res.data.package_id assign后", res.data.order.package_id);
    }
    return {
      code: res.code,
      msg: res.msg,
      count: length,
      data: format_data,
    };
  };

  parseGameData = (res) => {
    if (res.status === 0 && res.data) {
      let error = [];
      let success = [];
      res.data.map((ele, index) => {
        //有取得數據
        if (isArray(ele)) {
          ele.map((e) => success.push(e));
          //該時段異常
        } else {
          error.push(ele);
        }
      });
      console.log("success", success);
      //將所有資料按遊戲id分別加總輸贏總額與總人數
      const summary = {};
      success.forEach((data) => {
        if (summary[data.game_id]) {
          summary[data.game_id]["win_statement_total"] +=
            data.win_statement_total;
          summary[data.game_id]["lose_statement_total"] +=
            data.lose_statement_total;
          summary[data.game_id]["count"] += data.count;
          summary[data.game_id]["game_name"] = data.game_name;
          summary[data.game_id]["bet_money_total"] += data.bet_money_total;
        } else {
          summary[data.game_id] = {
            win_statement_total: data.win_statement_total,
            lose_statement_total: data.lose_statement_total,
            count: data.count,
            game_name: data.game_name,
            bet_money_total: data.bet_money_total,
          };
        }
      });
      const newData = Object.entries(summary).map(
        ([
          game_id,
          {
            win_statement_total,
            lose_statement_total,
            count,
            game_name,
            bet_money_total,
          },
        ]) => {
          return {
            game_id,
            win_statement_total,
            lose_statement_total,
            count,
            game_name,
            bet_money_total,
          };
        }
      );
      //加入總流水&盈虧比
      newData.forEach((e) => {
        e.statement_ratio = (
          (Math.abs(e.lose_statement_total) - e.win_statement_total) /
          (e.win_statement_total + Math.abs(e.lose_statement_total))
        ).toFixed(4);
        e.win_statement_total =
          Math.round(e.win_statement_total * 10000) / 10000;
        e.lose_statement_total =
          Math.round(e.lose_statement_total * 10000) / 10000;
        e.statement_total =
          Math.round(
            (e.win_statement_total + Math.abs(e.lose_statement_total)) * 10000
          ) / 10000;
      });
      console.log("newData", newData);
      return { footer: error, list: newData };
    }
  };

  getDateReport = async (record) => {
    message.loading({
      content: "查询中",
      key: "loadingMsg",
      duration: 0,
    });
    const res = await dateReport(
      1,
      20,
      record.package_id,
      this.startTime,
      this.endTime
    );
    message.destroy("loadingMsg");
    message.info(res.msg);
    const reportData = this.parseDateData(res);
    this.action = "getDateReport";
    this.setState({
      isDateReportShow: true,
      package_id_for_nextpage: record.package_id,
      reportData: reportData,
    });
  };
  getGameReport = async (record) => {
    message.loading({
      content: "查询中",
      key: "loadingMsg",
      duration: 0,
    });
    const res = await gameReport(
      1,
      20,
      record.package_id,
      this.startTime,
      this.endTime
    );
    message.destroy("loadingMsg");
    message.info(res.msg);
    const reportData = this.parseGameData(res);
    console.log("reportData", reportData);
    this.setState({
      isGameReportShow: true,
      date: record.date,
      reportData: reportData,
      package_id_for_nextpage: record.package_id,
    });
  };
}

export default DailyReport;
