import React, { Component } from "react";
import { Card, Table, Modal, Icon, Input, Select } from "antd";
import { sellGoldOrderList } from "../../../api/index";
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
    const res = await sellGoldOrderList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data&&res.data.list,
        count: parseInt(res.data&&res.data.count)
      });
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
              handleValue={(data,val) => {
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
      title: "订单ID",
      dataIndex: ""
    },
    {
      title: "ID",
      dataIndex: ""
    },
    {
      title: "买家ID",
      dataIndex: ""
    },
    {
      title: "买家昵称",
      dataIndex: ""
    },
    {
      title: "卖家ID",
      dataIndex: ""
    },
    {
      title: "卖家昵称",
      dataIndex: ""
    },
    {
      title: "所属品牌",
      dataIndex: ""
    },
    {
      title: "所属代理",
      dataIndex: ""
    },
    {
      title: "兑换单价",
      dataIndex: ""
    },
    {
      title: "支付金额",
      dataIndex: ""
    },
    {
      title: "兑换金额",
      dataIndex: ""
    },
    {
      title: "到账金额",
      dataIndex: ""
    },
    {
      title: "状态",
      dataIndex: ""
    },
    {
      title: "创建时间",
      dataIndex: ""
    },
    {
      title: "完成时间",
      dataIndex: ""
    }
  ];
  // onSearch = async () => {
  //   let value = {
  //     end_time: this.start_time || "",
  //     start_time: this.start_time || "",
  //     status: this.status || "",
  //     operator_nick: this.input.input.value || ""
  //   };
  //   const res = await tasksList(this.state.page, this.state.pageSize, value);
  //   this.setState({ data: res.data, count: res.count });
  // };
  review = async record => {
    this.action = "review";
    this.editDataRecord = record;
    this.setState({ isEditFormShow: true });
  };
  refuse = async record => {
    this.action = "refuse";
    this.editDataRecord = record;
    this.setState({ isEditFormShow: true });
  };
}
export default Tasks;
