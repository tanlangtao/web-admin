import React, { Component } from "react";
import { Card, Table, message, Input, Modal } from "antd";
import { activityList } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { formateDate } from "../../../utils/dateUtils";

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20
    };
  }
  getInitialData = async (page, limit) => {
    const res = await activityList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data && res.data.list,
        count: parseInt(res.data && res.data.count)
      });
    } else {
      message.error("未检索到数据");
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
              handleValue={val => {
                this.start_time = val[0];
                this.end_time = val[1];
              }}
            />
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
              onClick={this.onSearch}
              icon="search"
              size="default"
            ></LinkButton>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
              size="default"
            />
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
      title: "user_id",
      dataIndex: "user_id"
    },
    {
      title: "活动Id",
      dataIndex: "activity_id"
    },
    {
      title: "活动名称",
      dataIndex: "activity_name"
    },
    {
      title: "品牌Id",
      dataIndex: "package_id"
    },
    {
      title: "领取日期",
      dataIndex: "receive_date"
    },
    {
      title: "领取详情",
      dataIndex: "",
      render: (text, record) => (
        <span>
          <LinkButton
            size="small"
            onClick={() => {
              this.check(record);
            }}
          >
            查看
          </LinkButton>
        </span>
      )
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: formateDate
    }
  ];
  check = record => {
    let obj = JSON.parse(record.receive_info)
    for (const key in obj) {
      if (obj[key].hasOwnProperty("time")) {
        obj[key].time = formateDate(obj[key].time)
      }
    }
    Modal.info({
      title: "领取详情",
      content: JSON.stringify(obj)
    });
  };
  onSearch = async () => {
    let value = {
      user_id: this.input.input.value,
      start_time: this.start_time,
      end_time: this.end_time
    };
    const res = await activityList(this.state.page, this.state.pageSize, value);
    if (res.status === 0) {
      this.setState({
        data: res.data && res.data.list,
        count: parseInt(res.data && res.data.count)
      });
    } else {
      message.error("未检索到数据");
    }
  };
}
export default AccountList;
