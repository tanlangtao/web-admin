import React, { useState } from "react";
import { Card, message, Input, Table } from "antd";
import { getPaymentInfoDetail } from "../../../api";
import MyDatePickerOneDay from "../../../components/MyDatePickerOneDay";
import { formatDateYMD } from "../../../utils/dateUtils";

import { reverseNumber2 } from "../../../utils/commonFuntion";
import moment from "moment";

let initstate = {
    start_time: formatDateYMD(new Date()),
};

export default () => {
    const [data, setData] = useState([])
    const initColumns = [       
		{
			title: "贡献玩家ID",
			dataIndex: "game_user_id",
			
		},
        {
            title: "分红金额",
            dataIndex: "income",
            render: reverseNumber2
        },
    ]

    //查询玩家分红数据详情
    const proxySearch = async (value) => {
        const { start_time } = initstate
        if (!value) {
            message.info("请输入玩家ID");
            return;
        }
        if (!start_time ) {
            message.info("请选择时间范围");
            return;
        }
        let reqData = {
            date: start_time,
            id: value,
            account_name: value,
        }
        const res = await getPaymentInfoDetail(reqData)
        if (res.code === 200) {
            message.success(res.status)
            setData(res.msg  || [])
        } else {
            message.info(res.status || JSON.stringify(res))
        }
    }

    return (
        <Card
            title={
                <div>
                    <MyDatePickerOneDay
                        handleValue={(date, dateString) => {
                            initstate.start_time = date ? moment(date.valueOf()).format("YYYY-MM-DD") : null;
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