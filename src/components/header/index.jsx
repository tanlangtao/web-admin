import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Modal, Tabs } from "antd";

import LinkButton from "../link-button";
import { reqWeather } from "../../api";
import menuList from "../../config/menuConfig";
import { formateDate } from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import "./index.less";
const { TabPane } = Tabs;
/*
左侧导航的组件
 */
class Header extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      {
        title: "首页",
        content: "Content of Tab 1",
        key: "1",
        closable: false,
        path: "/home"
      }
    ];
    this.state = {
      activeKey: panes[0].key,
      panes
    };
  }
  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = tabConfig => {
    const { panes } = this.state;
    let isTabExist = false;
    let oldKey;
    panes.forEach(item => {
      if (item.title === tabConfig.title) {
        isTabExist = true;
        oldKey = item.key;
      }
    });
    if (isTabExist) {
      this.onChange(oldKey);
    } else {
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({
        title: tabConfig.title,
        content: "Content of new Tab",
        key: activeKey,
        path: tabConfig.key
      });
      this.onChange(activeKey);
      this.setState({ panes, activeKey });
    }
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    let data = this.state;
    const path = this.props.location.pathname;
    let title;
    if (path !== "/home" && path !== "/") {
      menuList.forEach(item => {
        if (!item.children && item.key === path) {
          title = item.title;
        } else if (item.children) {
          item.children.forEach(val => {
            if (val.key === path) {
              title = val.title;
            }
          });
        }
      });
      data.activeKey = "2";
      data.panes.push({
        title: title,
        key: "2",
        path: path
      });
      console.log(data);
      this.setState({
        ...data
      });
    }
  }

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: "" // 天气图片url
    // weather: '', // 天气的文本
  };

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  // getWeather = async () => {
  //   // 调用接口请求异步获取数据
  //   const {dayPictureUrl, weather} = await reqWeather('北京')
  //   // 更新状态
  //   this.setState({dayPictureUrl, weather})
  // }

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path) {
        // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title;
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.key) === 0
        );
        // 如果有值才说明有匹配的
        if (cItem) {
          // 取出它的title
          title = cItem.title;
        }
      }
    });
    return title;
  };

  /*
  退出登陆
   */
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: "确定退出吗?",
      onOk: () => {
        console.log("OK", this);
        // 删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};

        // 跳转到login
        this.props.history.replace("/login");
      }
    });
  };

  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  // componentDidMount() {
  // 获取当前的时间
  // this.getTime()
  // 获取当前天气
  // this.getWeather()
  // }
  /*
  // 不能这么做: 不会更新显示
  componentWillMount () {
    this.title = this.getTitle()
  }*/

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  render() {
    // const { currentTime, dayPictureUrl, weather } = this.state;

    const username = memoryUtils.user.username;

    // 得到当前需要显示的title
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          {/* <div className="header-bottom-left">{title}</div> */}
          <Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
            hideAdd
          >
            {this.state.panes.map(pane => (
              <TabPane
                tab={<Link to={pane.path}>{pane.title}</Link>}
                key={pane.key}
                closable={pane.closable}
                forceRender
              />
            ))}
          </Tabs>

          {/* <div className="header-bottom-right"> */}
          {/* <span>{currentTime}</span> */}
          {/* <span>{weather}</span> */}
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
