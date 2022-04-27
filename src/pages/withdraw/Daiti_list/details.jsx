import React, { Component } from "react";
import { Table } from "antd";
import { formateDate } from "../../../utils/dateUtils";
class GoldDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sumData: "",
        };
    }
    render() {
        const { data } = this.props.detailRecord;
        console.log(data);
        return (
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data}
                columns={this.initColumns()}
                size="small"
            />
        );
    }
    initColumns = () => {
        if (this.props.action === "check") {
            return [
                {
                    title: "审核人",
                    dataIndex: "review_name",
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
                                word = " (已失败) 复审通过";
                                break;
                            case 6:
                                word = "复审拒绝";
                                break;
                            default:
                                word = "";
                                break;
                        }
                        return word;
                    },
                },
                {
                    title: "审核时间",
                    dataIndex: "review_at",
                    render: formateDate,
                },
            ];
        } else {
            return [
                {
                    title: "备注人",
                    dataIndex: "remark_name",
                },
                {
                    title: "内容",
                    dataIndex: "content",
                },
                {
                    title: "备注时间",
                    dataIndex: "created_at",
                    render: formateDate,
                },
            ];
        }
    };
}

export default GoldDetail;
