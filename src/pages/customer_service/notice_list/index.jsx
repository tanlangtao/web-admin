import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Button, Popover, Popconfirm } from "antd";
import LinkButton from "../../../components/link-button/index";
import { getNoticeList, delNotice } from "../../../api/index";
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
  }
  fetchNoticeList = async (page, limit) => {
    const result = await getNoticeList(page, limit);
    if (result.data) {
      let newData = JSON.parse(result.data)
      this.setState({
        data: newData,
        count: newData.length
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
    let res = await delNotice(record._id);
    if (res.status === 0) {
      message.success("删除成功");
      this.refreshPage();
    } else {
      message.info("出错了：" + res.msg);
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
    this.fetchNoticeList();
  };
  componentDidMount() {
    this.fetchNoticeList();
  }
  render() {
    return (
      <Card
        title={
          <span>
            <LinkButton onClick={this.addData} size="default">
              添加
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
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
          }}
          scroll={{ x: "max-content" }}
        />
        <Modal
          title="新增公告"
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
              refreshPage={() => this.fetchNoticeList()}
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
    },
    {
      title: "品牌",
      dataIndex: "package_ids",
      render: (text, record) => <span>{text.join(",")}</span>
    },
    {
      title: "代理",
      dataIndex: "proxy_user_id"
    },
    {
      title: "公告类型",
      dataIndex: "type",
      render: (text, record) => (
        <span>{text === "1" || text === 1 ? "活动" : "公告"}</span>
      )
    },
    {
      title: "是否跑马灯",
      dataIndex: "is_slider",
      // eslint-disable-next-line
      render: (text, record) => <span>{text == 1 ? "是" : "否"}</span>
    },
    {
      title: "公告内容",
      dataIndex: "words",
      render: (text, record) => (
        <Popover content={text} trigger="click" overlayStyle={{ width: "30%" }}>
          <div
            style={{
              width: "170px",
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
          onClick: event => { }, // 点击行
          onDoubleClick: event => { },
          onContextMenu: event => { },
          onMouseEnter: event => {
            event.target.style.cursor = "pointer";
          }, // 鼠标移入行
          onMouseLeave: event => { }
        };
      }
    },
    {
      title: "开始时间",
      dataIndex: "start_time",
      render: formateDate,
    },
    {
      title: "截止时间",
      dataIndex: "end_time",
      render: formateDate,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: formateDate,
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button type="primary" onClick={() => this.edit(record)} size="small">
            编辑
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.onDelete(record)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </span>
      )
    }
  ];
}

export default Notice_list;
