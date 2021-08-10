import React, { useState } from "react";

import { Card, message, Input, Row, Col, Statistic, Table } from "antd";

import _ from "lodash-es";

import MyDatePicker from "../../../components/MyDatePicker";
import { getProxy, getProxyChild } from "../../../api/";
import { reverseDecimal } from "../../../utils/commonFuntion";

let initstate = {
    start_time: null,
    end_time: null,
};
export default () => {
    const [msg, setMsg] = useState();
    const [childIncome, set_childIncome] = useState("--");

    const [data, setData] = useState([
        {
            name: "棋牌流水数据",
        },
        {
            name: "视讯流水数据",
        },
        {
            name: "彩票流水数据",
        },
        {
            name: "沙巴流水数据",
        },
        {
            name: "合计",
        },
    ]);
    const initColumns = [
        {
            title: "游戏",
            dataIndex: "name",
        },
        {
            title: "玩家总赢流水",
            dataIndex: "win_statement_total",
            render: reverseDecimal,
        },
        {
            title: "玩家总输流水",
            dataIndex: "lose_statement_total",
            render: reverseDecimal,
        },
        {
            title: "玩家总输 - 玩家总赢",
            dataIndex: "",
            render: (text, record) => {
                let result = Math.abs(record.lose_statement_total) - record.win_statement_total;
                if (!isNaN(result) && (record.win_statement_total || record.lose_statement_total)) {
                    return reverseDecimal(result);
                }
            },
        },
        {
            title: "总流水",
            dataIndex: "",
            render: (text, record) => {
                let result = record.win_statement_total + Math.abs(record.lose_statement_total);
                if (!isNaN(result) && (record.win_statement_total || record.lose_statement_total)) {
                    return reverseDecimal(result);
                }
            },
        },
    ];
    const fetchData1 = async (value, start_time, end_time) => {
        const res = await getProxy(
            value,
            Math.floor(start_time / 1000),
            Math.floor(end_time / 1000),
        );
        if (res.code === 200 && res.msg) {
            message.success(res.status);
            setMsg(res.msg);
            let totalwin = 0,
                totallose = 0;
            if (res.msg.game) {
                res.msg.game.forEach((ele) => {
                    totalwin += ele.win_statement_total;
                    totallose += ele.lose_statement_total;
                });
            }
            let shixun = _.find(res.msg.game, { game_id: "5b1f3a3cb76a591e7f25173" });
            let caipiao = _.find(res.msg.game, { game_id: "569a62be7ff123m117d446aa" });
            let shaba = _.find(res.msg.game, { game_id: "5b1f3a3cb76a591e7f25179" });
            //处理table需要的data
            setData([
                {
                    name: "棋牌流水数据",
                    win_statement_total: res.msg.game
                        ? totalwin -
                          (shixun?.win_statement_total || 0) -
                          (caipiao?.win_statement_total || 0) -
                          (shaba?.win_statement_total || 0)
                        : "",
                    lose_statement_total: res.msg.game
                        ? totallose -
                          (shixun?.lose_statement_total || 0) -
                          (caipiao?.lose_statement_total || 0) -
                          (shaba?.lose_statement_total || 0)
                        : "",
                },
                {
                    name: "视讯流水数据",
                    win_statement_total: shixun?.win_statement_total,
                    lose_statement_total: shixun?.lose_statement_total,
                },
                {
                    name: "彩票流水数据",
                    win_statement_total: caipiao?.win_statement_total,
                    lose_statement_total: caipiao?.lose_statement_total,
                },
                {
                    name: "沙巴流水数据",
                    win_statement_total: shaba?.win_statement_total,
                    lose_statement_total: shaba?.lose_statement_total,
                },
                {
                    name: "合计",
                    win_statement_total: totalwin,
                    lose_statement_total: totallose,
                },
            ]);
        } else {
            message.info(res.status || JSON.stringify(res));
        }
    };
    const fetchData2 = async (value, start_time, end_time) => {
        const res = await getProxyChild(
            value,
            Math.floor(start_time / 1000),
            Math.floor(end_time / 1000),
        );
        if (res.code === 200 && res.msg) {
            message.success(res.status);
            let income = Math.floor(res.msg.income * 10000) / 10000;
            set_childIncome(income);
        } else {
            message.info(res.status || JSON.stringify(res));
        }
    };
    const proxySearch = async (value) => {
        let { start_time, end_time } = initstate;
        if (!value) {
            message.info("请输入ID");
            return;
        }
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        fetchData1(value, start_time, end_time);
        fetchData2(value, start_time, end_time);
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
                        &nbsp;*输入代理ID，查询该ID的代理链数据
                    </span>
                </div>
            }
        >
            <Row gutter={[16, 16]} style={{ background: "#ececec", padding: 30 }}>
                <div style={{ color: "#dc143c", fontSize: 14 }}>*数据包含该代理本身的数据</div>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="代理链玩家总充值"
                            value={msg?.pay?.top_up_total || "--"}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="代理链玩家总提现"
                            value={msg?.pay?.withdraw_total || "--"}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="充值人数" value={msg?.pay?.top_up_count || "--"} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="提现人数" value={msg?.pay?.withdraw_count || "--"} />
                    </Card>
                </Col>
                <div style={{ color: "#dc143c", fontSize: 14 }}>*数据不包含该代理本身的数据</div>
                <Col span={12}>
                    <Card>
                        <Statistic title="代理链产生的佣金总和" value={childIncome} />
                    </Card>
                </Col>
            </Row>
            <br />
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data}
                columns={initColumns}
                size="small"
                pagination={false}
            />
        </Card>
    );
};
