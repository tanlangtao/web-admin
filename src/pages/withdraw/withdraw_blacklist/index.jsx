import React, { useRef, useState, useEffect } from "react";

import { Table, message, Card, Input, Button, Modal } from "antd";

import { withdrawBlack } from "../../../api";
import { formateDate } from "../../../utils/dateUtils";
import LinkButton from "../../../components/link-button/index";

export default () => {
  const [table, setTable] = useState({ data: [], count: 0, current: 1 });
  const [is_modal_show, setis_modal_show] = useState(false);
  const [is_history_show, setis_history_show] = useState(false);
  const ref = useRef({});
  const fetchData = async (page, limit, user_id) => {
    const res = await withdrawBlack("getWithdrawBlack", {
      page,
      limit,
      user_id,
    });
    setTable({
      data: res.data.list || [],
      count: res.data.count || 0,
      current: page,
    });
    if (res.status === 0) {
      message.success(res.msg);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };
  useEffect(() => {
    fetchData(1, 20);
  }, []);

  const initColumns = [
    {
      title: "user_id",
      dataIndex: "user_id",
    },
    {
      title: "备注",
      dataIndex: "reason",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) =>
        text === 0 ? "取消封号" : text === 1 ? "封号中" : text,
    },
    // {
    //     title: "操作账号",
    //     dataIndex: "last_upd_user",
    // },
    {
      title: "建立时间",
      dataIndex: "created_at",
      render: formateDate,
    },

    {
      title: "调整时间",
      dataIndex: "updated_at",
      render: formateDate,
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record) => {
        return (
          <>
            <LinkButton onClick={() => check_history(record)}>查看</LinkButton>
            <LinkButton onClick={() => onAddButtonHandled(2, record)}>
              备注编辑
            </LinkButton>
            <LinkButton onClick={() => onAddButtonHandled(3, record)}>
              更改状态
            </LinkButton>
          </>
        );
      },
    },
  ];
  const onSearchButtonHandled = async (value) => {
    if (!value) {
      message.info("请输入user_id");
      return;
    }
    ref.current.search_value = value;
    fetchData(1, 20, value);
  };
  const onAddButtonHandled = (buttonStatus, record) => {
    ref.current.buttonStatus = buttonStatus;
    ref.current.user_id = record?.user_id;
    ref.current.reason = record?.reason;
    ref.current.status = record?.status;
    ref.current.id = record?.id;
    switch (buttonStatus) {
      case 1:
        ref.current.modaltitle = "添加";
        break;
      case 2:
        ref.current.modaltitle = "编辑";
        break;
      case 3:
        ref.current.modaltitle = "更改状态";
        break;
      default:
        break;
    }
    console.log(ref.current);
    setis_modal_show(true);
  };
  const onSubmitHandled = async () => {
    const { user_id, reason, buttonStatus, id, status, search_value } =
      ref.current;
    if (!user_id) {
      message.info("请输入user_id");
      return;
    }
    let res;
    if (buttonStatus === 1) {
      res = await withdrawBlack(
        "addWithdrawBlack",
        { user_id: parseInt(user_id), reason },
        "POST"
      );
    } else {
      res = await withdrawBlack(
        "updWithdrawBlack",
        { id, reason, status: buttonStatus === 2 ? status : 1 - status },
        "POST"
      );
    }
    if (res.status === 0) {
      message.success(res.msg);
      fetchData(1, 20, search_value);
      setis_modal_show(false);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };
  const check_history = async (record) => {
    const res = await withdrawBlack("getWithdrawBlackLog", {
      black_id: record.id,
    });
    if (res.status === 0) {
      message.success(res.msg);
      ref.current.historyData = res.data;
      setis_history_show(true);
    } else {
      message.info(res.msg || JSON.stringify(res));
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
          <Button type="primary" onClick={() => onAddButtonHandled(1)}>
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
          title={ref.current.modaltitle}
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
            USER_ID:
          </span>
          <Input
            type="text"
            style={{ width: "80%" }}
            placeholder="请输入USER_ID"
            defaultValue={
              ref.current.buttonStatus !== 1 ? ref.current.user_id : ""
            }
            disabled={ref.current.buttonStatus !== 1}
            onChange={(e) => {
              ref.current.user_id = e.target.value;
            }}
          />
          <br />
          <br />
          <span
            style={{
              width: 80,
              display: "inline-block",
              textAlign: "right",
              paddingRight: 20,
            }}
          >
            备注:
          </span>
          <Input.TextArea
            type="text"
            style={{ width: "80%" }}
            maxLength="28"
            autoSize={{ minRows: 2, maxRows: 5 }}
            placeholder="请输入备注"
            defaultValue={
              ref.current.buttonStatus !== 1 ? ref.current.reason : ""
            }
            onChange={(e) => {
              ref.current.reason = e.target.value;
            }}
          />
          <br />
          <br />
          <span
            style={{
              textIndent: 30,
              display: ref.current.buttonStatus === 3 ? "block" : "none",
            }}
          >
            状态:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {ref.current.status === 0 ? "取消封号" : "封号中"}
          </span>

          <div style={{ textAlign: "right", paddingRight: 10 }}>
            <Button type="primary" onClick={onSubmitHandled}>
              {ref.current.buttonStatus !== 3 ? "提交" : "变更状态"}
            </Button>
          </div>
        </Modal>
      )}
      {is_history_show && (
        <Modal
          title="操控详情"
          visible={is_history_show}
          onCancel={() => setis_history_show(false)}
          footer={null}
          maskClosable={false}
        >
          <Table
            bordered
            rowKey={(record, index) => `${index}`}
            dataSource={ref.current.historyData || []}
            columns={[
              {
                title: "操作人",
                dataIndex: "upd_user",
              },
              {
                title: "操作",
                dataIndex: "do_what",
              },
              {
                title: "操作时间",
                dataIndex: "updated_at",
                render: formateDate,
              },
            ]}
            size="small"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Modal>
      )}
    </Card>
  );
};
