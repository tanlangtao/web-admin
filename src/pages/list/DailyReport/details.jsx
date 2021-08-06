import React, { Component } from "react";
import { Table, Button, Modal, Card, message } from "antd";
import { oneDayGameReport } from "../../../api/index";
import DateGameReport from "./dateGameReport";
import ExportJsonExcel from "js-export-excel";
import { reverseNumber } from "../../../utils/commonFuntion";
import moment from "moment";
class MoreDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            isGameReportShow: false,
            nextLevelData: {},
            package_id_for_nextpage: 0
        };
    }
    downloadExcel = () => {
        // currentPro 是列表数据
        var option = {};
        let dataTable = [];
        let columns = this.initColumns();
        this.props.reportData.data &&
            this.props.reportData.data.forEach((ele) => {
                let obj = {};
                columns.forEach((item) => {
                    if (item.title && item.dataIndex) {
                        obj[item.title] = ele[item.dataIndex];
                    }
                });
                dataTable.push(obj);
            });
        console.log(dataTable);
        let sheetFilter = [];
        columns.forEach((item) => {
            if (item.title && item.dataIndex) {
                sheetFilter.push(item.title);
            }
        });
        option.fileName = "日期报表";
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: "sheet",
                sheetFilter: sheetFilter,
                sheetHeader: sheetFilter,
            },
        ];

        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
    };
    render() {
        const { data } = this.props.reportData;
        return (
            <Card
                extra={
                    <Button
                        type="primary"
                        onClick={() => {
                            this.downloadExcel();
                        }}
                    >
                        导出数据
                    </Button>
                }
            >
                <Table
                    bordered
                    rowKey={(record, index) => `${index}`}
                    dataSource={data}
                    columns={this.initColumns()}
                    size="small"
                    scroll={{ x: "max-content" }}
                />
                <Modal
                    title={this.state.date + "/游戏数据"}
                    width="80%"
                    visible={this.state.isGameReportShow}
                    onCancel={() => this.setState({ isGameReportShow: false})}
                >
                    <DateGameReport 
                    data={this.state.nextLevelData} 
					package_id={this.state.package_id_for_nextpage}
                    start_time={moment(this.state.date).startOf("day").valueOf() / 1000}
					end_time={moment(this.state.date).startOf("day").add(1, "days").valueOf() / 1000}
                    />
                </Modal>
            </Card>
        );
    }
    initColumns = () => {
        if (this.props.action === "getDateReport") {
            let tableHeader = [
                {
                    title: "日期",
                    dataIndex: "date",
                },
                {
                    title: "新增用户",
                    dataIndex: "regin_user_number",
                },
                {
                    title: "活跃用户",
                    dataIndex: "active_user_number",
                },
                {
                    title: "官方首充用户",
                    dataIndex: "first_pay_user_number",
                },
                {
                    title: "官方首充金额",
                    dataIndex: "first_pay_money_total",
                    render:reverseNumber
                },
                {
                    title: "官方充值用户",
                    dataIndex: "pay_user_number",
                },
                {
                    title: "官方充值金额",
                    dataIndex: "pay_money_total",
                    render:reverseNumber
                },
                {
                    title: "人工首充用户",
                    dataIndex: "first_pay_user_number_res",
                },
                {
                    title: "人工首充金额",
                    dataIndex: "first_pay_money_total_res",
                    render:reverseNumber
                },
                {
                    title: "人工充值用户",
                    dataIndex: "pay_user_number_res",
                },
                {
                    title: "人工充值金额",
                    dataIndex: "pay_money_total_res",
                    render:reverseNumber
                },
                {
                    title: "官方兑换用户",
                    dataIndex: "exchange_user_number",
                },
                {
                    title: "官方兑换金额",
                    dataIndex: "exchange_money_total",
                    render:reverseNumber
                },
                {
                    title: "人工兑换用户",
                    dataIndex: "exchange_user_number_res",
                },
                {
                    title: "人工兑换金额",
                    dataIndex: "exchange_money_total_res",
                    render:reverseNumber
                },
                {
                    title: "玩家总赢额",
                    dataIndex: "win_statement_total",
                    render:reverseNumber
                },
                {
                    title: "玩家总输额",
                    dataIndex: "lose_statement_total",
                    render:reverseNumber
                },
                {
                    title: "玩家总流水",
                    dataIndex: "statement_total",
                    render:reverseNumber
                },
                {
                    title: "盈亏比",
                    dataIndex: "statement_ratio",
                    render:reverseNumber
                },
                {
                    title: "操作",
                    dataIndex: "",
                    render: (text, record, index) => (
                        <span>
                            <Button size="small" onClick={() => this.getGameReport(record)}>
                                游戏
                            </Button>
                        </span>
                    ),
                },
            ];
            return tableHeader;
        }
    };

    getGameReport = async (record) => {
        message.loading({
			content: "查询中",
			key: "loadingMsg",
			duration: 0
		});
        const res = await oneDayGameReport(1, 20, this.props.package_id, record.date);
		message.destroy("loadingMsg");
        const reportData = this.props.parse(res);
        this.setState({
            date: record.date,
            isGameReportShow: true,
            nextLevelData: reportData,
            package_id_for_nextpage: this.props.package_id,
        });
    };
}

export default MoreDetail;
