import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { getProxyUserLinkBet } from "../../../api";
import MyDatePicker from "../../../components/MyDatePicker";
import { reverseNumber } from "../../../utils/commonFuntion";
import { gameRouter, thirdPartyGameRouter } from "../../../utils/public_variable"

let initstate = {
    start_time: null,
    end_time: null,
};

let gameNameMap = {
    ...gameRouter,
    ...thirdPartyGameRouter,
    "5b1f3a3cb76a591e7f251729": { path: "/castcraft/api", name: "城堡争霸" },
}

export default () => {
    const [data, setData] = useState([])
    const initColumns = [
        {
            title: "日期",
            dataIndex: "date",
            width: "15%",
        },
        {
            title: "game_id",
            dataIndex: "game_id",
        },
        {
            title: "游戏名称",
            dataIndex: "",
            render: (text, record) => {
                return record.game_id ? gameNameMap[record.game_id].name : ""
            },
        },
        {
            title: "有效投注",
            dataIndex: "bet_money",
            render: reverseNumber,
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
            start_time: Math.floor(start_time / 1000),
            end_time: Math.floor(end_time / 1000),
            id: value,
        }
        const res = await getProxyUserLinkBet(reqData)
        if (res.code === 200) {
            message.success(res.status)
            let newData = []
            //將日期以key = date 寫入每一筆data
            for (const [key, value] of Object.entries(res.msg)) {
                value.forEach((ele) => {
                    ele.date = key
                    newData.push(ele)
                })
            }
            //將data用日期排序
            let sortData = newData.sort((a, b) => new Date(b.date) - new Date(a.date))
            setData(sortData || [])
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
                            initstate.start_time = date[0] ? date[0].valueOf() : null;
                            initstate.end_time = date[1] ? date[1].valueOf() : null;
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