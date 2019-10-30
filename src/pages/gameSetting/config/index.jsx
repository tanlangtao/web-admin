import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Button
} from "antd";
import { configList, saveConf } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";
import { formateDate } from "../../../utils/dateUtils";

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20,
      isEditFormShow: false
    };
  }
  getInitialData = async (page, limit) => {
    const res = await configList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data,
        count: res.count
      });
    } else {
      message.error(res.msg);
    }
  };
  componentDidMount() {
    this.getInitialData(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Input
              style={{ width: 120 }}
              placeholder="请输入配置Key"
              ref={Input => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              size="default"
              type="primary"
              onClick={this.onSearch}
              icon="search"
            ></LinkButton>
            &nbsp;&nbsp;&nbsp;
            <LinkButton type="primary" onClick={this.onAdd} size="default">
              添加
            </LinkButton>
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
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.setState({
                page: page
              });
              this.getInitialData(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size
              });
              this.getInitialData(current, size);
            }
          }}
          // scroll={{ y: "100%" }}
        />
        {this.state.isEditFormShow && (
          <Modal
            title={this.action === "add" ? "添加配置" : "编辑配置"}
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
            width="50%"
          >
            <WrappedEditForm
              finished={() => {
                this.getInitialData(this.state.page, this.state.pageSize);
                this.setState({ isEditFormShow: false });
              }}
              record={this.editDataRecord}
              action={this.action}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "配置名",
      dataIndex: "name"
    },
    {
      title: "配置Key",
      dataIndex: "conf_key"
    },
    {
      title: "配置值",
      dataIndex: "conf_val",
      width: 600
    },
    {
      title: "更新时间",
      dataIndex: "created_at",
      render: formateDate
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
  onSearch = async () => {
    let conf_key = this.input.input.value;
    const res = await configList(1, 20, conf_key);
    this.setState({ data: res.data, count: res.count });
  };
  onDelete = async record => {
    let res = await saveConf({ id: record.id }, "del");
    if (res.status === 0) {
      message.success("删除成功:" + res.msg);
      this.getInitialData(this.state.page, this.state.pageSize);
    } else {
      message.error("出错了：" + res.msg);
    }
  };
  onAdd = async () => {
    this.action = "add";
    this.setState({
      isEditFormShow: true
    });
  };
  edit = async record => {
    this.action = "edit";
    this.editDataRecord = record;
    this.setState({
      isEditFormShow: true
    });
  };
}
export default Config;
