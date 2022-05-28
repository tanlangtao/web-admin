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
import { formateDate,formatDateYMD } from "../../utils/dateUtils";
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
    platform_name:""
};
export default class PersonalDaily extends Component {
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
      this.props.admin_user_id,
      this.props.package_id,
      page,
      limit
    );
    if (result.code == 200) {
      this.setState({
        data: result.msg,
        count: result.msg && result.msg.length,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
    this.setState({
      loading:false
    })
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
