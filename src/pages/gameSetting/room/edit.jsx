import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import { editRule } from "../../../api/index";
const EditForm = props => {
  const { getFieldDecorator } = props.form;
  const data = props.data;
  let handleEditSubmit = event => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await editRule(data.id, value);
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
      <Form.Item label="父级权限">
        {getFieldDecorator("pid", {
          rules: [{ required: true, message: "请选择权限" }],
          initialValue:  data.pid
        })(
          <Select style={{ width: "60%" }}>
            <Select.Option value={0}>一级权限</Select.Option>
            {props.packageNode}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="菜单名">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "请输入菜单名" }],
          initialValue: data.name.replace(/&nbsp;/g, "")
        })(<Input style={{ width: "60%" }} placeholder="菜单名" />)}
      </Form.Item>
      <Form.Item label="模块名">
        {getFieldDecorator("module", { initialValue: data.module })(
          <Input style={{ width: "60%" }} placeholder="模块名" />
        )}
      </Form.Item>
      <Form.Item label="方法名">
        {getFieldDecorator("action", { initialValue: data.action })(
          <Input style={{ width: "60%" }} placeholder="方法名" />
        )}
      </Form.Item>
      <Form.Item label="模板路径">
        {getFieldDecorator("href", { initialValue: data.href })(
          <Input style={{ width: "60%" }} placeholder="模板路径" />
        )}
      </Form.Item>
      <Form.Item label="路由key">
        {getFieldDecorator("key", { initialValue: data.router_key })(
          <Input style={{ width: "60%" }} placeholder="路由key" />
        )}
      </Form.Item>
      <Form.Item label="icon样式">
        {getFieldDecorator("icon", { initialValue: data.icon })(
          <Input style={{ width: "60%" }} placeholder="icon样式" />
        )}
      </Form.Item>
      <Form.Item label="菜单排序">
        {getFieldDecorator("sort", {
          rules: [{ required: true, message: "请输入排序值" }],
          initialValue: data.sort
        })(<Input style={{ width: "60%" }} placeholder="菜单排序" />)}
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
