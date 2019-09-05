import React, { Component } from "react";
import { Form, Icon, Input, Button, message, Radio, Select } from "antd";
import { withDrawRemark } from "../../../api";

export default class AddDataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { editDataRecord } = this.props;
    return (
      <div>
        <div>订单ID:{editDataRecord.order_id}</div>
        <div>用户ID:{editDataRecord.user_id}</div>
        <div>金额:{editDataRecord.amount}</div>
        <div>
          <span>备注[用户]:</span>
          <Input
            type="text"
            style={{ width: "70%", margin: "0 10px" }}
            placeholder="请输入备注内容，用户查看使用"
            onBlur={e => (this.userRemark = e.target.value)}
          />
          <Button
            type="primary"
            className="login-form-button"
            onClick={() =>
              this.submitRemark(editDataRecord.order_id, this.userRemark, 1)
            }
          >
            提交
          </Button>
        </div>
        <div>
          <span>备注[运营]:</span>
          <Input
            type="text"
            style={{ width: "70%", margin: "0 10px" }}
            placeholder="请输入备注内容，运营人员记录使用"
            onBlur={e => (this.operatorRemark = e.target.value)}
          />
          <Button
            type="primary"
            className="login-form-button"
            onClick={() =>
              this.submitRemark(editDataRecord.order_id, this.operatorRemark, 2)
            }
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
  submitRemark = async (id, temarks, remark_type) => {
    const res = await withDrawRemark(id, temarks, remark_type);
    if (res.status === 0) {
      message.success("操作成功:" + res.msg);
    } else {
      message.error("操作失败:" + res.msg);
    }
  };
}
