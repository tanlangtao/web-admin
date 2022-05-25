import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { createHashHistory } from "history";
import { Layout ,Button,Icon} from "antd";

import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/home";
import User from "../user/user";
import UserGameData from "../user/user_game_data";
import LandingPage from "../user/landing_page";
import AdminManageList from "../admin_manage/admin_manage_list/admin_manage_list";
import Role from "../admin_manage/role/role";
import OrderList from "../charge/order_list/order_list";
import ChannelList from "../charge/channel_list/channel_list";
import BankcardList from "../charge/bankcard_list/bankcard_list";
import RechargeOrder from "../charge/recharge_order/recharge_order";
import RechargeChannel from "../charge/recharge_channel/recharge_channel";
import Daichong from "../charge/daichong";
import NoticeList from "../customer_service/notice_list";
import CustomerList from "../customer_service/customer_list";
import CSAccount from "../customer_service/account";
import Autoreply from "../customer_service/auto_reply";
import Feedbacks from "../customer_service/feedbacks";
import WithdrawList from "../withdraw/withdraw_list";
import WithdrawBlackList from "../withdraw/withdraw_blacklist";
import WrappedConfig from "../gameSetting/config";
import Tasks from "../messageCenter/tasks";
import TaskList from "../messageCenter/tasklist";
import AccountList from "../trade/accountList";
import ApplyHistory from "../trade/applyHistory";
import TradeOrder from "../trade/tradeOrder";
import ActivityList from "../activity/activityList";
import ActivityRecieve from "../activity/recieve";
import ActivitySetting from "../activity/activity_setting";
import FruitSetting from "../activity/fruit_setting";
import GiftVoucher from "../activity/giftVoucher";
import GetBonusPool from "../activity/getBonusPool";
import GiftList from "../gift/giftList";
import GiftSetting from "../gift/giftSetting";
import AI from "../AI/robot";
import ProxySetting from "../proxy/setting";
import UserLinkAccount from "../proxy/userLinkAccount";
import ProxyCheck from "../proxy/check";
import LoseProfit from "../proxy/lose_profit";
import GetStockDividendInfo from "../proxy/getStockDividendInfo";
import GetProxyUserLinkAllInfo from "../proxy/getProxyUserLinkAllInfo";
import DaitiList from "../withdraw/Daiti_list";
import Channel from "../withdraw/Channel";
import WithdrawBankBindList from "../withdraw/WithdrawBankBindList";
import WithdrawComplimentAwayList from "../withdraw/WithdrawComplimentAwayList";
import NotFound from "../not-found/not-found";
import DailyReport from "../list/DailyReport";
import GameDataList from "../list/gamedatalist";
import OnlineNumber from "../list/onlineNumber";
import RuleManage from "../admin_manage/ruleManage";
import BankOnePay from "../charge/bankOnePay";
import FishConfig from "../gameSetting/fishConfig";
import Ipconfig from "../gameSetting/ipconfig";
import WhitleList from "../gameSetting/whitenlist";
import Profitpoolsetting from "../gameSetting/profit_pool";
import B2bConfig from "../b2b/config";
import B2bRegister from "../b2b/register";
import ZRSX from "../gameData/ZRSX";
import MoneyFloatDetail from "../customer_service/moneyfloat_detail";
import BankCardCheck from "../user/bank_check";
import GetAmmountbyPhone from "../user/getAmmountbyPhone";
import GetBlackProxyUserList from "../user/getBlackProxyUserList";
import GetStatementTotalByID from "../user/getStatementTotalByID";
import { Provider, KeepAlive } from "react-keep-alive";
import { History } from "../customer_service/history";
import {
  OldYonghubaopei,
  OldYonghubaopeichaxun,
  Yonghubaopei,
  Yonghubaopeichaxun,
  ApplyFristPay,
  GetApplyFristPayUser,
} from "../activity/yonghubaopei";
import {
  GetPromotionCheck,
  ApplyPromotion,
  ApplyHandleHeNeiPay,
  GetApplyHeNei,
} from "../activity/promotion";
import {
  ChangeRoomStatus,
  UserLimitRangeBet,
  RoomLimitRangeBet,
} from "../gameSetting/subGameSetting/cylhd";
import {
  CycdxChangeRoomStatus,
  CycdxUserLimitRangeBet,
  CycdxRoomLimitRangeBet,
} from "../gameSetting/subGameSetting/cycdx";
import {
  XWBYcomponent1,
  XWBYcomponent2,
  XWBYcomponent3,
  XWBYcomponent4,
  SwitchChouFang,
} from "../gameSetting/subGameSetting/xwby";
import GamelistAG from "../gameSetting/subGameSetting/ag/GameList";
import GamelistJDB from "../gameSetting/subGameSetting/jdb/GameList";
import GamelistQT from "../gameSetting/subGameSetting/qt/GameList";
import GamelistPP from "../gameSetting/subGameSetting/pp/GameList";
import ProxyUserGold from "../proxy/baseDividend/UserGold";
import GetUserSortByGameTag from "../proxy/baseDividend/GetUserSortByGameTag";
import GetProxyUserInductionsSortByGameTag from "../proxy/baseDividend/GetProxyUserInductionsSortByGameTag";
import ProxyBaseDividend from "../proxy/baseDividend/Details";
import GetBaseDividendRule from "../proxy/baseDividend/GetBaseDividendRule";
import GetBaseChannel from "../proxy/baseDividend/GetBaseChannel";
import ProxyGameBetData from "../proxy/gameBetData";
import ProxyGameBetAmount from "../proxy/gameBetAmount";
import ProxyLoseProfitDevidend from "../proxy/lose_profit_devidend";
import GetPaymentInfoDetail from "../proxy/getPaymentInfoDetail";
import GetPaymentInfo from "../proxy/getPaymentInfo";
import GetBaseDividendRule1 from "../proxy/newBaseDividend/GetBaseDividentRule1";
import GetBaseDividendRule2 from "../proxy/secondBaseDividend/GetBaseDividentRule2";
import ProxyBaseDividend1 from "../proxy/newBaseDividend/Details";
import ProxyBaseDividend2 from "../proxy/secondBaseDividend/Details2";
import GetProxyGetGlobal from "../proxy/baseDividend/GetProxyGetGlobal";
import DonateList from "../liveStream/donateList";
import LiveReport from "../liveStream/liveReport";
import LiveBlackList from "../liveStream/blackList";
import HighSpeedNotificationOne from "../withdraw/highSpeedNotification/HighSpeedOne";
import HighSpeedNotificationTwo from "../withdraw/highSpeedNotification/HighSpeedTwo";
import PipeiOrderList from "../pipei/OrderList";
import PersonalDaily from "../ptWorkers/personal-daily";
import PersonalList from "../ptWorkers/personal-list";
import TeamDaily from "../ptWorkers/team-daily";
import TeamList from "../ptWorkers/team-list";
import PtLink from "../ptWorkers/ptlink";
import PtManage from "../ptWorkers/pt-manage";
import AccountDetail from "../accManage/accountDetail";
import UserGroupManage from "../accManage/userGroupManage";
import MyAgentRecharge from "../payManage/myAgentRecharge";
import MyAgentCash from "../payManage/myAgentCash";
import ServiceRecharge from "../payManage/serviceRecharge";
import ServiceCash from "../payManage/serviceCash";
import MyGoldDetail from "../payManage/myGoldDetail";
import MyGoldDetailXinyong from "../payManage/myGoldDetailXinyong";
import CreateNewService from "../payManage/creditManage/createNewService";
import ServiceDetail from "../payManage/creditManage/serviceDetail";
import LowerManage from "../ptWorkers/lower-manage";
import MenuManage from "../menuManage/menuManage";
import ActivityManage from "../activity/activity-manage";
import { conforms } from "lodash-es";
const { Sider, Content } = Layout;
const history = createHashHistory();

