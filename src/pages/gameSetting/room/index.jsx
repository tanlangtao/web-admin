import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Select,
  Button,
  Form
} from "antd";
import { ruleList, addRule, ruleDel } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";

class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      isEditFormShow: false
    };
  }
  getInitialData = async () => {
    const res = await ruleList();
    if (res.status === 0) {
      this.setState({
        data: res.data&&res.data.list,
        count: parseInt(res.data&&res.data.count)
      });
    } else {
      message.error(res.msg);
    }
  };
  componentDidMount() {
    this.getInitialData();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const packageNode = this.state.data.map(item => {
      return (
        <Select.Option value={item.id} key={item.name}>
          {item.name.replace(/&nbsp;/g, "-")}
        </Select.Option>
      );
    });
    return (
      <Card
        title={
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator("pid", {
                  rules: [{ required: true, message: "请选择权限" }],
                  initialValue: "0"
                })(
                  <Select style={{ width: 200 }}>
                    <Select.Option value="0">一级权限</Select.Option>
                    {packageNode}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "请输入菜单名" }]
                })(<Input style={{ width: 120 }} placeholder="菜单名" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("module", {})(
                  <Input style={{ width: 120 }} placeholder="模块名" />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("action", {})(
                  <Input style={{ width: 120 }} placeholder="方法名" />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("href", {})(
                  <Input style={{ width: 120 }} placeholder="模板路径" />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("key", {})(
                  <Input style={{ width: 120 }} placeholder="路由key" />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("icon", {})(
                  <Input style={{ width: 120 }} placeholder="icon样式" />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("sort", {
                  rules: [{ required: true, message: "请输入排序值" }]
                })(<Input style={{ width: 120 }} placeholder="菜单排序" />)}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  增加
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()}>
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
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.getInitialData(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.getInitialData(current, size);
            }
          }}
        />
        {this.state.isEditFormShow && (
          <Modal
            title="编辑"
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
          >
            <WrappedEditForm
              finished={() => {
                this.getInitialData();
                this.setState({ isEditFormShow: false });
              }}
              packageNode={packageNode}
              data={this.editDataRecord}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "菜单名",
      dataIndex: "name",
      render: (text, record, index) => (
        <span>{record.name.replace(/&nbsp;/g, "-")}</span>
      )
    },
    {
      title: "模块名",
      dataIndex: "module"
    },
    {
      title: "方法名",
      dataIndex: "action"
    },
    {
      title: "模板路径",
      dataIndex: "href"
    },
    {
      title: "路由key",
      dataIndex: "router_key"
    },
    {
      title: "icon样式",
      dataIndex: "icon"
    },
    {
      title: "显示",
      dataIndex: "status"
    },
    {
      title: "菜单排序",
      dataIndex: "sort"
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button type="primary" onClick={() => this.edit(record)} size="small">
            编辑
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.onDelete(record)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </span>
      )
    }
  ];
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await addRule(value);
        if (res.status === 0) {
          message.success("提交成功");
          this.getInitialData();
          this.props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      }
    });
  };
  onDelete = async record => {
    let res = await ruleDel(record.id);
    if (res.status === 0) {
      message.success("删除成功");
      this.getInitialData();
    } else {
      message.error("出错了：" + res.msg);
    }
  };
  edit = async record => {
    this.editDataRecord = record;
    this.setState({
      isEditFormShow: true
    });
  };
}
const RuleManage = Form.create()(Rule);
export default RuleManage;
