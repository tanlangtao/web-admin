import React, { Component } from "react";
import { Form, Icon, Input, Radio, Select, Checkbox, Button } from "antd";

class AddDataForm extends Component {
  state = {
    isBan: 1,
    checkedList: [],
    indeterminate: true,
    checkAll: false
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.props.form);
    this.props.form.validateFields(async (err, values) => {
      console.log(values);
    });
  };
  checkboxOnChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length &&
        checkedList.length < this.props.packageList.length,
      checkAll: checkedList.length === this.props.packageList.length
    });
  };
  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? this.props.packageList : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        console.log('no error!',value);
      }else{
        console.log('error!',err,value);
      }
      // this.props.form.resetFields();
    });
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      packageList: this.state.checkedList
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // const packageList=this.props.packageList
    const Option = this.props.optionList.map(item => (
      <Select.Option value={item.id} key={item.id}>
        {item.name}
      </Select.Option>
    ));
    return (
      <Form
        labelCol={{ span: 4 }}
        onSubmit={this.handleSubmit}
        labelAlign="left"
      >
        <Form.Item label="登录名">
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "登录名必须输入"
              },
              { min: 3, message: "用户名至少3位" },
              { max: 12, message: "用户名最多12位" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户名必须是英文、数字或下划线组成"
              }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              style={{ width: "60%" }}
              placeholder="将会成为您唯一的登入名"
            />
          )}
        </Form.Item>
        <Form.Item label="用户状态">
          {getFieldDecorator("userStatus", {
            initialValue: 1
          })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="用户组">
          {getFieldDecorator("userGroup", {
            rules: [{ required: true, message: "请选择用户组!" }]
          })(
            <Select style={{ width: " 40%" }} placeholder="选择用户组">
              {Option}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="授权品牌">
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
          {getFieldDecorator("packageList", {
            rules: [{ required: true, message: "请选择授权品牌!" }]
          })(
            <Checkbox.Group
              options={this.props.packageList}
              // value={this.state.checkedList}
              onChange={this.checkboxOnChange}
            />
          )}
        </Form.Item>
        <Form.Item label="授权代理">
          {getFieldDecorator("proxy", {
            rules: [
              {
                whitespace: true,
                message: "多个代理请用英文逗号分隔"
              }
            ]
          })(
            <Input
              style={{ width: "60%" }}
              placeholder="多个代理请用英文逗号分隔"
            />
          )}
        </Form.Item>
        <Form.Item label="携带金额">
          {getFieldDecorator("loadGold", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入有效数字"
              },
              {
                pattern: /^\d+(\.\d+)?$/,
                message: "请输入有效数字"
              }
            ]
          })(<Input style={{ width: "60%" }} placeholder="请输入数字" />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "密码不能为空"
              },
              { min: 6, message: "密码至少6位" },
              { max: 16, message: "密码最多16位" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "密码必须是英文、数字或下划线组成"
              }
            ]
          })(
            <Input
              type="password"
              style={{ width: "60%" }}
              placeholder="6到16个字符"
            />
          )}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator("confirmPssword", {
            rules: [
              {
                required: true,
                whitespace: true
              },
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback(); //如果还没填写，则不进行一致性验证
                  }
                  if (value === getFieldValue("password")) {
                    callback();
                  } else {
                    callback("两次密码不一致");
                  }
                }
              }
            ]
          })(
            <Input
              type="password"
              style={{ width: "60%" }}
              placeholder="6到16个字符"
            />
          )}
        </Form.Item>
        <Form.Item>
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
}
const WrappedAddDataForm = Form.create()(AddDataForm);

export default WrappedAddDataForm;
