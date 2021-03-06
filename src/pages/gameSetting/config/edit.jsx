import React from "react";
import { Form, Input, Button, message } from "antd";
import { saveConf } from "../../../api/index";
import { CodeEditor } from "../../../components/myComponents";
const EditForm = (props) => {
	const { getFieldDecorator } = props.form;
	const record = props.record;
	// let getValueFromEvent = e => {
	//   console.log("Upload event:", e);
	// if (Array.isArray(e)) {
	//   return e;
	// }
	// return e && e.fileList;
	// };
	let handleEditSubmit = (event) => {
		event.preventDefault();
		props.form.validateFields(async (err, value) => {
			console.log(value);
			if (!err) {
				if (props.action === "edit") {
          value.id = record.id;
          try {
            value.conf_val = JSON.stringify(JSON.parse(value.conf_val));
            } catch(err) { 
              message.info(`${err}`)
              return 
            }
				}
				const res = await saveConf(value, props.action);
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
		<Form labelCol={{ span: 3 }} labelAlign="left" onSubmit={handleEditSubmit}>
			<Form.Item label="配置名">
				{getFieldDecorator("name", {
					rules        : [ { required: true, message: "请输入配置名" } ],
					initialValue : props.action === "add" ? "" : props.record.name
				})(<Input style={{ width: "50%" }} />)}
			</Form.Item>
			<Form.Item label="配置Key">
				{getFieldDecorator("conf_key", {
					rules        : [ { required: true, message: "请输入配置Key" } ],
					initialValue : props.action === "add" ? "" : props.record.conf_key
				})(<Input style={{ width: "50%" }} />)}
			</Form.Item>
			<Form.Item label="配置Val">
				{getFieldDecorator("conf_val", {
					rules        : [ { required: true, message: "请输入有效的配置Val" } ],
					initialValue : props.action === "add" ? "" : props.record.conf_val
				})(
					props.action === "add" ? (
						<Input style={{ width: "50%" }} />
					) : (
						<CodeEditor conf_val={props.record.conf_val} />
					)
				)}
				<span style={props.action === "add" ? { display: "none" } : {}}>
					{/* 请注意首尾中括号【】为代码编辑器携带符号，实际参数不带首尾中括号,请勿修改删除【】 */}
				</span>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					提交
				</Button>
			</Form.Item>
		</Form>
	);
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
