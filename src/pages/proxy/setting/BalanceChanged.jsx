import React from "react";
import { Form, Input, Button, message, Select, Radio } from "antd";
import { proxy_changeGold } from "../../../api/index";

const EditForm = props => {
  const { getFieldDecorator } = props.form;
  const record = props.record;
  let handleEditSubmit = event => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        let obj = {
          task_type: 1,
          "params[user_id]": record.id,
          "params[amount]": value.amount,
          "params[reason]": value.reason,
          "params[user_name]": record.id,
          "params[proxy_user_id]": record.proxy_pid,
          "params[package_id]": record.package_id
        };
        console.log("proxy_changeGold:--------------------", obj);
        const res = await proxy_changeGold(obj);
        if (res.status === 0) {
          message.success("提交成功" + res.msg);
          props.cancel();
          props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      }
    });
  };
  return (
    <Form labelCol={{ span: 4 }} labelAlign="left" onSubmit={handleEditSubmit}>
      <Form.Item label="金额">
        {getFieldDecorator("amount", {
          rules: [{ required: true, message: "必须为数字，减少时金额为负" }]
        })(
          <Input
            placeholder="必须为数字，减少时金额为负"
            style={{ width: "60%" }}
          />
        )}
      </Form.Item>
      <Form.Item label="备注">
        {getFieldDecorator("reason", {
          rules: [{ required: true }]
        })(
          <Input.TextArea
            placeholder="请输入内容"
            autoSize={{ minRows: 4, maxRows: 10 }}
            style={{ width: "60%" }}
          />
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
