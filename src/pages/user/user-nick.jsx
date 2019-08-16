import React, { Component } from 'react';
import { Form, Icon, Input } from 'antd';
 
const FormItem = Form.Item;
class NormalLoginForm extends Component {
 
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue:this.props.val,
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入昵称" />
          )}
        </FormItem>
      </Form>
    );
  }
}
 
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
 
export default WrappedNormalLoginForm;