import React, { useCallback } from "react";
import { Form, Input, Button, message } from "antd";
import { proxy_changeGold } from "../../../api/index";
import { throttle } from "../../../utils/commonFuntion";
const EditForm = props => {
	const { getFieldDecorator } = props.form;
	const record = props.record;
	let handleEditSubmit = () => {
		props.form.validateFields(async (err, value) => {
			if (!err) {
				let obj = {
					task_type: 1,
					params: {
						user_id: record.id,
						amount: parseFloat(value.amount),
						reason: value.reason,
						user_name: record.proxy_nick,
						proxy_user_id: record.proxy_pid,
						package_id: record.package_id,
					},
				};
				console.log("proxy_changeGold:--------------------", obj);
				const res = await proxy_changeGold(obj);
				if (res.status === 0) {
					message.success("提交成功" + res.msg);
					props.cancel();
					props.form.resetFields();
				} else {
					message.info("出错了：" + res.msg);
				}
			}
		});
	};
	//保存函数节流返回的函数在内存中不要随着组件更新而释放
	const handleThrottled = useCallback(throttle(handleEditSubmit, 3000), []);
	return (
		<Form
			labelCol={{ span: 4 }}
			labelAlign="left"
			onSubmit={e => {
				e.preventDefault();
				handleThrottled();
			}}
		>
			<Form.Item label="金额">
				{getFieldDecorator("amount", {
					rules: [{ required: true, message: "必须为数字，减少时金额为负" }],
				})(<Input placeholder="必须为数字，减少时金额为负" style={{ width: "60%" }} />)}
			</Form.Item>
			<Form.Item label="备注">
				{getFieldDecorator("reason", {
					rules: [{ required: true }],
				})(
					<Input.TextArea
						placeholder="请输入内容"
						autoSize={{ minRows: 4, maxRows: 10 }}
						style={{ width: "60%" }}
					/>,
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
