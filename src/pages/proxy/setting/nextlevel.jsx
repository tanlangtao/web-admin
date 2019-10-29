import React, { Component } from "react";
import { Card, Table, Modal } from "antd";
import { getProxyUserList } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import Myself from "./nextlevel.jsx";

class NextLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: ""
    };
  }
  onSearchData = async (page, limit) => {
    let reqdata = { page, limit, proxy_pid: this.props.pid };
    const res = await getProxyUserList(reqdata);
    if (res.status === 0 && res.data) {
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
      <Card>
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
          style={{ top: this.props.topDistance + 40 }}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          footer={null}
          mask={false}
          maskClosable={false}
          // maskStyle={{
          //   backgroundColor: "#eee",
          //   width: "100%",
          //   height: "100%",
          //   zIndex: 999
          // }}
          width="60%"
        >
          <Myself pid={this.pid} topDistance={this.props.topDistance + 40} />
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
          <LinkButton
            type="primary"
            onClick={() => this.nextLevel(record)}
            size="small"
          >
            下级
          </LinkButton>
          &nbsp;&nbsp;&nbsp;
          <LinkButton type="primary" size="small">
            转移
          </LinkButton>
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
}

export default NextLevel;
