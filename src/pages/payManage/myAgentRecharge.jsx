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
import {
  bindInfo,
  reqUsers
} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputKey: "玩家ID",
  inputValue: "",
  inputStatus: "未支付",
  id: 427223993, // id先写死
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowModifyModel:false,
  modifyAmount:""
};
export default class MyAgentRecharge extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "订单编号",
      dataIndex: "",
      key: "",
      fixed: "left",
      align: 'center',
    },
    {
      title: "玩家ID",
      dataIndex: "",
      key: "",
      fixed: "left",
      align: 'center',
    },
    {
      title: "玩家昵称",
      dataIndex: "",
      key: "",
      align: 'center',
      // width: 150,
    },
    {
      title: "所属品牌",
      dataIndex: "",
      key: "",
      align: 'center',
      // width: 100,
    },
    {
      title: "上级代理",
      dataIndex: "",
      key: "",
      align: 'center',
      width: 100,
    },
    {
      title: "订单金额",
      dataIndex: "",
      key: "",
      align: 'center',
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "",
      key: "",
      align: 'center',
      width: 120,
    },
    {
      title: "代充ID",
      dataIndex: "",
      key: "",
      align: 'center',
      // width: 150,
    },
    {
      title: "代充昵称",
      dataIndex: "",
      key: "",
      align: 'center',
      // width: 150,
    },
    {
      title: "到账金额",
      dataIndex: "",
      key: "",
      align: 'center',
    },
    {
      title: "到账时间",
      dataIndex: "",
      key: "",
      align: 'center',
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (text, record) => {
        let statusStr = ''
        if (record.status == 0) {
          statusStr = "未完成"
        } else if (record.status == 1) {
          statusStr = "已完成"
        }
        return statusStr;
      },
    },
    {
      title: "代充操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.handleApplyAmount(record)}>
            确认上分
              </LinkButton>
          <LinkButton type="default" onClick={() => this.showModifyModel(record)}>
            修改上分
              </LinkButton>
        </span>
      ),
    },
  ];
  handleApplyAmount = async (record) => {
    this.recordID = record.id
  }
  showModifyModel = (record) => {
    this.setState({
      isShowModifyModel: true
    })
    this.recordID = record.id
  }
  handleModifyModel = async () => {

  }
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqUsers(
      page,
      limit,
      this.state.startTime,
      this.state.endTime,
      this.state.inputKey,
      this.state.inputValue
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      game_user.forEach((element) => {
        proxy_user.forEach((item) => {
          if (element.id === item.id) {
            element.proxy_nick = item.proxy_pid;
          }
        });
      });
      this.setState({
        data: game_user,
        count: result.data && result.data.count,
        loading: false,
        packages: result.data && result.data.packages,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
  };
  componentDidMount() {
    this.getUsers(1, 20)
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
              <Input
          type="text"
          placeholder="请输入玩家ID"
          style={{ width: 150 }}
          onChange={(e) => {
            this.setState({ inputValue: e.target.value });
          }}
          value={this.state.inputValue}
        />
        &nbsp; &nbsp;
              <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputStatus}
          onChange={(val) => {
            this.setState({ inputStatus: val });
          }}
        >
          <Option value="1">未支付</Option>
          <Option value="2">已完成</Option>
        </Select>
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
      />
      {this.state.isShowModifyModel && (
        <Modal
          title="修改上分"
          visible={this.state.isShowModifyModel}
          onOk={this.handleModifyModel}
          onCancel={() => {
            this.setState({ isShowModifyModel: false });
          }}
        >
          <Input
            value={this.state.modifyAmount}
            onChange={(e) => this.setState({ modifyAmount: e.target.value })}
          />
        </Modal>
      )}
    </Card>
  }
}
