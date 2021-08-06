import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Modal, Button, Icon } from "antd";

// import _ from "lodash-es";

import MyDatePicker from "../../../components/MyDatePicker";
import { activitySetting, registerCode } from "../../../api";
// import { formateDate } from "../../../utils/dateUtils";
// import { reverseDecimal } from "../../../utils/commonFuntion";
import LinkButton from "../../../components/link-button/index";
import Editform from "./editData";

export default () => {
    const initstates = useRef({
        start_time: "",
        end_time: "",
        proxy_pid: "",
        activity_id: "",
        addData: {},
        type: null,
        checkdetail_proxy_pid: null,
    });
    //渲染周期之间共享数据的存储（state不能存储跨渲染周期的数据，因为state的保存会触发组件重渲染）
    const [data, setData] = useState([]);
    // const [count, setCount] = useState(0);
    const [isEditformShow, set_isEditformShow] = useState(false);

    const checkdetail = (record, type) => {
        console.log(record);
        initstates.current.type = type;
        initstates.current.checkdetail_proxy_pid = record.proxy_pid;
        record.receive_rows.forEach((ele) => {
            ele.code = JSON.parse(ele.receive_info).code;
            record.recharge_info.forEach((ele2) => {
                if (ele.user_id === ele2.user_id) {
                    ele.arrival_amount = ele2.arrival_amount;
                }
            });
        });
        console.log(record.receive_rows);
        initstates.current.record = record;
        set_isEditformShow(true);
    };
    const initColumns = [
        {
            title: "代理ID",
            dataIndex: "proxy_pid",
        },
        {
            title: "设定配额",
            dataIndex: "num",
        },
        {
            title: "序号已生成数量",
            dataIndex: "code",
            render: (text, record) => text?.length,
        },
        {
            title: "序号已领取数量",
            dataIndex: "receive_rows",
            render: (text, record) => text?.length,
        },
        {
            title: "充值达标人数",
            dataIndex: "recharge_num",
        },

        {
            title: "操作",
            dataIndex: "",
            render: (record) => (
                <span>
                    <LinkButton onClick={() => checkdetail(record, 1)}>生成序号</LinkButton>
                    <LinkButton onClick={() => checkdetail(record, 2)}>已领取玩家信息</LinkButton>
                </span>
            ),
        },
    ];
    const fetchData = async () => {
        let { start_time, end_time, proxy_pid, activity_id } = initstates.current;
        if (!start_time || !end_time) {
            message.info("请选择时间");
            return;
        }
        if (!proxy_pid) {
            message.info("请输入proxy_pid");
            return;
        }
        if (!activity_id) {
            message.info("请输入activity_id");
            return;
        }
        const res = await activitySetting({ start_time, end_time, proxy_pid, activity_id });
        if (res.status === 0) {
            message.success(res.msg);
            setData(res.data);
            // setCount(res.count);
        } else {
            setData([]);
            message.info(res.msg || JSON.stringify(res));
        }
    };
    const addData = async () => {
        Modal.confirm({
            title: "添加",
            okText: "提交",
            onOk: async () => {
                let { proxy_pid, num } = initstates.current.addData;
                if (!proxy_pid || !num) {
                    message.info("请输入配置");
                }
                console.log("registerCode reqData:", proxy_pid, num);
                const res = await registerCode({
                    proxy_pid,
                    num,
                    token: "e40f01afbb1b9ae3dd6747ced5bca532",
                });
                if (res.status === 0) {
                    message.success(res.msg);
                    fetchData();
                } else {
                    message.info(res.msg || JSON.stringify(res));
                }
            },
            content: (
                <div>
                    <Input
                        type="text"
                        style={{ width: "60%" }}
                        placeholder="请输入id"
                        onChange={(e) => {
                            initstates.current.addData.proxy_pid = e.target.value;
                        }}
                    />
                    <br />
                    <br />
                    <Input
                        type="number"
                        style={{ width: "60%" }}
                        placeholder="生成数量"
                        onChange={(e) => {
                            initstates.current.addData.num = e.target.value;
                        }}
                    />
                </div>
            ),
        });
    };
    return (
        <Card
            title={
                <div>
                    <MyDatePicker
                        handleValue={(date, dateString) => {
                            initstates.current = {
                                ...initstates.current,
                                start_time: dateString[0],
                                end_time: dateString[1],
                            };
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入总代id"
                        onChange={(e) => {
                            initstates.current.proxy_pid = e.target.value;
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入开业注册送的活动id"
                        onChange={(e) => {
                            initstates.current.activity_id = e.target.value;
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => fetchData()}>
                        查看
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => addData()}>
                        添加
                    </Button>
                </div>
            }
            extra={
                <LinkButton onClick={() => window.location.reload()} size="default">
                    <Icon type="reload" />
                </LinkButton>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data || []}
                columns={initColumns}
                size="small"
                pagination={{
                    defaultPageSize: 50,
                    // showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: data?.length || 0,
                }}
            />
            <br />
            <div>参数说明</div>
            <div>
                总代id : 查询格式demo 1个查询：361730819 N个查询 ：361730819,230619510 英文逗号分隔
            </div>
            <div>
                时间范围不支持跨天查询 ,
                原因：1.要查配额，总代今天和昨天的配额配置可能不一样，没办法区分要查哪天的配额
                2.充值达标人数的统计 今天可能是配100就算达标 明天可能是配200就算达标
                跨天统计可能会有误
            </div>
            <div>
                充值达标人数：活动第一天 领取玩家里看day1配置的充值要求实时得出
                <br />
                活动第二天 day1的领取玩家里看day1配置的充值要求得出
                <br />
                活动第三天 day2的领取玩家里看day2配置的充值要求得出
                <br />
                序号已生成数量等于活动三天总的生成数量，不参与时间范围统计
            </div>
            <div>
                设定配额公式:
                <br />
                day1 设定配额 = 总代当日配额 - 玩家当日已领取占用的额度 即剩余配额
                <br />
                day2/day3 设定配额 = 前置条件检查达标后的总代当日配额 - 玩家当日已领取占用的额度
                不达标即为0
            </div>
            {isEditformShow && (
                <Modal
                    title={
                        initstates.current.checkdetail_proxy_pid +
                        (initstates.current.type === 1 ? "生成序号" : "已领取玩家信息")
                    }
                    visible={isEditformShow}
                    onCancel={() => {
                        set_isEditformShow(false);
                    }}
                    footer={null}
                    maskClosable={false}
                >
                    <Editform record={initstates.current.record} type={initstates.current.type} />
                </Modal>
            )}
        </Card>
    );
};
