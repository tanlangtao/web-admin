import React, { Component } from "react";
import { Card, Table, Modal, Input, message } from "antd";
import { getProxyUserList, changeProxyUserProxyPid } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import Myself from "./nextlevel.jsx";
import BalanceChanged from "./BalanceChanged";

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
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.onSearchData(page, pageSize);
            },
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
          width="60%"
        >
          <Myself pid={this.pid} topDistance={this.props.topDistance + 40} />
        </Modal>
        <Modal
          title={`[代理:${this.proxyID}]资金变动`}
          visible={this.state.isChangeBalanceShow}
          onCancel={() => {
            this.setState({ isChangeBalanceShow: false });
          }}
          footer={null}
        >
          <BalanceChanged
            record={this.record}
            cancel={() => {
              this.setState({ isChangeBalanceShow: false });
            }}
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
      title: "昵称",
      dataIndex: "proxy_nick"
    },
    {
      title: "上级ID",
      dataIndex: "proxy_pid"
    },
    {
      title: "代理余额[点击调整]",
      dataIndex: "balance",
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            this.changeBalance(record);
          }, // 点击行
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
          <LinkButton
            type="primary"
            size="small"
            onClick={() => this.changePid(record)}
          >
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
          id: record.id,
          proxy_user_id: this.state.new_proxy_user_id
        });
        if (res.status === 0) {
          message.success("操作成功" + res.msg);
        } else {
          message.error("操作失败" + res.msg);
        }
      }
    });
  };
  changeBalance = record => {
    this.record = record;
    this.setState({
      isChangeBalanceShow: true
    });
  };
}

export default NextLevel;
