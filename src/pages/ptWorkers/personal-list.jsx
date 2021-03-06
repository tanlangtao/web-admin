import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Select,
  Input,
  Popconfirm,
  Button,
} from "antd";
import Mytable from "../../components/MyTable";
import MyDatePicker from "../../components/MyDatePicker";
import { formatDateYMD } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import {
  reqGetCreditDividendInfo7Day,
} from "../../api/index";
const { Option } = Select;

const init_state = {
  current: 1,
  pageSize: 20,
  data: [],
  count: 0,
  startTime: "",
  endTime: "",
  MyDatePickerValue: null,
  packages: "",
  loading: false,
};
export default class PersonalList extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "玩家id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: 'center',
      width: 100,
    },
    {
      title: "品牌ID",
      dataIndex: "package_id",
      key: "package_id",
      align: 'center',
    },
    {
      title: "统计时间",
      dataIndex: "date",
      key: "date",
      align: 'center',
      width: 200,
    },
    {
      title: "团队充值",
      dataIndex: "top_up",
      key: "top_up",
      align: 'center',
      // width: 150,
    },
    {
      title: "团队兑换",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (record) => {
        return Math.abs(record.withdraw)
      }
    },
    {
      title: "期初金额",
      dataIndex: "first_balance",
      key: "first_balance",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.first_balance * 100) / 100);
      },
    },
    {
      title: "期末金额",
      dataIndex: "last_balance",
      key: "last_balance",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.last_balance * 100) / 100);
      },
    },
    {
      title: "营收",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.amount * 100) / 100);
      },
    },
    {
      title: "分红比例(%）",
      dataIndex: "percent",
      key: "percent",
      align: 'center',
      // width: 150,
    },
    {
      title: "充值成本",
      dataIndex: "top_up_cost",
      key: "top_up_cost",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.top_up_cost * 100) / 100);
      },
    },
    {
      title: "运营成本",
      dataIndex: "activity_cost",
      key: "activity_cost",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.activity_cost * 100) / 100);
      },
    },
    {
      title: "渠道费用",
      dataIndex: "cost_money",
      key: "cost_money",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.cost_money * 100) / 100);
      },
    },
    {
      title: "上期结转金额",
      dataIndex: "last_grant",
      key: "last_grant",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.last_grant * 100) / 100);
      },
    },
    {
      title: "直属下级分红",
      dataIndex: "child_money",
      key: "child_money",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.child_money * 100) / 100);
      },
    },
    // {
    //   title: "直属下级上期结转",
    //   dataIndex: "last_child_grant",
    //   key: "last_child_grant",
    //   align: 'center',
    //   render: (text, record) => {
    //     return (Math.round(record.last_child_grant * 100) / 100);
    //   },
    // },
    {
      title: "应发分红",
      dataIndex: "money",
      key: "money",
      align: 'center',
      render: (text, record) => {
        let sum = record.money + record.last_grant - record.child_money + record.last_child_grant
        return (Math.round(sum * 100) / 100);
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (text, record) => {
        let statusStr = ''
        if (record.status == 0) {
          statusStr = "未发"
        } else if (record.status == 1) {
          statusStr = "已发"
        }
        return statusStr;
      },
    },
  ];
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqGetCreditDividendInfo7Day(
      formatDateYMD(this.state.startTime),
      formatDateYMD(this.state.endTime),
      this.props.admin_user_id,
    );
    // const result = {"status":0,"code":200,"msg":[{"_id":"ac49bbb1f423c7a5ec13d69044cc6d6c","date":"2022-04-30:2022-05-05","id":630997900,"package_id":20,"proxy_user_id":590176383,"type":4,"demand_type":3,"demand_tag":1,"game_tag":0,"money":176.19900000000234,"grant":176.19900000000234,"amount":34190.33,"percent":30,"statement":0,"deficit":0,"statement_type":0,"statement_percent":0,"deficit_percent":0,"cost_percent":2,"cost_type":0,"cost_money":1980.9,"statement_cost_money":0,"deficit_cost_money":0,"status":0,"first_balance":0,"last_balance":10809.67,"top_up":45000,"withdraw":0,"child_money":0,"last_child_grant":0,"last_grant":0,"top_up_cost":1350,"activity_cost":6750}]}
    if (result.code == 200) {
      this.setState({
        data: result.msg,
        count: result.msg && result.msg.length,
        loading: false,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
  };
  getDataByTime(num) {
    let start = ""
    let end = ""
    switch (num) {
      case 1:
        //昨天
        start = moment().startOf("day").subtract(1, "day")
        end = moment().endOf("day").subtract(1, "day")
        break;
      case 2:
        //本周
        start = moment().startOf("week")
        end = moment().endOf("week")
        break;
      case 3:
        //本周
        start = moment().startOf("week").subtract(1, "week")
        end = moment().endOf("week").subtract(1, "week")
        break;
    }
    this.setState({
      startTime: start.format("YYYY-MM-DD HH:mm:ss"),
      endTime: end.format("YYYY-MM-DD HH:mm:ss"),
      current: 1
    }, () => {
      this.getUsers(1, 20)
    })
  }
  componentDidMount(){
    let start = moment().startOf("week")
    let end = moment().endOf("week")
    this.setState({
      startTime: start.format("YYYY-MM-DD HH:mm:ss"),
      endTime: end.format("YYYY-MM-DD HH:mm:ss"),
    })
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    const title = (
      <span>
        <MyDatePicker
          handleValue={(data, dateString) => {
            this.setState({
              startTime: dateString[0],
              endTime: dateString[1],
              MyDatePickerValue: data,
            });
          }}
          value={this.state.MyDatePickerValue}
        />
        &nbsp; &nbsp;
          <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getUsers(1, this.state.pageSize);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => this.getDataByTime(2)}
          size="default"
        >本周
        </LinkButton>
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => this.getDataByTime(3)}
          size="default"
        >上周
        </LinkButton>
        <br />
        <span style={{ color: "red" }}>开始日期必须为周一，结束日期必须为周日</span>
      </span>
    );
    return <Card title={title} >
      <Mytable
        tableData={{
          data,
          count,
          columns: this.initColumns(),
          x: "max-content",
          // y: "65vh",
          current,
          pageSize,
          loading,
        }}
        paginationOnchange={(page, limit) => {
          this.getUsers(page, limit);
        }}
        setPagination={(current, pageSize) => {
          if (pageSize) {
            this.setState({ current, pageSize });
          } else {
            this.setState({ current });
          }
        }}
      /></Card>
  }
}
