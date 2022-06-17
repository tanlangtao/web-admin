import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, message, Icon } from "antd";
import { navList } from "../../api";
import "./index.less";

const SubMenu = Menu.SubMenu;
// 左侧导航的组件
class LeftNav extends Component {
  constructor() {
    super();
    this.state = { data: [], openKey: "", menuNodes: null };
  }
  /*
   获取左侧菜单导航栏
  */
  getMenuList = async () => {
    const result = await navList();
    if (result.status === 0) {
      this.setState({
        data: result.data,
      });
    } else {
      message.info("网络问题，请重新登陆");
    }
  };
  componentWillReceiveProps(){
    const menuList = JSON.parse(localStorage.getItem("menuList"));
    const menuNodes = this.getMenuNodes(menuList);
    this.setState({ menuNodes });
  }
  /*
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;
    // console.log(path);

    //递归菜单函数
    //menulist转变为menunodes
    var self = this;
    function getMoreMenuNodes(item) {
      // console.log('item=====',item);
      if (!item.children) {
        // console.log('item.title111====',item,item.title);
        return (
          <Menu.Item
            key={item.key}
            onClick={() => {
              self.props.onClick(item);
            }}
          >
            
            <Link to={item.key}>
            <Icon type='bug' />
              <span>{item.title.replace(/&nbsp;/g, "")}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        // console.log('item.title222====',item,item.title);

        return (
          <SubMenu
          
            key={item.key || item.id}
            title={
              <span>
              <Icon id='airplane' />
                <span>{item.title.replace(/&nbsp;/g, "")}</span>
              </span>
            }
          >
            {/* <Icon type='bug' /> */}
            {item.children.reduce((cpre, ele) => {
              // console.log('ele=',ele)
              cpre.push(getMoreMenuNodes(ele));
              return cpre;
            }, [])}
            {/* {item.children.forEach(ele => {
							getMoreMenuNodes(ele);
						})} */}
          </SubMenu>
        );
      }
    }
    function findPathIndex(item) {
      function iter(o, pathindex) {
        if (o.children) {
          o.children.forEach((ele) => {
            return iter(ele, pathindex.concat(o.key || `${o.id}`));
          });
        }
        if (!o.children) {
          result.push({ value: o.key || `${o.id}`, pathindex: pathindex });
        }
      }

      var result = [],
        target = [];
      iter(item, []);
      // console.log("res====", result);
      result.forEach((e) => {
        if (e.value === path) {
          target = e.pathindex;
        }
      });
      return target;
    }
    return (

      menuList &&
      menuList.reduce((pre, item) => {
        // 向pre添加<Menu.Item>
        // if (item.key) {
        //按需渲染侧边栏，必须已经在后台-权限管理中设置了路由key才能渲染
        if (!item.children) {
          pre.push(
            <Menu.Item
              key={item.key}
              onClick={() => {
                this.props.onClick(item);
                this.openMenu = item.key;
              }}
            >
              <Link to={item.key}>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
          console.log('item.title====', item.title)
        } else {
          // console.log('2item.title====', item.tittle)
          if (item.title == '用户管理' || item.title == '报表管理' || item.title == "推广员管理" || item.title == "账户管理" || item.title == "支付管理" || item.title == "菜单管理" || item.title == "活动管理") {
            // console.log('2item.title====', item.children)
            //下面代码放入这里即可控制左侧标签渲染数量
            // 查找一个与当前请求路径匹配的子Item
            const cItem = item.children.find(
              (currentValue) =>
                currentValue.key && path.indexOf(currentValue.key) === 0
            );
            //渲染二级菜单
            // 如果存在, 说明当前item的子列表需要打开
            // console.log('cItem===', cItem, "sdsd", item.key);
            if (cItem && item.key) {
              this.openKey = [item.key];
            }

            this.openKey = findPathIndex(item);
            // console.log("this.openKey", this.openKey);
            pre.push(
              <SubMenu
                key={item.key || item.id}
                title={
                  <span>
                    {/* <Icon id='cicle' /> */}
                    <Icon type={item.type} />
                    <span>{item.title}</span>
                  </span>
                }
                onClick={() => {
                  this.openMenu = item.key;
                }}
              >
                {item.title === "第三方游戏数据" &&
                  item.children.reduce((cpre, ele) => {
                    if (ele.title === "真人视讯") {
                      cpre.push(
                        <Menu.Item
                          key={ele.key}
                          onClick={() => {
                            this.props.onClick(ele);
                          }}
                        >

                          <Link to={ele.key}>

                            <span>{ele.title}</span>
                          </Link>
                        </Menu.Item>
                      );
                    } else {
                      cpre.push(
                        //不在後台操作，瀏覽器打開新分頁訪問三方後台
                        <Menu.Item key={ele.key}>
                          <a
                            href={ele.key}
                            target="_blank"
                            rel="noreferrer noopener"
                          >

                            <span>{ele.title}</span>
                          </a>
                        </Menu.Item>
                      );
                    }
                    return cpre;
                  }, [])}
                {item.title !== "第三方游戏数据" &&
                  item.children.reduce((cpre, ele) => {
                    // if (ele.title == "用户列表" || ele.title == "日常运营"
                    //   || ele.title == "本级数据日报" || ele.title == "团队数据日报" || ele.title == "个人结算列表" || ele.title == "团队结算列表" || ele.title == "推广链接" ||ele.title == "下级管理" || ele.title == "推广管理"
                    //   || ele.title == "账户详情" || ele.title == "用户组管理"
                    //   || ele.title == "人工充值" || ele.title == "我的代充" || ele.title == "人工兑换" || ele.title == "我的代付" || ele.title == "代充管理" || ele.title == "代充明细" || ele.title == "新增代充" || ele.title == "充提账变" || ele.title == "信用账变"
                    //   || ele.title == "菜单管理"
                    // ) 
                    // {
                    //   // console.log('渲染===ele.title===', ele.title);
                    //   switch (ele.title) {
                    //     case "子游戏设定":
                    //     case "无限代保底分红":
                    //     case "无限代保底分红1":
                    //     case "无限代保底分红2":
                    //     case "亏损分红充提差":
                    //     case "提现手续费5级分红":
                    //       cpre.push(getMoreMenuNodes(ele));
                    //       break;
                    //     default:
                    //       cpre.push(
                    //         <Menu.Item
                    //           key={ele.key}
                    //           onClick={() => {
                    //             this.props.onClick(ele);
                    //           }}
                    //         >
                    //           {/* 左侧菜单二级菜单按钮渲染图表 type="bug"*/}
                    //           <Link to={ele.key}>
                    //             <Icon id='airplane' />
                    //             <span>{ele.title}</span>
                    //           </Link>
                    //         </Menu.Item>
                    //       );
                    //   }
                    // }
                    // return cpre;
                    cpre.push(
                      <Menu.Item
                        key={ele.key}
                        onClick={() => {
                          this.props.onClick(ele);
                        }}
                      >
                        {/* 左侧菜单二级菜单按钮渲染图表 type="bug"*/}
                        <Link to={ele.key}>
                          <Icon id='airplane' />
                          <span>{ele.title}</span>
                        </Link>
                      </Menu.Item>
                    );
                    return cpre;
                    // }

                  }, [])}
              </SubMenu>

            );
          } else {
          }


          //每个item 包含左侧导航栏信息以及二级菜单下级
          // children: Array(7) 0: {id: 26, title: '用户列表', href: '/admin/user/index', key: '/user/user-list', pid: 1, …}
          //                    1: {id: 184, title: '用户游戏数据', href: '', key: '/user/user_game_data', pid: 1, …}
          //                     2: {id: 197, title: '落地页访问查询', href: '/admin/Operation/Api/GetSaveCodeList', key: '/user/landing_page', pid: 1, …}
          //                     3: {id: 228, title: '银行卡反查', href: '/admin/user/queryAccount', key: '/user/bankCardCheck', pid: 1, …}
          //                     4: {id: 343, title: '用户盈亏数据', href: '/admin/proxy/user/GetStatementTotalByID', key: '/user/getStatementTotalByID', pid: 1, …}
          //                     5: {id: 296, title: ' 批量电话号码查询', href: '/admin/user/queryAccount\t', key: '/user/getAmmountbyPhone', pid: 1, …}
          //                     6: {id: 321, title: '代理佣金转出黑名单', href: '/admin/Operation/Api/getBlackProxyUserList', key: '/user/getBlackProxyUserList', pid: 1, …}
          // length: 7
          // [[Prototype]]: Array(0)
          // href: ""
          // icon: ""
          // id: 1
          // key: "/user"
          // pid: 0
          // spread: false
          // title: "用户"

        }
        // }
        return pre;
      }, [])
    );
  };
  componentWillMount() {
    const adminLoginData = JSON.parse(localStorage.getItem("adminLoginData"))
    
    if(adminLoginData){
        this.role_id = Number(adminLoginData.roleid)
        this.package_id = Number(adminLoginData.packageid)
    }else{
        localStorage.removeItem("menuList");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("BASE");
        // 跳转到login
        this.props.history.replace("/login");
    }
    const menuList = JSON.parse(localStorage.getItem("menuList"));
    if (!menuList) {
      this.getMenuList()
      return
    }
    // let hasactivity = false
    // menuList.forEach((e)=>{
    //   if(e.title == "活动管理"){
    //     hasactivity = true
    //   }
    // })
    // if(!hasactivity){
    //   menuList.push({
    //     id:3,
    //     title:"活动管理",
    //     level:1,
    //     children:[{
    //       id:15,
    //       title:"活动领取列表",
    //       level:2
    //     }]
    //   })
    // }
    let newList = this.reduceItem(menuList)
    localStorage.menuList = JSON.stringify(newList)
    const menuNodes = this.getMenuNodes(newList);
    this.setState({ menuNodes });
  }
  reduceItem(menuList){
    return menuList.map(e=>{
      if(e.children){
        e.children = this.reduceItem(e.children)
        return {
          ...e,
          key:this.GetIdToKey(e.title)[0],
          type:this.GetIdToKey(e.title)[1],
          children:e.children
        }
      }else{
        return {...e,key:this.GetIdToKey(e.title)[0],type:this.GetIdToKey(e.title)[1]
        }
      }
    })
  }
  GetIdToKey(title){
    let key = ""
    let type = "bug"
    switch(title){
      case "用户管理": key = "/user";type= "user" ; break; //用户管理
      case "支付管理": key = "/payManage";type="pay-circle" ; break; // 支付管理
      case "活动管理": key = "/activity" ;type="fire"; break; // 活动管理
      case "报表管理": key = "/list" ;type="table"; break; // 报表管理
      case "推广员管理": key = "/ptWorkers" ;type="team"; break; // 推广员管理
      case "账户管理": key = "/accManage" ;type="idcard";  break; //账户管理
      case "用户列表": key = "/user/user-list" ; ;break;//用户列表
      case "人工充值": key = "/payManage/serviceRecharge" ;break;//人工充值
      case "人工兑换": key = "/payManage/serviceCash" ; break;//人工兑换
      case "代充管理": key = "/payManage/creditManage/serviceDetail" ; break; // 代充管理
      case "我的代充": key = "/payManage/myAgentRecharge" ; break; // 我的代充
      case "我的代付": key = "/payManage/myAgentCash" ; break;//我的代付
      case "充提账变": key = "/payManage/myGoldDetail" ; break;//充提账变
      case "信用账变": key = "/payManage/myGoldDetailXinyong" ; break;//信用账变
      case "活动领取列表": key = "/activity/activity-manage" ; break;//活动领取列表
      case "日常运营": key = "/list/daily-report" ; break;//日常运营
      case "历史个人数据": key = "/ptWorkers/personal-daily" ; break;//本级数据日报
      case "历史团队数据": key = "/ptWorkers/team-daily" ; break;//团队数据日报
      case "个人结算列表": key = "/ptWorkers/personal-list" ; break;//个人结算列表
      case "团队结算列表": key = "/ptWorkers/team-list" ; break;//团队结算列表  
      case "推广链接": key = "/ptWorkers/pt-link" ; break;//推广链接
      case "下级管理": key = "/ptWorkers/lower-manage" ; break;//下级管理
      case "推广管理": key = "/ptWorkers/pt-manage" ; break;//推广管理
      case "个人账户": key = "/accManage/accountDetail" ; break;//个人账户
      case "菜单管理": key = "/accManage/menuManage" ;type="menu"; break;//菜单管理
      case "权限管理": key = "/accManage/roleManage" ; break; //权限管理
      case "账户管理": key = "/accManage/accountDetail" ; break; //账户管理 
      case "域名配置": key = "/accManage/doman-config" ; break; //域名配置 
      case "账户列表": key = "/accManage/acc-list" ; break; //账户列表 
      case "单日团队数据": key = "/ptWorkers/daily-settlement" ; break; //单日团队数据 
      case "游戏玩家数据": key = "/list/gamedatalist" ; break; //游戏数据
      case "注册送28元35": key = "/activity/zcs-28" ; break; //活动，注册送28
      case "新用户包赔活动35": key = "/activity/xyhbp35" ; break; //活动，注册送28
    }
    return [key,type]
  }
  componentDidMount() {
    this.setState({ openKey: this.openKey });
  }
  getGameName(){
    let name = ""
    this.package_id = 35
    switch(this.package_id){
      case 20,35:
       name = "冠赢国际"
       break;
      default :
        name = ""
        break;
    }
    return name
  }
  IsMobile() {
    let userAgent = navigator.userAgent,Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    console.log("userAgent",userAgent)
    return Agents.some((i)=>{
        return userAgent.includes(i)
    })
}
  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    return (
      <div className="left-nav">
        <div
          className="left-nav-header"
          onClick={() => (window.location.href = "/")}
        >
          <h1 style={{fontSize:"15px"}}>{`${this.getGameName()}游戏中心`}</h1>
          {/* <h4>V:1.0.9</h4> */}
        </div>
        <Menu
          mode="inline"
          theme="light"
          className = "lefv-nav-manu"
          // selectedKeys={[path]}
          // defaultOpenKeys={[this.openKey]}
          onOpenChange={(key) => {
            console.log('key====', key, this.state.openKey);
            // if (key[1] && key[0] !== key[1]) {
            // 	this.setState({ openKey: [key[1]] });
            // } else {
            // 	this.setState({ openKey: [] });
            // }
            this.setState({ openKey: key });
          }}
          openKeys={this.state.openKey}
        >
          {this.state.menuNodes}
        </Menu>
      </div>
    );
  }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav);
