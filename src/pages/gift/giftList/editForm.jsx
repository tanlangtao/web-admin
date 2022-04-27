import React, { Component } from "react";
import {  Button, message, Radio } from "antd";
import { withDrawReview } from "../../../api/index";
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review_status: ""
    };
  }
  render() {
    const record = this.props.record;
    return (
      <div>
        <div>订单ID:{record.order_id}</div>
        <div>用户ID:{record.user_id}</div>
        <div>金额:{record.amount}</div>
        <div>
          订单状态:
          <Radio.Group
            onChange={e => {
              this.setState({ review_status: e.target.value });
            }}
            value={this.state.review_status}
          >
            <Radio value={2}>已成功</Radio>
            <Radio value={3}>已失败</Radio>
          </Radio.Group>
          <Button onClick={() => this.orderStatus(record)}>确认</Button>
        </div>
      </div>
    );
  }
  orderStatus = async record => {
    const res = await withDrawReview(
      record.order_id,
      record.user_id,
      this.state.review_status
    );
    message.info(res.msg);
  };
}

export default EditForm;
