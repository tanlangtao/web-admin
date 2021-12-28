import React, { Component } from "react";
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
import { getGamelistInfo, updateGamelistInfo } from "../../../../api/index";
import LinkButton from "../../../../components/link-button";

class GamelistInfoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      isEditFormShow: false,
    };
  }
  getInitialData = async () => {
    const res = await getGamelistInfo();
    if (res.code === 0) {
      this.setState({
        data: res.data,
      });
    } else {
      message.info(res.msg);
    }
  };
  componentDidMount() {
    this.getInitialData();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card
        title={
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
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
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: 30,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
          }}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "游戏识别码",
      dataIndex: "type",
    },
    {
      title: "状态",
      dataIndex: "isclose",
      render: (text, record) => {
        if (text) {
          return "开启";
        } else {
          return "维护";
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
            onConfirm={() => this.onEdit(record)}
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
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await getGamelistInfo(value);
        if (res.code === 0) {
          message.success(res.msg);
          this.setState({
            data: res.data.length > 0 ? res.data : [res.data],
          });
          this.props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  };
  onEdit = async (record) => {
    let reqData = {
      type: record.type,
      isClose: !record.isclose,
    };
    let res = await updateGamelistInfo(reqData);
    if (res.code === 0) {
      message.success(res.msg);
      this.getInitialData();
    } else {
      message.info("出错了：" + res.msg);
    }
  };
}
const GamelistInfo = Form.create()(GamelistInfoList);
export default GamelistInfo;
