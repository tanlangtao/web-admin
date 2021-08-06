import React, { useState, useRef, useEffect } from "react";
import { Card, message, Input, Table, Icon } from "antd";
import { getProxyGetGlobal,packageList } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";


export default () => {
    const [data, setData] = useState([])
    const [packageLIst, setpackageList] = useState([])
    const initColumns = [
        {
            title: "品牌ID",
            dataIndex: "package_id",
            render: (text) =>{
                let result = text;
                if(packageLIst && packageLIst.length !== 0){
                    packageLIst.map(ele =>{
                        if(ele.value === parseInt(text)){
                            result = ele.label
                        }
                    })
                }
                return result
            }
        },
        {
            title: "平台注册金 ",
            dataIndex: "platform_regin_gold",
            render: reverseNumber,
        },
        {
            title: "平台税收比例 ",
            dataIndex: "platform_tax_percent",
            render : text => (text + "%")
        },
        {
            title: "收入比例",
            dataIndex: "income_proportion",
            render : text => (text + "%")

        },
        {
            title: "收入类型",
            dataIndex: "income_type",
            render: text => (text === 1 ? "无限代" : text === 2 ? "无限代有收益（35%）" : text === 3 ? "无限代 无收益" : ""),
        },
        {
            title: "注册限制",
            dataIndex: "regin_times_limit",
            render: reverseNumber,
        },
        {
            title: "注册间隔",
            dataIndex: "regin_interval_limit",
            render: reverseNumber,
        },
        {
            title: "业绩统计方式",
            dataIndex: "base_dividend_type",
            render: text => (text === 1 ? "流水" : text === 2 ? "有效投注" : ""),

        },
        {
            title: "业绩折扣比例",
            dataIndex: "base_dividend_discount",
            render : text => (text + "%")
        },
        {
            title: "保底分红扣除比例",
            dataIndex: "payment_base_dividend_percent",
            render : text => (text + "%")
        },
        {
            title: "充值渠道费用比例",
            dataIndex: "payment_top_up_percent",
            render : text => (text + "%")
        },
        {
            title: "活动成本费用比例",
            dataIndex: "payment_activity_cost_percent",
            render : text => (text + "%")
        },
    ]
    useEffect( 
        () =>{
            proxySearch()
        }, []
    )
    //搜寻代理个人玩家流水
    const proxySearch = async (value) => {
        const res = await getProxyGetGlobal()
        const getpackageList = await packageList()
        if (res.code === 200) {
            message.success(res.status)
            const ressort = res.msg.sort(function (a, b) {
                return a.package_id - b.package_id;
              });     
            setData(ressort || [])
            console.log(getpackageList)
            if(getpackageList.status === 0){
                const newlist = getpackageList.data.list.map(ele =>{
                    return {
                        label: ele.name , value:ele.id
                    }
                }) 
                setpackageList(newlist)                    
            }
        } else {
            message.info(res.status || JSON.stringify(res))
        }
    }

    return (
        <Card
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