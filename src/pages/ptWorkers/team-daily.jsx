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
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
    reqGetCreditDividendInfoList,
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
    packages:"",
    loading: false,
    searchID:"",
    platform_name:""
};
export default class TeamDaily extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "统计时间",
      dataIndex: "date",
      key: "date",
      fixed: "left",
      align: 'center',
      width: 200,
    },
    {
      title: "玩家id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: 'center',
      width: 100,
    },
    {
      title: "今日团队充值",
      dataIndex: "top_up",
      key: "top_up",
      align: 'center',
      // width: 150,
    },
    {
      title: "今日团队兑换",
      dataIndex: "withdraw",
      key: "withdraw",
      align: 'center',
      // width: 100,
    },
    {
      title: "期初金额",
      dataIndex: "first_balance",
      key: "first_balance",
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (Math.round(record.first_balance * 1000000) / 1000000).toFixed();
      },
    },
    {
      title: "期末金额",
      dataIndex: "last_balance",
      key: "last_balance",
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (Math.round(record.last_balance * 1000000) / 1000000).toFixed();
      },
    },
    {
      title: "今日营收",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
      width: 120,
      render: (text, record) => {
        return (Math.round(record.amount * 1000000) / 1000000).toFixed();
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
      title: "今日充值成本",
      dataIndex: "top_up_cost",
      key: "top_up_cost",
      align: 'center',
      // width: 150,
    },
    {
      title: "今日活动成本",
      dataIndex: "activity_cost",
      key: "activity_cost",
      align: 'center',
    },
    {
      title: "今日渠道费用",
      dataIndex: "cost_money",
      key: "cost_money",
      align: 'center',
      // width: 200,
    },
    {
      title: "今日预估团队分红",
      dataIndex: "money",
      key: "money",
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (Math.round(record.money * 1000000) / 1000000).toFixed();
      },
    },
  ];
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqGetCreditDividendInfoList(
      this.state.startTime,
      this.state.endTime,
      this.state.searchID,
      this.props.package_id,
    );
    // const result = {"status":0,"code":200,"msg":[{"_id":"53c430d9aff2e955ca0beb399cd966b1","date":"2022-05-05:2022-05-05","id":630997900,"package_id":20,"proxy_user_id":590176383,"type":4,"demand_type":3,"demand_tag":1,"game_tag":0,"money":9194.535,"grant":0,"amount":36531.45,"percent":30,"statement":0,"deficit":0,"statement_type":0,"statement_percent":0,"deficit_percent":0,"cost_percent":2,"cost_type":0,"cost_money":864.9,"statement_cost_money":0,"deficit_cost_money":0,"status":0,"first_balance":42341.119999999995,"last_balance":10809.67,"top_up":5000,"withdraw":0,"top_up_cost":150,"activity_cost":750},{"_id":"313c663e4ca6c18ecc847da99232efa1","date":"2022-05-04:2022-05-04","id":630997900,"package_id":20,"proxy_user_id":590176383,"type":4,"demand_type":3,"demand_tag":1,"game_tag":0,"money":-6328.220999999998,"grant":0,"amount":-5374.069999999992,"percent":30,"statement":0,"deficit":0,"statement_type":0,"statement_percent":0,"deficit_percent":0,"cost_percent":2,"cost_type":0,"cost_money":1116,"statement_cost_money":0,"deficit_cost_money":0,"status":0,"first_balance":16967.05,"last_balance":42341.119999999995,"top_up":20000,"withdraw":0,"top_up_cost":600,"activity_cost":3000}]}
    if (result.status === 0) {
      this.setState({
        data: result.msg,
        count: result.msg && result.msg.length,
        loading: false,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
  };
  componentDidMount(){
    let platform_name = localStorage.getItem("name")
    this.setState({
        platform_name:platform_name
    })
  }
  render(){
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
        <Input
            type="text"
            placeholder="请输入ID搜索"
            style={{ width: 150 }}
            onChange={(e) => {
                this.setState({ searchID: e.target.value });
            }}
            value={this.state.searchID}
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
        </span>
    );
        
      const extra = (
        <span>
          <LinkButton
            style={{ float: "right" }}
            onClick={() => {
              this.setState(init_state, () => {
                this.getUsers(1, 20);
              });
            }}
            icon="reload"
            size="default"
          />
          <br />
          <br />
        </span>
      );
      console.log(data)
      return  <Card title={title} extra={extra}>
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
                 />
      </Card>
    }
}
