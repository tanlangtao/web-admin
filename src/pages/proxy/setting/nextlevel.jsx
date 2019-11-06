import React, { Component } from "react";
import { Card, Table, Modal, Input, message, Button } from "antd";
import {
  getProxyUserList,
  changeProxyUserProxyPid,
  getProxyUser
} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import Myself from "./nextlevel.jsx";
import BalanceChanged from "./BalanceChanged";
import { reverseNumber } from "../../../utils/commonFuntion";

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
      render: text => {
        return <span>{reverseNumber(text)}</span>;
      },
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
    },
    {
      title: "实时余额",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button onClick={() => this.checkBalance(record)} size="small">
            查看
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
          id: record.id,
          proxy_user_id: this.state.new_proxy_user_id
        });
        if (res.status === 0) {
          message.success(res.msg || "操作成功");
          this.onSearchData(1, 20);
        } else {
          message.error(res.msg || "操作失败");
        }
      }
    });
  };
  changeBalance = record => {
    this.proxyID = record.id;
    this.record = record;
    this.setState({
      isChangeBalanceShow: true
    });
  };
  checkBalance = async record => {
    let reqData = {
      page: 1,
      limit: 10,
      id: record.id
    };
    const res = await getProxyUser(reqData);
    if (res.status === 0) {
      Modal.success({
        title: "实时余额",
        content: `代理${record.id}实时余额是 : ${
          res.data ? res.data[0].balance : "0.00"
        }`
      });
    } else {
      message.info(res.msg || "操作失败");
    }
  };
}

export default NextLevel;
