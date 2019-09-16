import React from "react";
import { Form, Input, Button, message } from "antd";
import { changeUserBalance } from "../../../api/index";
const EditForm = props => {
  const { getFieldDecorator } = props.form;
  const record = props.record;
  let params = JSON.parse(record.params);

  let handleEditSubmit = event => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        let obj = {
          "data[id]": record.id,
          "data[params]": record.params,
          "data[status]": 2
        };
        if (props.action === "review") {
          obj["data[pay_reason]"] = value.reason;
          obj["data[status]"] = 1;
        }
        const res = await changeUserBalance(obj);
        if (res.status === 0) {
          message.success("提交成功" + res.msg);
          props.finished();
          props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      }
    });
  };
  return (
    <div>
      <span>
        ID:{params.user_id} 资金变动：{params.amount} 复审
        {props.action === "review" ? "备注" : "拒绝"}
      </span>
      <Form
        labelCol={{ span: 4 }}
        labelAlign="left"
        onSubmit={handleEditSubmit}
      >
        <Form.Item
          style={{ display: props.action === "review" ? "block" : "none" }}
        >
          {getFieldDecorator("reason", {
            initialValue: params.reason
          })(<Input.TextArea autosize={{ minRows: 5, maxRows: 10 }} />)}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
