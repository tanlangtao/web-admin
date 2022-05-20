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
    console.log(path);

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
      console.log("res====", result);
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
          if (item.title == '用户管理' || item.title == '报表管理' || item.title == "推广员管理" || item.title == "账户管理" || item.title == "支付管理") {
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

            if (
              path.includes("/gameSetting/subGame") &&
              item.title === "游戏设定"
            ) {
              this.openKey = findPathIndex(item);
              console.log("this.openKey", this.openKey);
            }
            pre.push(
              <SubMenu
                key={item.key || item.id}
                title={
                  // 左侧一级菜单主页按钮渲染type="menu" 
                  <span>
                    <Icon id='cicle' />

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
                    //只有"子游戏设定"栏(id=229)需要三级导航栏,由于menulist的特殊性,故不对所有submenu递归
                    //需要三级导航栏 2021-6-28"无限代保底分红"栏(id=254) 2021-7-4"亏损分红充提差"(id=257)
                    // console.log('ele.title===', ele.title);
                    //目前只渲染报表 和 用户数据
                    // console.log("this.props.role_id",this.props.role_id)
                    if(this.role_id == 2){
                      //操盘  列出来的不显示
                      if(ele.title=="我的代充" || ele.title=="我的代付" || ele.title=="个人结算列表" || ele.title=="本级数据日报" || ele.title == "个人账变" ){
                        return cpre
                      }
                    }else if(this.role_id == 3){
                      //充提组
                      if(ele.title=="人工充值" || ele.title=="人工兑换" || ele.title == "代充管理" ){
                        return cpre
                      }
                    }else if(this.role_id == 4){
                      //推广组
                      if(ele.title=="团队数据日报" || ele.title=="团队结算列表" || ele.title == "推广管理" ){
                        return cpre
                      }
                    }if(this.role_id == 1){
                      //超管
                      if(ele.title=="账户详情"){
                        return cpre
                      }
                    }
                    if (ele.title == "用户列表" || ele.title == "日常运营"
                      || ele.title == "本级数据日报" || ele.title == "团队数据日报" || ele.title == "个人结算列表" || ele.title == "团队结算列表" || ele.title == "推广链接" ||ele.title == "下级管理" || ele.title == "推广管理"
                      || ele.title == "账户详情" || ele.title == "用户组管理"
                      || ele.title == "人工充值" || ele.title == "我的代充" || ele.title == "人工兑换" || ele.title == "我的代付" || ele.title == "代充管理" || ele.title == "代充明细" || ele.title == "新增代充" || ele.title == "个人账变"
                    ) {
                      // console.log('渲染===ele.title===', ele.title);
                      switch (ele.title) {
                        case "子游戏设定":
                        case "无限代保底分红":
                        case "无限代保底分红1":
                        case "无限代保底分红2":
                        case "亏损分红充提差":
                        case "提现手续费5级分红":
                          cpre.push(getMoreMenuNodes(ele));
                          break;
                        default:
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
                      }
                    }

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
    console.log(menuList)
    let HasTuiGuangYuan = false
    let HasPaymentManage = false  
    if (!menuList) {
      this.getMenuList()
      return
    }
    let testMenulist = []
    menuList.forEach(e => {
       if(e.title == "用户管理"){
        let testItem= {
          children:[
            {id: 26, title: '用户列表', href: '/admin/user/index', key: '/user/user-list', pid: 1,children: null,spread: false},
          ],
          href:"",
          icon:"",
          key:"/user",
          id:1,
          pid:0,
          spread:false,
          title:"用户管理",
        }
        testMenulist.push(testItem)
      }else if(e.title == "支付管理"){
        HasPaymentManage = true
        let testItem= {
          children:[
            {id: 998, title: '人工充值', href: '/payManage/serviceRecharge', key: '/payManage/serviceRecharge', pid: 1,children: null,spread: false},
            {id: 998, title: '人工兑换', href: '/admin/user/index', key: '/payManage/serviceCash', pid: 1,children: null,spread: false},
            {id: 998, title: '我的代充', href: '/admin/user/index', key: '/payManage/myAgentRecharge', pid: 1,children: null,spread: false},
            {id: 998, title: '我的代付', href: '/admin/user/index', key: '/payManage/myAgentCash', pid: 1,children: null,spread: false},
            {id: 998, title: '个人账变', href: '/admin/user/index', key: '/payManage/myGoldDetail', pid: 1,children: null,spread: false},
            {id: 998, title: '代充管理', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/serviceDetail', pid: 1,children: null,spread: false},
            // {id: 998, title: '新增代充', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/createNewService', pid: 1,children: null,spread: false},
          ],
          href:"",
          icon:"",
          key:"/payManage",
          id:999,
          pid:0,
          spread:false,
          title:"支付管理",
        }
        testMenulist.push(testItem)
      }else if (e.title == "推广员管理") {
        HasTuiGuangYuan  = true
        let testItem = {
          children: [
            { id: 998, title: '本级数据日报', href: '/admin/user/index', key: '/ptWorkers/personal-daily', pid: 1, children: null, spread: false },
            { id: 997, title: '团队数据日报', href: '/admin/user/index', key: '/ptWorkers/team-daily', pid: 1, children: null, spread: false },
            { id: 996, title: '个人结算列表', href: '/admin/user/index', key: '/ptWorkers/personal-list', pid: 1, children: null, spread: false },
            { id: 995, title: '团队结算列表', href: '/admin/user/index', key: '/ptWorkers/team-list', pid: 1, children: null, spread: false },
            { id: 995, title: '推广链接', href: '/admin/user/index', key: '/ptWorkers/pt-link', pid: 1, children: null, spread: false },
            { id: 995, title: '下级管理', href: '/admin/user/index', key: '/ptWorkers/lower-manage', pid: 1, children: null, spread: false },
            { id: 995, title: '推广管理', href: '/admin/user/index', key: '/ptWorkers/pt-manage', pid: 1, children: null, spread: false },
          ],
          href: "",
          icon: "",
          key: "/ptWorkers",
          id: 999,
          pid: 0,
          spread: false,
          title: "推广员管理",
        }
        testMenulist.push(testItem)
      }else if(e.title == "报表管理"){
        let testItem= {
          children:[
            {id: 130, title: '日常运营', href: '/admin/report/dailyReport', key: '/list/daily-report', pid: 22,children: null,spread: false},
          ],
          href:"",
          icon:"",
          key:"/list",
          id:1,
          pid:0,
          spread:false,
          title:"报表管理",
        }
        testMenulist.push(testItem)
      }else if(e.title == "账户管理"){
        let testItem = {
          children:[
            {id: 998, title: '账户详情', href: '/admin/user/index', key: '/accManage/accountDetail', pid: 1,children: null,spread: false},
            // {id: 998, title: '用户组管理', href: '/admin/user/index', key: '/accManage/userGroupManage', pid: 1,children: null,spread: false},
          ],
          href:"",
          icon:"",
          key:"/accManage",
          id:999,
          pid:0,
          spread:false,
          title:"账户管理",
  
        }
        testMenulist.push(testItem)
      }
    })
    if(!HasTuiGuangYuan && (this.role_id == 2 || this.role_id == 4 )){
      let testItem = {
        children: [
          { id: 998, title: '本级数据日报', href: '/admin/user/index', key: '/ptWorkers/personal-daily', pid: 1, children: null, spread: false },
          { id: 997, title: '团队数据日报', href: '/admin/user/index', key: '/ptWorkers/team-daily', pid: 1, children: null, spread: false },
          { id: 996, title: '个人结算列表', href: '/admin/user/index', key: '/ptWorkers/personal-list', pid: 1, children: null, spread: false },
          { id: 995, title: '团队结算列表', href: '/admin/user/index', key: '/ptWorkers/team-list', pid: 1, children: null, spread: false },
          { id: 995, title: '推广链接', href: '/admin/user/index', key: '/ptWorkers/pt-link', pid: 1, children: null, spread: false },
          { id: 995, title: '下级管理', href: '/admin/user/index', key: '/ptWorkers/lower-manage', pid: 1, children: null, spread: false },
          { id: 995, title: '推广管理', href: '/admin/user/index', key: '/ptWorkers/pt-manage', pid: 1, children: null, spread: false },
        ],
        href: "",
        icon: "",
        key: "/ptWorkers",
        id: 999,
        pid: 0,
        spread: false,
        title: "推广员管理",
      }
      testMenulist.splice(2,0,testItem)
    }
    if(!HasPaymentManage &&  (this.role_id == 1 || this.role_id == 2 || this.role_id == 3 )){
      let testItem= {
        children:[
          {id: 998, title: '人工充值', href: '/payManage/serviceRecharge', key: '/payManage/serviceRecharge', pid: 1,children: null,spread: false},
          {id: 998, title: '人工兑换', href: '/admin/user/index', key: '/payManage/serviceCash', pid: 1,children: null,spread: false},
          {id: 998, title: '我的代充', href: '/admin/user/index', key: '/payManage/myAgentRecharge', pid: 1,children: null,spread: false},
          {id: 998, title: '我的代付', href: '/admin/user/index', key: '/payManage/myAgentCash', pid: 1,children: null,spread: false},
          {id: 998, title: '个人账变', href: '/admin/user/index', key: '/payManage/myGoldDetail', pid: 1,children: null,spread: false},
          {id: 998, title: '代充管理', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/serviceDetail', pid: 1,children: null,spread: false},
          // {id: 998, title: '新增代充', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/createNewService', pid: 1,children: null,spread: false},
        ],
        href:"",
        icon:"",
        key:"/payManage",
        id:999,
        pid:0,
        spread:false,
        title:"支付管理",
      }
      testMenulist.splice(1,0,testItem)
    }
    console.log(testMenulist)
    localStorage.menuList = JSON.stringify(testMenulist)
    const menuNodes = this.getMenuNodes(testMenulist);
    this.setState({ menuNodes });
  }
  // 旧版本渲染方式，先隐藏
  // componentWillMount() {
  //   const menuList = JSON.parse(localStorage.getItem("menuList"));
  //   console.log(menuList)
  //   if(!menuList){
  //     this.getMenuList()
  //     return
  //   }
  //   // test 
  //   let HasTuiGuangYuan = false
  //   menuList.forEach(e=>{
  //     if(e.title == "推广员管理"){
  //       HasTuiGuangYuan = true
  //     }
  //   })
  //   if(!HasTuiGuangYuan){
  //     let testitem = {
  //       children:[
  //         {id: 998, title: '本级数据日报', href: '/admin/user/index', key: '/ptWorkers/personal-daily', pid: 1,children: null,spread: false},
  //         {id: 997, title: '团队数据日报', href: '/admin/user/index', key: '/ptWorkers/team-daily', pid: 1,children: null,spread: false},
  //         {id: 996, title: '个人结算列表', href: '/admin/user/index', key: '/ptWorkers/personal-list', pid: 1,children: null,spread: false},
  //         {id: 995, title: '团队结算列表', href: '/admin/user/index', key: '/ptWorkers/team-list', pid: 1,children: null,spread: false},
  //       ],
  //       href:"",
  //       icon:"",
  //       key:"/ptWorkers",
  //       id:999,
  //       pid:0,
  //       spread:false,
  //       title:"推广员管理",

  //     }
  //     menuList.push(testitem)
  //   }
  //   let HasAccountManage = false
  //   menuList.forEach(e=>{
  //     if(e.title == "账户管理"){
  //       HasAccountManage = true
  //     }
  //   })
  //   if(!HasAccountManage){
  //     let testitem = {
  //       children:[
  //         {id: 998, title: '账户详情', href: '/admin/user/index', key: '/accManage/accountDetail', pid: 1,children: null,spread: false},
  //         {id: 998, title: '用户组管理', href: '/admin/user/index', key: '/accManage/userGroupManage', pid: 1,children: null,spread: false},
  //       ],
  //       href:"",
  //       icon:"",
  //       key:"/accManage",
  //       id:999,
  //       pid:0,
  //       spread:false,
  //       title:"账户管理",

  //     }
  //     menuList.push(testitem)
  //   }
  //   let HasPaymentManage = false
  //   menuList.forEach(e=>{
  //     if(e.title == "支付管理"){
  //       HasPaymentManage = true
  //     }
  //   })
  //   if(!HasPaymentManage){
  //     let testitem = {
  //       children:[
  //         {id: 998, title: '人工充值', href: '/payManage/serviceRecharge', key: '/payManage/serviceRecharge', pid: 1,children: null,spread: false},
  //         {id: 998, title: '人工兑换', href: '/admin/user/index', key: '/payManage/serviceCash', pid: 1,children: null,spread: false},
  //         {id: 998, title: '我的代充', href: '/admin/user/index', key: '/payManage/myAgentRecharge', pid: 1,children: null,spread: false},
  //         {id: 998, title: '我的代付', href: '/admin/user/index', key: '/payManage/myAgentCash', pid: 1,children: null,spread: false},
  //         {id: 998, title: '个人账变', href: '/admin/user/index', key: '/payManage/myGoldDetail', pid: 1,children: null,spread: false},
  //         {id: 998, title: '代充管理', href: '/admin/user/index', key: '/payManage/creditManage', pid: 1,children: [
  //           {id: 998, title: '代充明细', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/serviceDetail', pid: 1,children: null,spread: false},
  //           {id: 998, title: '新增代充', href: '/payManage/serviceRecharge', key: '/payManage/creditManage/createNewService', pid: 1,children: null,spread: false},
  //         ],spread: false},
  //       ],
  //       href:"",
  //       icon:"",
  //       key:"/payManage",
  //       id:999,
  //       pid:0,
  //       spread:false,
  //       title:"支付管理",

  //     }
  //     menuList.push(testitem)
  //   }
  //   const menuNodes = this.getMenuNodes(menuList);
  //   this.setState({ menuNodes });
  // }
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
  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    return (
      <div className="left-nav">
        <div
          className="left-nav-header"
          onClick={() => (window.location.href = "/")}
        >
          <h1>{`${this.getGameName()}游戏中心`}</h1>
          {/* <h4>V:1.0.9</h4> */}
        </div>
        <Menu
          mode="inline"
          theme="dark"

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
