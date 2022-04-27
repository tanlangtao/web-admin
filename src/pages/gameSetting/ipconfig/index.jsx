import React, { useState, useEffect } from "react";
import { Card, message, InputNumber, Input, Table, Popconfirm } from "antd";
import { getIPlist, addIP, deleteIP, setLimit, getIPconfig } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button";


export default function Ipconfig(props) {
    const [data, setData] = useState([]);
    const [initLimitValue, setinitLimitValue] = useState({});
    const [inputValue, setInputValue] = useState();
    const [days, setdays] = useState()
    const [times, settimes] = useState()
    const fetchData = async (page, limit, ip) => {
        if (!ip) { ip = "" }
        const res = await getIPlist(page, limit, ip);
        if (res.code === 200 && res.msg) {
            setData(res.msg);
        } else {
            message.info(res.msg || "请求失败");
        }
    }
    const getInitIpconfig = async () => {
        const res = await getIPconfig()
        if (res.code === 200 && res.msg) {
            setinitLimitValue(res.msg)
        }
    }
    useEffect(() => {
        fetchData(1, 20);
        getInitIpconfig()
    }, []);
    const initColumns = [
        {
            title: "注册ip",
            dataIndex: "_id",
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            render: formateDate,
        },
        {
            title: "操作",
            dataIndex: "",
            render: (text, record, index) => {
                return (
                    <Popconfirm
                        title="确定要删除吗?"
                        onConfirm={() => deleteIPconfig(record._id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <LinkButton type="danger" size="small">
                            删除
                </LinkButton>
                    </Popconfirm>
                );
            }
        },
    ]
    const addIPconfig = async () => {
        console.log(inputValue);
        if (!inputValue) {
            message.info("请输入要添加的ip!")
        } else {
            const res = await addIP(inputValue);
            if (res.code === 200) {
                message.success(res.status)
                setInputValue()
                fetchData(1, 20)
            } else {
                message.info(res.msg || "请求失败");
            }
        }
    }
    const deleteIPconfig = async (_id) => {
        const res = await deleteIP(_id);
        if (res.code === 200) {
            message.success(res.status)
            fetchData(1, 20)
        } else {
            message.info(res.msg || "请求失败");
        }
    }
    const setLimitConfig = async (type) => {
        let field, value;
        type === 0 ? field = "regin_interval_limit" : field = "regin_times_limit"
        type === 0 ? value = days : value = times
        if (value) {
            const res = await setLimit(field, value)
            if (res.code === 200) {
                message.success(res.status)
                fetchData(1, 20)
                getInitIpconfig()
            } else {
                message.info(res.msg || "请求失败");
            }
        } else {
            message.info("请输入有效值")
        }

    }
    return (
        <Card
            title={
                <>
                    <div>
                        <Input
                            type="text"
                            placeholder="请输入要列入黑名单的ip"
                            style={{ width: 200 }}
                            value={inputValue}
                            onChange={e => (setInputValue(e.target.value))}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <LinkButton onClick={addIPconfig}>添加</LinkButton>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <div style={{ paddingLeft: 10, backgroundColor: "#eee", marginBottom: 10, fontSize: 14 }}>单个ip单位时间最多注册用户数配置(请输入正整数):
                        <span style={{ float: "right" }}>当前配置：{initLimitValue.regin_interval_limit}天限制注册{initLimitValue.regin_times_limit}次</span>
                        </div>
                        <InputNumber
                            placeholder="限制天数"
                            style={{ width: 150 }}
                            precision={0.1}
                            min={0}
                            onBlur={(e) => setdays(e.target.value)}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <LinkButton onClick={() => setLimitConfig(0)}>确定</LinkButton>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber
                            placeholder="限制注册次数"
                            style={{ width: 150 }}
                            precision={0.1}
                            min={0}
                            onBlur={(e) => settimes(e.target.value)}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <LinkButton onClick={() => setLimitConfig(1)}>确定</LinkButton>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Input.Search
                            placeholder="请输入关键字搜索"
                            style={{ width: 200 }}
                            onSearch={value => { fetchData(1, 20, value) }}
                            enterButton
                        />
                    </div>
                </>
            }
        >
            <Table
                bordered
                size="small"
                rowKey={(record, index) => `${index}`}
                dataSource={data.black_list}
                columns={initColumns}
                pagination={{
                    defaultPageSize: 20,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共${total}条`,
                    defaultCurrent: 1,
                    total: data.count,
                    onChange: (page, pageSize) => {
                        fetchData(page, pageSize);
                    },
                }}
            />
        </Card>
    );
}