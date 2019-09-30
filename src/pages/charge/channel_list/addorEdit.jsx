import React, { Component } from "react";
import { Form, Icon, Input, Button, message, Radio, Select } from "antd";
import { addChannel, editPayChannel } from "../../../api";

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
        <Form.Item label="支付名称">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.name : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="所属渠道ID">
          {getFieldDecorator("channel_id", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.channel_id : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="支付名称">
          {getFieldDecorator("nick_name", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.nick_name : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator("status", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.status) : 1
          })(
            <Radio.Group>
              <Radio value={1}>开启</Radio>
              <Radio value={0}>关闭</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="支付方式">
          {getFieldDecorator("pay_type", {
            rules: [{ required: true, message: "请选择支付方式!" }],
            initialValue: isEdit && editDataRecord.pay_type
          })(
            <Select style={{ width: " 40%" }} placeholder="选择支付方式">
              <Select.Option value="7">支付宝H5</Select.Option>
              <Select.Option value="8">支付宝扫码</Select.Option>
              <Select.Option value="2">快捷支付</Select.Option>
              <Select.Option value="4">微信H5</Select.Option>
              <Select.Option value="5">微信扫码</Select.Option>
              <Select.Option value="1">网银支付</Select.Option>
              <Select.Option value="13">银联扫码</Select.Option>
              <Select.Option value="17">转账银行卡</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="支付限额最小面值">
          {getFieldDecorator("min_amount", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.min_amount : ""
          })(<Input style={{ width: "30%" }} />)}
        </Form.Item>
        <Form.Item label="支付限额最大面值">
          {getFieldDecorator("max_amount", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.max_amount : ""
          })(<Input style={{ width: "30%" }} />)}
        </Form.Item>
        <Form.Item label="固定面值">
          {getFieldDecorator("span_amount", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入有效数字"
              }
            ],
            initialValue: isEdit && editDataRecord.span_amount
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="单笔间隔">
          {getFieldDecorator("seed", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入有效数字"
              }
            ],
            initialValue: isEdit && editDataRecord.seed
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="玩家承担费率%">
          {getFieldDecorator("rate", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit && editDataRecord.rate
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="显示排序">
          {getFieldDecorator("sort", {
            initialValue: isEdit ? editDataRecord.sort : "0"
          })(<Input style={{ width: "60%" }} />)}
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
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      let id = this.props.editDataRecord ? this.props.editDataRecord.id : "";
      if (!err) {
        const res = !this.props.isEdit
          ? await addChannel(value)
          : await editPayChannel(value,id);
        if (res.status === 0) {
          message.success("提交成功");
          this.props.refreshPage();
          this.props.cancel();
          this.props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      } else {
        message.error("提交失败");
      }
    });
  };
}

const WrappedAddDataForm = Form.create()(AddDataForm);

export default WrappedAddDataForm;