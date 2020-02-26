import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { createHashHistory } from "history";
import { Layout } from "antd";

import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/home";
import User from "../user/user";
import AdminManageList from "../admin_manage/admin_manage_list/admin_manage_list";
import Role from "../admin_manage/role/role";
import OrderList from "../charge/order_list/order_list";
import ChannelList from "../charge/channel_list/channel_list";
import BankcardList from "../charge/bankcard_list/bankcard_list";
import RechargeOrder from "../charge/recharge_order/recharge_order";
import RechargeChannel from "../charge/recharge_channel/recharge_channel";
import NoticeList from "../customer_service/notice_list";
import CustomerList from "../customer_service/customer_list";
import WithdrawList from "../withdraw/withdraw_list";
import WrappedConfig from "../gameSetting/config";
import Tasks from "../messageCenter/tasks";
import AccountList from "../trade/accountList";
import ApplyHistory from "../trade/applyHistory";
import TradeOrder from "../trade/tradeOrder";
import ActivityList from "../activity/activityList";
import ActivityRecieve from "../activity/recieve";
import GiftVoucher from "../activity/giftVoucher";
import GiftList from "../gift/giftList";
import GiftSetting from "../gift/giftSetting";
import AI from "../AI/robot";
import ProxySetting from "../proxy/setting";
import DaitiList from "../withdraw/Daiti_list";
import Channel from "../withdraw/Channel";
import NotFound from "../not-found/not-found";
import DailyReport from "../list/DailyReport";
import RuleManage from "../admin_manage/ruleManage";
import FishConfig from "../gameSetting/fishConfig";

import { Provider, KeepAlive } from "react-keep-alive";
const { Sider, Content } = Layout;

