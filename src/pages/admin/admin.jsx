import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import storageUtils from "../../utils/storageUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/home";
import User from "../user/user";
import Admin_manage_list from "../admin_manage/admin_manage_list/admin_manage_list";
import Role from "../admin_manage/role/role";
import Order_list from "../charge/order_list/order_list";
import Channel_list from "../charge/channel_list/channel_list";
import Bankcard_list from "../charge/bankcard_list/bankcard_list";
import Recharge_order from "../charge/recharge_order/recharge_order";
import Recharge_channel from "../charge/recharge_channel/recharge_channel";
import NotFound from "../not-found/not-found";

const { Footer, Sider, Content } = Layout;

/*
后台管理的路由组件
 */
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onRef = ref => {
    this.child1 = ref;
  };
  render() {
    const user = storageUtils.getUser();
    // 如果内存没有存储user ==> 当前没有登陆
    if (!user || !user.id) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to="/login" />;
    }
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav
            onClick={tabConfig => {
              this.child1.add && this.child1.add(tabConfig);
            }}
          />
        </Sider>
        <Layout>
          <Header onRef={this.onRef}>Header</Header>
          <Content style={{ margin: 5, backgroundColor: "#fff" }}>
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" exact component={Home} />
              <Route path="/user/user-list" exact component={User} />
              <Route
                path="/admin_manage/list"
                exact
                component={Admin_manage_list}
              />
              <Route path="/admin_manage/role" exact component={Role} />
              <Route path="/charge/order_list" exact component={Order_list} />
              <Route path="/charge/channel-list" exact component={Channel_list} />
              <Route path="/charge/bankcard-list" exact component={Bankcard_list} />
              <Route path="/charge/recharge_order" exact component={Recharge_order} />
              <Route path="/charge/recharge_channel" exact component={Recharge_channel} />
              <Route component={NotFound} />
            </Switch>
          </Content>
          {/* <Footer style={{ textAlign: "center", color: "#cccccc", padding: 5 }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer> */}
        </Layout>
      </Layout>
    );
  }
}
