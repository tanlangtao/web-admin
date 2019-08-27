import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popover,
  Popconfirm
} from "antd";
import LinkButton from "../../../components/link-button/index";
import { getList, packageList, addNotice, delNotice } from "../../../api/index";
import WrappedAddDataForm from "./addorEdit";
import { formateDate } from "../../../utils/dateUtils";

class Notice_list extends Component {
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
    const result = await getList(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: result.count
      });
    } else {
      message.error("网络问题");
    }
  };
  // onSearchData = async () => {
  //   const res = await getChannelList(1, 20, this.state.inputParam);
  //   if (res.status === 0) {
  //     this.setState({
  //       data: res.data,
  //       count: parseInt(res.count)
  //     });
  //   } else {
  //     message.error("网络问题");
  //   }
  // };
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
    let res = await delNotice(record._id.$oid);
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
            <button onClick={this.addData}>添加</button>
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
          rowKey={record => record._id.$oid}
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
          scroll={{ x: 1700, y: 600 }}
        />
        <Modal
          title="新增公告"
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
      title: "标题",
      dataIndex: "title",
      width: 300
    },
    {
      title: "品牌",
      dataIndex: "package_ids",
      width: 120,
      render: (text, record) => <span>{text.join(",")}</span>
    },
    {
      title: "代理",
      dataIndex: "proxy_user_id",
      width: 100
    },
    {
      title: "公告类型",
      dataIndex: "type",
      width: 120,
      render: (text, record) => (
        <span>{text === "1" || text === 1 ? "活动" : "公告"}</span>
      )
    },
    {
      title: "是否跑马灯",
      dataIndex: "is_slider",
      width: 120,
      render: (text, record) => <span>{text === "1" ? "是" : "否"}</span>
    },
    {
      title: "公告内容",
      dataIndex: "words",
      width: 300,
      render: (text, record) => (
        <Popover content={text} trigger="click" overlayStyle={{ width: "60%" }}>
          <div
            style={{
              width: 250,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
          >
            {text}
          </div>
        </Popover>
      ),
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {}, // 点击行
          onDoubleClick: event => {},
          onContextMenu: event => {},
          onMouseEnter: event => {
            event.target.style.cursor = "pointer";
          }, // 鼠标移入行
          onMouseLeave: event => {}
        };
      }
    },
    {
      title: "开始时间",
      dataIndex: "start_time",
      width: 150,
      render: formateDate
    },
    {
      title: "截止时间",
      dataIndex: "end_time",
      width: 150,
      render: formateDate
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: 150,
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

export default Notice_list;