//后台管理的路由组件
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      package_id:0,
      login_user_id:0,
      role_id:0,
      password:0,
      account:"",
      collapsed:true
    };
  }
  componentDidMount(){
    const adminLoginData = JSON.parse(localStorage.getItem("adminLoginData"))
    if(adminLoginData){
      this.setState({
        package_id:Number(adminLoginData.packageid),
        role_id:Number(adminLoginData.roleid),
        admin_user_id:Number(adminLoginData.userid),
        password:Number(adminLoginData.password),
        account:adminLoginData.account,
      })
    }else{
      localStorage.removeItem("menuList");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("BASE");
      // 跳转到login
      this.props.history.replace("/login");
    }
    console.log("IsMobile",this.IsMobile())
    if(this.IsMobile()){
      this.setState({
        collapsed :true
      })
    }else{
      this.setState({
        collapsed :false
      })
    }
  }
  IsMobile() {
    let userAgent = navigator.userAgent,Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    console.log("userAgent",userAgent)
    return Agents.some((i)=>{
        return userAgent.includes(i)
    })
  }
  render() {
    const token = localStorage.token;
    // 如果内存没有存储token ==> 当前没有登陆
    if (!token) {
      return <Redirect to="/login" />;
    }
    // console.log("this.state.role_id",this.state.role_id)
    return (
      <Layout style={{ minHeight: "100%" ,display:"flex"}}>
        <Sider
            breakpoint="lg"
            collapsed ={this.state.collapsed}
            style={{
              overflow: "auto",
              height: "100%",
              position: "fixed",
              left: 0,
            }}
            width="200"
          >
            <LeftNav
              style
              onClick={(tabConfig) => {
                this.child1.add && this.child1.add(tabConfig);
              }}
              role_id = {this.state.role_id}
            />
          </Sider>
        <Layout style={{ marginLeft: this.IsMobile() ? 80 :200}}>
            <Header onRef={(ref) => (this.child1 = ref)} history={history} package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id} >
              Header
            </Header>
            <Content style={{ margin: 5, backgroundColor: "#fff" }}>
              <Provider>
                <div
                  style={{
                    height: "100%",
                  }}
                >
                  <Switch>
                    <Redirect from="/" exact to="/home" />
                    <Route path="/home" exact component={Home} />
                    <Route path="/user/user-list" exact>
                      <KeepAlive name="User">
                        <User />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/user_game_data" exact>
                      <KeepAlive name="UserGameData">
                        <UserGameData />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/landing_page" exact>
                      <KeepAlive name="LandingPage">
                        <LandingPage />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/detail" exact>
                      <KeepAlive name="MoneyFloatDetail">
                        <MoneyFloatDetail />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/bankCardCheck" exact>
                      <KeepAlive name="BankCardCheck">
                        <BankCardCheck />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/getAmmountbyPhone" exact>
                      <KeepAlive name="GetAmmountbyPhone">
                        <GetAmmountbyPhone />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/getBlackProxyUserList" exact>
                      <KeepAlive name="getBlackProxyUserList">
                        <GetBlackProxyUserList />
                      </KeepAlive>
                    </Route>
                    <Route path="/user/getStatementTotalByID" exact>
                      <KeepAlive name="getStatementTotalByID">
                        <GetStatementTotalByID />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/notice_list" exact>
                      <KeepAlive name="Notice_list">
                        <NoticeList />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/customer_list" exact>
                      <KeepAlive name="CustomerList">
                        <CustomerList />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/account" exact>
                      <KeepAlive name="CSAccount">
                        <CSAccount />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/autoreply" exact>
                      <KeepAlive name="Autoreply">
                        <Autoreply />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/history" exact>
                      <KeepAlive name="History">
                        <History />
                      </KeepAlive>
                    </Route>
                    <Route path="/customer_service/feedbacks" exact>
                      <KeepAlive name="Feedbacks">
                        <Feedbacks />
                      </KeepAlive>
                    </Route>
                    <Route path="/admin_manage/list" exact>
                      <KeepAlive name="AdminManageList">
                        <AdminManageList />
                      </KeepAlive>
                    </Route>
                    <Route path="/admin_manage/rule" exact>
                      <KeepAlive name="RuleManage">
                        <RuleManage />
                      </KeepAlive>
                    </Route>
                    <Route path="/admin_manage/role" exact>
                      <KeepAlive name="Role">
                        <Role />
                      </KeepAlive>
                    </Route>
                    <Route path="/list/daily-report" exact>
                      <KeepAlive name="DailyReport">
                        <DailyReport />
                      </KeepAlive>
                    </Route>
                    <Route path="/list/gameDataList" exact>
                      <KeepAlive name="GameDataList">
                        <GameDataList />
                      </KeepAlive>
                    </Route>
                    <Route path="/list/onlineNumber" exact>
                      <KeepAlive name="onlineNumber">
                        <OnlineNumber />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/config" exact>
                      <KeepAlive name="WrappedConfig">
                        <WrappedConfig />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/setBuYuConfig" exact>
                      <KeepAlive name="FishConfig">
                        <FishConfig />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/ipconfig" exact>
                      <KeepAlive name="Ipconfig">
                        <Ipconfig />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/whitelist" exact>
                      <KeepAlive name="whitelist">
                        <WhitleList />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/profitpoolsetting" exact>
                      <KeepAlive name="Profitpoolsetting">
                        <Profitpoolsetting isAuthed={true} />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/cylhd/changeRoomStatus"
                      exact
                    >
                      <KeepAlive name="ChangeRoomStatus">
                        <ChangeRoomStatus />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/cylhd/UserLimitRangeBet"
                      exact
                    >
                      <KeepAlive name="setUserLimitRangeBet">
                        <UserLimitRangeBet />
                      </KeepAlive>
                    </Route>
                    <Route
                      path="/gameSetting/subGame/cylhd/RoomLimitRangeBet"
                      exact
                    >
                      <KeepAlive name="RoomLimitRangeBet">
                        <RoomLimitRangeBet />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/cycdx/changeRoomStatus"
                      exact
                    >
                      <KeepAlive name="CycdxChangeRoomStatus">
                        <CycdxChangeRoomStatus />
                      </KeepAlive>
                    </Route>
                    <Route  path="/gameSetting/subGame/cycdx/UserLimitRangeBet"
                      exact
                    >
                      <KeepAlive name="CycdxUserLimitRangeBet">
                        <CycdxUserLimitRangeBet />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/cycdx/RoomLimitRangeBet"
                      exact
                    >
                      <KeepAlive name="CycdxRoomLimitRangeBet">
                        <CycdxRoomLimitRangeBet />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/xwby/level1" exact>
                      <KeepAlive name="XWBYcomponent1">
                        <XWBYcomponent1 serverId={3000} />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/xwby/level2" exact>
                      <KeepAlive name="XWBYcomponent2">
                        <XWBYcomponent2 serverId={3001} />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/xwby/level3" exact>
                      <KeepAlive name="XWBYcomponent3">
                        <XWBYcomponent3 serverId={3002} />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/xwby/level4" exact>
                      <KeepAlive name="XWBYcomponent4">
                        <XWBYcomponent4 serverId={3003} />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/xwby/switchChouFang" exact>
                      <KeepAlive name="SwitchChouFang">
                        <SwitchChouFang />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/ag/gamelistInfo" exact>
                      <KeepAlive name="GamelistAG">
                        <GamelistAG />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/jdb/gamelistInfo" exact>
                      <KeepAlive name="GamelistJDB">
                        <GamelistJDB />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/qt/gamelistInfo" exact>
                      <KeepAlive name="GamelistQT">
                        <GamelistQT />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameSetting/subGame/pp/gameListInfo" exact>
                      <KeepAlive name="GamelistPP">
                        <GamelistPP />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/setting" exact>
                      <KeepAlive name="ProxySetting">
                        <ProxySetting />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/userLinkAccount" exact>
                      <KeepAlive name="UserLinkAccount">
                        <UserLinkAccount />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/check" exact>
                      <KeepAlive name="ProxyCheck">
                        <ProxyCheck />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/lose_profit" exact>
                      <KeepAlive name="LoseProfit">
                        <LoseProfit />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/getStockDividendInfo" exact>
                      <KeepAlive name="getStockDividendInfo">
                        <GetStockDividendInfo />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/getProxyUserLinkAllInfo" exact>
                      <KeepAlive name="getProxyUserLinkAllInfo">
                        <GetProxyUserLinkAllInfo />
                      </KeepAlive>
                    </Route>

                    <Route path="/proxy/lose_profit_devidend/details" exact>
                      <KeepAlive name="ProxyLoseProfitDevidend">
                        <ProxyLoseProfitDevidend />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/getPaymentInfoDetail/details" exact>
                      <KeepAlive name="getPaymentInfoDetail">
                        <GetPaymentInfoDetail />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/getPaymentInfo/details" exact>
                      <KeepAlive name="getPaymentInfo">
                        <GetPaymentInfo />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/userGold" exact>
                      <KeepAlive name="ProxyUserGold">
                        <ProxyUserGold />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/getUserSortByGameTag" exact>
                      <KeepAlive name="getUserSortByGameTag">
                        <GetUserSortByGameTag />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/getUserInductionsSortByGameTag"
                      exact
                    >
                      <KeepAlive name="getUserInductionsSortByGameTag">
                        <GetProxyUserInductionsSortByGameTag />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/gameBetData" exact>
                      <KeepAlive name="ProxyGameBetData">
                        <ProxyGameBetData />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/gameBetAmount" exact>
                      <KeepAlive name="ProxyGameBetAmount">
                        <ProxyGameBetAmount />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/details" exact>
                      <KeepAlive name="ProxyBaseDividend">
                        <ProxyBaseDividend />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/getBaseChannel" exact>
                      <KeepAlive name="GetBaseChannel">
                        <GetBaseChannel />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/getBaseDividendRule" exact>
                      <KeepAlive name="GetBaseDividendRule">
                        <GetBaseDividendRule />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividend/getGlobal" exact>
                      <KeepAlive name="GetProxyGetGlobal">
                        <GetProxyGetGlobal />
                      </KeepAlive>
                    </Route>
                    <Route   path="/proxy/baseDividendNew/GetBaseDividendRule"
                      exact
                    >
                      <KeepAlive name="GetBaseDividendRule1">
                        <GetBaseDividendRule1 />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividendsecond/GetBaseDividendRule"
                      exact
                    >
                      <KeepAlive name="GetBaseDividendRule2">
                        <GetBaseDividendRule2 />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividendNew/details" exact>
                      <KeepAlive name="ProxyBaseDividend1">
                        <ProxyBaseDividend1 />
                      </KeepAlive>
                    </Route>
                    <Route path="/proxy/baseDividendsecond/details" exact>
                      <KeepAlive name="ProxyBaseDividend2">
                        <ProxyBaseDividend2 />
                      </KeepAlive>
                    </Route>
                    <Route path="/messageCenter/tasks" exact>
                      <KeepAlive name="Tasks">
                        <Tasks />
                      </KeepAlive>
                    </Route>
                    <Route path="/messageCenter/taskList" exact>
                      <KeepAlive name="TaskList">
                        <TaskList />
                      </KeepAlive>
                    </Route>
                    <Route path="/trade/accountList" exact>
                      <KeepAlive name="AccountList">
                        <AccountList />
                      </KeepAlive>
                    </Route>
                    <Route path="/trade/applyHistory" exact>
                      <KeepAlive name="ApplyHistory">
                        <ApplyHistory />
                      </KeepAlive>
                    </Route>
                    <Route path="/trade/tradeOrder" exact>
                      <KeepAlive name="TradeOrder">
                        <TradeOrder />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/list" exact>
                      <KeepAlive name="ActivityList">
                        <ActivityList />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/yonghubaopei" exact>
                      <KeepAlive name="Yonghubaopei">
                        <Yonghubaopei />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getApplyReimburseUser" exact>
                      <KeepAlive name="Yonghubaopeichaxun">
                        <Yonghubaopeichaxun />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/oldUserApplyReimburse" exact>
                      <KeepAlive name="OldYonghubaopei">
                        <OldYonghubaopei />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getApplyReimburseOldUser" exact>
                      <KeepAlive name="OldYonghubaopeichaxun">
                        <OldYonghubaopeichaxun />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/applyFristPay" exact>
                      <KeepAlive name="applyFristPay">
                        <ApplyFristPay />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getApplyFristPayUser" exact>
                      <KeepAlive name="getApplyFristPayUser">
                        <GetApplyFristPayUser />
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
                    <Route path="/activity/activitySetting" exact>
                      <KeepAlive name="ActivitySetting">
                        <ActivitySetting />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/fruitSetting" exact>
                      <KeepAlive name="FruitSetting">
                        <FruitSetting />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getPromotion" exact>
                      <KeepAlive name="getPromotion">
                        <GetPromotionCheck />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/applyPromotion" exact>
                      <KeepAlive name="ApplyPromotion">
                        <ApplyPromotion />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getApplyHeNei" exact>
                      <KeepAlive name="GetApplyHeNei">
                        <GetApplyHeNei />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/applyHandleHeNeiPay" exact>
                      <KeepAlive name="ApplyHandleHeNeiPay">
                        <ApplyHandleHeNeiPay />
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/getBonusPool" exact>
                      <KeepAlive name="getBonusPool">
                        <GetBonusPool />
                      </KeepAlive>
                    </Route>
                    <Route path="/charge/order_list" exact>
                      <KeepAlive name="OrderList">
                        <OrderList />
                      </KeepAlive>
                    </Route>
                    <Route path="/charge/channel-list" exact>
                      <KeepAlive name="ChannelList">
                        <ChannelList />
                      </KeepAlive>
                    </Route>
                    <Route path="/charge/bankcard-list" exact>
                      <KeepAlive name="BankcardList">
                        <BankcardList />
                      </KeepAlive>
                    </Route>
                    <Route path="/charge/back_onepay" exact>
                      <KeepAlive name="BankOnePay">
                        <BankOnePay />
                      </KeepAlive>
                    </Route>
                    <Route path="/artificialcharge/order" exact>
                      <KeepAlive name="RechargeOrder">
                        <RechargeOrder />
                      </KeepAlive>
                    </Route>
                    <Route path="/artificialcharge/Daichong" exact>
                      <KeepAlive name="Daichong">
                        <Daichong />
                      </KeepAlive>
                    </Route>
                    <Route path="/charge/recharge_channel" exact>
                      <KeepAlive name="RechargeChannel">
                        <RechargeChannel />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/withdraw_list" exact>
                      <KeepAlive name="WithdrawList">
                        <WithdrawList />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/withdraw_black_list" exact>
                      <KeepAlive name="WithdrawBlackList">
                        <WithdrawBlackList />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/bankBindList" exact>
                      <KeepAlive name="WithdrawBankBindList">
                        <WithdrawBankBindList />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/ComplimentAwayList" exact>
                      <KeepAlive name="WithdrawComplimentAwayList">
                        <WithdrawComplimentAwayList />
                      </KeepAlive>
                    </Route>
                    <Route path="/artificialWithdraw/order" exact>
                      <KeepAlive name="DaitiList">
                        <DaitiList />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/channel" exact>
                      <KeepAlive name="Channel">
                        <Channel />
                      </KeepAlive>
                    </Route>
                    <Route path="/gift/list" exact>
                      <KeepAlive name="GiftList">
                        <GiftList />
                      </KeepAlive>
                    </Route>
                    <Route path="/gift/setting" exact>
                      <KeepAlive name="GiftSetting">
                        <GiftSetting />
                      </KeepAlive>
                    </Route>
                    <Route path="/AI/robot" exact>
                      <KeepAlive name="AI">
                        <AI />
                      </KeepAlive>
                    </Route>
                    <Route path="/b2b/config" exact>
                      <KeepAlive name="B2bConfig">
                        <B2bConfig />
                      </KeepAlive>
                    </Route>
                    <Route path="/b2b/register" exact>
                      <KeepAlive name="B2bRegister">
                        <B2bRegister />
                      </KeepAlive>
                    </Route>
                    <Route path="/gameData/ZRSX" exact>
                      <KeepAlive name="ZRSX">
                        <ZRSX />
                      </KeepAlive>
                    </Route>
                    <Route path="/live/donate_list" exact>
                      <KeepAlive name="DonateList">
                        <DonateList />
                      </KeepAlive>
                    </Route>
                    <Route path="/live/streamer_report" exact>
                      <KeepAlive name="streamerReport">
                        <LiveReport type="streamer" />
                      </KeepAlive>
                    </Route>
                    <Route path="/live/user_report" exact>
                      <KeepAlive name="userReport">
                        <LiveReport type="user" />
                      </KeepAlive>
                    </Route>
                    <Route path="/live/blacklist" exact>
                      <KeepAlive name="blacklist">
                        <LiveBlackList />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/highSpeedNotification1" exact>
                      <KeepAlive name="HighSpeedNotificationOne">
                        <HighSpeedNotificationOne />
                      </KeepAlive>
                    </Route>
                    <Route path="/withdraw/highSpeedNotification2" exact>
                      <KeepAlive name="HighSpeedNotificationTwo">
                        <HighSpeedNotificationTwo />
                      </KeepAlive>
                    </Route>
                    <Route path="/pipei/orderList" exact>
                      <KeepAlive name="PipeiOrderList">
                        <PipeiOrderList />
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/personal-daily" exact>
                      <KeepAlive name="PersonalDaily">
                        <PersonalDaily package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/team-daily" exact>
                      <KeepAlive name="TeamDaily">
                        <TeamDaily package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/personal-list" exact>
                      <KeepAlive name="PersonalList">
                        <PersonalList package_id={this.state.package_id} account = {this.state.account} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/team-list" exact>
                      <KeepAlive name="TeamList">
                        <TeamList package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/pt-manage" exact>
                      <KeepAlive name="PtManage">
                        <PtManage package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/accManage/accountDetail" exact>
                      <KeepAlive name="AccountDetail">
                        <AccountDetail  package_id={this.state.package_id} account={this.state.account} password={this.state.password} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/accManage/userGroupManage" exact>
                      <KeepAlive name="UserGroupManage">
                        <UserGroupManage package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/myAgentRecharge" exact>
                      <KeepAlive name="MyAgentRecharge">
                        <MyAgentRecharge package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/myAgentCash" exact>
                      <KeepAlive name="MyAgentCash">
                        <MyAgentCash package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/serviceRecharge" exact>
                      <KeepAlive name="ServiceRecharge">
                        <ServiceRecharge package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/serviceCash" exact>
                      <KeepAlive name="ServiceCash">
                        <ServiceCash package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/myGoldDetail" exact>
                      <KeepAlive name="MyGoldDetail">
                        <MyGoldDetail package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/myGoldDetailXinyong" exact>
                      <KeepAlive name="MyGoldDetailXinyong">
                        <MyGoldDetailXinyong package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/creditManage/createNewService" exact>
                      <KeepAlive name="CreateNewService">
                        <CreateNewService />
                      </KeepAlive>
                    </Route>
                    <Route path="/payManage/creditManage/serviceDetail" exact>
                      <KeepAlive name="ServiceDetail">
                        <ServiceDetail package_id={this.state.package_id} account = {this.state.account} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/pt-link" exact>
                      <KeepAlive name="PtLink">
                        <PtLink package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/ptWorkers/lower-manage" exact>
                      <KeepAlive name="LowerManage">
                        <LowerManage package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/menuManage/menuManage" exact>
                      <KeepAlive name="MenuManage">
                        <MenuManage package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
                      </KeepAlive>
                    </Route>
                    <Route path="/activity/activity-manage" exact>
                      <KeepAlive name="ActivityManage">
                        <ActivityManage package_id={this.state.package_id} admin_user_id = {this.state.admin_user_id}/>
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
