import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Modal, Tabs } from "antd";

import LinkButton from "../link-button";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import "./index.less"
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
    // console.log("tabConfig", tabConfig);
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
        localStorage.removeItem('menuList')
        // 跳转到login
        this.props.history.replace("/login");
      }
    });
  };

  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    let data = this.state;
    const path = this.props.location.pathname;
    let title;
    if (path !== "/home" && path !== "/") {
      const menuList=JSON.parse(localStorage.getItem('menuList'))
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
      this.setState({
        ...data
      });
    }
  }

  render() {
    const username = memoryUtils.user.username;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎！{username}</span>
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
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
