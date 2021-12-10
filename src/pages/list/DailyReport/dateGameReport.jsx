import React from "react";

import { Table, Card, Button, Modal, message } from "antd";
import ExportJsonExcel from "js-export-excel";
import { reverseNumber } from "../../../utils/commonFuntion";
import { getGameUserStatementTotalList } from "../../../api";

const DateGameReport = (props) => {
    let { start_time, end_time, package_id } = props;
    let detail_columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "总赢",
            dataIndex: "win_statement_total",
            render: reverseNumber,
        },
        {
            title: "总输",
            dataIndex: "lose_statement_total",
            render: reverseNumber,
        },
        {
            title: "总流水",
            dataIndex: "",
            render: (text, record) => {
                return reverseNumber(
                    Math.abs(record.win_statement_total || 0) +
                    Math.abs(record.lose_statement_total || 0),
                );
            },
            defaultSortOrder: "descend",
            sorter: (a, b) =>
                Math.abs(a.win_statement_total || 0) +
                Math.abs(a.lose_statement_total || 0) -
                (Math.abs(b.win_statement_total || 0) + Math.abs(b.lose_statement_total || 0)),
        },
    ];
    const footerDetail = (details) => {
        const footercolumns = [
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: "25%",
            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: "25%",
            },
            {
                title: '说明',
                dataIndex: 'msg',
                render: (text, record) => record.msg || "此时段数据异常"
            },
        ];
        return (
            <>
                &nbsp; &nbsp;
                <p>以下时段无数据：</p>
                <Table
                    bordered
                    rowKey={(record, index) => `${index}`}
                    dataSource={details}
                    columns={footercolumns}
                    size="middle"
                    pagination={false}
                />
            </>
        )
    }

    const check_detail = async (record) => {
        //start_time=1599053186&end_time=1599153186&game_id=5b1f3a3cb76a591e7f251725&package_id=1
        console.log(record.game_id, start_time, end_time, package_id);
        message.loading({
            content: "查询中",
            key: "loadingMsg",
            duration: 0
        });
        const res = await getGameUserStatementTotalList({
            game_id: record.game_id,
            start_time,
            end_time,
            package_id,
        });
        message.destroy("loadingMsg");
        if (res.code === 200) {
            message.success(res.status);
            Modal.info({
                title: record.game_name,
                okText: "关闭",
                width: "60%",
                content: (
                    <Table
                        bordered
                        rowKey={(record, index) => `${index}`}
                        dataSource={res.msg || []}
                        columns={detail_columns}
                        size="small"
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                ),
            });
        } else {
            message.info(res.status || JSON.stringify(res));
        }
    };
    let initColumns = () => [
        {
            title: "游戏",
            dataIndex: "game_name",
        },
        {
            title: "人数",
            dataIndex: "count",
            onCell: (record, rowIndex) => {
                if (package_id === 0) {
                    return;
                } else {
                    return {
                        onClick: (event) => {
                            check_detail(record);
                        },
                        onMouseEnter: (event) => {
                            event.target.style.cursor = "pointer";
                        },
                    };
                }
            },
        },
        {
            title: "玩家总赢额",
            dataIndex: "win_statement_total",
            render: reverseNumber,
        },
        {
            title: "玩家总输额",
            dataIndex: "lose_statement_total",
            render: reverseNumber,
        },
        {
            title: "玩家输赢差",
            dataIndex: "",
            render: (text, record) => {
                return reverseNumber((Math.abs(record.lose_statement_total || 0) - (record.win_statement_total || 0)))
            },
        },
        {
            title: "玩家总流水",
            dataIndex: "statement_total",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.statement_total - b.statement_total,
            render: reverseNumber,
        },
        {
            title: "盈亏比",
            dataIndex: "statement_ratio",
            render: reverseNumber,
        },
    ];
    const downloadExcel = () => {
        // currentPro 是列表数据
        var option = {};
        let dataTable = [];
        props.data &&
            props.data.list.forEach((ele) => {
                let obj = {
                    游戏: ele.game_name,
                    人数: ele.count,
                    玩家总赢额: ele.win_statement_total,
                    玩家总输额: ele.lose_statement_total,
                    玩家输赢差: Math.abs(ele.lose_statement_total) - ele.win_statement_total,
                    玩家总流水: ele.statement_total,
                    盈亏比: ele.statement_ratio,
                };
                dataTable.push(obj);
            });
        console.log(dataTable);

        option.fileName = `${props.timefortitle ? props.timefortitle : ""}游戏数据`;
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: "sheet",
                sheetFilter: ["游戏", "人数", "玩家总赢额", "玩家总输额", "玩家输赢差", "玩家总流水", "盈亏比"],
                sheetHeader: ["游戏", "人数", "玩家总赢额", "玩家总输额", "玩家输赢差", "玩家总流水", "盈亏比"],
            },
        ];

        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
    };
    return (
        <Card
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        downloadExcel();
                    }}
                >
                    导出数据
                </Button>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={props.data.list}
                columns={initColumns()}
                size="small"
                pagination={false}
                scroll={{ x: "max-content" }}
            />
            {props.data.footer && props.data.footer.length > 0 &&
                footerDetail(props.data.footer)
            }
        </Card>
    );
};

export default DateGameReport;
