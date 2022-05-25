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
        let data = res.msg.login_history.sort((a,b)=>{
          return b.login_time - a.login_time 
        })
        this.state.pages = page
        console.log(' this.state.total==', this.state.total);
        message.success(res.status);
        this.setState({
          data: data,
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
      dataIndex: "id",
      key: "id",
      align: 'center',
    },
    {
      title: "注册时间",
      dataIndex: "regin_time",
      key: "regin_time",
      align: 'center',
      render: formateDate,
    },
    {
      title: "登陆时间",
      dataIndex: "login_time",
      key: "login_time",
      align: 'center',
      render: formateDate,
    },
    {
      title: "登陆IP",
      dataIndex: "ip",
      key: "ip",
      align: 'center',
      width:120,
    },
    {
      title: "本次设备ID",
      dataIndex: "current_device_id",
      key: "current_device_id",
      align: 'center',
      width:100,
    },

    {
      title: "上次设备ID",
      dataIndex: "before_device_id",
      key: "before_device_id",
      align: 'center',
      width:100,
    },
  ];





}

export default PopProxyhistory;
