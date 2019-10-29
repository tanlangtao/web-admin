import React, { Component } from "react";
import { Card, Table, Modal, Icon, Input, Button, message } from "antd";
import { getProxyUserList, changeProxyUserProxyPid } from "../../../api/index";
import NextLevel from "./nextlevel";
import LinkButton from "../../../components/link-button";

class ProxySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: ""
    };
  }
  onSearchData = async (page, limit) => {
    // let reqdata = { page, limit, id: 232843783 };
    let reqdata = { page, limit, id: this.input.input.value };
    const res = await getProxyUserList(reqdata);
    if (res.status === 0) {
      this.setState({
        data: res.data.proxy_user,
        count: parseInt(res.count)
      });
    }
  };
  componentDidMount() {
    this.onSearchData(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <span>
            <Input
              type="text"
              placeholder="请输入代理ID"
              style={{ width: 150 }}
              ref={input => (this.input = input)}
            />
            &nbsp; &nbsp;
            <LinkButton onClick={() => this.onSearchData(1, 20)} size="default">
              <Icon type="search" />
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
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.onSearchData(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.onSearchData(current, size);
            }
          }}
        />
        <Modal
          title={`[ID:${this.pid}]直属下级列表`}
          visible={this.state.isAddDataShow}
          style={{ top: 20 }}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          footer={null}
          mask={false}
          maskClosable={false}
          // maskStyle={{
          //   backgroundColor: "#eee",
          //   color: "#ddd"
          // }}
          width="60%"
        >
          <NextLevel pid={this.pid} topDistance={20} />
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
      title: "昵称",
      dataIndex: "proxy_nick"
    },
    {
      title: "上级ID",
      dataIndex: "proxy_pid"
    },
    {
      title: "代理余额[点击调整]",
      dataIndex: "balance"
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button
            type="primary"
            onClick={() => this.nextLevel(record)}
            size="small"
          >
            下级
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            type="primary"
            size="small"
            onClick={() => this.changePid(record)}
          >
            转移
          </Button>
        </span>
      )
    }
  ];
  nextLevel = record => {
    this.setState({
      isAddDataShow: true
    });
    this.pid = record.id;
  };
  changePid = record => {
    Modal.confirm({
      title: "修改上级代理",
      content: (
        <Input
          onBlur={e => this.setState({ new_proxy_user_id: e.target.value })}
        ></Input>
      ),
      onOk: async () => {
        const res = await changeProxyUserProxyPid({
          change_id: record.id,
          new_proxy_user_id: this.state.new_proxy_user_id
        });
        if (res.status === 0) {
          message.success("操作成功" + res.msg);
        } else {
          message.error("操作失败" + res.msg);
        }
      }
    });
  };
}

export default ProxySetting;