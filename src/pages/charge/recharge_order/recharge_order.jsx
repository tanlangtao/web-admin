import React, { Component } from "react";
import {
  Card,
  Table,
  Icon,
  Input,
  Select,
  Popconfirm,
  message
} from "antd";
import { formateDate } from "../../../utils/dateUtils";
import "moment/locale/zh-cn";
import { rechargeOrder, downloadList, cancelOrder } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";

class Recharge_order extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      start_time: "",
      end_time: "",
      type: "14",
      paramKey: "",
      inputParam: "",
      user_id: "",
      order_id: ""
    };
    this.inputKey = "user_id";
    this.inputValue = "";
    this.order_status = "";
  }
  getUsers = async (page, limit) => {
    const result = await rechargeOrder(
      page,
      limit,
      this.state.start_time,
      this.state.end_time,
      this.order_status,
      this.inputKey,
      this.inputValue
    );
    if (result.data) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    }
    if (result.status === -1) {
      this.setState({
        data: [],
        count: 0
      });
    }
  };
  handleChange(event) {
    this.setState({ inputParam: event.target.value });
  }
  download = () => {
    let data = {
      start_time: this.state.start_time,
      end_time: this.state.end_time,
      order_status: this.order_status,
      type: "14",
      inputParam: this.inputValue,
      paramKey: this.inputKey
    };
    downloadList(data);
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <div>
            <div>
              <MyDatePicker
                handleValue={val => {
                  this.setState({
                    start_time: val[0],
                    end_time: val[1]
                  });
                }}
              />
              &nbsp; &nbsp;
              <Select
                placeholder="请选择"
                style={{ width: 120 }}
                onSelect={value => (this.inputKey = value)}
                defaultValue="user_id"
              >
                <Select.Option value="order_id">订单id</Select.Option>
                <Select.Option value="user_id">user_id</Select.Option>
                <Select.Option value="package_nick">所属品牌</Select.Option>
                <Select.Option value="proxy_pid">所属代理</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <Input
                type="text"
                placeholder="请输入关键字"
                style={{ width: 150 }}
                ref={Input => (this.input = Input)}
              />
              &nbsp; &nbsp;
              <Select
                defaultValue=""
                style={{ width: 100 }}
                onSelect={value => (this.order_status = value)}
              >
                <Select.Option value="">状态</Select.Option>
                <Select.Option value="1">未支付</Select.Option>
                <Select.Option value="4">已撤销</Select.Option>
                <Select.Option value="5">已支付</Select.Option>
                <Select.Option value="6">已完成</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <LinkButton
                onClick={() => {
                  this.inputValue = this.input.input.value;
                  this.getUsers(1, this.state.pageSize);
                }}
                size="default"
              >
                <Icon type="search" />
              </LinkButton>
              &nbsp; &nbsp;
            </div>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
              size="default"
            />
            <br />
            <br />
            <LinkButton
              size="default"
              style={{ float: "right" }}
              onClick={this.download}
              icon="download"
            ></LinkButton>
          </span>
        }
      >
        <Table
          bordered
          size="small"
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size
              });
              this.getUsers(current, size);
            }
          }}
          scroll={{ x: 1850 }}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      width: 320
    },
    {
      title: "user_id",
      dataIndex: "user_id",
      width: 150
    },
    {
      title: "昵称",
      dataIndex: "user_name",
      width: 150
    },
    {
      title: "代充ID",
      dataIndex: "replace_id",
      width: 150
    },
    {
      title: "代充昵称",
      dataIndex: "replace_name",
      width: 100
    },
    {
      title: "下单金额",
      dataIndex: "amount",
      width: 150,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      width: 150,
      sorter: (a, b) => a.arrival_amount - b.arrival_amount
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 150,
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
            word = "未支付";
            break;
          case "2":
            word = "已过期";
            break;
          case "3":
            word = "已分配";
            break;
          case "4":
            word = "已撤销";
            break;
          case "5":
            word = "已支付";
            break;
          case "6":
            word = "已完成";
            break;
          case "7":
            word = "补单初审通过";
            break;
          case "8":
            word = "初审拒绝";
            break;
          case "9":
            word = "补单复审通过";
            break;
          case "10":
            word = "复审拒绝";
            break;
          case "11":
            word = "充值失败";
            break;
          case "12":
            word = "客服拒绝";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      }
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 200,
      render: formateDate,
      sorter: (a, b) => a.created_at - b.created_at
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      width: 200,
      render: (text, record, index) => {
        if (text === "0" || !text) {
          return "";
        } else return formateDate(text);
      },
      sorter: (a, b) => a.arrival_at - b.arrival_at
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => {
        if (record.status == 1 || record.status == 5) {
          return (
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.handleWithdraw(record)}
              okText="确定"
              cancelText="取消"
            >
              <LinkButton>协助玩家撤销</LinkButton>
            </Popconfirm>
          );
        } else {
          return;
        }
      }
    }
  ];
  handleWithdraw = async record => {
    let reqData = {
      order_id: record.order_id,
      user_id: record.user_id,
      form_type: 2
    };
    const res = await cancelOrder(reqData);
    if (res.status === 0) {
      message.info(res.msg || "操作成功");
      window.location.reload();
    } else {
      message.error(res.msg || "操作失败");
    }
  };
}

export default Recharge_order;
