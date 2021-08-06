import React, { useState, useEffect } from "react";
import { Card, message, Input, Table, Popconfirm } from "antd";
import { getwhiteIPlist, AddWhiteList , DeleteWhiteList } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button";


export default function WhitleList(props) {
    const [data, setData] = useState({});
    const [inputValue, setInputValue] = useState();
    const fetchData = async (page, limit, ip) => {
        if (!ip) { ip = "" }
        const res = await getwhiteIPlist(page, limit, ip);
        if (res.code === 200 && res.msg) {
            setData(res.msg);
        } else {
            message.info(res.msg || "请求失败");
        }
    }
    useEffect(() => {
        fetchData(1, 20);
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
            const res = await AddWhiteList(inputValue);
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
        const res = await DeleteWhiteList(_id);
        if (res.code === 200) {
            message.success(res.status)
            fetchData(1, 20)
        } else {
            message.info(res.msg || "请求失败");
        }
    }
    return (
        <Card
            title={
                <>
                    <div>
                        <Input
                            type="text"
                            placeholder="请输入要列入白名单的ip"
                            style={{ width: 200 }}
                            value={inputValue}
                            onChange={e => (setInputValue(e.target.value))}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <LinkButton onClick={addIPconfig}>添加</LinkButton>
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
                dataSource={data.white_list}
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