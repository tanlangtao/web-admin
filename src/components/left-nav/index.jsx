import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, message } from "antd";
import { navList } from "../../api";
import "./index.less";

const SubMenu = Menu.SubMenu;
// 左侧导航的组件
class LeftNav extends Component {
  constructor() {
    super();
    this.state = { data: [], openKey: "" };
  }
  getMenuList = async () => {
    const result = await navList();

    if (result.status === 0) {
      //登陆成功
      this.setState({
        data: result.data
      });
    } else {
      // 提示错误信息
      message.error(result.msg);
    }
  };
  /*
   获取左侧菜单导航栏
    */
  getMenuList = async () => {
    const result = await navList();
    if (result.status === 0) {
      this.setState({
        data: result.data
      });
    } else {
      message.error("网络问题，请重新登陆");
    }
  };

  /*
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */
  getMenuNodes = menuList => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
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
                {/* <Icon type={item.icon} /> */}
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            currentValue => path.indexOf(currentValue.key) === 0
          );
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
            // this.setState({ openKey: item.key });
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <span>{item.title}</span>
                </span>
              }
              onClick={() => {
                this.openMenu = item.key;
                // console.log(this.openMenu);
              }}
            >
              {item.children.reduce((cpre, ele) => {
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
                return cpre;
              }, [])}
            </SubMenu>
          );
        }
      // }
      return pre;
    }, []);
  };
  componentDidMount() {
    this.setState({openKey:this.openKey})
  }
  render() {
    const menuList = JSON.parse(localStorage.getItem("menuList"));
    const menuNodes = this.getMenuNodes(menuList);
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    // 得到需要打开菜单项的key
    // const openKey = this.openKey;

    return (
      <div className="left-nav">
        <Link
          to="/"
          className="left-nav-header"
          style={{ justifyContent: "center" }}
        >
          <h1>QGame后台管理</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          // defaultOpenKeys={[this.openKey]}
          onOpenChange={key => {
            console.log(key);
            if (key[1] && key[0] !== key[1]) {
              this.setState({ openKey: key[1] });
            } else {
              this.setState({ openKey: null });
            }
          }}
          openKeys={[this.state.openKey]}
        >
          {menuNodes}
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
