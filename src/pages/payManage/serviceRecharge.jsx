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
  isShowUpdateModal:false,
  isShowChangeModal:false,
  isShowAssignedModel:false,
  updateID:"",
  changeID:"",
  assignedID:""
};
export default class ServiceRecharge extends Component {
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
      title: "运营操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.showUpdateModel(record)}>
            更新代充
            </LinkButton>
          <LinkButton type="default" onClick={() => this.showChangeModel(record)}>
            修改代充
            </LinkButton>
          <LinkButton type="default" onClick={() => this.showAssignedModel(record)}>
            指派
            </LinkButton>
        </span>
      ),
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
  ];
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
  showUpdateModel = (record)=>{
    this.setState({
      isShowUpdateModal:true
    })
    this.recordID = record.id
  }
  showChangeModel = (record)=>{
    this.setState({
      isShowChangeModal:true
    })
    this.recordID = record.id
  }
  showAssignedModel = (record)=>{
    this.setState({
      isShowAssignedModel:true
    })
    this.recordID = record.id
  }
  // 更新代充ID
  handleUpdateId = ()=>{
    
  }
  // 修改代充
  handleChange= ()=>{
    
  }
  // 指派
  handleAssigned = ()=>{
    
  }
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
              <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputKey}
          onChange={(val) => {
            this.setState({ inputKey: val });
          }}
        >
          <Option value="id">玩家ID</Option>
          <Option value="game_nick">代充ID</Option>
        </Select>
        &nbsp; &nbsp;
              <Input
          type="text"
          placeholder="请输入关键字搜索"
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
      {this.state.isShowUpdateModal && (
        <Modal
          title="更新代充ID"
          visible={this.state.isShowUpdateModal}
          onOk={this.handleUpdateId}
          onCancel={() => {
            this.setState({ isShowUpdateModal: false });
          }}
        >
          <Input
            value={this.state.updateID}
            onChange={(e) => this.setState({ updateID: e.target.value })}
          />
        </Modal>
      )}
      {this.state.isShowChangeModal && (
        <Modal
          title="修改代充"
          visible={this.state.isShowChangeModal}
          onOk={this.handleChange}
          onCancel={() => {
            this.setState({ isShowChangeModal: false });
          }}
        >
          <Input
            value={this.state.changeID}
            onChange={(e) => this.setState({ changeID: e.target.value })}
          />
        </Modal>
      )}
      {this.state.isShowAssignedModel && (
        <Modal
          title="指派"
          visible={this.state.isShowAssignedModel}
          onOk={this.handleAssigned}
          onCancel={() => {
            this.setState({ isShowAssignedModel: false });
          }}
        >
          <Input
            value={this.state.assignedID}
            onChange={(e) => this.setState({ assignedID: e.target.value })}
          />
        </Modal>
      )}
    </Card>
  }
}
