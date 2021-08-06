import React, { useState, useRef } from "react";

import { Form, Input, Button, message, Table, Card } from "antd";

import { editLogisticsInfo } from "../../../api";

const EditForm = (props) => {
    const { rowdata, type } = props;
    // const [data, setdata] = useState((type === 1 ? record.code : record.receive_rows) || []);
    const ref = useRef({ num: null });
    const handle_confirmed = async (value, key) => {
        let { id, tracking_number, comp_name, update_user } = rowdata;
        const res = await editLogisticsInfo({
            id,
            tracking_number,
            comp_name,
            update_user: localStorage.getItem("name"),
            [key]: value,
        });
        if (res.status === 0) {
            message.success(res.msg || "操作成功");
        } else {
            message.info(res.msg || "操作失败");
        }
    };
    // const initColumns = () => {
    //     if (type === "编辑") {
    //         return [
    //             {
    //                 title: "序列号",
    //                 dataIndex: "",
    //             },
    //         ];
    //     }
    //     if (type === "数据") {
    //         return [
    //             {
    //                 title: "领取玩家ID",
    //                 dataIndex: "user_id",
    //             },
    //             {
    //                 title: "领取的序列号",
    //                 dataIndex: "code",
    //             },
    //             {
    //                 title: "累计充值",
    //                 dataIndex: "arrival_amount",
    //                 defaultSortOrder: "descend",
    //                 sorter: (a, b) => a.recharge_amount - b.recharge_amount,
    //             },
    //         ];
    //     }
    //     return [];
    // };
    // const add_code = async () => {
    //     let { num } = ref.current;
    //     if (!num) {
    //         message.info("请输入配置");
    //     }
    //     const res = await registerCode({
    //         proxy_pid: record.proxy_pid,
    //         num,
    //         token: "e40f01afbb1b9ae3dd6747ced5bca532",
    //     });
    //     if (res.status === 0) {
    //         message.success(res.msg);
    //         setdata(res.data || []);
    //     } else {
    //         message.info(res.msg || JSON.stringify(res));
    //     }
    // };
    if (type === "编辑") {
        return (
            <Card>
                新增物流单号 :{" "}
                <Input.Search
                    enterButton="确认"
                    onSearch={(value) => handle_confirmed(value, "tracking_number")}
                />
                <br />
                <br />
                新增物流公司 :{" "}
                <Input.Search
                    enterButton="确认"
                    onSearch={(value) => handle_confirmed(value, "comp_name")}
                />
            </Card>
        );
    }
    if (type === "数据") {
        return <div>数据</div>;
    }
    // return (
    //     <Card
    //         title={
    //             type === 1 && (
    //                 <div>
    //                     <Input
    //                         type="number"
    //                         style={{ width: 200 }}
    //                         placeholder="生成数量"
    //                         onChange={(e) => {
    //                             ref.current.num = e.target.value;
    //                         }}
    //                     />
    //                     &nbsp;&nbsp;&nbsp;&nbsp;
    //                     <Button type="primary" onClick={() => add_code()}>
    //                         添加
    //                     </Button>
    //                 </div>
    //             )
    //         }
    //     >
    //         <Table
    //             bordered
    //             rowKey={(record, index) => `${index}`}
    //             dataSource={data}
    //             columns={initColumns()}
    //             size="small"
    //             pagination={{
    //                 defaultPageSize: 20,
    //                 // showSizeChanger: true,
    //                 showQuickJumper: true,
    //                 showTotal: (total, range) => `共${total}条`,
    //                 defaultCurrent: 1,
    //                 total: data?.length || 0,
    //             }}
    //         />
    //     </Card>
    // );
};

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm;
