import React, { useRef, useState } from "react";

import { Table, message, Card, Input } from "antd";
import _ from "lodash-es";

import MyDatePicker from "../../../components/MyDatePicker";
import { getriskcontrol } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";
export default () => {
    const [table_data, set_table_data] = useState([]);
    const [other_data, set_other_data] = useState({});
    const initstates = useRef({
        start_time: "",
        end_time: "",
    });
    const initColumns = [
        {
            title: "游戏名称",
            dataIndex: "name",
        },
        {
            title: "盈利局数",
            dataIndex: "winround",
        },
        {
            title: "盈利金额",
            dataIndex: "wingold",
            render: reverseNumber,
        },
        {
            title: "亏损局数",
            dataIndex: "loseround",
        },

        {
            title: "亏损金额",
            dataIndex: "losegold",
            render: reverseNumber,
        },

        // {
        //     title: "总局数",
        //     dataIndex: "",
        //     render: (text, record) => (record.winround || 0) + (record.loseround || 0),
        // },
        {
            title: "总盈亏",
            dataIndex: "",
            render: (text, record) => reverseNumber((record.wingold || 0) + (record.losegold || 0)),
        },
    ];
    const onSearchButtonHandled = async (value) => {
        let { start_time, end_time } = initstates.current;
        if (!value || !start_time || !end_time) {
            message.info("请选择时间范围并输入玩家ID");
            return;
        }
        const res = await getriskcontrol({
            user_id: value,
            start_time,
            end_time,
            action: 1,
        });
        if (res.status === 0 && res.data) {
            let riskData = [],
                // sumround = 0,
                sumgold = 0,
                sumincome = 0;
            _.forEach(res.data, (value, key) => {
                if (_.has(value, "game_id") && key !== "Proxy") {
                    riskData.push(value);
                } else if (_.has(value, "totalgold")) {
                    // extraData.push({ name: key, totalgold: value.totalgold });
                    value.totalgold = reverseNumber(value.totalgold);
                }
            });
            _.forEach(riskData, (value) => {
                // sumround += (value.winround || 0) + (value.loseround || 0);
                sumgold += (value.wingold || 0) + (Math.abs(value.losegold) || 0);
                sumincome += (value.wingold || 0) + (value.losegold || 0);
            });
            let charge = [
                res.data["人工充值订单增加金币"]?.totalgold,
                res.data["人工充值订单补单增加金币"]?.totalgold,
                res.data["银行卡充值增加金币"]?.totalgold,
                res.data["银行卡充值订单补单增加金币"]?.totalgold,
                res.data["渠道充值增加金币"]?.totalgold,
                res.data["渠道充值订单补单增加金币"]?.totalgold,
                res.data["极速支付2增加金币"]?.totalgold,
                res.data["匹配充值增加金币"]?.totalgold,
            ];
            var afterdeal_charge = _.compact(charge);
            let sumcharge = _.sumBy(afterdeal_charge, _.toNumber);

            set_table_data(riskData);
            // for (const key in res.data) {
            //     res.data[key].totalgold = reverseNumber(ele.totalgold);
            // }
            set_other_data({
                sumgold: reverseNumber(sumgold),
                sumcharge: reverseNumber(sumcharge),
                sumincome: reverseNumber(sumincome),
                ...res.data,
            });
        } else {
            message.info(res.msg || JSON.stringify(res));
        }
    };
    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            let diffDays = date[1] && date[1].diff(date[0], "month");
                            if (diffDays > 6) {
                                message.info("请选择时间范围不超过六个月");
                            } else if (date && date.length !== 0) {
                                initstates.current.start_time = date[0].valueOf() / 1000;
                                initstates.current.end_time =
                                    Math.ceil(date[1].valueOf() / 1000) - 1;
                            } else {
                                initstates.current.start_time = "";
                                initstates.current.end_time = "";
                            }
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input.Search
                        style={{ width: 200 }}
                        placeholder="请输入玩家id"
                        enterButton
                        onSearch={(value) => onSearchButtonHandled(value)}
                    />
                </div>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={table_data}
                columns={initColumns}
                size="small"
                pagination={false}
            />
            {/* 此处为原用户界面显示的详情 要显示的话 display:"none" 干掉即可*/}
            <div style={{ fontSize: 16, marginTop: 20 ,display:"none"}}>
                <div>总流水:{other_data?.sumgold || "-"}</div>
                <div>总盈亏:{other_data?.sumincome || "-"}</div>
                <br />
                <div>总充值:{other_data?.sumcharge || "-"}</div>
                <div>
                    人工充值订单增加金币:{other_data?.["人工充值订单增加金币"]?.totalgold || "-"}
                </div>
                <div>
                    人工充值订单补单增加金币:
                    {other_data?.["人工充值订单补单增加金币"]?.totalgold || "-"}
                </div>
                <div>银行卡充值增加金币:{other_data?.["银行卡充值增加金币"]?.totalgold || "-"}</div>
                <div>
                    银行卡充值订单补单增加金币:
                    {other_data?.["银行卡充值订单补单增加金币"]?.totalgold || "-"}
                </div>
                <div>渠道充值增加金币:{other_data?.["渠道充值增加金币"]?.totalgold || "-"}</div>
                <div>
                    渠道充值订单补单增加金币:
                    {other_data?.["渠道充值订单补单增加金币"]?.totalgold || "-"}
                </div>
                <div>
                    极速支付2增加金币:
                    {other_data?.["极速支付2增加金币"]?.totalgold || "-"}
                </div>
                <div>
                    匹配充值增加金币:
                    {other_data?.["匹配充值增加金币"]?.totalgold || "-"}
                </div>
                <br />
                <div>后台增加:{other_data?.["运营后台用户增加金币"]?.totalgold || "-"}</div>
                <div>后台减少:{other_data?.["运营后台用户减少金币"]?.totalgold || "-"}</div>
            </div>
        </Card>
    );
};
