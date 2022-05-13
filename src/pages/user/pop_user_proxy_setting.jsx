import React, { Component } from "react";

import { Card, Table, Modal, Icon, Input, Button, message } from "antd";
import { sortBy } from "lodash-es";

import {
  getProxyUserList,
  changeProxyUserProxyPid,
  getProxyUser,
  getDividendRule,
  getProxyUserLink,
} from "../../api/index";
import NextLevel from "../proxy/setting/nextlevel";
import BalanceChanged from "../proxy/setting/BalanceChanged";
import LinkButton from "../../components/link-button";
import { reverseNumber, toNonExponential } from "../../utils/commonFuntion";
import { formateDate } from "../../utils/dateUtils";

class PopProxySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data2: [],
      count: "",
      recordID:""
    };
  }
  onSearchData = (page, limit) => {
    this.fetchData(page, limit, this.state.recordID);
  };
  fetchData = async (page, limit, id) => {
    let reqdata = { page, limit, id };
    const res = await getProxyUserList(reqdata);
    if (res.status === 0) {
    } else {
      message.info(res.msg || "操作失败");
    }
    this.setState({
      data: res.data?.proxy_user || [],
      count: parseInt(res.data?.count || 0),
    },()=>{
        this.fetchData2(this.state.recordID);
        this.fetchData3(this.state.recordID);
    });
  };
  fetchData2 = async (id) => {
    try {
      const res = await getDividendRule(id);
      if (res.code === 200) {
      } else {
        message.info("操作失败");
      }
      let new_arr = [];
      if (res.msg) {
        new_arr = sortBy(res.msg, ["type", "game_tag", "amount"]);
      }
      this.setState({
        data2: new_arr || [],
      });
    } finally {
    }
  };
  fetchData3 = async (id) => {
    try {
      const res = await getProxyUserLink(id);
      if (res.code === 200) {
      } else {
        message.info("查询失败");
      }
      let str = res.msg.join(">>");
      let testState = this.state.data;
      testState[0].userlink = str;
      this.setState({
        data: testState || [],
      });
    } finally {
    }
  };
  componentDidMount() {
    this.setState({
        recordID:this.props.recordID
    },()=>{
        this.onSearchData(1, 20);
    })
  }
  render() {
    return (
      <div
      >
        <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={false}
        />
        {/* <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data2}
          columns={this.initColumns2()}
          size="small"
          pagination={{
            defaultPageSize: 30,
            defaultCurrent: 1,
          }}
        /> */}
      </div>
    );
  }
  initColumns = () => [
    {
      title: "玩家ID",
      dataIndex: "id",
      align: 'center',
    },
    {
      title: "玩家昵称",
      dataIndex: "proxy_nick",
      align: 'center',
    },
    {
      title: "推广员ID",
      dataIndex: "proxy_pid",
      align: 'center',
    },
    {
      title: "玩家代理链详情",
      dataIndex: "userlink",
      align: 'center',
    },
    {
      title: "佣金余额",
      dataIndex: "",
      align: 'center',
      render: (text, record, index) => (
        <span>
          <Button onClick={() => this.checkBalance(record)} size="small">
            查看
          </Button>
        </span>
      ),
    },
  ];
  initColumns2 = () => [
    {
      title: "分红类型",
      dataIndex: "type",
      align: 'center',
      render: (text) =>
        text === 1
          ? "流水分红"
          : text === 2
          ? "亏损分红（输赢差）"
          : text === 3
          ? "亏损分红（充提差）"
          : "",
      // defaultSortOrder: "descend",
      // sorter: (a, b) => a.type - b.type,
    },
    // 分红类型: 对应type字段, 1=流水分红, 2=亏损分红
    // 游戏分类: 对应game_tag 字段,  1=棋牌类型游戏, 2=彩票类型游戏, 3=体育类型游戏,  4= 视讯类型游戏
    // 统计方式: 对应demand_type  字段,  1=流水 , 2=亏损
    // 统计范围: 对应  demand_tag  字段,  1=当前游戏类型, 2=所有游戏类型
    // 周期量: 对应 amount  字段
    // 分红比例: 对应 percent 字段, 显示数字后面加 %
    // 时间: 对应 create_time 字段, 当前为时间戳, 需要转换成当地时间
    {
      title: "游戏分类",
      dataIndex: "game_tag",
      align: 'center',
      render: (text) =>
        text === 1
          ? "棋牌类型游戏"
          : text === 2
          ? "彩票类型游戏"
          : text === 3
          ? "体育类型游戏"
          : text === 4
          ? "视讯类型游戏"
          : text === 5
          ? "所有游戏类型"
          : "",
      // defaultSortOrder: "descend",
      // sorter: (a, b) => a.game_tag - b.game_tag,
    },
    {
      title: "统计方式",
      dataIndex: "demand_type",
      align: 'center',
      render: (text) =>
        text === 1
          ? "按流水统计"
          : text === 2
          ? "按亏损统计"
          : text === 3
          ? "亏损（充提差）"
          : "",
    },
    {
      title: "统计范围",
      dataIndex: "demand_tag",
      align: 'center',
      render: (text) =>
        text === 1 ? "当前游戏类型" : text === 2 ? "所有游戏类型" : "",
    },
    {
      title: "周期量",
      dataIndex: "amount",
      align: 'center',
      // defaultSortOrder: "descend",
      // sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "分红比例",
      dataIndex: "percent",
      align: 'center',
      render: (text) => text + "%",
    },
    {
      title: "时间",
      dataIndex: "create_time",
      align: 'center',
      render: formateDate,
    },
  ];
  nextLevel = (record) => {
    this.setState({
      isAddDataShow: true,
    });
    this.pid = record.id;
  };
  changePid = (record) => {
    Modal.confirm({
      title: "修改上级代理",
      content: (
        <Input
          onBlur={(e) => this.setState({ new_proxy_user_id: e.target.value })}
        />
      ),
      onOk: async () => {
        const res = await changeProxyUserProxyPid({
          id: record.id,
          proxy_user_id: this.state.new_proxy_user_id,
        });
        if (res.status === 0) {
          message.success(res.msg || "操作成功");
          this.onSearchData(1, 20);
        } else {
          message.info(res.msg || "操作失败");
        }
      },
    });
  };
  changeBalance = (record) => {
    this.proxyID = record.id;
    this.record = record;
    this.setState({
      isChangeBalanceShow: true,
    });
  };
  checkBalance = async (record) => {
    let reqData = {
      page: 1,
      limit: 10,
      id: record.id,
    };
    const res = await getProxyUser(reqData);
    if (res.status === 0) {
      Modal.success({
        title: "佣金余额",
        content: `玩家${record.id}佣金余额是 : ${
          res.data
            ? (Math.floor(res.data.balance * 100) / 100).toFixed(2)
            : "0.00"
        }`,
      });
    } else {
      message.info(res.msg || "操作失败");
    }
  };
}

export default PopProxySetting;
