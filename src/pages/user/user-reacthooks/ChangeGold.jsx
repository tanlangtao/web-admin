import React, { useCallback } from "react";
import { Modal, message, Form, InputNumber, Input } from "antd";
import {changeGold} from "../../../api/index";
import { throttle } from "../../../utils/commonFuntion";

const ChangeGoldform = (props) => {
	// 子组件中直接通过context拿到dispatch，通过reducer操作state
	// console.log(state)
	console.log("ChangeGoldform渲染了！");

	const { getFieldDecorator, validateFields } = props.form;
	const { state, dispatch, record } = props;
	const modal_onok = () => {
		validateFields(async (err, value) => {
			if (!err) {
				const res = await changeGold(record, value);
				if (res.status === 0) {
					message.success(res.msg);
					dispatch({
						type: "update",
						values: {
							isGoldShow: false
						}
					});
				} else {
					message.info(res.msg);
				}
			} else {
				message.info("请按要求输入");
			}
		});
	};
	//保存函数节流返回的函数在内存中不要随着组件更新而释放
	const handleThrottled = useCallback(throttle(modal_onok, 2000), []);
	return (
		<Modal
			title={`[用户user_id:${record.id}]资金变动`}
			visible={state.isGoldShow}
			onCancel={() => {
				dispatch({
					type: "update",
					values: {
						isGoldShow: false
					}
				});
			}}
			onOk={handleThrottled}
		>
			<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} labelAlign="right">
				<Form.Item label="金额">
					{getFieldDecorator("gold", {
						rules: [
							{
								required: true
							}
						]
					})(<InputNumber />)}
					<span style={{ marginLeft: 20, color: "#ccc", fontWeight: "normal" }}>必须为数字，减少时金额为负</span>
				</Form.Item>
				<Form.Item label="备注">
					{getFieldDecorator("desc", {
						rules: [
							{ max: 400, message: "最多400字" },
							{
								required: true
							}
						]
					})(<Input.TextArea placeholder="请输入文字" autoSize={{ minRows: 3, maxRows: 6 }} />)}
				</Form.Item>
			</Form>
		</Modal>
	);
};
export const ChangeGold = Form.create()(ChangeGoldform);
