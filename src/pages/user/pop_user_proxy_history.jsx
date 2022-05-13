import React, { Component } from "react";

import { Card, Table, Modal, Icon, Input, Button, message, Pagination } from "antd";
import { sortBy } from "lodash-es";

import {
  getGameUserLoginHistory,
  getProxyUserList,
  changeProxyUserProxyPid,
  getProxyUser,
  getDividendRule,
  getProxyUserLink,
} from "../../api/index";
import BalanceChanged from "../proxy/setting/BalanceChanged";
import LinkButton from "../../components/link-button";
import { reverseNumber, toNonExponential } from "../../utils/commonFuntion";
import { formateDate } from "../../utils/dateUtils";

class PopProxyhistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data2: [],
      count: "",
      recordID: "",
      total: 1,
      pages: 1,

    };
  }

  onSearchData = (page, limit) => {
    this.fetchData(page, limit, this.state.recordID);
  };
  fetchData = async (page, limit, id) => {
    let reqdata = { page, limit, id };
    const res = await getGameUserLoginHistory(reqdata);

    if (res.code === 200) {
      // console.log('res.msg.login_history===', res.msg.login_history);
      if (res.msg.login_history != null) {
        console.log('lenth====', res.msg.login_history.length);
        if (this.state.pages <= page) {
          if (res.msg.login_history.length == 10) {
            this.state.total += res.msg.login_history.length
          }
        }

        this.state.pages = page
        console.log(' this.state.total==', this.state.total);
        message.success(res.status);
        this.setState({
          data: res.msg?.login_history || [],
          count: parseInt(res.data?.count || 0),
        })




      } else {
        message.success("暂无数据");
        this.state.total= 11
        this.setState({
          data: [],
         
        })
      }
    } else {
      message.info(res.msg || "操作失败");
    }
    // console.log("res.data====",res.msg);


  };
  componentDidMount(page) {
    if (!page) {
      page = 1
    }

    // console.log('page===', page);
    this.setState({
      recordID: this.props.recordID
    }, () => {
      //235309623
      this.onSearchData(page, 10);
    })
  }
  onChange(page) {
    console.log('page===', page);
    this.componentDidMount(page)
    this.setState({
      loading: true
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

        <Pagination
          defaultCurrent={1}
          total={this.state.total}
          pageSize={10}
          onChange={this.onChange.bind(this)}
        // hideOnSinglePage={true}

        />


      </div>

    );
  }
  initColumns = () => [
    {
      title: "玩家ID",
      dataIndex: "proxy_user_id",
    },
    {
      title: "注册时间",
      dataIndex: "login_time",
      render: formateDate,
    },
    {
      title: "登陆时间",
      dataIndex: "regin_time",
      render: formateDate,
    },
    {
      title: "登陆IP",
      dataIndex: "ip",
    },
    {
      title: "本次设备ID",
      dataIndex: "before_device_id",
    },

    {
      title: "上次设备ID",
      dataIndex: "current_device_id",
    },

    // {
    //   title: "玩家ID",
    //   dataIndex: "id",
    //   align: 'center',
    // },
    // {
    //   title: "玩家昵称",
    //   dataIndex: "proxy_nick",
    //   align: 'center',
    // },
    // {
    //   title: "推广员ID",
    //   dataIndex: "proxy_pid",
    //   align: 'center',
    // },
    // {
    //   title: "玩家代理链详情",
    //   dataIndex: "userlink",
    //   align: 'center',
    // },
    // {
    //   title: "佣金余额",
    //   dataIndex: "",
    //   align: 'center',
    //   // render: (text, record, index) => (
    //   //   <span>
    //   //     <Button onClick={() => this.checkBalance(record)} size="small">
    //   //       查看
    //   //     </Button>
    //   //   </span>
    //   // ),
    // },
  ];





}

export default PopProxyhistory;
