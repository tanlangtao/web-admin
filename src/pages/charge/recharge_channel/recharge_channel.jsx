import React, { Component } from "react";
import { Card, Table, Modal, message, Input, Button } from "antd";
import {
  getChannel,
  getChannelInfo,
  editChannelInfo
} from "../../../api/index";

class Recharge_channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      childData: [],
      expandedRowKeys: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isEditDataShow: false,
      recordId: ""
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await getChannel(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data && result.data.list,
        count: result.data && result.data.count
      });
    }
    if (result.status === -1) {
      this.setState({
        data: [],
        count: 0
      });
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
              onClick={() => window.location.reload()}
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
          expandRowByClick
          onExpand={this.onExpandRow}
          expandedRowKeys={this.state.expandedRowKeys}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
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
        <Modal
          title="修改"
          visible={this.state.isEditDataShow}
          onOk={this.handleEditData}
          onCancel={() => {
            this.setState({ isEditDataShow: false });
          }}
        >
          <span>pay_code:</span>
          <Input
            type="text"
            value={this.state.inputParam}
            onChange={event =>
              this.setState({ inputParam: event.target.value })
            }
          />
        </Modal>
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
  expandedRowRender = (record, index, indent, expanded) => {
    const columns = [
      {
        title: "支付方式名称",
        dataIndex: "pay_name",
        width: 200
      },
      {
        title: "所属支付渠道",
        dataIndex: "channel_name",
        width: 200
      },
      {
        title: "pay_code",
        dataIndex: "pay_code",
        width: 200
      },
      {
        title: "操作",
        dataIndex: "action",
        render: (text, record, index) => (
          <Button onClick={() => this.edit(record)}>修改pay_code</Button>
        )
      }
    ];
    return (
      <Table
        columns={columns}
        dataSource={this.state.childData}
        pagination={false}
      />
    );
  };
  onExpandRow = async (expanded, record) => {
    let keys = [];
    if (expanded) {
      keys.push(record.id);
      this.setState({
        expandedRowKeys: keys,
        childData: []
      });
      const result = await getChannelInfo(record.id);
      if (result.status === 0) {
        result.data&&result.data.list.forEach((element, index) => {
          element.key = index;
        });
        this.setState({
          childData: result.data&&result.data.list
        });
      } else {
        message.info(result.msg || "未检索到数据");
        this.setState({
          childData: []
        });
      }
    } else {
      this.setState({
        expandedRowKeys: []
      });
    }
  };
  edit = record => {
    console.log(record.pay_code);
    this.setState({
      recordId: record.id,
      inputParam: record.pay_code,
      isEditDataShow: true
    });
  };
  handleEditData = async () => {
    const result = await editChannelInfo(
      this.state.recordId,
      this.state.inputParam
    );
    if (result.status === 0) {
      message.success(result.msg);
      this.setState({
        isEditDataShow: false,
        expandedRowKeys: []
      });
    } else {
      message.info("网络问题");
    }
  };
}
export default Recharge_channel;
