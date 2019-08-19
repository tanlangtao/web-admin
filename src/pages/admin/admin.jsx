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
          <Content style={{ margin: 20, backgroundColor: "#fff" }}>
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" exact component={Home} />
              <Route path="/user/user-list" exact component={User} />
              <Route
                path="/admin_manage/list"
                exact
                component={Admin_manage_list}
              />
              <Route
              path="/admin_manage/role"
              exact
              component={Role}
            />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#cccccc", padding: 5 }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
