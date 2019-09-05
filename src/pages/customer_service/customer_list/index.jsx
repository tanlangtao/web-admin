import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input,Popconfirm } from "antd";
import LinkButton from "../../../components/link-button/index";
import { customerList, saveCustomerService } from "../../../api/index";
import WrappedAddDataForm from "./addorEdit";
import { formateDate } from "../../../utils/dateUtils";

class Customer_list extends Component {
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
  getUsers = async (page, limit) => {
    const result = await customerList(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: result.count
      });
    } else {
      message.error("网络问题");
    }
  };
  onSearchData = async () => {
    const res = await customerList(1, 20, this.input.input.value);
    if (res.status === 0) {
      this.setState({
        data: res.data,
        count: parseInt(res.count)
      });
    } 
  };
  addData = () => {
    this.setState({
      isAddDataShow: true
    });
  };
  edit = async record => {
    this.editDataRecord = record;
    this.setState({
      isEditDataShow: true
    });
  };
  onDelete = async record => {
    let user_id=record.user_id
    let res = await saveCustomerService({user_id},"del");
    if (res.status === 0) {
      message.success("删除成功");
      this.refreshPage();
    } else {
      message.error("出错了：" + res.msg);
    }
  };
  refreshPage = () => {
    this.setState({
      data: [],
      count: 0,
      pageSize: 20,
      isAddDataShow: false,
      isEditDataShow: false
    });
    this.getUsers(1, 20);
    this.input.handleReset()
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
              placeholder="请输入支付名称"
              style={{ width: 150 }}
              ref={input => (this.input = input)}
            />
            &nbsp; &nbsp;
            <button onClick={this.onSearchData}>
              <Icon type="search" />
            </button>
            &nbsp; &nbsp;
            <button onClick={this.addData}>
              <Icon type="user-add" />
              添加
            </button>
          </span>
        }
        extra={
          <button onClick={this.refreshPage}>
            <Icon type="reload" />
          </button>
        }
      >
        <Table
          bordered
          rowKey="user_id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
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
          scroll={{ x: 1200, y: "60vh" }}
        />
        <Modal
          title="新增"
          visible={this.state.isAddDataShow}
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
      title: "账号",
      dataIndex: "user_id",
      width: 150
    },
    {
      title: "昵称",
      dataIndex: "nick_name",
      width: 150
    },
    {
      title: "品牌ID",
      dataIndex: "package_ids",
      width: 100
    },
    {
      title: "是否显示",
      dataIndex: "status",
      width: 100,
      render: (text, record) => (text === 1 ? "是" : "否")
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: 100
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: 200,
      render: formateDate
    },
    {
      title: "修改时间",
      dataIndex: "update_time",
      width: 200,
      render: formateDate
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
          <LinkButton>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={()=>this.onDelete(record)}
              okText="删除"
              cancelText="取消"
            >
              删除
            </Popconfirm>
          </LinkButton>
        </span>
      )
    }
  ];
}

export default Customer_list;
