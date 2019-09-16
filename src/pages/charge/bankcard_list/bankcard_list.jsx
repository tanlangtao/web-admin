import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input, Popconfirm } from "antd";
import LinkButton from "../../../components/link-button/index";
import { bankList, deleteBankCard } from "../../../api/index";
import WrappedAddDataForm from "./addorEdit";
import { formateDate } from "../../../utils/dateUtils";
class Bankcard_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isAddDataShow: false,
      isEditDataShow: false
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await bankList(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: result.count
      });
    } else {
      message.error("网络问题:" + result.msg);
    }
  };
  addData = () => {
    this.setState({
      isAddDataShow: true
    });
  };
  edit = async record => {
    // console.log(record);
    this.editDataRecord = record;
    this.setState({
      isEditDataShow: true
    });
  };
  delete = async record => {
    const result = await deleteBankCard(record.id);
    if (result.status === 0) {
      message.success(result.msg);
      this.refreshPage(1, 20);
    } else {
      message.error("网络问题:" + result.msg);
    }
  };
  refreshPage = () => {
    this.setState({
      data: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isAddDataShow: false,
      isEditDataShow: false
    });
    this.getUsers(1, 20);
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <span>
            <LinkButton onClick={this.addData}>
              <Icon type="user-add" />
              添加
            </LinkButton>
          </span>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()}>
            <Icon type="reload" />
          </LinkButton>
        }
      >
        <Table
          bordered
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal:(total, range) => `共${total}条`,
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
          scroll={{ x: 1000, y: "60vh" }}
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
            refreshPage={this.refreshPage}
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
              isEdit
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
  initColumns = () => [
    {
      title: "ID",
      dataIndex: "id",
      width: 50
    },
    {
      title: "卡使用类型",
      dataIndex: "type",
      width: 100,
      render: (text, record, index) => (
        <span>{text === "1" ? "收款卡" : "出款卡"}</span>
      )
    },
    {
      title: "银行卡号",
      dataIndex: "card_num",
      width: 200
    },
    {
      title: "开户人姓名",
      dataIndex: "card_name",
      width: 100,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      )
    },
    {
      title: "银行名称",
      dataIndex: "bank_name",
      width: 100
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (text, record, index) => (
        <span>{text === "1" ? "空闲" : text === "2" ? "使用中" : "停用"}</span>
      )
    },
    {
      title: "修改时间",
      dataIndex: "updated_at",
      width: 200,
      render: formateDate
    },
    {
      title: "操作",
      dataIndex: "",
      width: 150,
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
          <Popconfirm
            title="确定要删除吗"
            onConfirm={() => this.delete(record)}
            okText="删除"
            cancelText="取消"
          >
            <LinkButton>删除</LinkButton>
          </Popconfirm>
        </span>
      )
    }
  ];
}

export default Bankcard_list;
