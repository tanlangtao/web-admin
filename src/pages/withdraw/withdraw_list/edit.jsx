import React from "react";
import { Form, Input, Radio, message, Spin, Modal, Collapse, Table } from "antd";
import { orderWithDrawReview, withDrawRemark } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import { formateDate } from "../../../utils/dateUtils";

const { Panel } = Collapse;
class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinning: false,
        };
        // this.orderStatus = parseInt(this.props.editData.review_status);
    }

    render() {
        const data = this.props.editData;
        const { data : details} = this.props.detailRecord;
        const initColumns = [
            {
                title: "审核人",
                dataIndex: "review_name"
            },
            {
                title: "审核操作",
                dataIndex: "status",
                render: (text) => {
                    let word;
                    switch (text) {
                        case 2:
                            word = "发起初审";
                            break;
                        case 3:
                            word = "(提交第三方)复审通过";
                            break;
                        case 4:
                            word = "(已成功)复审通过";
                            break;
                        case 5:
                            word = "(已失败)复审通过";
                            break;
                        case 6:
                            word = "复审拒绝";
                            break;
                        default:
                            word = "";
                            break;
                    }
                    return word;
                }
            },
            {
                title: "审核时间",
                dataIndex: "review_at",
                render: formateDate
            }
        ];
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
                successRadio = true;
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
            <Spin spinning={this.state.spinning}>
                <Form labelCol={{ span: 4 }} labelAlign="left">
                    <p style={{ color: '#f00' }}>注意：初审人与复审人不能为同一个人！</p>
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
                        <Radio.Group
                            defaultValue={(status === 4 || status === 5) ? (status - 2) : review_status}
                            onChange={(e) => (this.orderStatus = e.target.value)}
                        >
                            <Radio value={1} disabled={submitRadio} checked={submitRadioChecked}>
                                提交
                            </Radio>
                            <Radio value={2} disabled={successRadio} checked={successRadioChecked}>
                                已成功
                            </Radio>
                            <Radio value={3} disabled={failRadio} checked={failRadioChecked}>
                                已失败
                            </Radio>
                        </Radio.Group>
                        <LinkButton
                            onClick={this.sumbitOrderStatus}
                            style={confirmButtonShow ? {} : { display: "none" }}
                        >
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
                            style={{ width: "60%", marginRight: "8px" }}
                            onChange={(e) => {
                                this.remarkUser = e.target.value;
                            }}
                        />
                        <LinkButton onClick={this.sumbitRemarkUser}>确认</LinkButton>
                    </Form.Item>
                    <Form.Item label="备注[运营]">
                        <Input
                            style={{ width: "60%", marginRight: "8px" }}
                            onChange={(e) => {
                                this.remarkOperator = e.target.value;
                            }}
                        />
                        <LinkButton onClick={this.sumbitRemarkOperator}>确认</LinkButton>
                    </Form.Item>
                </Form>
                <Collapse accordion expandIconPosition="right">
                    <Panel header="查看审核详情" key="1">
                        {details && <Table
                            bordered
                            rowKey={(record, index) => `${index}`}
                            dataSource={details}
                            columns={initColumns}
                            size="small"
                            pagination={{
                                defaultPageSize: 5,
                                showQuickJumper: true,
                                showTotal: (total, range) => `共${total}条`,
                                defaultCurrent: 1,
                                total: details?.length || 0,
                            }}
                            scroll={{ x: "max-content" }}
                        />}
                    </Panel>
                </Collapse>
            </Spin>
        );
    }
    sumbitOrderStatus = async () => {
        const data = this.props.editData;
        let status = parseInt(data.status);
        let reqData = {
            order_id: data.order_id,
            review_status: parseInt(this.orderStatus),
            user_id: parseInt(data.user_id),
            review_type: 1,
            is_pass: 1,
        };
        if (!this.orderStatus) {
            message.info("请选择变更的订单状态");
            return;
        }
        if (status === 4 || status === 5) {
            console.log(
                "status----------",
                status,
                "reqData.review_status-----------------",
                reqData.review_status,
            );
            if (status - 2 === reqData.review_status) {
                message.info("无法重复提交订单状态");
                return;
            }
            Modal.confirm({
                title: "确定是否要变更状态?",
                okText: "确定",
                content: (
                    <div>
                        该订单状态为 [{status === 4 ? "已成功" : status === 5 ? "已失败" : ""}]
                    </div>
                ),
                onOk: async () => {
                    const res = await orderWithDrawReview(reqData);
                    if (res.status === 0) {
                        message.success(res.msg);
                    } else {
                        message.info(res.msg || "操作失败");
                    }
                    this.props.onclose();
                },
            });
        } else {
            const res = await orderWithDrawReview(reqData);
            if (res.status === 0) {
                message.success(res.msg);
            } else {
                message.info(res.msg || "操作失败");
            }
            this.props.onclose();
        }
    };
    review = async (is_pass) => {
        this.setState({ spinning: true });
        const data = this.props.editData;
        let reqData = {
            order_id: data.order_id,
            review_status: parseInt(data.review_status),
            user_id: parseInt(data.user_id),
            review_type: 2,
            is_pass: is_pass,
        };
        try {
            const res = await orderWithDrawReview(reqData);
            if (res.status === 0) {
                message.info(res.msg);
            } else {
                message.info(res.msg || "操作失败");
            }
            this.props.onclose();
        } catch (err) {
            console.log(err);
            this.setState({ spinning: false });
        }
    };
    sumbitRemarkUser = async () => {
        console.log(this.remarkUser);
        const data = this.props.editData;
        if (!this.remarkUser) {
            message.info("请输入有效内容！");
        } else {
            const res = await withDrawRemark(data.order_id, this.remarkUser, 1);
            if (res.status === 0) {
                message.success(res.msg);
            } else {
                message.info(res.msg);
            }
        }
    };
    sumbitRemarkOperator = async () => {
        console.log(this.remarkOperator);
        const data = this.props.editData;
        if (!this.remarkOperator) {
            message.info("请输入有效内容！");
        } else {
            const res = await withDrawRemark(data.order_id, this.remarkOperator, 2);
            if (res.status === 0) {
                message.success(res.msg);
            } else {
                message.info(res.msg);
            }
        }
    };
}
export default EditForm;
