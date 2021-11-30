import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { getProxyBaseDividendInfo } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";
import moment from "moment";
import { reverseNumber } from "../../../utils/commonFuntion";

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
            title: "状态",
            dataIndex: "status",
            render: text => (text === -1 ? "作废" : text === 0 ? "未发" : text === 1 ? "已发" : ""),
        },
        {
            title: "团队业绩",
            dataIndex: "amount",
            render: reverseNumber,
        },
        {
            title: "团队返佣",
            dataIndex: "money",
            render: reverseNumber,
        },
        {
            title: "我的返佣",
            dataIndex: "grant",
            render: reverseNumber,
        },
        {
            title: "每万返佣",
            dataIndex: "income",
            render: reverseNumber,
        },
        {
            title: "80%折扣团队业绩",
            dataIndex: "",
            render: (text, record) => {
                return reverseNumber(record.amount * 0.8)
            },
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
        const res = await getProxyBaseDividendInfo(reqData)
        if (res.code === 200) {
            message.success(res.status)
            if (res.msg) {
                const newData = Object.values(res.msg).map(ele => { return ele[0] })
                let sortData = newData.sort((a, b) => new Date(a.date) - new Date(b.date))
                setData(sortData || [])
            } else {
                setData([])
            }
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input.Search
                        style={{ width: 200 }}
                        placeholder="请输入玩家id"
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
                pagination={false}
                scroll={{ x: "max-content" }}
            />
        </Card>

    )
}