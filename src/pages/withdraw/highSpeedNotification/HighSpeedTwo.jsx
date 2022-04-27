import React from "react"
import { Card, Form, Input, Button, message, Radio } from "antd";
import { sendHighSpeedTwoNotification } from "../../../api"
import { useState } from "react";

const HighSpeedNotification = (props) => {
  const { getFieldDecorator } = props.form
  const [resMsg, setShowResMsg] = useState()

  const handleSubmit = (e) => {
    setShowResMsg()
    e.preventDefault()
    props.form.validateFields(async (err, value) => {
      if (!err) {
        const res = await sendHighSpeedTwoNotification(value)
        setShowResMsg(res)
        if (res.status === 0) {
          message.success("提交成功" + res.msg)
          props.cancel();
          props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg)
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
            <Form.Item label="状态">
              {getFieldDecorator("wdr_status", {
                rules: [
                  {
                    required: true
                  }
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>成功</Radio>
                  <Radio value={0}>失敗</Radio>
                </Radio.Group>
              )}
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
    </div>
  )
}

const HighSpeedNotificationForm = Form.create()(HighSpeedNotification)
export default HighSpeedNotificationForm

