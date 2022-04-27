import React, { Component } from "react";
import { Card, Table, message, Input, Modal } from "antd";
import { packageList, activityList, downloadActivityReceive } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { formateDate } from "../../../utils/dateUtils";
import { reverseDecimal } from "../../../utils/commonFuntion";

class AccountList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            count: 0,
            page: 1,
            pageSize: 20,
            options: [],
            packages: "",
        };
        this.activityId = 0;
    }
    getInitialData = async (page, limit) => {
        const res = await activityList(page, limit);
        if (res.status === 0) {
            this.setState({
                data: res.data && res.data.list,
                count: parseInt(res.data && res.data.count),
                packages: res.data.packages,
            });
        } else {
            message.info("未检索到数据");
        }
    };
    getPackageList = async () => {
        let res = await packageList();
        if (res.status === 0 && res.data) {
            let arr = [];
            res.data.list.forEach((element) => {
                arr.push({ label: element.name, value: element.id });
            });
            this.setState({
                options: arr,
            });
        }
    };
    componentDidMount() {
        this.getInitialData(1, 20);
        this.getPackageList();
    }

    render() {
        console.log(this.state.options);

        return (
            <Card
                title={
                    <div>
                        <MyDatePicker
                            handleValue={(data, dateString) => {
                                this.start_time = dateString[0];
                                this.end_time = dateString[1];
                                this.setState({
                                    MyDatePickerValue: data,
                                });
                            }}
                            value={this.state.MyDatePickerValue}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <Input
                            style={{ width: 150 }}
                            placeholder="请输入user_id"
                            ref={(Input) => {
                                this.input = Input;
                            }}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <Input
                            style={{ width: 150 }}
                            placeholder="请输入活动id"
                            ref={(Input) => {
                                this.activityId = Input;
                            }}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <LinkButton
                            onClick={() => this.onSearch(1, 20)}
                            icon="search"
                            size="default"
                        />
                    </div>
                }
                extra={
                    <span>
                        <LinkButton
                            style={{ float: "right" }}
                            onClick={() => window.location.reload()}
                            icon="reload"
                            size="default"
                        />
                        <br />
                        <br />
                        <LinkButton
                            size="default"
                            style={{ float: "right" }}
                            onClick={this.download}
                            icon="download"
                        />
                    </span>
                }
            >
                <Table
                    bordered
                    rowKey={(record, index) => `${index}`}
                    dataSource={this.state.data}
                    columns={this.initColumns()}
                    size="small"
                    pagination={{
                        defaultPageSize: 20,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `共${total}条`,
                        defaultCurrent: 1,
                        total: this.state.count,
                        onChange: (page, pageSize) => {
                            this.onSearch(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            this.onSearch(current, size);
                        },
                    }}
                />
            </Card>
        );
    }
    initColumns = () => [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "user_id",
            dataIndex: "user_id",
        },
        {
            title: "活动Id",
            dataIndex: "activity_id",
        },
        {
            title: "活动名称",
            dataIndex: "activity_name",
            render: (text) => {
                let res = "";
                switch (text.split("-")[1]) {
                    case "100":
                        res = "扎金花赢局";
                        break;
                    case "101":
                        res = "斗地主赢局";
                        break;
                    case "300":
                        res = "下级完成首充1人";
                        break;
                    case "301":
                        res = "下级完成首充3人";
                        break;
                    case "400":
                        res = "积分达到50";
                        break;
                    case "401":
                        res = "积分达到80";
                        break;
                    case "200":
                        res = "个人完成充值次数1次";
                        break;
                    case "201":
                        res = "个人完成充值金额";
                        break;
                    default:
                        res = text;
                        break;
                }
                return res;
            },
        },
        {
            title: "品牌Id",
            dataIndex: "package_id",
            render: (text) => {
                let result = text;
                if (this.state.options && this.state.options.length !== 0) {
                    this.state.options.forEach((ele) => {
                        if (ele.value === parseInt(text)) {
                            result = ele.label;
                        }
                    });
                }
                return result;
            },
        },
        {
            title: "领取日期",
            dataIndex: "receive_date",
        },
        {
            title: "领取金额",
            dataIndex: "receive_amount",
            render: reverseDecimal,
        },
        {
            title: "领取详情",
            dataIndex: "",
            render: (text, record) => (
                <span>
                    <LinkButton
                        size="small"
                        onClick={() => {
                            this.check(record);
                        }}
                    >
                        查看
                    </LinkButton>
                </span>
            ),
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            render: formateDate,
        },
    ];
    check = (record) => {
        let obj = JSON.parse(record.receive_info);
        for (const key in obj) {
            if (obj[key].hasOwnProperty("time")) {
                obj[key].time = formateDate(obj[key].time);
            }
        }
        Modal.info({
            title: "领取详情",
            content: JSON.stringify(obj),
        });
    };
    onSearch = async (page, limit) => {
        let value = {
            user_id: this.input.input.value,
            activity_id: this.activityId.input.value,
            start_time: this.start_time,
            end_time: this.end_time,
        };
        const res = await activityList(page, limit, value);
        if (res.status === 0) {
            this.setState({
                data: res.data && res.data.list,
                count: parseInt(res.data && res.data.count),
                packages: res.data.packages,
            });
        } else {
            message.info("未检索到数据");
        }
    };
    download = () => {
        let data = {
            user_id: this.input.input.value,
            activity_id: this.activityId.input.value,
            start_time: this.start_time,
            end_time: this.end_time,
            packages: this.state.packages,
        };
        downloadActivityReceive(data);
    };
}
export default AccountList;
