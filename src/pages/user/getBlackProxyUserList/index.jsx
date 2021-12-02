import React, { useRef, useState, useEffect } from "react";

import { Table, message, Card, Input, Button, Modal, Popconfirm } from "antd";

import {
  getBlackProxyUserList,
  addBlackProxyUserList,
  deleteBlackProxyUserList,
} from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
export default () => {
  const [table, setTable] = useState({ data: [], count: 0, current: 1 });
  const [is_modal_show, setis_modal_show] = useState(false);
  const [is_history_show, setis_history_show] = useState(false);
  const ref = useRef({});
  const fetchData = async (page, limit, user_id) => {
    const res = await getBlackProxyUserList(page, limit, user_id);

    setTable({
      data:
        res.msg.black_id_list?.sort((a, b) => {
          return b.create_time - a.create_time;
        }) || [],
      count: res.msg.count || 0,
      current: page,
    });
    if (res.code === 200) {
      message.success(res.status);
    } else {
      message.info(res.status || JSON.stringify(res));
    }
  };
  useEffect(() => {
    fetchData(1, 20);
  }, []);

  const initColumns = [
    {
      title: "序号",
      dataIndex: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "玩家ID",
      dataIndex: "id",
    },
    { title: "创建时间", dataIndex: "create_time", render: formateDate },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record) => {
        return (
          <>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => onDelete(record)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const onDelete = async (value) => {
    let res = await deleteBlackProxyUserList(value.id);
    if (res.code === 200) {
      message.success(res.status || "刪除成功");
      fetchData(1, 20);
    } else {
      message.info(res.status);
    }
  };

  const onSearchButtonHandled = async (value) => {
    if (!value) {
      message.info("请输入user_id");
      return;
    }
    fetchData(1, 20, value);
  };
  const onAddButtonHandled = () => {
    setis_modal_show(true);
  };
  const onSubmitHandled = async () => {
    const { user_id } = ref.current;
    if (!user_id) {
      message.info("请输入user_id");
      return;
    }
    let res;
    res = await addBlackProxyUserList(parseInt(user_id));
    if (res.code === 200) {
      message.success(res.status);
      fetchData(1, 20);
      setis_modal_show(false);
    } else {
      message.info(res.status || JSON.stringify(res));
    }
  };
  return (
    <Card
      title={
        <div>
          <Input.Search
            type="number"
            style={{ width: 200 }}
            placeholder="请输入user_id"
            enterButton
            onSearch={(value) => onSearchButtonHandled(value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => onAddButtonHandled()}>
            添加
          </Button>
        </div>
      }
      extra={
        <Button
          type="primary"
          style={{ float: "right" }}
          onClick={() => fetchData(1, 20)}
          icon="reload"
          size="default"
        />
      }
    >
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={table.data}
        columns={initColumns}
        size="small"
        pagination={{
          defaultPageSize: 20,
          // showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `共${total}条`,
          current: table.current,
          total: table.count,
          onChange: (page, pageSize) => {
            fetchData(page, pageSize);
          },
        }}
        scroll={{ x: "max-content" }}
      />
      {is_modal_show && (
        <Modal
          title={"添加"}
          visible={is_modal_show}
          onCancel={() => setis_modal_show(false)}
          footer={null}
          maskClosable={false}
        >
          <span
            style={{
              width: 80,
              display: "inline-block",
              textAlign: "right",
              paddingRight: 20,
            }}
          >
            玩家ID :
          </span>
          <Input
            type="text"
            style={{ width: "80%" }}
            placeholder="请输入USER_ID"
            defaultValue={ref.current.user_id}
            onChange={(e) => {
              ref.current.user_id = e.target.value;
            }}
          />
          <br />
          <br />
          <br />
          <div style={{ textAlign: "right", paddingRight: 10 }}>
            <Button type="primary" onClick={onSubmitHandled}>
              提交
            </Button>
          </div>
        </Modal>
      )}
    </Card>
  );
};
