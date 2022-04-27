// import React, { Component, Suspense } from "react";
// import { Redirect, Route, Switch } from "react-router-dom";
// import { createHashHistory } from "history";
// import { reqUsers } from "../../api/index";
// import { Layout } from "antd";

// import { Provider, KeepAlive } from "react-keep-alive";
// import LeftNav from "../../components/left-nav";
// import Header from "../../components/header";

// //路由懒加载
// //懒加载和react-keep-alive冲突，组件加载成功后不会显示
// const Home = React.lazy(_ => import('../home/home'))
// const User = React.lazy(_ => import('../user/user'))
// const AdminManageList = React.lazy(_ => import('../admin_manage/admin_manage_list/admin_manage_list'))
// const Role = React.lazy(_ => import('../admin_manage/role/role'))
// const OrderList = React.lazy(_ => import('../charge/order_list/order_list'))
// const ChannelList = React.lazy(_ => import('../charge/channel_list/channel_list'))
// const BankcardList = React.lazy(_ => import('../charge/bankcard_list/bankcard_list'))
// const RechargeOrder = React.lazy(_ => import("../charge/recharge_order/recharge_order"))
// const RechargeChannel = React.lazy(_ => import("../charge/recharge_channel/recharge_channel"))
// const NoticeList = React.lazy(_ => import("../customer_service/notice_list"))
// const CustomerList = React.lazy(_ => import("../customer_service/customer_list"))
// const WithdrawList = React.lazy(_ => import("../withdraw/withdraw_list"))
// const WrappedConfig = React.lazy(_ => import("../gameSetting/config"))
// const Tasks = React.lazy(_ => import("../messageCenter/tasks"))
// const AccountList = React.lazy(_ => import("../trade/accountList"))
// const ApplyHistory = React.lazy(_ => import("../trade/applyHistory"))
// const TradeOrder = React.lazy(_ => import("../trade/tradeOrder"))
// const ActivityList = React.lazy(_ => import("../activity/activityList"))
// const ActivityRecieve = React.lazy(_ => import("../activity/recieve"))
// const GiftVoucher = React.lazy(_ => import("../activity/giftVoucher"))
// const GiftList = React.lazy(_ => import("../gift/giftList"))
// const GiftSetting = React.lazy(_ => import("../gift/giftSetting"))
// const AI = React.lazy(_ => import("../AI/robot"))
// const ProxySetting = React.lazy(_ => import("../proxy/setting"))
// const DaitiList = React.lazy(_ => import("../withdraw/Daiti_list"))
// const Channel = React.lazy(_ => import("../withdraw/Channel"))
// const NotFound = React.lazy(_ => import("../not-found/not-found"))
// const DailyReport = React.lazy(_ => import("../list/DailyReport"))
// const RuleManage = React.lazy(_ => import("../admin_manage/ruleManage"))
// const FishConfig = React.lazy(_ => import("../gameSetting/fishConfig"))



// const { Sider, Content } = Layout;

// const history = createHashHistory();
// const Loading = (
//     <h3>loading...</h3>
// );
// /*
// 后台管理的路由组件
//  */
// export default class Admin extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     //header和left-nav通过共同父组件传值
//     // onRef = ref => {
//     //   this.child1 = ref;
//     // };
//     render() {
//         const token = localStorage.token;
//         // 如果内存没有存储token ==> 当前没有登陆
//         if (!token) {
//             return <Redirect to="/login" />;
//         }
//         //如果内存中存储的token超过24小时，需要验证token，如果已经延期更新时间戳，如果未延期，更新token
//         const timeStamp = new Date().getTime();
//         const tokenTimeStamp = localStorage.tokenTimeStamp;
//         let time = timeStamp - tokenTimeStamp;
//         if (time > 24 * 3600 * 1000) {
//             const res = reqUsers(1, 20);
//             if (res.status !== 0) {
//                 localStorage.removeItem("menuList");
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("name");
//                 localStorage.removeItem("tokenTimeStamp");
//                 return <Redirect to="/login" />;
//             }
//         }
//         return (
//             <Layout style={{ minHeight: "100%" }}>
//                 <Sider>
//                     <LeftNav
//                         onClick={tabConfig => {
//                             this.child1.add && this.child1.add(tabConfig);
//                         }}
//                     />
//                 </Sider>
//                 <Layout>
//                     <Header onRef={ref => (this.child1 = ref)} history={history}>
//                         Header
//                     </Header>
//                     <Suspense fallback={Loading}>
//                         <Content style={{ margin: 5, backgroundColor: "#fff" }}>
//                             <Provider>
//                                 <div style={{ height: "100%" }}>
//                                     <Switch>
//                                         <Redirect from="/" exact to="/home" />
//                                         <Route path="/home" exact component={Home} />
//                                         <Route path="/user/user-list" exact>
//                                             <KeepAlive name="User">
//                                                 <User />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/customer_service/notice_list">
//                                             <KeepAlive name="Notice_list">
//                                                 <NoticeList />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/customer_service/customer_list"
//                                             exact
//                                             component={CustomerList}
//                                         >
//                                             <KeepAlive name="CustomerList">
//                                                 <CustomerList></CustomerList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/admin_manage/list"
//                                             exact
//                                             component={AdminManageList}
//                                         >
//                                             <KeepAlive name="AdminManageList">
//                                                 <AdminManageList></AdminManageList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/admin_manage/rule" exact component={RuleManage}>
//                                             <KeepAlive name="RuleManage">
//                                                 <RuleManage></RuleManage>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/admin_manage/role" exact component={Role}>
//                                             <KeepAlive name="Role">
//                                                 <Role></Role>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/list/daily-report" exact>
//                                             <KeepAlive name="DailyReport">
//                                                 <DailyReport></DailyReport>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/gameSetting/config" exact>
//                                             <KeepAlive name="WrappedConfig">
//                                                 <WrappedConfig></WrappedConfig>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/gameSetting/setBuYuConfig" exact>
//                                             <KeepAlive name="FishConfig">
//                                                 <FishConfig></FishConfig>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/proxy/setting" exact>
//                                             <KeepAlive name="ProxySetting">
//                                                 <ProxySetting></ProxySetting>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/messageCenter/tasks" exact>
//                                             <KeepAlive name="Tasks">
//                                                 <Tasks></Tasks>
//                                             </KeepAlive>
//                                         </Route>

