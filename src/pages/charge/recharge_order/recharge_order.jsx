import React, { Component } from "react";
import { Card, Table, Icon, Input, Select, Button } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import "moment/locale/zh-cn";
import { rechargeOrder, downloadList } from "../../../api/index";
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
    this.inputKey = "";
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
    this.setState({
      data: result.data,
      count: parseInt(result.count)
    });
  };
  handleChange(event) {
    this.setState({ inputParam: event.target.value });
  }
  download = () => {
    downloadList(this.state);
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
              >
                <Select.Option value="order_id">订单id</Select.Option>
                <Select.Option value="user_id">user_id</Select.Option>
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
                <Select.Option value="0">未成功</Select.Option>
                <Select.Option value="1">已分配</Select.Option>
                <Select.Option value="4">已撤销</Select.Option>
                <Select.Option value="6">已完成</Select.Option>
                <Select.Option value="7">初审通过</Select.Option>
                <Select.Option value="8">初审拒绝</Select.Option>
                <Select.Option value="9">复审通过</Select.Option>
                <Select.Option value="10">复审拒绝</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <LinkButton
                onClick={() => {
                  this.inputValue = this.input.input.value;
                  this.getUsers(1, this.state.pageSize);
                }}
              >
                <Icon type="search" />
              </LinkButton>
              &nbsp; &nbsp;
            </div>
          </div>
        }
        extra={
          <span>
            <Button
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
            />
            <br />
            <br />
            <Button onClick={this.download} icon="download">
              下载列表
            </Button>
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
              if (page && pageSize) {
                this.setState({
                  pageSize: pageSize
                });
                this.getUsers(page, pageSize);
              } else return;
            },
            onShowSizeChange: (current, size) => {
              if (size) {
                this.getUsers(current, size);
              } else return;
            }
          }}
          scroll={{ x: 1500, y: "60vh" }}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      width: 280
    },
    {
      title: "user_id",
      dataIndex: "user_id",
      width: 100
    },
    {
      title: "昵称",
      dataIndex: "user_name",
      width: 200
    },
    {
      title: "代充ID",
      dataIndex: "replace_id",
      width: 100
    },
    {
      title: "代充昵称",
      dataIndex: "replace_name",
      width: 100
    },
    {
      title: "下单金额",
      dataIndex: "amount",
      width: 100,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      width: 100,
      sorter: (a, b) => a.arrival_amount - b.arrival_amount
    },
    {
      title: "订单状态",
      dataIndex: "status",
      width: 130,
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
      width: 150,
      render: formateDate,
      sorter: (a, b) => a.created_at - b.created_at
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      render: (text, record, index) => {
        if (text === "0" || !text) {
          return "";
        } else return formateDate(text);
      },
      sorter: (a, b) => a.arrival_at - b.arrival_at
    }
  ];
}

export default Recharge_order;