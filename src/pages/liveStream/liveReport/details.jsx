import React, { useState, useRef, useEffect } from "react";
import { Card, message, Input, Table, Select, Modal, Button, Icon } from "antd";
import ExportJsonExcel from "js-export-excel";
import { reverseNumber } from "../../../utils/commonFuntion";

const LiveReportDetails = (props) => {
    const { details, type } = props
    const initColumns = [
        {
            title: (type == "streamer") ? "游戏名称" : "主播ID",
            dataIndex: (type == "streamer") ? "name" : "id",
        },
        {
            title: "玩家打赏",
            dataIndex: "amount",
            render: reverseNumber,
        },
    ]

    return (
        <Table
            bordered
            rowKey={(record, index) => `${index}`}
            dataSource={details}
            columns={initColumns}
            size="small"
            pagination={false}
			scroll={{ x: "max-content" }}
        />
    )
}

export default LiveReportDetails