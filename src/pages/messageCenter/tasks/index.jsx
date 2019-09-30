import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Button,
  Select
} from "antd";
import { tasksList, saveConf } from "../../../api/index";
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
      isEditFormShow: false
    };
  }
  getInitialData = async (page, limit) => {
    const res = await tasksList(page, limit);
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
            <MyDatePicker
              handleValue={val => {
                this.start_time = val[0];
                this.end_time = val[1];
              }}
            ></MyDatePicker>
            &nbsp;&nbsp;&nbsp;
            <Select
              placeholder="任务状态"
              style={{ width: 150 }}
              onChange={value => (this.status = value)}
            >
              <Select.Option value="0">待操作</Select.Option>
              <Select.Option value="1">已复审</Select.Option>
              <Select.Option value="2">复审拒绝</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入创建人昵称"
              ref={Input => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              type="primary"
              onClick={this.onSearch}
              icon="search"
            ></LinkButton>
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
          scroll={{ x: 1800 }}
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
      title: "任务ID",
      dataIndex: "id"
    },
    {
      title: "任务信息",
      dataIndex: "params",
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "任务来源",
      dataIndex: "task_type",
      render: (text, record, index) => (
        <span>{text === 0 ? "用户列表资金变动" : "代理配置列表资金变动"}</span>
      )
    },
    {
      title: "创建人昵称",
      dataIndex: "operator_nick",
      width: 150
    },
    {
      title: "复审人昵称",
      dataIndex: "review_nick"
    },
    {
      title: "创建时间",
      dataIndex: "created_at"
    },
    {
      title: "更新时间",
      dataIndex: "updated_at"
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
                <LinkButton size="small" onClick={()=>this.review(record)}>
                  复审
                </LinkButton>
                <LinkButton size="small" type="danger" onClick={()=>this.refuse(record)}>
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
      }
    }
  ];
  onSearch = async () => {
    let value = {
      end_time: this.start_time || "",
      start_time: this.start_time || "",
      status: this.status || "",
      operator_nick: this.input.input.value || ""
    };
    const res = await tasksList(this.state.page, this.state.pageSize, value);
    this.setState({ data: res.data, count: res.count });
  };
  review=async (record)=>{
   this.action="review"
   this.editDataRecord=record
   this.setState({ isEditFormShow: true });
  }
  refuse=async(record)=>{
    this.action="refuse"
    this.editDataRecord=record
    this.setState({ isEditFormShow: true });
  }
}
export default Tasks;