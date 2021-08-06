import React, { Component } from "react";
import { Card, Table, Modal, message, Input, Popconfirm } from "antd";
import { giftVoucherList, delActivityConfig } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import WrappedEditForm from "./editForm";

class AccountList extends Component {
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
    const res = await giftVoucherList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data && res.data&&res.data.list,
        count: parseInt(res.data&&res.data.count)
      });
    } else {
      message.info("未检索到数据");
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
					handleValue={(data, dateString) => {
						this.setState({
							start_time: dateString[0],
							end_time: dateString[1],
							MyDatePickerValue:data
						});
					}}
					value={this.state.MyDatePickerValue}
				/>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入活动id"
              ref={Input => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              onClick={this.onSearch}
              icon="search"
              size="default"
            ></LinkButton>
            &nbsp;&nbsp;&nbsp;
            <LinkButton onClick={this.add} size="default">
              添加
            </LinkButton>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
              size="default"
            />
          </span>
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
        />
        {this.state.isEditFormShow && (
          <Modal
            title={this.action === "add" ? "添加" : "编辑"}
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
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "领取人ID",
      dataIndex: ""
    },
    {
      title: "领取人昵称",
      dataIndex: ""
    },
    {
      title: "代理ID",
      dataIndex: "",
      render: text => <span>{text === "1" ? "关闭" : "开启"}</span>
    },
    {
      title: "code",
      dataIndex: "",
      render: text => <span>{text === "1" ? "是" : "否"}</span>
    },
    {
      title: "领取金额",
      dataIndex: "",
      render: text => <span>{text === "1" ? "是" : "否"}</span>
    },
    {
      title: "创建时间",
      dataIndex: "",
      width: 200
    },
    {
      title: "领取时间",
      dataIndex: "order_by"
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record) => (
        <span>
          <LinkButton
            size="small"
            onClick={() => {
              this.edit(record);
            }}
          >
            编辑
          </LinkButton>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.delete(record)}
            okText="删除"
            cancelText="取消"
          >
            <LinkButton type="danger" size="small">
              删除
            </LinkButton>
          </Popconfirm>
        </span>
      )
    }
  ];
  onSearch = async () => {
    let value = {
      user_id: this.input.input.value
    };
    const res = await giftVoucherList(
      this.state.page,
      this.state.pageSize,
      value
    );
    this.setState({ data: res.data, count: parseInt(res.count) });
  };
  add = async record => {
    this.action = "add";
    this.setState({ isEditFormShow: true });
  };
  edit = async record => {
    this.action = "edit";
    this.editDataRecord = record;
    this.setState({ isEditFormShow: true });
  };
  delete = async record => {
    const res = await delActivityConfig(record.id);
    if (res.status === 0) {
      message.success(res.msg);
    } else {
      message.info(res.msg);
    }
    this.getInitialData(1, 20);
  };
}
export default AccountList;
