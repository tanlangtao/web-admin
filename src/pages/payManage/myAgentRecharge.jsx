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
  reqDaiPayOrderListByLoginId,
  reqApplyDaiPayAmount,
  reqModifyDaiPayAmount

} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputValue: "",
  inputStatus: 0,
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
      width: 100,
    },
    {
      title: "订单金额",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      width: 120,
    },
    {
      title: "代充ID",
      dataIndex: "replace_id",
      key: "replace_id",
      align: 'center',
      // width: 150,
    },
    {
      title: "代充昵称",
      dataIndex: "replace_name",
      key: "replace_name",
      align: 'center',
      // width: 150,
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
      render:formateDate,
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
        }else if (record.status == 4) {
          statusStr = "已撤销"
        }else if (record.status == 5 ) {
          statusStr = "已支付"
        }else if (record.status == 6 ) {
          statusStr = "已完成"
        }else if (record.status == 7 ) {
          statusStr = "补单一审通过"
        }else if (record.status == 9 ) {
          statusStr = "补单二审通过"
        }else if (record.status == 11 ) {
          statusStr = "充值失败"
        }else if (record.status == 12 ) {
          statusStr = "客服拒绝"
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
          <LinkButton type="default" onClick={() => this.handleApplyDaiPayAmount(record)}>
            确认上分
              </LinkButton>
          <LinkButton type="default" onClick={() => this.showModifyModel(record)}>
            修改上分
              </LinkButton>
        </span>
      ),
    },
  ];
  handleApplyDaiPayAmount = async (record) => {
    const result = await reqApplyDaiPayAmount(
      record.order_id,
      Number(record.package_id),
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiPayOrderListByLoginId()
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  showModifyModel = (record) => {
    this.setState({
      isShowModifyModel: true
    })
    this.record = record
  }
  handleModifyModel = async () => {
    const result = await reqModifyDaiPayAmount(
      this.record.order_id,
      Number(this.record.package_id),
      Number(this.modifyAmount),
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiPayOrderListByLoginId()
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  getReqDaiPayOrderListByLoginId = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqDaiPayOrderListByLoginId(
      {
        user_id:this.props.admin_user_id,
        package_id:this.props.package_id,
        start_time:this.state.startTime,
        end_time:this.state.endTime,
        export:1,
        page:this.state.current,
        limit:this.state.pageSize,
        flag:3,
        order_status:Number(this.state.inputStatus),
      }
    );
    if (result.status === 0) {
      let data =result.data && JSON.parse(result.data)
      console.log(data)
      this.setState({
        data:data,
        count: data.length,
      })
    } else {
      message.error(`失败！${result.data}`)
    }
    this.setState({loading:false})
  };
  componentDidMount() {
    this.getReqDaiPayOrderListByLoginId(1,20)
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
          value={this.state.inputStatus == 0 ? "全部":(this.state.inputStatus == 6 ? "已完成":(
            this.state.inputStatus == 1 ? "未支付" :""
          ))}
          onChange={(val) => {
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
            this.getReqDaiPayOrderListByLoginId(1, this.state.pageSize);
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
