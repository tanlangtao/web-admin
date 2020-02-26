import React from "react";
import { Form, Input, Radio, message } from "antd";
import { orderWithDrawReview, withDrawRemark } from "../../../api/index";
import LinkButton from "../../../components/link-button";

class EditForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const data = this.props.editData;
		let review_status = parseInt(data.review_status);
		let status = parseInt(data.status);
		let orderStatusShow,
			reviewShow,
			confirmButtonShow,
			submitRadio,
			successRadio,
			failRadio,
			submitRadioChecked,
			successRadioChecked,
			failRadioChecked;
		switch (status) {
			case 1:
				orderStatusShow = true;
				confirmButtonShow = true;
				break;
			case 2:
				orderStatusShow = true;
				reviewShow = true;
				switch (review_status) {
					case 1:
						successRadio = true;
						failRadio = true;
						submitRadioChecked = true;
						break;
					case 2:
						submitRadio = true;
						failRadio = true;
						successRadioChecked = true;
						break;
					case 3:
						successRadio = true;
						submitRadio = true;
						failRadioChecked = true;
						break;
					default:
						break;
				}
				break;
			case 3:
				orderStatusShow = true;
				confirmButtonShow = true;
				submitRadio = true;
				break;
			case 4:
				orderStatusShow = true;
				confirmButtonShow = true;
				submitRadio = true;
				break;
			case 5:
				orderStatusShow = true;
				confirmButtonShow = true;
				submitRadio = true;
				break;
			default:
				break;
		}
		return (
			<Form labelCol={{ span: 4 }} labelAlign="left">
				<Form.Item label="订单ID">
					<Input style={{ width: "60%" }} value={data.order_id} readOnly />
				</Form.Item>
				<Form.Item label="用户ID">
					<Input style={{ width: "60%" }} value={data.user_id} readOnly />
				</Form.Item>
				<Form.Item label="金额">
					<Input style={{ width: "60%" }} value={data.amount} readOnly />
				</Form.Item>

				<Form.Item label="订单状态:" style={orderStatusShow ? {} : { display: "none" }}>
					<Radio.Group defaultValue={review_status} onChange={(e) => (this.orderStatus = e.target.value)}>
						<Radio value={1} disabled={submitRadio} checked={submitRadioChecked}>
							提交第三方
						</Radio>
						<Radio value={2} disabled={successRadio} checked={successRadioChecked}>
							已成功
						</Radio>
						<Radio value={3} disabled={failRadio} checked={failRadioChecked}>
							已失败
						</Radio>
					</Radio.Group>
					<LinkButton onClick={this.sumbitOrderStatus} style={confirmButtonShow ? {} : { display: "none" }}>
						确认
					</LinkButton>
				</Form.Item>

				<Form.Item label="复审:" style={reviewShow ? {} : { display: "none" }}>
					<LinkButton
						onClick={() => {
							this.review(1);
						}}
					>
						通过
					</LinkButton>
					<LinkButton
						onClick={() => {
							this.review(2);
						}}
					>
						拒绝
					</LinkButton>
				</Form.Item>
				<Form.Item label="备注[用户]">
					<Input
						style={{ width: "60%" }}
						onChange={(e) => {
							this.remarkUser = e.target.value;
						}}
					/>
					<LinkButton onClick={this.sumbitRemarkUser}>确认</LinkButton>
				</Form.Item>
				<Form.Item label="备注[运营]">
					<Input
						style={{ width: "60%" }}
						onChange={(e) => {
							this.remarkOperator = e.target.value;
						}}
					/>
					<LinkButton onClick={this.sumbitRemarkOperator}>确认</LinkButton>
				</Form.Item>
			</Form>
		);
	}
	sumbitOrderStatus = async () => {
		const data = this.props.editData;
		if (!this.orderStatus) {
			message.error("请选择订单状态！");
		} else {
			let reqData = {
				order_id: data.order_id,
				review_status: parseInt(this.orderStatus),
				user_id: parseInt(data.user_id),
				review_type: 1,
				is_pass: 1
			};
			const res = await orderWithDrawReview(reqData);
			if (res.status === 0) {
				message.success(res.msg);
			} else {
				message.error(res.msg || "操作失败");
			}
			this.props.onclose();
		}
	};
	review = async (is_pass) => {
		const data = this.props.editData;
		let reqData = {
			order_id: data.order_id,
			review_status: parseInt(data.review_status),
			user_id: parseInt(data.user_id),
			review_type: 2,
			is_pass: is_pass
		};
		const res = await orderWithDrawReview(reqData);
		if (res.status === 0) {
			message.info(res.msg);
		} else {
			message.error(res.msg || "操作失败");
		}
		this.props.onclose();
	};
	sumbitRemarkUser = async () => {
		console.log(this.remarkUser);
		const data = this.props.editData;
		if (!this.remarkUser) {
			message.error("请输入有效内容！");
		} else {
			const res = await withDrawRemark(data.order_id, this.remarkUser, 1);
			if (res.status === 0) {
				message.success(res.msg);
			} else {
				message.error(res.msg);
			}
		}
	};
	sumbitRemarkOperator = async () => {
		console.log(this.remarkOperator);
		const data = this.props.editData;
		if (!this.remarkOperator) {
			message.error("请输入有效内容！");
		} else {
			const res = await withDrawRemark(data.order_id, this.remarkOperator, 2);
			if (res.status === 0) {
				message.success(res.msg);
			} else {
				message.error(res.msg);
			}
		}
	};
}
export default EditForm;