//                                         <Route path="/trade/accountList" exact>
//                                             <KeepAlive name="AccountList">
//                                                 <AccountList></AccountList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/trade/applyHistory" exact>
//                                             <KeepAlive name="ApplyHistory">
//                                                 <ApplyHistory></ApplyHistory>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/trade/tradeOrder" exact>
//                                             <KeepAlive name="TradeOrder">
//                                                 <TradeOrder></TradeOrder>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/activity/list" exact>
//                                             <KeepAlive name="ActivityList">
//                                                 <ActivityList />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/activity/recieve" exact>
//                                             <KeepAlive name="ActivityRecieve">
//                                                 <ActivityRecieve />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/activity/giftVoucher" exact>
//                                             <KeepAlive name="giftVoucher">
//                                                 <GiftVoucher />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/charge/order_list" exact component={OrderList}>
//                                             <KeepAlive name="OrderList">
//                                                 <OrderList></OrderList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/charge/channel-list"
//                                             exact
//                                             component={ChannelList}
//                                         >
//                                             <KeepAlive name="ChannelList">
//                                                 <ChannelList></ChannelList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/charge/bankcard-list"
//                                             exact
//                                             component={BankcardList}
//                                         >
//                                             <KeepAlive name="BankcardList">
//                                                 <BankcardList></BankcardList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/artificialcharge/order"
//                                             exact
//                                             component={RechargeOrder}
//                                         >
//                                             <KeepAlive name="RechargeOrder">
//                                                 <RechargeOrder></RechargeOrder>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/charge/recharge_channel"
//                                             exact
//                                             component={RechargeChannel}
//                                         >
//                                             <KeepAlive name="RechargeChannel">
//                                                 <RechargeChannel></RechargeChannel>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/withdraw/withdraw_list"
//                                             exact
//                                             component={WithdrawList}
//                                         >
//                                             <KeepAlive name="WithdrawList">
//                                                 <WithdrawList></WithdrawList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route
//                                             path="/artificialWithdraw/order"
//                                             exact
//                                             component={DaitiList}
//                                         >
//                                             <KeepAlive name="DaitiList">
//                                                 <DaitiList />
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/withdraw/channel" exact>
//                                             <KeepAlive name="Channel">
//                                                 <Channel></Channel>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/gift/list" exact>
//                                             <KeepAlive name="GiftList">
//                                                 <GiftList></GiftList>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/gift/setting" exact>
//                                             <KeepAlive name="GiftSetting">
//                                                 <GiftSetting></GiftSetting>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route path="/AI/robot" exact>
//                                             <KeepAlive name="AI">
//                                                 <AI></AI>
//                                             </KeepAlive>
//                                         </Route>
//                                         <Route component={NotFound} />
//                                     </Switch>
//                                 </div>
//                             </Provider>
//                         </Content>

//                     </Suspense>
//                     {/* <Footer style={{ textAlign: "center", color: "#cccccc", padding: 5 }}>
//             推荐使用谷歌浏览器，可以获得更佳页面操作体验
//           </Footer> */}
//                 </Layout>
//             </Layout>

//         );
//     }
// }
