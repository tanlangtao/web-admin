import React from "react";
import { Form, Input, Select, Button, message, Radio } from "antd";
import { modifybank } from "../../../api/index";
const EditForm = (props) => {
  const { getFieldDecorator } = props.form;
  const data = props.data;
  let handleEditSubmit = (event) => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await modifybank(data.id, value);
        if (res.status === 0) {
          message.success("提交成功");
          props.finished();
          props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  };
  return (
    <Form labelCol={{ span: 4 }} labelAlign="left" onSubmit={handleEditSubmit}>
      <Form.Item>
        {getFieldDecorator("bank_id", {
          rules: [{ required: true, message: "请输入银行卡名称" }],
        })(<Input style={{ width: 200 }} placeholder="银行卡名称" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("bank_name", {
          rules: [{ required: true, message: "请输入银行卡简称" }],
        })(<Input style={{ width: 200 }} placeholder="银行卡简称" />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
