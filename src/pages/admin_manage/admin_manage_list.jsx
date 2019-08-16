import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input } from "antd";
import "moment/locale/zh-cn";
import WrappedAddDataForm from "./addData";
import LinkButton from "../../components/link-button/index";
import {
  reqAdminList,
  searchAdminData,
  roleList,
  packageList
} from "../../api/index";
import { log, callbackify } from "util";

class Admin_manage_list extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isAddDataShow: false,
      isGoldShow: false,
      game_nick: "",
      startTime: "",
      endTime: "",
      inputParam: ""
    };
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
      width: 100,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
      //   onCell: (record, rowIndex) => {
      //     return {
      //       onClick: event => {
      //         this.game_nick = record.game_nick;
      //         this.id = record.id;
      //         this.rowIndex = rowIndex;
      //         this.setState({
      //           isNickShow: true
      //         });
      //       }, // 点击行
      //       onDoubleClick: event => {},
      //       onContextMenu: event => {},
      //       onMouseEnter: event => {
      //         event.target.style.cursor = "pointer";
      //       }, // 鼠标移入行
      //       onMouseLeave: event => {}
      //     };
      //   }
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
        return item.name;
      });
      console.log(this.packageList);

      // this.packageList = result.data;
      this.setState({
        isAddDataShow: true
      });
    }
  };
  edit(record) {}
  resetAuthCode(record) {}
  componentWillMount() {
    this.initColumns();
  }
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
            }
          }}
          scroll={{ x: 1400, y: 550 }}
        />
        <Modal
          title="添加用户"
          visible={this.state.isAddDataShow}
          onOk={this.handleAddData}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          // footer={null}
        >
          <WrappedAddDataForm
            ref="getFormValue"
            optionList={this.optionList}
            packageList={this.packageList}
            cancel={this.state.isAddDataShow}
          />
        </Modal>
      </Card>
    );
  }
}

export default Admin_manage_list;
