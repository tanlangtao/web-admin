import React, { useRef, useState } from "react";

import { Table, message, Card, Input } from "antd";

import MyDatePicker from "../../../components/MyDatePicker";
import { getSaveCodeList } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";

export default () => {
    const [table_data, set_table_data] = useState([]);
    const initstates = useRef({
        start_time: "",
        end_time: "",
    });
    const initColumns = [
        {
            title: "时间",
            dataIndex: "time",
            render: formateDate,
        },
        {
            title: "包体名称",
            dataIndex: "package_name",
        },
        {
            title: "上级ID",
            dataIndex: "proxy_user_id",
        },
        {
            title: "设备型号",
            dataIndex: "os_name",
        },

        {
            title: "设备版本",
            dataIndex: "os_version",
        },

        {
            title: "浏览器",
            dataIndex: "browser_name",
        },
        {
            title: "浏览器版本",
            dataIndex: "browser_version",
        },
    ];
    const onSearchButtonHandled = async (value) => {
        let { start_time, end_time } = initstates.current;
        if (!value || !start_time || !end_time) {
            message.info("请选择时间范围并输入访问ip");
            return;
        }
        const res = await getSaveCodeList({
            ip: value,
            start_time,
            end_time,
        });
        if (res.code === 200) {
            message.success(res.status);
            set_table_data(res.msg || []);
        } else {
            set_table_data([]);
            message.info(res.status || JSON.stringify(res));
        }
    };
    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            // let diffDays = date[1] && date[1].diff(date[0], "month");
                            // if (diffDays > 6) {
                            //     message.info("请选择时间范围不超过六个月");
                            // } else
                            if (date && date.length !== 0) {
                                initstates.current.start_time = date[0].valueOf() / 1000;
                                initstates.current.end_time =
                                    Math.ceil(date[1].valueOf() / 1000) - 1;
                            } else {
                                initstates.current.start_time = "";
                                initstates.current.end_time = "";
                            }
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input.Search
                        style={{ width: 200 }}
                        placeholder="请输入访问ip"
                        enterButton
                        onSearch={(value) => onSearchButtonHandled(value)}
                    />
                </div>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={table_data}
                columns={initColumns}
                size="small"
                pagination={false}
            />
        </Card>
    );
};
