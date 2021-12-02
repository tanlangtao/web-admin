import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input, Select } from "antd";
import { tasksList, reviewTask } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";
import MyDatePicker from "../../../components/MyDatePicker";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20,
      isEditFormShow: false,
      loading: false,
    };
  }
  getInitialData = async (page, limit) => {
    const res = await tasksList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data && res.data.list,
        count: parseInt(res.data && res.data.count),
      });
    } else {
      message.info(res.msg);
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
            <MyDatePicker
              handleValue={(data, val) => {
                this.start_time = val[0];
                this.end_time = val[1];
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Select
              placeholder="任务状态"
              style={{ width: 150 }}
              onChange={(value) => (this.status = value)}
            >
              {/* <Select.Option value="-1">全部</Select.Option> */}
              <Select.Option value="0">待操作</Select.Option>
              <Select.Option value="1">已复审</Select.Option>
              <Select.Option value="2">复审拒绝</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入创建人昵称"
              ref={(Input) => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              type="primary"
              onClick={this.onSearch}
              icon="search"
              size="default"
            />
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
              this.setState(
                {
                  page: page,
                },
                () => {
                  this.onSearch();
                }
              );
            },
            onShowSizeChange: (current, size) => {
              this.setState(
                {
                  pageSize: size,
                },
                () => {
                  this.onSearch();
                }
              );
            },
          }}
        />
        {this.state.isEditFormShow && (
          <Modal
            title={this.action === "review" ? "复审" : "拒绝"}
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
          >
            <WrappedEditForm
              finished={() => {
                this.getInitialData(this.state.page, this.state.pageSize);
              }}
              closepopup={() => this.setState({ isEditFormShow: false })}
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
      title: "任务ID",
      dataIndex: "id",
    },
    {
      title: "任务信息",
      dataIndex: "params",
      width: 500,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      ),
    },
    {
      title: "任务来源",
      dataIndex: "task_type",
      width: 150,
      render: (text, record, index) => (
        <span>
          {parseInt(text) === 0
            ? "用户列表资金变动"
            : parseInt(text) === 1
            ? "代理配置列表资金变动"
            : parseInt(text) === 2
            ? "用户重置密码"
            : parseInt(text) === 3
            ? "解绑用户绑定账户"
            : parseInt(text) === 4
            ? "安全码重置"
            : ""}
        </span>
      ),
    },
    {
      title: "创建人昵称",
      dataIndex: "operator_nick",
    },
    {
      title: "复审人昵称",
      dataIndex: "review_nick",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 200,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text.replace("T", " ").replace("+08:00", " ")}
        </div>
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      width: 200,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text.replace("T", " ").replace("+08:00", " ")}
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text, record, index) => {
        let res;
        switch (text) {
          case 0:
            res = (
              <div>
                <LinkButton
                  size="small"
                  onClick={() => this.review(record)}
                  loading={this.state.loading}
                >
                  复审
                </LinkButton>
                &nbsp;&nbsp;
                <LinkButton
                  size="small"
                  type="danger"
                  onClick={() => this.refuse(record)}
                  loading={this.state.loading}
                >
                  拒绝
                </LinkButton>
              </div>
            );
            break;
          case 1:
            res = <LinkButton size="small">已复审</LinkButton>;
            break;
          case 2:
            res = (
              <LinkButton size="small" type="danger">
                复审拒绝
              </LinkButton>
            );
            break;
          default:
            break;
        }
        return res;
      },
    },
  ];
  onSearch = async () => {
    let value = {
      start_time: this.start_time || "",
      end_time: this.end_time || "",
      // status: this.status || "",
      operator_nick: this.input.input.value || "",
    };
    if (this.status) {
      value.status = this.status;
    }
    const res = await tasksList(this.state.page, this.state.pageSize, value);
    this.setState({ data: res.data.list, count: res.data.count });
  };
  review = async (record) => {
    this.setState({ loading: true });
    if (
      record.task_type === 2 ||
      record.task_type === 3 ||
      record.task_type === 4
    ) {
      let value = {
        id: record.id,
        params: record.params,
        status: 1,
      };
      const res = await reviewTask(value);
      if (res.status === 0) {
        message.success("提交成功 : " + res.msg);
        this.onSearch();
      } else {
        message.info("出错了 : " + res.msg);
      }
    } else {
      this.action = "review";
      this.editDataRecord = record;
      this.setState({ isEditFormShow: true });
    }
    this.setState({ loading: false });
  };
  refuse = async (record) => {
    this.setState({ loading: true });
    if (
      record.task_type === 2 ||
      record.task_type === 3 ||
      record.task_type === 4
    ) {
      let value = {
        id: record.id,
        params: record.params,
        status: 2,
      };
      const res = await reviewTask(value);
      if (res.status === 0) {
        message.success("提交成功" + res.msg);
        this.onSearch();
      } else {
        message.info("出错了：" + res.msg);
      }
    } else {
      this.action = "refuse";
      this.editDataRecord = record;
      this.setState({ isEditFormShow: true });
    }
    this.setState({ loading: false });
  };
}
export default Tasks;
