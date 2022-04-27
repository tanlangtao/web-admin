import React, { Component } from "react";
import { Card, Table, Modal, Icon } from "antd";
import WrappedAddDataForm from "./addData";
import LinkButton from "../../../components/link-button/index";
import { getRoleList } from "../../../api/index";

class Role extends Component {
  constructor(props) {
    super(props);
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
      title: "id",
      dataIndex: "id",
      width: 80
    },
    {
      title: "角色名",
      dataIndex: "name",
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "描述",
      dataIndex: "description"
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      render: (text, record, index) => (
        <span>{text === 1 ? "已启用" : "禁用"}</span>
      )
    },
    {
      title: "操作",
      dataIndex: "handle",
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
        </span>
      )
    }
  ];
  getUsers = async (page, limit) => {
    const result = await getRoleList(page, limit);
    if (result.data) {
      this.setState({
        data: result.data&&result.data.list,
        count: parseInt(result.data&&result.data.count)
      });
    }
  };
  addData = async () => {
    //getRuleList的请求/acl/ruleList返回的不是树状结构的数据，所以使用缓存在本地navlist返回的menulist
    // const res = await getRuleList();
    // if (res.status === 0) {
    //   this.ruleList = res.data;
    this.setState({
      isAddDataShow: true
    });
    // }
  };
  edit = async record => {
    // console.log(record);
    this.editDataRecord = record;
    this.setState({
      isEditDataShow: true
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
            <LinkButton onClick={this.addData} size="default">
              <Icon type="user-add" />
              添加账户
            </LinkButton>
          </span>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()} size="default">
            <Icon type="reload" />
          </LinkButton>
        }
      >
        <Table
          bordered
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
            }
          }}
          // scroll={{ x: 1500, y: 550 }}
        />
        <Modal
          title="添加角色"
          visible={this.state.isAddDataShow}
          // onOk={this.handleAddData}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          footer={null}
        >
          <WrappedAddDataForm
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

export default Role;
