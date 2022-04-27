import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { getPaymentDividendInfo } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";
import { reverseNumber2 } from "../../../utils/commonFuntion";
import moment from "moment";

let initstate = {
    start_time: null,
    end_time: null,
};

export default () => {
    const [data, setData] = useState([])
    const initColumns = [
        {
            title: "日期",
            dataIndex: "date",
        },
        {
            title: "玩家ID",
            dataIndex: "id",
        },
        {
            title: "上级ID",
            dataIndex: "proxy_user_id",
        },
        {
            title: "分红类型",
            dataIndex: "type",
            render: text =>
                text === 1
                    ? "流水分红"
                    : text === 2
                        ? "亏损分红(输赢差)"
                        : text === 3
                            ? "亏损分红(充提差)"
                            : "",
        },
        {
            title: "团队总充值",
            dataIndex: "top_up",
            render: reverseNumber2,
        },
        {
            title: "团队总兑换",
            dataIndex: "withdraw",
            render: reverseNumber2,
        },
        {
            title: "期初金额",
            dataIndex: "first_balance",
            render: reverseNumber2,
        },
        {
            title: "期末金额",
            dataIndex: "last_balance",
            render: reverseNumber2,
        },
        {
            title: "流水分红扣除",
            dataIndex: "",
            render: (text, record) => reverseNumber2((record.top_up || 0) + (record.withdraw || 0) + (record.first_balance || 0) - (record.last_balance || 0) - (record.amount || 0))

        },
        {
            title: "渠道三方费用",
            dataIndex: "cost_money",
            render: reverseNumber2,
        },
        {
            title: "应发分红",
            dataIndex: "money",
            render: reverseNumber2,
        },
        {
            title: "状态",
            dataIndex: "status",
            width: "5%",
            render: text => (text === -1 ? "作废" : text === 0 ? "未发" : text === 1 ? "已发" : ""),
        },
    ]

    //搜寻代理个人玩家流水
    const proxySearch = async (value) => {
        const { start_time, end_time } = initstate
        if (!value) {
            message.info("请输入玩家ID");
            return;
        }
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        let reqData = {
            first_date: start_time,
            last_date: end_time,
            account_name: value,
        }
        const res = await getPaymentDividendInfo(reqData)
        if (res.code === 200) {
            message.success(res.status)
            setData((res.msg && res.msg[`${start_time}:${end_time}`]) || [])
        } else {
            message.info(res.status || JSON.stringify(res))
        }
    }

    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            initstate.start_time = date[0] ? moment(date[0].valueOf()).format("YYYY-MM-DD") : null;
                            initstate.end_time = date[1] ? moment(date[1].valueOf()).format("YYYY-MM-DD") : null;
                        }}
                    />
                    &nbsp; &nbsp;
                    <Input.Search
                        style={{ width: 200 }}
                        placeholder="请输入玩家ID"
                        enterButton
                        onSearch={(value) => proxySearch(value)}
                    />
                </div>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data}
                columns={initColumns}
                size="small"
                scroll={{ x: "max-content" }}
                pagination={{
                    defaultPageSize: 30,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: data?.length || 0,
                }}
            />

        </Card>
    )

}