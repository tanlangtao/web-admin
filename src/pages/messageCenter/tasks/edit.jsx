import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { changeUserBalance } from "../../../api/index";
import { throttle } from "../../../utils/commonFuntion";

class EditForm extends Component {
	constructor(props) {
		super(props);
		this.handleInputThrottled = throttle(this.handleEditSubmit, 2000);
	}
	handleEditSubmit = () => {
		this.props.closepopup();
		this.props.form.validateFields(async (err, value) => {
			if (!err) {
				let obj = {
					id     : this.props.record.id,
					params : JSON.parse(this.props.record.params),
					status : 2
				};
				if (this.props.action === "review") {
					obj["pay_reason"] = value.reason;
					obj["status"] = 1;
				}
				const res = await changeUserBalance(obj);
				if (res.status === 0) {
					message.success(res.msg || "提交成功");
				} else {
					message.info(res.msg || "出错了");
				}
				this.props.finished();
			}
		});
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const params = JSON.parse(this.props.record.params);
		return (
			<div>
				<span>
					ID:{params.user_id} 资金变动：{params.amount} 复审
					{this.props.action === "review" ? "备注" : "拒绝"}
				</span>
				<Form
					labelCol={{ span: 4 }}
					labelAlign="left"
					onSubmit={(e) => {
						e.preventDefault();
						this.handleInputThrottled();
					}}
				>
					<Form.Item style={{ display: this.props.action === "review" ? "block" : "none" }}>
						{getFieldDecorator("reason", {
							initialValue : params.reason
						})(<Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />)}
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							确定
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
