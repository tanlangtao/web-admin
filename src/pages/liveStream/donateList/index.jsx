import React, { useState, useRef, useEffect } from "react";
import { Card, message, Input, Table, Select, Button, Icon } from "antd";
import _ from "lodash-es";
import ExportJsonExcel from "js-export-excel";
import { formateDate } from "../../../utils/dateUtils";
import { reverseNumber } from "../../../utils/commonFuntion";
import MyDatePicker from "../../../components/MyDatePicker";
import moment from "moment";
import { getDonateList, getZhiboGameList } from "../../../api"

const DonateList = () => {
    const [data, setData] = useState([])
    const [gameList, setGameList] = useState({})
    const [loading, setLoading] = useState(false)
    const initStates = useRef({
        streamerId: "",
        userId: "",
        start_time: "",
        end_time: "",
        game_code: "",
    })

    //取得直播遊戲清單
    const getGameList = async () => {
        // setGameList(gameListTrans || {})
        const res = await getZhiboGameList()
        //状态码，0： 成功；-1：失败
        if (res.code === 0) {
            setGameList(res.data || [])
        } else {
            message.info(res.status || JSON.stringify(res))
        }
    }

    //搜尋按鈕
    const donateSearch = async () => {
        let { game_code, start_time, end_time, userId, streamerId } = initStates.current
        if (!start_time || !end_time) {
            message.info("请选择时间范围，且范围不大于31天")
            return
        }

        if (!game_code && !userId && !streamerId) {
            message.info("游戏名称、玩家ID、主播ID需要至少选择其中一项")
            return
        }
        let reqData = {
            game_code: game_code,
            start_time: start_time,
            end_time: end_time,
            id: userId,
            live_id: streamerId,
        }
        fetchData(1, 50, reqData)
    }

    //獲取打賞明細
    const fetchData = async (page, limit, reqData) => {
        setLoading(true)
        const res = await getDonateList(page, limit, reqData)
        //状态码，0： 成功；-1：失败
        if (res.code === 0) {
            message.success(res.msg)
            setData(res.data || [])
        } else {
            message.info(res.msg || JSON.stringify(res))
        }
        setLoading(false);
    }

    //Table欄位
    let initColumns = [
        {
            title: "游戏名称",
            dataIndex: "game_code",
            render: (record) => gameList[record] || ""
        },
        {
            title: "主播ID",
            dataIndex: "giftOfLiveUserId",
        },
        {
            title: "玩家ID",
            dataIndex: "user_id",
        },
        {
            title: "玩家打赏",
            dataIndex: "giftTotalPrice",
            render: reverseNumber
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            render: formateDate,
        },
    ]

    //Excel下載
    const downloadExcel = () => {
        let option = {}
        let dataTable = []
        let columns = initColumns
        data && data.list && data.list.map((ele) => {
            let obj = {}
            columns.forEach((item) => {
                if (item.title && item.dataIndex) {
                    switch (item.title) {
                        //游戏名称需要用game_code比对gamelist取得
                        case "游戏名称":
                            obj[item.title] = gameList[ele[item.dataIndex]] || ele[item.dataIndex]
                            break
                        //创建时间需从timestamp转成日期格式
                        case "创建时间":
                            obj[item.title] = formateDate(ele[item.dataIndex])
                            break
                        default:
                            obj[item.title] = ele[item.dataIndex]
                    }
                }
            });
            return dataTable.push(obj)
        });
        console.log(dataTable)
        let sheetFilter = []
        columns.forEach((item) => {
            if (item.title && item.dataIndex) {
                sheetFilter.push(item.title)
            }
        });
        option.fileName = "打赏明细报表"
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: "sheet",
                sheetFilter: sheetFilter,
                sheetHeader: sheetFilter,
            },
        ]

        var toExcel = new ExportJsonExcel(option) //new
        toExcel.saveExcel()
    }

    //進入頁面取得遊戲清單
    useEffect(() => {
        getGameList()
    }, [])

    return (
        <Card
            title={
                <React.Fragment>
                    <div>
                        <span style={{ fontSize: 14, marginRight: 20 }}>游戏名称</span>
                        <Select
                            placeholder="请选择游戏名称/选填"
                            style={{ width: 200, marginRight: 100 }}
                            allowClear
                            onChange={value => {
                                initStates.current.game_code = value;
                            }}
                        >
                            {_.map(gameList, (value, key) => {
                                return (
                                    <Select.Option key={key} value={key}>
                                        {value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <span style={{ fontSize: 14, marginRight: 20 }}>玩家ID</span>
                        <Input
                            placeholder="请输入玩家ID/选填"
                            style={{ width: 200 }}
                            onChange={e => {
                                initStates.current.userId = e.target.value;
                            }}
                        />
                    </div>
                    <br />

                    <div>
                        <span style={{ fontSize: 14, marginRight: 20 }}>主播ID</span>
                        <Input
                            placeholder="请输入主播ID/选填"
                            style={{ width: 200, marginRight: 114 }}
                            onChange={e => {
                                initStates.current.streamerId = e.target.value;
                            }}
                        />
                        <span style={{ fontSize: 14, marginRight: 20 }}>时间</span>
                        <MyDatePicker
                            format="YYYY-MM-DD HH:mm"
                            handleValue={(date, val) => {
                                let diffDays = moment(val[1]).diff(moment(val[0]), "days");
                                if (diffDays > 31) {
                                    message.info("请选择时间范围不大于31天");
                                } else if (date[0]) {
                                    console.log(
                                        Math.floor(date[0].valueOf() / 1000),
                                        Math.floor(date[1].valueOf() / 1000),
                                    );
                                    initStates.current.start_time = Math.floor(
                                        date[0].valueOf() / 1000,
                                    );
                                    initStates.current.end_time = Math.floor(
                                        date[1].valueOf() / 1000,
                                    );
                                } else {
                                    initStates.current.start_time = null;
                                    initStates.current.end_time = null;
                                }
                            }}
                        />
                    </div>
                    <br />
                    <Button type="primary" onClick={() => donateSearch()}>
                        <Icon type="search" />
                    </Button>
                </React.Fragment >
            }
            extra={
                <>
                    <Button type="primary" icon="download" onClick={downloadExcel}>
                        导出数据
                    </Button>
                </>
            }
        >
            <Table
                bordered
                size="small"
                rowKey={(record, index) => `${index}`}
                dataSource={data.list}
                columns={initColumns}
                loading={loading}
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 50,
                    showQuickJumper: true,
                    showTotal: total => `共${total}条`,
                    total: data.total || 0,
                    onChange: (page, pageSize) => {
                        fetchData(page, pageSize);
                    },
                }}
                scroll={{ x: "max-content" }}
            />
        </Card >

    )
}

export default DonateList
