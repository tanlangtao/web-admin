import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input } from "antd";
import "moment/locale/zh-cn";
import WrappedAddDataForm from "./addData";
import LinkButton from "../../../components/link-button/index";
import {
  reqAdminList,
  searchAdminData,
  roleList,
  packageList,
  resetAuthCode
} from "../../../api/index";

class Admin_manage_list extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isAddDataShow: false,
      isEditDataShow: false
    };
    this.initColumns();
  }
  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "id",
      fixed: "left",
      width: 80
    },
    {
      title: "用户名",
      dataIndex: "name",
      fixed: "left",
      width: 150,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "角色",
      dataIndex: "role_name",
      width: 200
    },
    {
      title: "授权品牌",
      dataIndex: "group",
      width: 100
    },
    {
      title: "授权代理",
      dataIndex: "proxy",
      width: 100
    },
    {
      title: "可使用金额",
      dataIndex: "use_balance",
      width: 150
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 180,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      width: 180,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      //   width: 80,
      align: "center",
      render: (text, record, index) => (
        <span>{text === 1 ? "启用" : "禁用"}</span>
      )
    },
    {
      title: "操作",
      dataIndex: "handle",
      width: 200,
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
          <LinkButton onClick={() => this.resetAuthCode(record)}>
            AuthCode重置
          </LinkButton>
        </span>
      )
    }
  ];

  getUsers = async (page, limit) => {
    const result = await reqAdminList(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: result.count
      });
    } else {
      message.error("网络问题");
    }
  };
  handleChange(event) {
    this.setState({ inputParam: event.target.value });
  }
  onSearchData = async () => {
    const result = await searchAdminData(this.state.inputParam);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: 1
      });
    }
  };
  addData = async () => {
    const res = await roleList();
    const result = await packageList();
    if (res.status === 0 && result.status === 0) {
      this.optionList = res.data;
      this.packageList = result.data.map(item => {
        return { label: item.name, value: item.id };
      });
      this.setState({
        isAddDataShow: true
      });
    }
  };
  edit = async record => {
    console.log(record);
    this.editDataRecord = record;
    const res = await roleList();
    const result = await packageList();
    if (res.status === 0 && result.status === 0) {
      this.optionList = res.data;
      this.packageList = result.data.map(item => {
        return { label: item.name, value: item.id };
      });
      this.setState({
        isEditDataShow: true
      });
    }
  };
  resetAuthCode = record => {
    Modal.confirm({
      title: "信息",
      content: "真的要重置么?",
      async onOk() {
        const res = await resetAuthCode(record.id);
        if (res.status === 0) {
          message.success(res.msg);
        } else {
          message.success(res.msg);
        }
      }
    });
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <span>
            <Input
              type="text"
              placeholder="请输入用户名"
              style={{ width: 150 }}
              value={this.state.inputParam}
              onChange={this.handleChange}
            />
            &nbsp; &nbsp;
            <button onClick={this.onSearchData}>
              <Icon type="search" />
            </button>
            &nbsp; &nbsp;
            <button onClick={this.addData}>
              <Icon type="user-add" />
              添加账户
            </button>
          </span>
        }
        extra={
          <button onClick={() => this.getUsers(1, 20)}>
            <Icon type="reload" />
          </button>
        }
      >
        <Table
          bordered
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
              this.setState({
                pageSize: pageSize
              });
            },
            onShowSizeChange: (current, size) => {
              this.getUsers(current, size);
            }
          }}
          scroll={{ x: 1500, y: 600 }}
        />
        <Modal
          title="添加用户"
          visible={this.state.isAddDataShow}
          // onOk={this.handleAddData}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          footer={null}
        >
          <WrappedAddDataForm
            optionList={this.optionList}
            packageList={this.packageList}
            cancel={() =>
              this.setState({
                isAddDataShow: false
              })
            }
            refreshPage={() => this.getUsers(1, 20)}
          />
        </Modal>
        {this.state.isEditDataShow && (
          <Modal
            title="编辑用户"
            visible={this.state.isEditDataShow}
            // onOk={this.handleAddData}
            onCancel={() => {
              this.setState({ isEditDataShow: false });
            }}
            footer={null}
          >
            <WrappedAddDataForm
              isEdit="true"
              optionList={this.optionList}
              packageList={this.packageList}
              editDataRecord={this.editDataRecord}
              cancel={() =>
                this.setState({
                  isEditDataShow: false
                })
              }
              refreshPage={() => this.getUsers(1, 20)}
            />
          </Modal>
        )}
      </Card>
    );
  }
}

export default Admin_manage_list;
