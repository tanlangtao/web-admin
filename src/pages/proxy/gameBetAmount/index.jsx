import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { GetProxyUserLinkstatement } from "../../../api";
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
    // 以下二款遊戲尚未取得api，無法用於用戶資金明細、盈餘池查詢、玩家遊戲數據，僅在此組件作為遊戲名稱map
    "5b1f3a3cb76a591e7f251728": { path: null, name: "云谷寻宝" },
    "5c6a62be56209ac117d446aa": { path: null, name: "聚宝盆捕鱼" },
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
            title: "玩家总输",
            dataIndex: "bet_money",
            render: (text, record) => {
                return record.lose_total ? reverseNumber(record.lose_total) : 0
                
            },
            
        },
        {
            title: "玩家总赢",
            dataIndex: "bet_money",
            render: (text, record) => {
                return record.win_total ? reverseNumber(record.win_total) : 0
            },
        },
        {
            title: "输赢差",
            dataIndex: "bet_money",
            render: (text, record) => {
                return record.win_total||record.lose_total ? reverseNumber(record.win_total +record.lose_total)  : ""
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
            start_time: Math.floor(start_time / 1000),
            end_time: Math.floor(end_time / 1000),
            id: value,
        }
        const res = await GetProxyUserLinkstatement(reqData)
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