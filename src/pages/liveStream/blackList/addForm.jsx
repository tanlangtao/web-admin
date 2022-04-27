import React from "react";
import {
  Form,
  Input,
  Button,
  message,
} from "antd";
import { addLiveBlackList } from "../../../api";

const AddForm = (props) => {
  const { finished } = props
  const { getFieldDecorator, resetFields, validateFields } = props.form

  const handleEditSubmit = (e) => {
    e.preventDefault()
    validateFields(async (err, value) => {
      if (!err) {
        const res = await addLiveBlackList(value)
        if (res.code === 0) {
          message.success("提交成功");
          resetFields();
          finished()
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  }

  return (
    <Form labelCol={{ span: 6 }} labelAlign="right" onSubmit={handleEditSubmit}>
      <Form.Item label="玩家ID">
        {getFieldDecorator("user_id", {
          rules: [{ required: true, message: '请输入玩家ID' }],
          initialValue: "",
        })(<Input style={{ width: "50%" }} />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddForm)