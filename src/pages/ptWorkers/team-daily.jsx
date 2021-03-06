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
import {
    reqGetCreditDividendInfoList,
} from "../../api/index";
import moment from "moment";
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
      title: "今日团队充值",
      dataIndex: "top_up",
      key: "top_up",
      align: 'center',
      // width: 150,
    },
    {
      title: "今日团队兑换",
      dataIndex: "",
      key: "",
      align: 'center',
      render:(record)=>{
        return Math.abs(record.withdraw)
      }
    },
    {
      title: "期初金额",
      dataIndex: "first_balance",
      key: "first_balance",
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (Math.round(record.first_balance * 100) / 100);
      },
    },
    {
      title: "期末金额",
      dataIndex: "last_balance",
      key: "last_balance",
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (Math.round(record.last_balance * 100) / 100);
      },
    },
    {
      title: "今日营收",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
      width: 120,
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
      title: "今日充值成本",
      dataIndex: "top_up_cost",
      key: "top_up_cost",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.top_up_cost * 100) / 100);
      },
    },
    {
      title: "今日运营成本",
      dataIndex: "activity_cost",
      key: "activity_cost",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.activity_cost * 100) / 100);
      },
    },
    {
      title: "今日渠道费用",
      dataIndex: "cost_money",
      key: "cost_money",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.cost_money * 100) / 100);
      },
    },
    {
      title: "今日预估团队分红",
      dataIndex: "money",
      key: "money",
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (Math.round(record.money * 100) / 100);
      },
    },
  ];
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqGetCreditDividendInfoList(
      formatDateYMD(this.state.startTime),
      formatDateYMD(this.state.endTime),
      this.state.searchID,
      this.props.package_id,
      page,
      limit
    );
    // const result = {"status":0,"code":200,"msg":[{"_id":"53c430d9aff2e955ca0beb399cd966b1","date":"2022-05-05:2022-05-05","id":630997900,"package_id":20,"proxy_user_id":590176383,"type":4,"demand_type":3,"demand_tag":1,"game_tag":0,"money":9194.535,"grant":0,"amount":36531.45,"percent":30,"statement":0,"deficit":0,"statement_type":0,"statement_percent":0,"deficit_percent":0,"cost_percent":2,"cost_type":0,"cost_money":864.9,"statement_cost_money":0,"deficit_cost_money":0,"status":0,"first_balance":42341.119999999995,"last_balance":10809.67,"top_up":5000,"withdraw":0,"top_up_cost":150,"activity_cost":750},{"_id":"313c663e4ca6c18ecc847da99232efa1","date":"2022-05-04:2022-05-04","id":630997900,"package_id":20,"proxy_user_id":590176383,"type":4,"demand_type":3,"demand_tag":1,"game_tag":0,"money":-6328.220999999998,"grant":0,"amount":-5374.069999999992,"percent":30,"statement":0,"deficit":0,"statement_type":0,"statement_percent":0,"deficit_percent":0,"cost_percent":2,"cost_type":0,"cost_money":1116,"statement_cost_money":0,"deficit_cost_money":0,"status":0,"first_balance":16967.05,"last_balance":42341.119999999995,"top_up":20000,"withdraw":0,"top_up_cost":600,"activity_cost":3000}]}
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
  getDataByTime(num){
    let start = ""
    let end = ""
    switch(num){
      case 1 :
        //昨天
         start = moment().startOf("day").subtract(1, "day")
         end = moment().endOf("day").subtract(1, "day")
         break;
      case 2 :
          //本周
         start = moment().startOf("week")
         end = moment().endOf("week")
         break;
      case 3 :
        //本周
         start = moment().startOf("week").subtract(1, "week")
         end = moment().endOf("week").subtract(1, "week")
         break;
    }
    this.setState({
      startTime:start.format("YYYY-MM-DD HH:mm:ss"),
      endTime:end.format("YYYY-MM-DD HH:mm:ss"),
      current:1
    },()=>{
      this.getUsers(1,20)
    })
  }
  componentDidMount(){
    let platform_name = localStorage.getItem("name")
    this.setState({
        platform_name:platform_name
    })
    let start = moment().startOf("day").subtract(1, "day")
    let end = moment().endOf("day").subtract(1, "day")
    this.setState({
      startTime: start.format("YYYY-MM-DD HH:mm:ss"),
      endTime: end.format("YYYY-MM-DD HH:mm:ss"),
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
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => this.getDataByTime(1)}
          size="default"
          >昨天
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
      </span>
    );
        
      console.log(data)
      return  <Card title={title} >
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
