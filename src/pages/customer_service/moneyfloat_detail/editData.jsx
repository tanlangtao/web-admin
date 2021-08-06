import React from "react";

import { Form, Input, Button, message } from "antd";

import { post_moneyfloat_detail } from "../../../api";

const EditForm = (props) => {
    const { record, isadd } = props;
    const { getFieldDecorator } = props.form;

    let handleEditSubmit = (event) => {
        event.preventDefault();
        props.form.validateFields(async (err, value) => {
            if (!err) {
                if (!isadd) {
                    value.id = record.id;
                }
                console.log(value);
                const res = await post_moneyfloat_detail({
                    action: isadd ? "add" : "edit",
                    ...value,
                });
                if (res.status === 0) {
                    message.success("提交成功" + res.msg);
                    props.finished();
                } else {
                    message.info("出错了：" + res.msg);
                }
            }
        });
    };
    return (
        <div>
            <Form labelCol={{ span: 4 }} labelAlign="left" onSubmit={handleEditSubmit}>
                <Form.Item label="用户id">
                    {getFieldDecorator("user_id", {
                        initialValue: isadd ? "" : record.user_id,
                    })(<Input style={{ width: "60%" }} readOnly={!isadd} />)}
                </Form.Item>
                <Form.Item label="系数">
                    {getFieldDecorator("rate", {
                        initialValue: isadd ? "" : record.rate,
                    })(<Input style={{ width: "60%" }} readOnly={!isadd} />)}
                </Form.Item>
                <Form.Item label="有效投注">
                    {getFieldDecorator("amount", {
                        initialValue: isadd ? "" : record.amount,
                    })(<Input style={{ width: "60%" }} />)}
                </Form.Item>
                <Form.Item label="关联id">
                    {getFieldDecorator("link_id", {
                        initialValue: isadd ? "" : record.link_id,
                    })(<Input style={{ width: "60%" }} />)}
                </Form.Item>
                <Form.Item label="备注">
                    {getFieldDecorator("remark", {
                        initialValue: isadd ? "" : record.remark,
                    })(
                        <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
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
        </div>
    );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