const history = createHashHistory();
/*
后台管理的路由组件
 */
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //header和left-nav通过共同父组件传值
  // onRef = ref => {
  //   this.child1 = ref;
  // };
  render() {
    const token = localStorage.token;
    // 如果内存没有存储token ==> 当前没有登陆
    if (!token) {
      return <Redirect to="/login" />;
    }
    //如果内存中存储的token超过24小时，需要验证token，如果已经延期更新时间戳，如果未延期，更新token
    // const timeStamp = new Date().getTime();
    // const tokenTimeStamp = localStorage.tokenTimeStamp;
    // let time = timeStamp - tokenTimeStamp;
    // if (time > 24 * 3600 * 1000) {
    //   const res = reqUsers(1, 20);
    //   if (res.status !== 0) {
    //     localStorage.removeItem("menuList");
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("name");
    //     localStorage.removeItem("tokenTimeStamp");
    //     return <Redirect to="/login" />;
    //   }
    // }
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
          <Header onRef={ref => (this.child1 = ref)} history={history}>
            Header
          </Header>
          <Content style={{ margin: 5, backgroundColor: "#fff" }}>
            <Provider>
              <div style={{ height: "100%" }}>
                <Switch>
                  <Redirect from="/" exact to="/home" />
                  <Route path="/home" exact component={Home} />
                  <Route path="/user/user-list" exact>
                    <KeepAlive name="User">
                      <User />
                    </KeepAlive>
                  </Route>
                  <Route path="/customer_service/notice_list">
                    <KeepAlive name="Notice_list">
                      <NoticeList />
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/customer_service/customer_list"
                    exact
                    component={CustomerList}
                  >
                    <KeepAlive name="CustomerList">
                      <CustomerList></CustomerList>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/admin_manage/list"
                    exact
                    component={AdminManageList}
                  >
                    <KeepAlive name="AdminManageList">
                      <AdminManageList></AdminManageList>
                    </KeepAlive>
                  </Route>
                  <Route path="/admin_manage/rule" exact component={RuleManage}>
                    <KeepAlive name="RuleManage">
                      <RuleManage></RuleManage>
                    </KeepAlive>
                  </Route>
                  <Route path="/admin_manage/role" exact component={Role}>
                    <KeepAlive name="Role">
                      <Role></Role>
                    </KeepAlive>
                  </Route>

                  <Route path="/list/daily-report" exact>
                    <KeepAlive name="DailyReport">
                      <DailyReport></DailyReport>
                    </KeepAlive>
                  </Route>

                  <Route path="/gameSetting/config" exact>
                    <KeepAlive name="WrappedConfig">
                      <WrappedConfig></WrappedConfig>
                    </KeepAlive>
                  </Route>

                  <Route path="/gameSetting/setBuYuConfig" exact>
                    <KeepAlive name="FishConfig">
                      <FishConfig></FishConfig>
                    </KeepAlive>
                  </Route>

                  <Route path="/proxy/setting" exact>
                    <KeepAlive name="ProxySetting">
                      <ProxySetting></ProxySetting>
                    </KeepAlive>
                  </Route>

                  <Route path="/messageCenter/tasks" exact>
                    <KeepAlive name="Tasks">
                      <Tasks></Tasks>
                    </KeepAlive>
                  </Route>

                  <Route path="/trade/accountList" exact>
                    <KeepAlive name="AccountList">
                      <AccountList></AccountList>
                    </KeepAlive>
                  </Route>
                  <Route path="/trade/applyHistory" exact>
                    <KeepAlive name="ApplyHistory">
                      <ApplyHistory></ApplyHistory>
                    </KeepAlive>
                  </Route>
                  <Route path="/trade/tradeOrder" exact>
                    <KeepAlive name="TradeOrder">
                      <TradeOrder></TradeOrder>
                    </KeepAlive>
                  </Route>
                  <Route path="/activity/list" exact>
                    <KeepAlive name="ActivityList">
                      <ActivityList />
                    </KeepAlive>
                  </Route>
                  <Route path="/activity/recieve" exact>
                    <KeepAlive name="ActivityRecieve">
                      <ActivityRecieve />
                    </KeepAlive>
                  </Route>
                  <Route path="/activity/giftVoucher" exact>
                    <KeepAlive name="giftVoucher">
                      <GiftVoucher />
                    </KeepAlive>
                  </Route>
                  <Route path="/charge/order_list" exact component={OrderList}>
                    <KeepAlive name="OrderList">
                      <OrderList></OrderList>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/charge/channel-list"
                    exact
                    component={ChannelList}
                  >
                    <KeepAlive name="ChannelList">
                      <ChannelList></ChannelList>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/charge/bankcard-list"
                    exact
                    component={BankcardList}
                  >
                    <KeepAlive name="BankcardList">
                      <BankcardList></BankcardList>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/artificialcharge/order"
                    exact
                    component={RechargeOrder}
                  >
                    <KeepAlive name="RechargeOrder">
                      <RechargeOrder></RechargeOrder>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/charge/recharge_channel"
                    exact
                    component={RechargeChannel}
                  >
                    <KeepAlive name="RechargeChannel">
                      <RechargeChannel></RechargeChannel>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/withdraw/withdraw_list"
                    exact
                    component={WithdrawList}
                  >
                    <KeepAlive name="WithdrawList">
                      <WithdrawList></WithdrawList>
                    </KeepAlive>
                  </Route>
                  <Route
                    path="/artificialWithdraw/order"
                    exact
                    component={DaitiList}
                  >
                    <KeepAlive name="DaitiList">
                      <DaitiList />
                    </KeepAlive>
                  </Route>
                  <Route path="/withdraw/channel" exact>
                    <KeepAlive name="Channel">
                      <Channel></Channel>
                    </KeepAlive>
                  </Route>
                  <Route path="/gift/list" exact>
                    <KeepAlive name="GiftList">
                      <GiftList></GiftList>
                    </KeepAlive>
                  </Route>
                  <Route path="/gift/setting" exact>
                    <KeepAlive name="GiftSetting">
                      <GiftSetting></GiftSetting>
                    </KeepAlive>
                  </Route>
                  <Route path="/AI/robot" exact>
                    <KeepAlive name="AI">
                      <AI></AI>
                    </KeepAlive>
                  </Route>
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Provider>
          </Content>
          {/* <Footer style={{ textAlign: "center", color: "#cccccc", padding: 5 }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer> */}
        </Layout>
      </Layout>
    );
  }
}
