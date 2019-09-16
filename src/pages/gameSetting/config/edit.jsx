import React from "react";
import { Form, Input, Button, message } from "antd";
import { saveConf } from "../../../api/index";
const EditForm = props => {
  const { getFieldDecorator } = props.form;
  const record = props.record;
  let handleEditSubmit = event => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        if (props.action === "edit") {
          value.id = record.id;
        }
        const res = await saveConf(value, props.action);
        if (res.status === 0) {
          message.success("提交成功");
          props.finished();
          props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      }
    });
  };
  return (
    <Form labelCol={{ span: 4 }} labelAlign="left" onSubmit={handleEditSubmit}>
      <Form.Item label="配置名">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "请输入配置名" }],
          initialValue: props.action === "add" ? "" : props.record.name
        })(<Input style={{ width: "60%" }} />)}
      </Form.Item>
      <Form.Item label="配置Key">
        {getFieldDecorator("conf_key", {
          rules: [{ required: true, message: "请输入配置Key" }],
          initialValue: props.action === "add" ? "" : props.record.conf_key
        })(<Input style={{ width: "60%" }} />)}
      </Form.Item>
      <Form.Item label="配置Val">
        {getFieldDecorator("conf_val", {
          rules: [{ required: true, message: "请输入配置Val" }],
          initialValue: props.action === "add" ? "" : props.record.conf_val
        })(<Input style={{ width: "60%" }} />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
