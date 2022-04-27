import React, { Component } from "react";
import { Form, Input, Button, message, Radio } from "antd";
import { saveBankCard } from "../../../api";

class AddDataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //   componentDidMount() {
  //     if (this.props.isEdit) {
  //       if (this.props.editDataRecord.rules) {
  //         let defaultValue = this.props.editDataRecord.rules.split(",");
  //         this.setState({
  //           defaultCheckedKeys: defaultValue
  //         });
  //       }
  //     }
  //   }
  //index.js:1375 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.              in AddDataForm (created by Form(AddDataForm))
  //解决上诉错误：
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editDataRecord, isEdit } = this.props;
    return (
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="开户人">
          {getFieldDecorator("card_name", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.card_name : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="银行名称">
          {getFieldDecorator("bank_name", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.bank_name : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="卡号">
          {getFieldDecorator("card_num", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              },
            ],
            initialValue: isEdit ? editDataRecord.card_num : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="用途">
          {getFieldDecorator("type", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.type) : 1
          })(
            <Radio.Group>
              <Radio value={1}>收款卡</Radio>
              <Radio value={2}>出款卡</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator("status", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.status) : 2
          })(
            <Radio.Group>
              <Radio value={1}>空闲</Radio>
              <Radio value={2}>使用中</Radio>
              <Radio value={3}>停用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="支付密码">
          {getFieldDecorator("pay_password", {})(
            <Input placeholder="出款卡时必填" style={{ width: "60%" }} />
          )}
        </Form.Item>
        <Form.Item label="查询密码">
          {getFieldDecorator("query_password", {})(
            <Input placeholder="出款卡时必填" style={{ width: "60%" }} />
          )}
        </Form.Item>
        <Form.Item label="U盾密码">
          {getFieldDecorator("u_code", {})(
            <Input placeholder="出款卡时必填" style={{ width: "60%" }} />
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 18 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      let id = this.props.editDataRecord ? this.props.editDataRecord.id : "";
      if (!err) {
        const res = !this.props.isEdit
          ? await saveBankCard(value)
          : await saveBankCard(value,parseInt(id));
        if (res.status === 0) {
          message.success(res.msg || "提交成功");
          this.props.refreshPage();
          this.props.cancel();
          this.props.form.resetFields();
        } else {
          message.info("出错了" + res.msg);
        }
      } else {
        message.info("提交失败");
      }
    });
  };
}

const WrappedAddDataForm = Form.create()(AddDataForm);

export default WrappedAddDataForm;
