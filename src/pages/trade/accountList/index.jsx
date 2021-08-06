import React, { Component } from "react";
import { Card, Table, Modal, message,  Input, Select } from "antd";
import { allAccountList, resetPassword, accountList } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";

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
    const res = await allAccountList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data&&res.data.list,
        count: parseInt(res.data&&res.data.count)
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
            <Select defaultValue="user_id" style={{ width: 150 }}>
              <Select.Option value="user_id">user_id</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入user_id"
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
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
            />
            {/* <br />
            <br />
            <LinkButton style={{ float: "right" }} onClick={this.download} icon="download">
            </LinkButton> */}
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
          // scroll={{ x: 1800 }}
        />
        {this.state.isEditFormShow && (
          <Modal
            title="绑定收付款账户详情"
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            width="60%"
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
      title: "user_id",
      dataIndex: "user_id"
    },
    {
      title: "昵称",
      dataIndex: "user_name"
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick"
    },
    {
      title: "所属代理",
      dataIndex: "proxy_user_id"
    },
    {
      title: "资金密码操作",
      dataIndex: "",
      render: (text, record) => (
        <LinkButton
          size="small"
          onClick={() => {
            this.resetPassword(record);
          }}
        >
          重置
        </LinkButton>
      )
    },
    {
      title: "绑定账号",
      dataIndex: "",
      render: (text, record) => (
        <LinkButton
          size="small"
          onClick={() => {
            this.checkAccount(record);
          }}
        >
          查看
        </LinkButton>
      )
    }
  ];
  onSearch = async () => {
    let value = {
      user_id: this.input.input.value
    };
    const res = await allAccountList(
      this.state.page,
      this.state.pageSize,
      value
    );
    this.setState({ data: res.data, count: parseInt(res.count) });
  };
  resetPassword = async record => {
    const res = await resetPassword(record.user_id);
    if (res.status === 0) {
      message.success(res.msg);
    } else {
      message.info(res.msg);
    }
  };
  checkAccount = async record => {
    const res = await accountList(record.user_id);
    this.editDataRecord = res.data;
    if (res.status !== 0) {
      message.info(res.msg);
    }
    this.setState({ isEditFormShow: true });
  };
  // download=async()=>{

  // }
}
export default AccountList;
