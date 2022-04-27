import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { GetBaseDividendRule } from "../../../api";
import { reverseNumber } from "../../../utils/commonFuntion";


export default () => {
    const [data, setData] = useState([])
    const initColumns = [
        {
            title: "玩家ID",
            dataIndex: "_id",
        },
        {
            title: "上级ID",
            dataIndex: "proxy_user_id",
        },
        {
            title: "每万返佣",
            dataIndex: "income",
            render: reverseNumber,
        },
    ]
    //搜寻代理个人玩家流水
    const proxySearch = async (value) => {
        if (!value) {
            message.info("请输入玩家ID");
            return;
        }
        let reqData = {
            id: value,
            account_name: value,
        }
        const res = await GetBaseDividendRule(reqData)
        if (res.code === 200) {
            message.success(res.status)
            setData(res.msg ? [res.msg] : [])
        } else {
            message.info(res.status || JSON.stringify(res))
            setData([])
        }
    }

    return (
        <Card
            title={
                <div>
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
            />        </Card>
    )
}