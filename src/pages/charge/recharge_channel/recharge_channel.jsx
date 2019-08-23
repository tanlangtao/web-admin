import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Select,
  ConfigProvider,
  DatePicker,
  Button,
  Dropdown,
  Badge,
  Menu
} from "antd";
import LinkButton from "../../../components/link-button/index";
import { getChannel, getChannelInfo } from "../../../api/index";

class Recharge_channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      start_time: "",
      end_time: "",
      order_status: "",
      type: "",
      paramKey: "",
      inputParam: "",
      user_id: "",
      order_id: ""
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await getChannel(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    } else {
      message.error("网络问题");
    }
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        extra={
          <span>
            <Button
              style={{ float: "right" }}
              onClick={() => this.getUsers(1, 20)}
              icon="reload"
            />
          </span>
        }
      >
        <Table
          bordered
          size="middle"
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          expandedRowRender={this.expandedRowRender}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              if (page && pageSize) {
                this.setState({
                  pageSize: pageSize
                });
                this.getUsers(page, pageSize);
              } else return;
            },
            onShowSizeChange: (current, size) => {
              if (size) {
                this.getUsers(current, size);
              } else return;
            }
          }}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "渠道名",
      dataIndex: "name"
    },
    {
      title: "商户号",
      dataIndex: "member_id"
    }
  ];
  expandedRowRender = () => {
    const menu = (
      <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
      </Menu>
    );

    const columns = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        key: "state",
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        )
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
      {
        title: "Action",
        dataIndex: "operation",
      }
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56"
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
}

export default Recharge_channel;
