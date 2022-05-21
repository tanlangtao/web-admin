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
import { formateDate } from "../../utils/dateUtils";
import {
  reqUpdateDaiPaymentID,
  reqModifyDaiPaymentID,
  reqLockDaiPayment,
  reqUsers,
  reqDaiPayOrderList
} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 10,
  count: 0,
  startTime: '',
  endTime: '',
  inputKey: "user_id",
  inputValue: "",
  inputStatus: 0,
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowChangeModal: false,
  changeID: "",
};
export default class ServiceRecharge extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "订单编号",
      dataIndex: "order_id",
      key: "order_id",
      fixed: "left",
      align: 'center',
    },
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
      fixed: "left",
      align: 'center',
    },
    {
      title: "玩家昵称",
      dataIndex: "user_name",
      key: "user_name",
      align: 'center',
      // width: 150,
    },
    {
      title: "所属品牌",
      dataIndex: "package_id",
      key: "package_id",
      align: 'center',
      // width: 100,
    },
    {
      title: "上级代理",
      dataIndex: "proxy_user_id",
      key: "proxy_user_id",
      align: 'center',
    },
    {
      title: "订单金额",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      render: formateDate,
    },
    {
      title: "代充ID",
      dataIndex: "replace_id",
      key: "replace_id",
      align: 'center',
    },
    {
      title: "代充昵称",
      dataIndex: "replace_name",
      key: "replace_name",
      align: 'center',
    },
    {
      title: "运营操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.handleUpdateId(record)}>
            更新代充
            </LinkButton>
          <LinkButton type="default" onClick={() => this.showChangeModel(record)}>
            修改代充
            </LinkButton>
          <LinkButton type="default" onClick={() => this.handleAssigned(record)}>
            指派
            </LinkButton>
        </span>
      ),
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      key: "arrival_amount",
      align: 'center',
      render: (text, record) => {
        let arrival_amount = 0
        if (record.arrival_at != 0) {
          arrival_amount = record.arrival_amount
        }
        return arrival_amount;
      },
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      key: "arrival_at",
      align: 'center',
      render: formateDate,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (text, record) => {
        let statusStr = ''
        if (record.status == 1) {
          statusStr = "未支付"
        } else if (record.status == 2) {
          statusStr = "已过期"
        } else if (record.status == 4) {
          statusStr = "已撤销"
        } else if (record.status == 5) {
          statusStr = "已支付"
        } else if (record.status == 6) {
          statusStr = "已完成"
        } else if (record.status == 7) {
          statusStr = "补单一审通过"
        } else if (record.status == 9) {
          statusStr = "补单二审通过"
        } else if (record.status == 11) {
          statusStr = "充值失败"
        } else if (record.status == 12) {
          statusStr = "客服拒绝"
        }
        return statusStr;
      },
    },
  ];
  getReqDaiPayOrderList = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqDaiPayOrderList(
      {
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        export: 1,
        page: page,
        limit: limit,
        package_id: this.props.package_id,
        flag: 3,
        [this.state.inputKey]: Number(this.state.inputValue),
        order_status: Number(this.state.inputStatus),
      }
    );
    if (result.status === 0) {
      let data = result.data && JSON.parse(result.data)
      console.log(data)
      this.setState({
        data: data,
        count: data.length,
      })
    } else {
      message.error(`失败！${result.data}`)
    }
    this.setState({ loading: false })
  };
  showUpdateModel = (record) => {
    this.setState({
      isShowUpdateModel: true
    })
    this.record = record
  }
  showChangeModel = (record) => {
    this.setState({
      isShowChangeModal: true
    })
    this.record = record
  }
  // 更新代充ID
  handleUpdateId = async (record) => {
    const result = await reqUpdateDaiPaymentID(
      this.props.admin_user_id,
      record.order_id,
      Number(record.package_id),
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiPayOrderList(1,10)
    } else {
      message.error(`操作失败！${message.data}`)
    }
    this.setState({
      isShowUpdateModel: false
    })
  }
  // 修改代充
  handleChange = async () => {
    const result = await reqModifyDaiPaymentID(
      Number(this.state.changeID),
      this.record.order_id,
      Number(this.record.package_id),
    )
    if (result.status === 0) {
      this.getReqDaiPayOrderList(1,10)
      message.success("操作成功！")
    } else {
      message.error(`操作失败！${message.data}`)
    }
    this.setState({
      isShowChangeModal: false
    })
  }
  // 指派
  handleAssigned = async (record) => {
    const result = await reqLockDaiPayment(
      record.order_id,
      Number(record.package_id),
    )
    if (result.status === 0) {
      this.getReqDaiPayOrderList(1,10)
      message.success("操作成功！")
    } else {
      message.error(`操作失败！${result.data}`)
    }
  }
  componentDidMount() {
    this.getReqDaiPayOrderList(1,10)
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
          <Option value="user_id">玩家ID</Option>
          <Option value="replace_id">代充ID</Option>
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
          value={this.state.inputStatus == 0 ? "全部" : (this.state.inputStatus == 6 ? "已完成" : (
            this.state.inputStatus == 1 ? "未支付" : ""
          ))}
          onChange={(val) => {
            console.log(val)
            this.setState({ inputStatus: val });
          }}
        >
          <Option value="0">全部</Option>
          <Option value="1">未支付</Option>
          <Option value="6">已完成</Option>
        </Select>
        &nbsp; &nbsp;
              <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getReqDaiPayOrderList(1, this.state.pageSize);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
      </span>
    );
    let daichongTitle = (
      <span>
        修改代充
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        <span style={{color:"red"}}>
          请输入 代充账号对应的代充ID信息（9位数字）
          填写完毕点击确定后 请返回人工充值界面对应订单点击【指派】
        </span>
      </span>
    )
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
          this.getReqDaiPayOrderList(page, limit);
        }}
        setPagination={(current, pageSize) => {
          if (pageSize) {
            this.setState({ current, pageSize });
          } else {
            this.setState({ current });
          }
        }}
      />
      {this.state.isShowChangeModal && (
        <Modal
          title={daichongTitle}
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
    </Card>
  }
}
