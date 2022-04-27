import React, { useState, useRef } from "react";
import { Card, message, Input, Table, Modal, Button, Icon } from "antd";
import { reverseNumber } from "../../../utils/commonFuntion";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button";
import moment from "moment";
import { getLiveData } from "../../../api";
import LiveReportDetails from "./details"

const LiveReport = (props) => {
    const { type } = props
    const [data, setData] = useState([])
    const [details, setDetails] = useState([])
    const [showDetails, setShowDetails] = useState(false)

    const initStates = useRef({
        id: "",
        live_id: "",
        start_time: "",
        end_time: "",
    })

    //搜尋按鈕onClick事件
    const reportSearch = () => {
        let { start_time, end_time, id, live_id } = initStates.current
        if (!start_time || !end_time) {
            message.info("请选择时间范围，且范围不大于31天")
            return
        }
        //定义reqData
        let reqData = {
            start_time: start_time,
            end_time: end_time,
            sum_field_num: 0,
            id: id,
            live_id: live_id,
        }
        //根据类型变换id的key name
        //sum_field_num 加總欄位 0=不加總 1=依據遊戲加總 2=依據直播主加總 3=依據玩家加總
        type == 'streamer' ? reqData.sum_field_num = 2 : reqData.sum_field_num = 3

        fetchData(reqData)
    }

    const fetchData = async (reqData) => {
        const res = await getLiveData(reqData)
        //状态码，0： 成功；-1：失败
        if (res.code === 0) {
            message.success(res.msg)
            setData((res.data.summary_list && res.data.summary_list) || [])
        }
        else {
            message.info(res.msg || JSON.stringify(res));
        }
    }

    //查看詳情按鈕onClick事件
    const getDetail = async (record) => {
        let { start_time, end_time } = initStates.current
        if (!record.id) {
            message.info('参数错误');
            return
        }

        let reqData
        if (type == 'streamer') {
            reqData = {
                start_time: start_time,
                end_time: end_time,
                sum_field_num: 1,
                live_id: record.id,
            }
        } else {
            reqData = {
                start_time: start_time,
                end_time: end_time,
                sum_field_num: 2,
                id: record.id,
            }
        }
        const res = await getLiveData(reqData)
        if (res.code === 0) {
            setShowDetails(true)
            message.success(res.msg)
            setDetails((res.data.summary_list && res.data.summary_list) || [])
        }
        else {
            message.info(res.msg || JSON.stringify(res));
        }
    }

    const initColumns = [
        {
            title: (type == "streamer") ? "主播ID" : "玩家ID",
            dataIndex: "id",
        },
        {
            title: "玩家打赏总和",
            dataIndex: "amount",
            render: reverseNumber,
        },
        {
            title: "打赏详情",
            dataIndex: "",
            render: record => (
                <span>
                    <Button
                        size="small"
                        onClick={() => getDetail(record)}
                        type="default"
                    >
                        查看
                    </Button>
                </span>
            ),
        },
    ]


    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, val) => {
                            let diffDays = moment(val[1]).diff(moment(val[0]), "days");
                            if (diffDays > 31) {
                                message.info("请选择时间范围不大于31天");
                            } else {
                                initStates.current.start_time = date[0] ? date[0].valueOf() / 1000 : null;
                                initStates.current.end_time = date[1] ? Math.ceil(date[1].valueOf() / 1000) : null;
                            }
                        }}
                    />
                    &nbsp; &nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder={type == "streamer" ? "请输入主播ID" : "请输入玩家ID"}
                        onChange={e => {
                            type == "streamer"
                                ? initStates.current.live_id = e.target.value
                                : initStates.current.id = e.target.value
                        }}
                    />
                    &nbsp; &nbsp;
                    <LinkButton onClick={() => reportSearch()} size="default">
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
            {showDetails && (
                <Modal
                    title={"打赏详情"}
                    visible={showDetails}
                    onCancel={() => {
                        setShowDetails(false)
                    }}
                    footer={null}
                    width="40%"
                >
                    <LiveReportDetails details={details} type={type} />
                </Modal>
            )}
        </Card>
    )
}

export default LiveReport