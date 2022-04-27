import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Modal, Button, Icon } from "antd";

// import _ from "lodash-es";

import MyDatePicker from "../../../components/MyDatePicker";
import { get_moneyfloat_detail, getTotalMoneyFlow } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import { reverseDecimal, reverseNumber } from "../../../utils/commonFuntion";
import LinkButton from "../../../components/link-button/index";
import Editform from "./editData";

export default () => {
    const initstates = useRef({
        start_time: "",
        end_time: "",
        link_id: "",
        user_id: "",
    });
    const ref = useRef({
        start_time: "",
        end_time: "",
        link_id: "",
        user_id: "",
        record: null,
        isadd: null,
    });
    //渲染周期之间共享数据的存储（state不能存储跨渲染周期的数据，因为state的保存会触发组件重渲染）
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [isEditformShow, set_isEditformShow] = useState(false);

    const [water, setwater] = useState({ total_bet: "-", total_game_statement: "-", total_money_flow: "-" });

    const handleEdit = (record, action) => {
        ref.current.isadd = action;
        ref.current.record = record;
        set_isEditformShow(true);
    };
    const initColumns = [
        {
            title: "id",
            dataIndex: "id",
        },
        {
            title: "用户id",
            dataIndex: "user_id",
        },
        {
            title: "流水金额",
            dataIndex: "amount",
        },
        {
            title: "系数",
            dataIndex: "rate",
        },
        {
            title: "关联id",
            dataIndex: "link_id",
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            render: formateDate,
        },
        {
            title: "更新时间",
            dataIndex: "updated_at",
            render: formateDate,
        },
        {
            title: "记录来源",
            dataIndex: "operator",
        },
        {
            title: "备注",
            dataIndex: "remark",
        },
        {
            title: "操作",
            dataIndex: "",
            render: (record) => (
                <span>
                    <LinkButton onClick={() => handleEdit(record, false)}>编辑</LinkButton>
                </span>
            ),
        },
    ];
    const handleSearch = () => {
        let { start_time, end_time } = initstates.current;
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        ref.current = { ...ref.current, ...initstates.current };
        console.log(ref.current);
        fetchData(1, 50);
    };

    const fetchData = async (page, limit) => {
        let { link_id, user_id, start_time, end_time } = ref.current;
        const res = await get_moneyfloat_detail({
            page,
            limit,
            link_id,
            user_id,
            start_time,
            end_time,
        });
        if (res.status === 0 && res.data) {
            message.success(res.msg);
            setData(res.data);
            setCount(res.count);
        } else {
            message.info(res.msg || JSON.stringify(res));
        }
    };
    const handleWaterSearch = async () => {
        let { user_id, start_time, end_time } = initstates.current;
        if (!user_id) {
            message.info("请输入user_id");
            return;
        }
        const res = await getTotalMoneyFlow({ user_id, start_time, end_time });
        if (res.status === 0 && res.data) {
            message.success(res.msg);
            setwater({
                total_bet: reverseNumber(res.data.total_bet),
                total_game_statement: reverseDecimal(res.data.total_game_statement),
                total_money_flow: reverseDecimal(res.data.total_money_flow),
            });
        } else {
            message.info(res.msg || JSON.stringify(res));
        }
    };
    let { record, isadd } = ref.current;
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
                        placeholder="请输入关联id"
                        onChange={(e) => {
                            initstates.current.link_id = e.target.value;
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入user_id"
                        onChange={(e) => {
                            initstates.current.user_id = e.target.value;
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => handleSearch()}>
                        查看
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => handleWaterSearch()}>
                        流水查看
                    </Button>
                    <br />
                    <br />
                    <div>
                        <Button type="primary" onClick={() => handleEdit(null, true)}>
                            添加
                        </Button>
                    </div>
                </div>
            }
            extra={
                <LinkButton onClick={() => window.location.reload()} size="default">
                    <Icon type="reload" />
                </LinkButton>
            }
        >
            <div>关联id: 充值时为订单Id,活动领取时记录活动Id</div>
            <div style={{ fontSize: 20 }}>
                <span style={{ marginRight: "15%"}}>玩家游戏流水:{water.total_game_statement}</span>
                <span style={{ marginRight: "15%"}}>玩家有效投注:{water.total_bet}</span>
                <span>玩家提现要求流水:{water.total_money_flow}</span>
            </div>
            <br />
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data}
                columns={initColumns}
                size="small"
                pagination={{
                    defaultPageSize: 50,
                    // showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: count,
                    onChange: (page, pageSize) => {
                        fetchData(page, pageSize);
                    },
                    // onShowSizeChange: (current, size) => {
                    //     this.setState({
                    //         pageSize: size,
                    //     });
                    //     this.onSearchData(current, size);
                    // },
                }}
            />
            {isEditformShow && (
                <Modal
                    title={isadd ? "添加" : `[id:${record?.id}]编辑`}
                    visible={isEditformShow}
                    onCancel={() => {
                        set_isEditformShow(false);
                    }}
                    footer={null}
                    maskClosable={false}
                >
                    <Editform
                        record={record}
                        isadd={isadd}
                        finished={() => {
                            if (!isadd) {
                                fetchData();
                            }
                            set_isEditformShow(false);
                        }}
                    />
                </Modal>
            )}
        </Card>
    );
};
