import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import MyDatePicker from "../../../components/MyDatePicker";
import { getProxyLinkPayLeaderboard } from "../../../api/";
import { reverseDecimal } from "../../../utils/commonFuntion";

let initstate = {
    start_time: null,
    end_time: null,
};
export default () => {
    const [Board, setBoard] = useState([]);
    const initboardColumns = [
        {
            title: "序号",
            dataIndex: "key",
            render: (text, record, index) => {
                if (record.totalIndex === "合计") {
                    return "合计"
                } else {
                    return ++index
                }
            },
        },
        {
            title: "玩家id",
            dataIndex: "id",
        },
        {
            title: "充值金额",
            dataIndex: "top_up_total",
            render: reverseDecimal,
        },
        {
            title: "兑换金额",
            dataIndex: "withdraw_total",
            render: reverseDecimal,
        },
        {
            title: "充提差",
            dataIndex: "topMinuswith",
            render: (text, record) => {
                let result = record.top_up_total - Math.abs(record.withdraw_total);
                if (!isNaN(result) && (record.top_up_total || record.withdraw_total)) {
                    return reverseDecimal(result);
                }
            },
        },
    ];

    const fetchData3 = async (value, start_time, end_time) => {
        if (!value) {
            return message.info("请输入玩家ID");
        }
        const res = await getProxyLinkPayLeaderboard(
            value,
            Math.floor(start_time / 1000),
            Math.floor(end_time / 1000),
        );
        if (res.code === 200 && res.msg) {
            message.success(res.status);
            res.msg.sort(function (a, b) {
                return a.withdraw_total - b.withdraw_total;
            })
            let top_up_total = 0,
                withdraw_total = 0
                ;
            if (res.msg) {
                res.msg.forEach((ele) => {
                    top_up_total += ele.top_up_total;
                    withdraw_total += ele.withdraw_total;
                }
                );
                const totalRow = {
                    totalIndex: "合计",
                    withdraw_total: withdraw_total,
                    top_up_total: top_up_total,
                    topMinuswith: top_up_total - Math.abs(withdraw_total)
                }
                let _list = res.msg && res.msg.length > 0 ? [...res.msg, totalRow] : []
                setBoard(_list)
            }
        } else {
            message.info(res.status || JSON.stringify(res));
        }
    };
    const proxySearch = async (value) => {
        let { start_time, end_time } = initstate;
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        var oDate1 = new Date(start_time);
        var oDate2 = new Date(end_time);
        var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
        if (iDays > 30) {
            message.info("最多查询31天数据");
            return;
        }
        fetchData3(value, start_time, end_time)
    };

    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            initstate.start_time = date[0] ? date[0].valueOf() : null;
                            initstate.end_time = date[1] ? date[1].valueOf() : null;
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input.Search
                        style={{ width: 200 }}
                        placeholder="请输入id"
                        enterButton
                        onSearch={(value) => proxySearch(value)}
                    />
                    <span style={{ color: "#dc143c", fontSize: 14 }}>
                        &nbsp;*输入代理ID，查询该ID的代理链数据，最多查询31天数据
                    </span>
                </div>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={Board}
                columns={initboardColumns}
                size="small"
                pagination={false}
            />
        </Card>
    );
};
