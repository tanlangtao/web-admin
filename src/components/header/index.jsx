import React, { Component } from "react";
import { browserHistory } from "react-router";
import { withRouter, Link } from "react-router-dom";
import {
  Modal,
  Tabs,
  Dropdown,
  Menu,
  Icon,
  Button,
  message,
  Input,
  Form
} from "antd";

import LinkButton from "../link-button";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { getAuthCode, editPass } from "../../api";
import QRCode from "qrcode.react";
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
      panes,
      isEditFormShow: false
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
        // browserHistory.push(panes[lastIndex].path);
        this.props.history.push(panes[lastIndex].path);
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  //退出LOG OUT
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: "确定退出吗?",
      onOk: () => {
        console.log("OK", this);
        // 删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};
        localStorage.removeItem("menuList");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
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
      const menuList = JSON.parse(localStorage.getItem("menuList"));
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
    const username = localStorage.getItem("name");
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className="header">
        <div className="header-top">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="0">
                  <Button type="link" onClick={this.authCode}>
                    安全码设置
                  </Button>
                </Menu.Item>
                <Menu.Item key="1">
                  <Button type="link" onClick={this.resetPWD}>
                    修改密码
                  </Button>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="link">
              {username} <Icon type="down" />
            </Button>
          </Dropdown>
          <LinkButton onClick={this.logout} size="default">
            退出
          </LinkButton>
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
        {this.state.isEditFormShow && (
          <Modal
            title="编辑"
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
          >
            <Form
              labelCol={{ span: 6 }}
              labelAlign="left"
              onSubmit={this.handleEditSubmit}
            >
              <Form.Item label="新密码">
                {getFieldDecorator("editPass", {
                  rules: [
                    { required: true, message: "密码不能为空" },
                    { whitespace: true },
                    { min: 6, message: "密码至少6位" },
                    { max: 16, message: "密码最多16位" }
                    // {
                    //   pattern: /^[a-zA-Z0-9_]+$/,
                    //   message: "用户名必须是英文、数字或下划线组成"
                    // }
                  ]
                })(
                  <Input
                    style={{ width: "40%" }}
                    type="password"
                    placeholder="6到16个字符"
                  />
                )}
              </Form.Item>
              <Form.Item label="重复密码">
                {getFieldDecorator("repeat", {
                  rules: [
                    { required: true },
                    {
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback(); //如果还没填写，则不进行一致性验证
                        }
                        if (value === getFieldValue("editPass")) {
                          callback();
                        } else {
                          callback("两次密码不一致");
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: "40%" }}
                    type="password"
                    placeholder="6到16个字符"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
  authCode = async () => {
    const res = await getAuthCode();
    if (res.status === 0) {
      Modal.info({
        title: "扫码获取验证码",
        content: <QRCode value={res.data.qrurl}></QRCode>,
        width: 300
      });
    } else {
      message.error(res.msg);
    }
  };
  resetPWD = () => {
    this.setState({ isEditFormShow: true });
  };
  handleEditSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const res = await editPass(value.editPass);
        if (res.status === 0) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      }
    });
  };
}
const WrappedHeader = Form.create()(Header);
export default withRouter(WrappedHeader);
