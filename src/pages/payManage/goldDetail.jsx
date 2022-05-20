import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Select,
} from "antd";
import Mytable from "../../components/MyTable";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import { formateDate } from "../../utils/dateUtils";
import {
  reqUsers,
  reqGetuserbalancelist

} from "../../api/index";

const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  loading: false,
  data: [],
  inputValue:"",
};
export default class GoldDetail extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      render:formateDate
    },
    {
      title: "代充ID",
      dataIndex: "account_name",
      key: "account_name",
      align: 'center',
    },
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
      align: 'center',
      // width: 150,
    },
    {
      title: "交易前金额",
      dataIndex: "before_amount",
      key: "before_amount",
      align: 'center',
      // width: 100,
    },
    {
      title: "交易金额",
      dataIndex: "act_amount",
      key: "act_amount",
      align: 'center',
    },
    {
      title: "交易后金额",
      dataIndex: "after_amount",
      key: "after_amount",
      align: 'center',
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      align: 'center',
    },
  ];
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqGetuserbalancelist(
        this.state.inputValue,
        this.props.user_id,
        this.props.package_id,
        this.state.startTime,
        this.state.endTime,
    );
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: result.data && result.data.length,
        loading: false,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
  };
  componentDidMount() {
    this.setState({
        startTime:moment().startOf("day").subtract(1, "month"),
        endTime:moment().startOf("day")
    },()=>{
        this.getUsers(1, 20)
    })
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    return <Card >
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
