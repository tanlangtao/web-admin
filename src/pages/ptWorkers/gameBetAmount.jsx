import React, { useState, useEffect } from "react";
import { Card, message, Icon, Table } from "antd";
import { GetProxyUserLinkstatement } from "../../api";
import MyDatePicker from "../../components/MyDatePicker";
import { reverseNumber } from "../../utils/commonFuntion";
import { gameRouter, thirdPartyGameRouter } from "../../utils/public_variable"
import moment from "moment"
import LinkButton from "../../components/link-button/index";
import ExportJsonExcel from "js-export-excel";
let initstate = {
    start_time: null,
    end_time: null,
};

let gameNameMap = {
    ...gameRouter,
    ...thirdPartyGameRouter,
    "5b1f3a3cb76a591e7f251729": { path: "/castcraft/api", name: "城堡争霸" },
}

export default (props) => {
    const [data, setData] = useState([])
    useEffect(() => {
        //相当于生命周期compomentDidmonut
        initstate = {
            start_time: moment().startOf("day"),
            end_time: moment().endOf("day"),
        }
        proxySearch(props.recordID)
    }, [])
    const initColumns = [
        {
            title: "日期",
            dataIndex: "date",
            width: "15%",
            align: 'center',
        },
        {
            title: "游戏名称",
            dataIndex: "",
            align: 'center',
            render: (text, record) => {
                return record.game_id ? gameNameMap[record.game_id].name : ""
            },
        },
        {
            title: "玩家总输",
            dataIndex: "lose_total",
            align: 'center',
            render: reverseNumber,
        },
        {
            title: "玩家总赢",
            dataIndex: "win_total",
            align: 'center',
            render: reverseNumber,
        },
        {
            title: "输赢差",
            dataIndex: "",
            align: 'center',
            render: (text, record) => {
                return reverseNumber(Math.abs(record.lose_total) - record.win_total)
            },
        },
    ]

    //搜寻代理个人玩家流水
    const proxySearch = async (value) => {
        const { start_time, end_time } = initstate
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
    const download = async () => {
        var option = {};
        let dataTable = [];
        data &&
            data.forEach((ele) => {
                let obj = {
                    日期: ele.date,
                    游戏名称: ele.game_id ? gameNameMap[ele.game_id].name : "",
                    玩家总输: reverseNumber(ele.lose_total),
                    玩家总赢: reverseNumber(ele.win_total),
                    输赢差: reverseNumber(Math.abs(ele.lose_total) - ele.win_total )
                };
                dataTable.push(obj);
            });
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: "sheet",
                sheetHeader: [
                    "日期",
                    "游戏名称",
                    "玩家总输",
                    "玩家总赢",
                    "输赢差",
                ],
            },
        ];

        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
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
                    &nbsp; &nbsp;
                    <LinkButton
                        onClick={() => proxySearch(props.recordID)}
                        size="default"
                    >
                        <Icon type="search" />
                    </LinkButton>
                    &nbsp; &nbsp;
                    <span style={{ color: 'red' }}>
                        *只支持查询30天内数据*
                    </span>
                   &nbsp; &nbsp;
                    <LinkButton
                        type="primary"
                        onClick={() => {
                            download();
                        }}
                    >
                        导出数据
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
                scroll={{ x: "max-content" }}
                pagination={{
                    defaultPageSize: 30,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: data ?.length || 0,
                }}
            />

        </Card>
    )

}
