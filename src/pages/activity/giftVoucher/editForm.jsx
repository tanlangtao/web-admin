import React from "react";
import { Form, Input, Button, message, Select, Radio } from "antd";
import { saveActivityConfig } from "../../../api/index";
const EditForm = props => {
  const { getFieldDecorator } = props.form;
  const record = props.record;
  const action = props.action;
  let handleEditSubmit = event => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        if (action === "edit") {
          value.id = record.id;
        }
        const res = await saveActivityConfig(value);
        if (res.status === 0) {
          message.success("提交成功" + res.msg);
          props.finished();
          props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  };
  return (
    <div>
      <Form
        labelCol={{ span: 6 }}
        labelAlign="left"
        onSubmit={handleEditSubmit}
      >
        <Form.Item label="活动名称">
          {getFieldDecorator("name", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.name
          })(<Input style={{ width: "40%" }} />)}
        </Form.Item>
        <Form.Item label="品牌">
          {getFieldDecorator("package_id", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.package_id
          })(
            <Select style={{ width: "40%" }}>
              <Select.Option value="1">特斯特娱乐</Select.Option>
              <Select.Option value="2">德比游戏</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator("is_close", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.is_close
          })(
            <Radio.Group>
              <Radio value="1">关闭</Radio>
              <Radio value="2">开启</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="需要绑定电话">
          {getFieldDecorator("need_mobile", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.need_mobile
          })(
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="2">否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="需要绑定银行卡">
          {getFieldDecorator("need_bankcard", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.need_bankcard
          })(
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="2">否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="排序">
          {getFieldDecorator("order_by", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.order_by
          })(<Input style={{ width: "40%" }} />)}
        </Form.Item>
        <Form.Item label="活动内容">
          {getFieldDecorator("info", {
            rules: [{ required: true }],
            initialValue: action === "add" ? "" : record.info
          })(
            <Input.TextArea
              style={{ width: "70%" }}
              autosize={{ maxRows: 10 }}
            />
          )}
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
