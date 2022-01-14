import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  message,
  Icon,
  Input,
  Popconfirm,
  Button,
  Form,
} from "antd";
import { getGameListInfo, updateGameListInfo } from "../../../../api/index";
import LinkButton from "../../../../components/link-button";
import { thirdPartyGameRouter } from "../../../../utils/public_variable";

const GamelistInfoList = (props) => {
  const { getFieldDecorator } = props.form;
  const { game_id } = props
  const path = thirdPartyGameRouter[game_id].path
  const [data, setData] = useState([]);

  const getInitialData = async (path) => {
    const res = await getGameListInfo({}, path);
    if (res.code === 0) {
      setData(res.data);
    } else {
      message.info(res.msg);
    }
  };

  useEffect(() => {
    getInitialData(path);
  }, []);


  const initColumns = () => [
    {
      title: "游戏识别码",
      dataIndex: "type",
    },
    {
      title: "状态",
      dataIndex: "isclose",
      render: (text, record) => {
        if (text) {
          return "维护";
        } else {
          return "开启";
        }
      },
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Popconfirm
            title="确定要修改吗?"
            onConfirm={() => onEdit(record)}
            okText="修改"
            cancelText="取消"
          >
            <Button type="primary" size="small">
              修改
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await getGameListInfo(value, path);
        if (res.code === 0) {
          message.success(res.msg);
          setData(res.data.length > 1 ? res.data : [res.data]);
          props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  };
  const onEdit = async (record) => {
    let reqData = {
      type: record.type,
      isClose: !record.isclose,
      game_id
    };
    let res = await updateGameListInfo(reqData, path);
    if (res.code === 0) {
      message.success(res.msg);
      getInitialData(path);
    } else {
      message.info("出错了：" + res.msg);
    }
  };
  return (
    <Card
      title={
        <div>
          <Form layout="inline" onSubmit={handleSubmit}>
            <Form.Item>
              {getFieldDecorator("type", {
                rules: [{ required: false, message: "请输入游戏识别码 " }],
              })(<Input style={{ width: 120 }} placeholder="游戏识别码 " />)}
            </Form.Item>
            <Form.Item>
              <Button
                size="default"
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                <Icon type="search" />
              </Button>
            </Form.Item>
          </Form>
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
        dataSource={data}
        columns={initColumns()}
        size="small"
        pagination={{
          defaultPageSize: 30,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `共${total}条`,
          defaultCurrent: 1,
        }}
      />
    </Card>
  );
};

const GamelistInfo = Form.create()(GamelistInfoList);
export default GamelistInfo;
