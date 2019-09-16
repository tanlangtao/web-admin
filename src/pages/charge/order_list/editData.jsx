import React, { Component } from "react";
import { Table, Input, Icon, Button, message } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import { reqLostOrder_list, orderReview } from "../../../api/index";

class Diaodan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_id: "",
      order_id: ""
    };
  }
  render() {
    return (
      <div>
        <Input
          type="text"
          placeholder="user_id"
          style={{ width: 150 }}
          value={this.state.user_id}
          onChange={e => this.setState({ user_id: e.target.value })}
        />
        &nbsp; &nbsp;
        <Input
          type="text"
          placeholder="订单Id"
          style={{ width: 300 }}
          value={this.state.order_id}
          onChange={e => this.setState({ order_id: e.target.value })}
        />
        &nbsp; &nbsp;
        <Button onClick={this.handleClick}>
          <Icon type="search" />
        </Button>
        <br></br>
        <br></br>
        <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
        />
      </div>
    );
  }
  initColumns = () => {
    return [
      {
        title: "订单Id",
        dataIndex: "order_id"
      },
      {
        title: "user_id",
        dataIndex: "user_id"
      },
      {
        title: "金额",
        dataIndex: "amount"
      },
      {
        title: "下单时间",
        dataIndex: "created_at",
        render: formateDate
      },
      {
        title: "操作",
        dataIndex: "status",
        render: (text, record, index) => {
          if (text !== "6" && text !== "7" && text !== "9") {
            return (
              <Button size='small' onClick={() => this.handleRecieveSubmit(record)}>
                手动到账提交
              </Button>
            );
          } else {
            return;
          }
        }
      }
    ];
  };
  handleClick = async () => {
    const res = await reqLostOrder_list(
      1,
      50,
      this.state.user_id,
      this.state.order_id
    );
    if (res.status === 0) {
      this.setState({
        data: res.data
      });
    } else {
      message.error(res.msg);
    }
  };
  handleRecieveSubmit = async record => {
    let { user_id, order_id } = record;
    const res = await orderReview(user_id, order_id);
    if (res.status === 0) {
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
    this.handleClick();
  };
}

export default Diaodan;
