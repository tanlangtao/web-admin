import React from "react";
import { Form, Input, Button, message, Radio } from "antd";
import { postb2bconfig } from "../../../api";

function dataForm({ data, action, form, cancel }) {
	const { getFieldDecorator, validateFields } = form;
	const handleSubmit = (event) => {
		event.preventDefault();
		validateFields(async (err, value) => {
			if (!err) {
				if (action === "upt") value.id = data.id;
				const res = await postb2bconfig(value, action);
				if (res.code === 200) {
					message.success(res.msg || "提交成功");
					cancel();
				} else {
					message.info("出错了:" + res.msg);
				}
			} else {
				message.info("提交失败");
			}
		});
	};
	return (
		<Form labelCol={{ span: 7 }} onSubmit={handleSubmit}>
			<Form.Item label="平台码">
				{getFieldDecorator("platform_code", {
					rules: [
						{
							required: true,
							message: "该项不能为空"
						}
					],
					initialValue: action === "upt" ? data.platform_code : ""
				})(<Input disabled={Boolean(action === "upt")} style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="平台验证token">
				{getFieldDecorator("platform_token", {
					rules: [
						{
							required: true,
							message: "该项不能为空"
						}
					],
					initialValue: action === "upt" ? data.token : ""
				})(<Input style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="平台名">
				{getFieldDecorator("platform_name", {
					rules: [
						{
							required: true,
							message: "该项不能为空"
						}
					],
					initialValue: action === "upt" ? data.name : ""
				})(<Input style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="平台环境包名">
				{getFieldDecorator("package_name", {
					rules: [
						{
							required: true,
							message: "该项不能为空"
						}
					],
					initialValue: action === "upt" ? data.package_name : ""
				})(<Input style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="平台上级代理ID">
				{getFieldDecorator("superior_agent", {
					rules: [
						{
							required: true,
							message: "该项不能为空"
						}
					],
					initialValue: action === "upt" ? data.superior_agent : ""
				})(<Input style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="充值开关">
				{getFieldDecorator("open_chongzhi", {
					rules: [{ required: true }],
					initialValue: action === "add" ? "" : data.item_status.open_chongzhi,
				})(
					<Radio.Group>
						<Radio value={0}>关闭</Radio>
						<Radio value={1}>开启</Radio>
					</Radio.Group>,
				)}
			</Form.Item>
			<Form.Item label="提现开关">
				{getFieldDecorator("open_tixian", {
					rules: [{ required: true }],
					initialValue: action === "add" ? "" : data.item_status.open_tixian,
				})(
					<Radio.Group>
						<Radio value={0}>关闭</Radio>
						<Radio value={1}>开启</Radio>
					</Radio.Group>,
				)}
			</Form.Item>
			<Form.Item label="返回大厅开关">
				{getFieldDecorator("open_back_hall", {
					rules: [{ required: true }],
					initialValue: action === "add" ? "" : data.item_status.open_back_hall,
				})(
					<Radio.Group>
						<Radio value={0}>关闭</Radio>
						<Radio value={1}>开启</Radio>
					</Radio.Group>,
				)}
			</Form.Item>
			<Form.Item label="客服开关">
				{getFieldDecorator("open_im", {
					rules: [{ required: true }],
					initialValue: action === "add" ? "" : data.item_status.open_im,
				})(
					<Radio.Group>
						<Radio value={0}>关闭</Radio>
						<Radio value={1}>开启</Radio>
					</Radio.Group>,
				)}
			</Form.Item>
			<Form.Item label="代理系统开关">
				{getFieldDecorator("open_proxy", {
					rules: [{ required: true }],
					initialValue: action === "add" ? "" : data.item_status.open_proxy,
				})(
					<Radio.Group>
						<Radio value={0}>关闭</Radio>
						<Radio value={1}>开启</Radio>
					</Radio.Group>,
				)}
			</Form.Item>
			<Form.Item wrapperCol={{ offset: 4 }}>
				<Button type="primary" htmlType="submit">
					提交
				</Button>
			</Form.Item>
		</Form>
	);
}

const WrappedDataForm = Form.create()(dataForm);

export default WrappedDataForm;
