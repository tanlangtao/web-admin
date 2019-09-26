import React, { Component } from "react";
import { Form, Icon, Input } from "antd";

const FormItem = Form.Item;
class NormalLoginForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isNickModal } = this.props;
    return (
      <Form className="login-form">
        <FormItem style={isNickModal ? {} : { display: "none" }}>
          {getFieldDecorator("name", {
            rules: [
              {
                required: isNickModal,
                message: "Please input your username!"
              }
            ],
            initialValue: this.props.val
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="请输入昵称"
            />
          )}
        </FormItem>
        <FormItem label="金额" style={isNickModal ? { display: "none" } : {}}>
          {getFieldDecorator("gold", {
            rules: [
              {
                required: !isNickModal,
                whitespace: true,
                pattern: /^\d+(\.\d+)?$/,
                message: "必须为数字，减少时金额为负"
              }
            ],
          })(<Input placeholder="必须为数字，减少时金额为负" />)}
        </FormItem>
        <FormItem label="备注" style={isNickModal ? { display: "none" } : {}}>
          {getFieldDecorator("desc", {
            rules: [
              { max: 400, message: "最多400字" },
              {
                required: !isNickModal
              }
            ]
          })(
            <Input.TextArea
              placeholder="请输入文字"
              autosize={{ minRows: 2, maxRows: 6 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
