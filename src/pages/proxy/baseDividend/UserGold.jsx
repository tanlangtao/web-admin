import React, { useState, useRef } from "react";
import { Card, message, Input, Table, Icon } from "antd";
import { getProxyUserMoneyFlow } from "../../../api";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { reverseNumber } from "../../../utils/commonFuntion";

let initstate = {
    start_time: null,
    end_time: null,
    proxy_pid: '',
    proxy_id: '',
    game_tags: ''
};

export default () => {
    const [data, setData] = useState([])
    const ref = useRef(initstate)
    const initColumns = [
        {
            title: "玩家ID",
            dataIndex: "id",
        },
        {
            title: "玩家总赢",
            dataIndex: "win_total",
            render: reverseNumber,
        },
        {
            title: "玩家总输",
            dataIndex: "lose_total",
            render: reverseNumber,
        },
        {
            title: "有效投注",
            dataIndex: "bet_total",
            render: reverseNumber,
        },
        {
            title: "有效投注记录条数",
            dataIndex: "bet_times",
        },
        {
            title: "80%折扣投注",
            dataIndex: "",
            render: (text, record) => {
                return reverseNumber(record.bet_total * 0.8)
            },
        },
    ]

    //搜寻代理个人玩家流水
    const proxySearch = async () => {
        const { start_time, end_time, proxy_pid, proxy_id, game_tags } = ref.current
        if (!proxy_id) {
            return message.info("请输入玩家ID");
        }
        if (!proxy_pid) {
            return message.info("请输入上级ID");
        }
        if (!start_time || !end_time) {
            return message.info("请选择时间范围");
        }
        if (!game_tags) {
            return message.info("请选择游戏类型");
        }
        let reqData = {
            start_time: Math.floor(start_time / 1000),
            end_time: Math.floor(end_time / 1000),
            account_name: proxy_pid,
            ids: `[${proxy_id}]`,
            game_tags: `[${game_tags}]`
        }
        const res = await getProxyUserMoneyFlow(reqData)
        if (res.code === 200) {
            message.success(res.status)
            setData(res.msg || [])
        } else {
            message.info(res.status || JSON.stringify(res))
        }
    }

    return (
        <Card
            title={
                <div>
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入上級ID"
                        onChange={e => {
                            ref.current.proxy_pid = e.target.value
                        }}
                    />
                    &nbsp; &nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入玩家ID"
                        onChange={e => {
                            ref.current.proxy_id = e.target.value
                        }}
                    />
                    &nbsp; &nbsp;
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            ref.current.start_time = date[0] ? date[0].valueOf() : null;
                            ref.current.end_time = date[1] ? date[1].valueOf() : null;
                        }}
                    />
                    &nbsp; &nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="游戏类型"
                        onChange={e => {
                            ref.current.game_tags = e.target.value
                        }}
                    />
                    &nbsp; &nbsp;
                    <LinkButton onClick={() => proxySearch()} size="default">
                        <Icon type="search" />
                    </LinkButton>
                    &nbsp; &nbsp;
                    <span style={{ color: "#dc143c" }} >**game_tags: 渠道组为6,12 输入 1 , 渠道组为8,9,10输入 1,5</span>
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