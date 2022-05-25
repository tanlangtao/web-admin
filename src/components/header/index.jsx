import React, { Component } from "react";
// import { browserHistory } from "react-router";
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
  Form,
} from "antd";

import LinkButton from "../link-button";
import { getAuthCode, editPass ,getCreditUserlist,reqEditUser} from "../../api";
// import QRCode from "qrcode.react";
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
        path: "/home",
      },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
      isResetPwdShow: false,
      user_balance:0,
      resetpwd:""
    };
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = (tabConfig) => {
    console.log("tabConfig", tabConfig);
    const { panes } = this.state;
    let isTabExist = false;
    let oldKey;
    panes.forEach((item) => {
      if (item.title === tabConfig.title.replace(/&nbsp;/g, "")) {
        isTabExist = true;
        oldKey = item.key;
      }
    });
    if (isTabExist) {
      this.onChange(oldKey);
    } else {
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({
        title: tabConfig.title.replace(/&nbsp;/g, ""),
        content: "Content of new Tab",
        key: activeKey,
        path: tabConfig.key,
      });
      this.onChange(activeKey);
      this.setState({ panes, activeKey });
    }
  };

  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter((pane) => pane.key !== targetKey);
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
        localStorage.removeItem("menuList");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("BASE");
        // 跳转到login
        this.props.history.replace("/login");
      },
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
      menuList.forEach((item) => {
        if (!item.children && item.key === path) {
          title = item.title;
        } else if (item.children) {
          item.children.forEach((val) => {
            if (val.key === path) {
              title = val.title;
            }
          });
        }
      });
      if (path.includes("subGame") && path.includes("changeRoomStatus")) {
        title = "开启与关闭游戏房间";
      }
      if (path.includes("subGame") && path.includes("UserLimitRangeBet")) {
        title = "玩家限红设定与查询";
      }
      if (path.includes("subGame") && path.includes("RoomLimitRangeBet")) {
        title = "房间限红设定与查询";
      }
      if (path.includes("subGame") && path.includes("xwby/level1")) {
        title = "初级房";
      }
      if (path.includes("subGame") && path.includes("xwby/level2")) {
        title = "中级房";
      }
      if (path.includes("subGame") && path.includes("xwby/level3")) {
        title = "高级房";
      }
      if (path.includes("subGame") && path.includes("xwby/level4")) {
        title = "大师房";
      }
      if (path.includes("subGame") && path.includes("xwby/switchChouFang")) {
        title = "自动抽水设置";
      }
      if (path.includes("subGame") && path.includes("ag/gamelistInfo")) {
        title = "AG电子游戏开启与关闭";
      }
      if (path.includes("subGame") && path.includes("jdb/gamelistInfo")) {
        title = "JDB电子游戏开启与关闭";
      }
      if (path.includes("subGame") && path.includes("qt/gamelistInfo")) {
        title = "QT电子游戏开启与关闭";
      }
      if (path.includes("subGame") && path.includes("pp/gamelistInfo")) {
        title = "PP电子游戏开启与关闭";
      }
      if (path.includes("baseDividend") && path.includes("userGold")) {
        title = "查询代理个人玩家流水";
      }
      //获取保底分红发放详情 + 获取保底分红发放详情1
      if (path.includes("baseDividend") && path.includes("details")) {
        title = "获取保底分红发放详情";
      }
      //获取保底分红发放详情2
      if (path.includes("baseDividendsecond") && path.includes("details")) {
        title = "获取保底分红发放详情2";
      }
      if (
        path.includes("baseDividend") &&
        path.includes("getUserSortByGameTag")
      ) {
        title = "按游戏类型查询玩家业绩";
      }
      if (
        path.includes("baseDividend") &&
        path.includes("getUserInductionsSortByGameTag")
      ) {
        title = "按游戏类型查询团队业绩界面";
      }
      if (path.includes("gameBetData")) {
        title = "查询代理链有效投注数据";
      }
      if (path.includes("gameBetAmount")) {
        title = "查询代理链流水数据";
      }
      //无限代保底分红 + 无限代保底分红1
      if (
        path.includes("baseDividend") &&
        path.includes("getBaseDividendRule")
      ) {
        title = "查询保底分成规则";
      }
      //无限代保底分红2
      if (
        path.includes("baseDividendsecond") &&
        path.includes("getBaseDividendRule")
      ) {
        title = "查询保底分成规则2";
      }
      if (path.includes("lose_profit_devidend") && path.includes("details")) {
        title = "获取亏损分红信息";
      }
      if (path.includes("lose_profit_devidend") && path.includes("details")) {
        title = "获取亏损分红信息";
      }
      if (path.includes("baseDividend") && path.includes("getGlobal")) {
        title = "查询渠道配置信息";
      }
      if (path.includes("baseDividend") && path.includes("getBaseChannel")) {
        title = "查询保底分成渠道";
      }
      if (path.includes("getPaymentInfo") && path.includes("details")) {
        title = "查询玩家分红数据总额";
      }
      if (path.includes("getPaymentInfoDetail") && path.includes("details")) {
        title = "查询玩家分红数据详情";
      }
      data.activeKey = "2";
      data.panes.push({
        title: title,
        key: "2",
        path: path,
      });
      this.setState({
        ...data,
      });
    }
  }
  //获取当前玩家信息
  reqGetCreditUserlist = async (page, limit) => {
    const result = await getCreditUserlist(
      this.props.package_id,
      this.props.admin_user_id,
      page,
      limit,
    );
    if (result.status === 0) {
      this.setState({
        user_balance: result.data && result.data.lists[0].user_balance,
        record:result.data && result.data.lists[0]
      })
    } else {
      message.info(result.msg || "未检索到数据");
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
                <Menu.Item key="1">
                  <Button type="link" onClick={this.resetPWD}>
                    修改密码
                  </Button>
                </Menu.Item>
                <Menu.Item key="2">
                    <Button type="link" >
                        账号余额: {this.state.user_balance}
                    </Button>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
            onClick={()=>this.reqGetCreditUserlist(1,20)}
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
            {this.state.panes.map((pane) => (
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
                    { max: 16, message: "密码最多16位" },
                    // {
                    //   pattern: /^[a-zA-Z0-9_]+$/,
                    //   message: "用户名必须是英文、数字或下划线组成"
                    // }
                  ],
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
                      },
                    },
                  ],
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
        {this.state.isResetPwdShow && (
                <Modal
                    title="重置密码"
                    visible={this.state.isResetPwdShow}
                    onOk={this.handleResetpwd}
                    onCancel={() => {
                        this.setState({ isResetPwdShow: false });
                    }}
                >
                    <span>重置密码</span>
                    <Input
                        value={this.state.resetpwd}
                        onChange={(e) => this.setState({ resetpwd: e.target.value })}
                    />
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
        okText: "关闭",
        content: (
          //  <QRCode value={res.data.qrurl}></QRCode>
          <div>
            <img src={res.data.qrurl} alt="验证码" />
          </div>
        ),
        width: 300,
      });
    } else {
      message.info(res.msg);
    }
  };
  resetPWD = () => {
    this.setState({ isResetPwdShow: true });
  };
  handleEditSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const res = await editPass(value.editPass);
        if (res.status === 0) {
          message.success(res.msg);
        } else {
          message.info(res.msg);
        }
      }
    });
  };
  handleResetpwd = async () => {
    if(this.state.resetpwd == ""){
        return message.info("密码不能为空！")
    }
    const res = await reqEditUser(
        this.state.record.id, 
        this.state.record.name, 
        this.state.resetpwd,
        this.state.record.user_id,
        this.state.record.package_id,
        this.state.record.role_id
    );
    if (res.status === 0) {
        message.success("操作成功！");
        this.setState({ resetpwd: "", isResetPwdShow: false });
        localStorage.removeItem("menuList");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("BASE");
        // 跳转到login
        this.props.history.replace("/login");
    } else {
         message.success("操作失败:" + res.msg);
    }
};
}
const WrappedHeader = Form.create()(Header);
export default withRouter(WrappedHeader);
