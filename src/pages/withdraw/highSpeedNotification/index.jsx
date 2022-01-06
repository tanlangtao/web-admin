import React from "react"
import { Card, Form, Input, Button, message } from "antd";
import { sendHighSpeedNotification } from "../../../api"
import { useState } from "react";

const HighSpeedNotification = (props) => {
  const { getFieldDecorator } = props.form
  const [resMsg, setShowResMsg] = useState()

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        const res = await sendHighSpeedNotification(value);
        if (res.status === 0) {
          message.success("提交成功" + res.msg);
          props.cancel();
          props.form.resetFields();
          setShowResMsg(res)
        } else {
          message.info("出错了：" + res.msg);
          setShowResMsg(res)
        }
      }
    });
  }

  return (
    <div>
      <Card
        title={
          <Form labelCol={{ span: 2 }} onSubmit={handleSubmit} labelAlign="left">
            <Form.Item label="兑换订单ID:">
              {getFieldDecorator("order_id", {
                rules: [{ required: true, message: "请输入兑换订单ID" }],
              })(<Input style={{ width: 300 }} placeholder="请输入兑换订单ID" />)}
            </Form.Item>
            <Form.Item label="金额:">
              {getFieldDecorator("amount", {
                rules: [{ required: true, message: "请输入金额" },
                {
                  pattern: /^\d+(\.\d+)?$/,
                  message: "请输入有效数字"
                }],
              })(<Input style={{ width: 300 }} placeholder="请输入金额" />)}
            </Form.Item>
            <Form.Item label="状态:">
              {getFieldDecorator("status", {
                rules: [{ required: true, message: "请输入状态码" },
                {
                  pattern: /^[0-1]?$/,
                  message: "请输入0或1"
                },],
              })(<Input style={{ width: 300 }} placeholder="请输入状态码" />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        }
      >
        <pre>{JSON.stringify(resMsg)}</pre>
      </Card >
      <div style={{ 'fontSize': '16px', padding: 24 }}>
        说明:
        <br />
        1. 本界面仅限极速兑换订单通知onepay使用
        <br />
        2. 状态:0=失败,1=成功
        <br />
        3. 金额:状态为0时,金额为0,状态为1时,金额为兑换订单金额
      </div>
    </div>
  )
}

const HighSpeedNotificationForm = Form.create()(HighSpeedNotification)
export default HighSpeedNotificationForm

