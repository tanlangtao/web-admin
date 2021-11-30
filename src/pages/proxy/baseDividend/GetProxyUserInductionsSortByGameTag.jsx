import React, { useState, useRef } from "react";
import { Card, message, Input, Table, Icon } from "antd";
import { getProxyUserInductionsSortByGameTag } from "../../../api";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { reverseNumber } from "../../../utils/commonFuntion";

let initstate = {
    start_time: null,
    end_time: null,
    account_name: null,
    ids: null,
};

export default () => {
    const [data, setData] = useState([])
    const ref = useRef(initstate)
    const initColumns = [
        {
            title: "玩家ID",
            dataIndex: "ids",
            render: (text, record) => {
                if (record.totalIndex === "合计") {
                    return "合计"
                } else {
                    return ref.current.ids
                }
            }
        },
        {
            title: "游戏类型",
            dataIndex: "game_tag",
            render: (text, record) => {
                switch (text) {
                    case 1:
                        return "棋牌类型"
                    case 2:
                        return "彩票类型"
                    case 3:
                        return "体育类型"
                    case 4:
                        return "视讯类型"
                    case 5:
                        return "电子类型"
                    default:
                        return
                }
            },
        },
        {
            title: "玩家总输",
            dataIndex: "lose_total",
            render: (text) => {
                return reverseNumber(Math.abs(text))
            }
        },
        {
            title: "玩家总赢",
            dataIndex: "win_total",
            render: reverseNumber,
        },
        {
            title: "玩家总流水",
            dataIndex: "winPluslose",
            render: (text, record) => {
                return reverseNumber(Math.abs(record.lose_total) + record.win_total)
            }
        },
        {
            title: "有效投注",
            dataIndex: "bet_total",
            render: reverseNumber,
        },
        {
            title: "统计类型",
            dataIndex: "base_dividend_type",
            render: (text, record) => {
                switch (text) {
                    case 1:
                        return "输赢流水"
                    case 2:
                        return "有效投注"
                    default:
                        return
                }
            },
        },
        {
            title: "折扣比例",
            dataIndex: "base_dividend_discount",
            render: (text, record) => {
                if (text) {
                    return text + "%"
                }
            },
        },
        {
            title: "流水折扣",
            dataIndex: "allMoney",
            render: (text, record) => {
                if (record.totalIndex === "合计") {
                    return reverseNumber(record.allMoney)
                }
                else if (record.base_dividend_type === 1) {
                    return reverseNumber((Math.abs(record.lose_total) + record.win_total) * (record.base_dividend_discount / 100))
                } else {
                    return 0
                }
            },
        },
        {
            title: "投注折扣",
            dataIndex: "bet_Account",
            render: (text, record) => {
                if (record.totalIndex === "合计") {
                    return reverseNumber(record.bet_Account)
                }
                else if (record.base_dividend_type === 2) {
                    return reverseNumber(record.bet_total * (record.base_dividend_discount / 100))
                } else {
                    return 0
                }
            },
        },
    ]

    //搜寻代理个人玩家流水
    const proxySearch = async () => {
        // const { start_time, end_time, proxy_pid, proxy_id ,game_tags } = ref.current
        const { start_time, end_time, account_name, ids } = ref.current
        if (!account_name) {
            message.info("请输入玩家ID");
            return;
        }
        if (!ids) {
            message.info("请输入上级ID");
            return;
        }
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        let reqData = {
            start_time: Math.floor(start_time / 1000),
            end_time: Math.floor(end_time / 1000),
            account_name: account_name,
            ids: `[${ids}]`,
            game_tags: `[1,2,3,4,5]`
        }
        const res = await getProxyUserInductionsSortByGameTag(reqData)
        if (res.code === 200) {
            message.success(res.status)
            let totalLose = 0,
                totalwin = 0, totalbet = 0, totalMoney = 0, totalbetAccount = 0;
            if (res.msg[ids]) {
                res.msg[ids].forEach((ele) => {
                    totalLose += ele.lose_total;
                    totalwin += ele.win_total;
                    totalbet += ele.bet_total;
                    totalMoney += ele.base_dividend_type === 1 ? (Math.abs(ele.lose_total) + ele.win_total) * (ele.base_dividend_discount / 100) : 0
                    totalbetAccount += ele.base_dividend_type === 2 ? ele.bet_total * (ele.base_dividend_discount / 100) : 0
                })
            }
            const totalRow = {
                totalIndex: "合计",
                lose_total: totalLose,
                win_total: totalwin,
                bet_total: totalbet,
                winPluslose: totalwin - Math.abs(totalLose),
                base_dividend_discount: "",
                allMoney: totalMoney,
                bet_Account: totalbetAccount
            }
            let _list = res.msg[ids] && res.msg[ids].length > 0 ? [...res.msg[ids], totalRow] : []
            setData(_list || [])
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
                            ref.current.account_name = e.target.value
                        }}
                    />
                    &nbsp; &nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入玩家ID"
                        onChange={e => {
                            ref.current.ids = e.target.value
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
                    <LinkButton onClick={() => proxySearch()} size="default">
                        <Icon type="search" />
                    </LinkButton>
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