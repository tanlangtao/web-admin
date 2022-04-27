import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Modal, Button, Icon, Select } from "antd";

import _ from "lodash-es";
import ExportJsonExcel from "js-export-excel";

import MyDatePicker from "../../../components/MyDatePicker";
import { getUserAddress, editLogisticsInfo, getChlidrenInfo, getProxyUserList } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import { reverseNumber } from "../../../utils/commonFuntion";
import LinkButton from "../../../components/link-button/index";
// import Editform from "./editData";

export default () => {
    const initstates = useRef({
        start_time: null,
        end_time: null,
        key: "user_id",
        value: null,
    });
    const reqData = useRef({});
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    // const [isEditformShow, set_isEditformShow] = useState(false);

    // const handle_tablebtn = (rowdata, second_page_type) => {
    //     initstates.current = { ...initstates.current, rowdata, second_page_type };
    //     console.log(initstates.current);
    //     // initstates.current.checkdetail_proxy_pid = record.proxy_pid;
    //     // record.receive_rows.forEach((ele) => {
    //     //     ele.code = JSON.parse(ele.receive_info).code;
    //     //     record.recharge_info.forEach((ele2) => {
    //     //         if (ele.user_id === ele2.user_id) {
    //     //             ele.arrival_amount = ele2.arrival_amount;
    //     //         }
    //     //     });
    //     // });
    //     // console.log(record.receive_rows);
    //     // initstates.current.record = record;
    //     set_isEditformShow(true);
    // };
    const edit = (record) => {
        let { id, tracking_number, logistics_comp, remark } = record;
        initstates.current.editData = {
            tracking_number,
            logistics_comp,
        };
        Modal.confirm({
            title: "编辑",
            okText: "提交",
            width: "60%",
            onOk: async () => {
                let { tracking_number, logistics_comp, remark } = initstates.current.editData;
                console.log(tracking_number, logistics_comp);
                if (!tracking_number || !logistics_comp) {
                    message.info("请输入关键字");
                    return Promise.reject();
                }
                const res = await editLogisticsInfo({
                    id,
                    tracking_number,
                    remark,
                    comp_name: logistics_comp,
                    update_user: localStorage.getItem("name"),
                });
                if (res.status === 0) {
                    message.success(res.msg || "操作成功");
                    fetchData(1, 20);
                } else {
                    message.info(res.msg || "操作失败");
                }
            },
            content: (
                <Card>
                    新增物流单号 :{" "}
                    <Input
                        type="text"
                        style={{ width: "80%" }}
                        placeholder="请输入物流单号"
                        defaultValue={tracking_number}
                        onChange={(e) => {
                            initstates.current.editData.tracking_number = e.target.value;
                        }}
                    />
                    <br />
                    <br />
                    新增物流公司 :{" "}
                    <Input
                        type="text"
                        style={{ width: "80%" }}
                        placeholder="请输入物流公司"
                        defaultValue={logistics_comp}
                        onChange={(e) => {
                            initstates.current.editData.logistics_comp = e.target.value;
                        }}
                    />
                    <br />
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注
                    :{" "}
                    <Input
                        type="text"
                        style={{ width: "80%" }}
                        placeholder="请输入备注"
                        defaultValue={remark}
                        onChange={(e) => {
                            initstates.current.editData.remark = e.target.value;
                        }}
                    />
                </Card>
            ),
        });
    };
    const checkData = async (record) => {
        let direct_number, self_arrival_amount, uucount, totalAmount, totalpeople;
        let async1 = getChlidrenInfo(record.user_id);
        let async2 = getProxyUserList({ page: 1, limit: 20, id: record.user_id });
        let res1 = await async1;
        let res2 = await async2;
        if (res1.status === 0) {
            self_arrival_amount = res1.data.self_arrival_amount;
            totalpeople = res1.data.chlid_recharge_info.length;
            uucount = _.uniqBy(res1.data.chlid_recharge_info, "user_id").length;
            totalAmount = _.sumBy(res1.data.chlid_recharge_info, (o) =>
                _.toNumber(o.arrival_amount),
            );
        }
        if (res2.status === 0) {
            direct_number = res2.data?.proxy_user?.[0]?.direct_number || 0;
        }
        Modal.info({
            title: "数据",
            okText: "关闭",
            width: "40%",
            content: (
                <Card style={{ fontSize: 16 }}>
                    <div>玩家本身充值 : {self_arrival_amount}</div>
                    <div>直属下级总人数 : {direct_number}</div>
                    <div>直属下级充值笔数 : {totalpeople}</div>
                    <div>直属下级充值唯一人次 : {uucount}</div>
                    <div>直属下级总充值金额 : {reverseNumber(totalAmount)}</div>
                </Card>
            ),
        });
    };

    const initColumns = [
        // {
        //     "id": 1,
        //     "user_id": 2,
        //     "shipping_user": "张三",
        //     "mobile": "2",
        //     "remark": "Rama9 ", //收件人地址
        //     "tracking_number": "ZT12334", //物流单号
        //     "logistics_comp": "SF",  //物流公司
        //     "info": `{"sign_day":7}`, //发货详情
        //     "activity_id": 4, //活动id
        //     "created_at": 4,
        //     "updated_at": 4,
        //     "update_user": "4"
        // }
        {
            title: "操作",
            dataIndex: "",
            render: (record) => <LinkButton onClick={() => edit(record)}>编辑</LinkButton>,
        },
        {
            title: "数据",
            dataIndex: "",
            render: (record) => <LinkButton onClick={() => checkData(record)}>数据</LinkButton>,
        },
        {
            title: "id",
            dataIndex: "id",
        },
        {
            title: "user_id",
            dataIndex: "user_id",
        },
        {
            title: "姓名",
            dataIndex: "shipping_user",
        },
        {
            title: "收货地址",
            dataIndex: "address",
        },
        {
            title: "手机",
            dataIndex: "mobile",
        },
        {
            title: "水果",
            dataIndex: "info",
            render: (text, record) => {
                let info = JSON.parse(text || null);
                let level =
                    info?.fruit_level === 1
                        ? "普通水果"
                        : info?.fruit_level === 2
                        ? "高级水果"
                        : "";
                let weight;
                if (record.source_type === 1) {
                    weight = info?.fruit || "";
                } else {
                    weight = info?.fruit_jin || "";
                }
                if (!weight) return `${level}`;
                return `${level}${weight}斤`;
            },
        },

        {
            title: "物流单号",
            dataIndex: "tracking_number",
        },

        {
            title: "物流公司",
            dataIndex: "logistics_comp",
        },
        {
            title: "活动类型",
            dataIndex: "source_type",
            // 1 对应 签到活动  2 免费领水果-被邀请者  3 免费领水果-邀请者
            render: (text) =>
                text === 1
                    ? "签到活动"
                    : text === 2
                    ? "免费领水果-被邀请者"
                    : text === 3
                    ? "免费领水果-邀请者"
                    : "",
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            render: formateDate,
        },
        {
            title: "备注",
            dataIndex: "remark",
        },
    ];
    const handleSearch = () => {
        let { key, value, start_time, end_time } = initstates.current;
        if (!value && !start_time) {
            message.info("请输入关键字或选择时间范围");
            return;
        }
        reqData.current = { [key]: value, start_time, end_time };
        fetchData(1, 20);
    };
    const fetchData = async (page, limit) => {
        let newvalue = _.omitBy(reqData.current, _.isNil);
        const res = await getUserAddress({ ...newvalue, page, limit });
        if (res.status === 0) {
            message.success(res.msg);
            setData(res.data.list);
            setCount(res.data.count);
        } else {
            setData([]);
            message.info(res.msg || JSON.stringify(res));
        }
    };
    const downloadExcel = (data_for_excel) => {
        let searchData = reqData.current;
        let { start_time, end_time } = searchData;
        let option = {};
        let dataTable = [];
        let columns = initColumns;
        data_for_excel.forEach((ele) => {
            let obj = {};
            columns.forEach((item) => {
                obj[item.title] = ele[item.dataIndex];
                if (item.dataIndex === "info") {
                    let info = JSON.parse(ele[item.dataIndex] || null);
                    let level =
                        info?.fruit_level === 1
                            ? "普通水果"
                            : info?.fruit_level === 2
                            ? "高级水果"
                            : "";
                    let weight;
                    if (ele.source_type === 1) {
                        weight = info?.fruit || "";
                    } else {
                        weight = info?.fruit_jin || "";
                    }
                    if (!weight) {
                        obj[item.title] = `${level}`;
                    } else {
                        obj[item.title] = `${level}${weight}斤`;
                    }
                    switch (ele[item.dataIndex]) {
                        case 1:
                            obj[item.title] = "签到活动";
                            break;
                        case 2:
                            obj[item.title] = "免费领水果-被邀请者";
                            break;
                        case 3:
                            obj[item.title] = "免费领水果-邀请者";
                            break;
                        default:
                            break;
                    }
                }
                if (item.dataIndex === "source_type") {
                    switch (ele[item.dataIndex]) {
                        case 1:
                            obj[item.title] = "签到活动";
                            break;
                        case 2:
                            obj[item.title] = "免费领水果-被邀请者";
                            break;
                        case 3:
                            obj[item.title] = "免费领水果-邀请者";
                            break;
                        default:
                            break;
                    }
                }
                if (item.dataIndex === "created_at") {
                    obj[item.title] = formateDate(ele[item.dataIndex]);
                }
            });
            dataTable.push(obj);
        });
        console.log(dataTable);
        let sheetFilter = [];
        columns.forEach((item) => {
            if (item.title && item.dataIndex) {
                sheetFilter.push(item.title);
            }
        });
        // let type = tableType === 1 ? "游戏" : "订单";
        option.fileName = `${start_time};${end_time};领水果活动数据`;
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: "sheet",
                sheetFilter: sheetFilter,
                sheetHeader: sheetFilter,
            },
        ];
        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
    };
    const handle_download = async () => {
        let newvalue = _.omitBy(reqData.current, _.isNil);
        if (!reqData.current.start_time || !reqData.current.end_time) {
            message.info("请输入关键字或选择时间范围进行搜索后点击导出");
            return;
        }
        const res = await getUserAddress({ ...newvalue, page: 1, limit: 10000 });
        if (res.status === 0) {
            downloadExcel(res.data.list);
        } else {
            message.info("下载失败" + res.msg);
        }
    };
    // let { second_page_type, rowdata } = initstates.current;
    return (
        <Card
            title={
                <div>
                    <Select
                        placeholder="请选择"
                        style={{ width: 200 }}
                        defaultValue="user_id"
                        onSelect={(value) => {
                            initstates.current.key = value;
                        }}
                    >
                        <Select.Option value="user_id">user_id</Select.Option>
                        <Select.Option value="tracking_number">物流单号</Select.Option>
                    </Select>
                    &nbsp; &nbsp;
                    <Input
                        style={{ width: 200 }}
                        placeholder="请输入关键字"
                        onChange={(e) => {
                            initstates.current.value = e.target.value;
                            console.log(e.target.value);
                        }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
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
                    <Button type="primary" onClick={() => handleSearch()}>
                        查看
                    </Button>
                </div>
            }
            extra={
                <>
                    <LinkButton onClick={() => window.location.reload()} type="primary">
                        <Icon type="reload" />
                    </LinkButton>
                    <br />
                    <br />
                    <LinkButton
                        type="primary"
                        onClick={() => {
                            handle_download();
                        }}
                    >
                        导出数据
                    </LinkButton>
                </>
            }
        >
            <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data || []}
                columns={initColumns}
                size="small"
                pagination={{
                    defaultPageSize: 20,
                    // showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: count || 0,
                    onChange: (page, pageSize) => {
                        fetchData(page, pageSize);
                    },
                }}
            />
            {/* {isEditformShow && (
                <Modal
                    title={second_page_type}
                    visible={isEditformShow}
                    onCancel={() => {
                        set_isEditformShow(false);
                    }}
                    footer={null}
                    maskClosable={false}
                >
                    <Editform rowdata={rowdata} type={second_page_type} />
                </Modal>
            )} */}
        </Card>
    );
};
