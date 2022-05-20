import React, { Component } from "react";

// import { Table, Menu, Card } from "antd";
import _, { } from "lodash-es";
import { Menu, Card, Modal, message, Input, Popconfirm, Button } from 'antd';
import {
    setAccountPass,
    setgameuserstatus,
    changeProxyUserProxyPid,
    reqCreditAdduser
} from "../../api/index";
import WrappedComponent from "./gold_details";
import PopProxySetting from "./pop_user_proxy_setting";
import PopProxyhistory from "./pop_user_proxy_history";

import PopUserGameData from "./pop_user_game_data";
import PopUserCashDetail from "./pop_user_cash_detail";
import PopUserRechargeDetail from "./pop_user_recharge_detail";
import LinkButton from "../../components/link-button/index";
const init_state = {
    isGoldDetailShow: false,
    isResetPwdShow: false,
    isRestrictingShow: false,
    isShowProxySetting: false,
    isShowPopProxyhistory:false,
    isShowUserGameData: false,
    isShowPopUserCashDetail: false,
    isShowPopUserRechargeDetail: false,
    resetpwd: "",
    new_proxy_user_id: "",
    isShowChangeProxy: false,
    isShowSetAgent: false,
    setAgentAccount: '',
    setAgentpassword: '',
}
class UserListRouter extends Component {
    constructor(props) {
        super(props);
        this.state = init_state
    }
    componentDidMount() {
        this.isBindInfo = true
    }
    handleClick = e => {
        console.log('click ', e);
        this.setState(init_state, () => {
            switch (e.key) {
                case "1":
                    //绑定信息
                    this.isBindInfo = true
                    this.setState({ isGoldDetailShow: true });
                    break
                case "2":
                    //重置密码
                    this.setState({ isResetPwdShow: true });
                    break
                case "3":
                    //限制玩家登录
                    this.setState({ isRestrictingShow: true });
                    break
                case "4":
                    //代理链信息
                    this.setState({ isShowProxySetting: true });
                    break
                case "5":
                    //转移代理链
                    this.setState({ isShowChangeProxy: true });
                    break
                case "6":
                    //资金明细
                    this.isBindInfo = false
                    this.setState({ isGoldDetailShow: true });
                    break
                case "7":
                    //游戏数据
                    this.setState({ isShowUserGameData: true });
                    break
                case "8":
                    //登陆信息
                    this.setState({ isShowPopProxyhistory: true });
                    break
                case "9":
                    //设置代充
                    this.setState({ isShowSetAgent: true });
                    break
                case "10":
                    //兑换明细
                    this.setState({ isShowPopUserCashDetail: true });
                    break
                case "11":
                    //充值明细
                    this.setState({ isShowPopUserRechargeDetail: true });
                    break
            }
        })
        this.setState({
            current: e.key
        })
    };
    changePid = async (recordID) => {
        if (this.state.new_proxy_user_id == "") {
            return message.info("ID不能为空!")
        }
        const res = await changeProxyUserProxyPid({
            id: recordID,
            proxy_user_id: this.state.new_proxy_user_id,
        });
        if (res.status == 0) {
            message.success(res.msg || "操作成功");
            this.setState({
                isShowChangeProxy:false,
                isShowProxySetting:true,
                current:4
            })
        } else {
            message.info(res.msg || "操作失败");
        }
    };
    handleResetpwd = async () => {
        if (this.state.resetpwd == "") {
            return message.info("新密码不能为空!");
        }
        const res = await setAccountPass(this.props.recordID,this.state.resetpwd);
        if (res.code == 200) {
            message.success("操作成功！");
            this.setState({ resetpwd: "", isResetPwdShow: false });
        } else {
            message.info("操作失败:" + res.msg);
        }
    };
    handSetAgent =  async () => {
        if (this.state.setAgentAccount == "" ||this.state.setAgentpassword == "") {
            return message.info("代充账号密码不能为空!");
        }
        const res = await reqCreditAdduser(
            this.state.setAgentAccount,
            this.state.setAgentpassword,
            String(this.props.recordID),
            String(this.props.recordPid),
            3,//代充默认为3
        );
        if (res.status == 0) {
            message.success("操作成功！");
            this.setState({ setAgentAccount: "", setAgentpassword: "" });
        } else {
            message.info("操作失败:" + res.msg);
        }
    }
    setuserstatus = async (recordID, status) => {
        let id = recordID;
        const res = await setgameuserstatus(id, status);
        if (res.code === 200) {
            message.success(res.status);
        } else {
            message.info(res.status);
        }
    };
    getMenu() {
        return <Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.current]}>
            <Menu.Item key="6">资金明细</Menu.Item>
            <Menu.Item key="11">充值明细</Menu.Item>
            <Menu.Item key="10">兑换明细</Menu.Item>
            <Menu.Item key="7">游戏数据</Menu.Item>
            <Menu.Item key="1">绑定信息</Menu.Item>
            <Menu.Item key="2">重置密码</Menu.Item>
            <Menu.Item key="3">限制玩家登陆</Menu.Item>
            <Menu.Item key="4">代理链信息</Menu.Item>
            <Menu.Item key="5">转移代理链</Menu.Item>
            <Menu.Item key="8">登陆日志</Menu.Item>
        </Menu>
    }
    onClick = e => {
        console.log('click ', e);
    };

    render() {
        return (
            <Card
            >
                {this.getMenu()}
                {
                    this.state.isGoldDetailShow && (
                        <WrappedComponent
                            recordID={this.props.recordID}
                            isBindInfo={this.isBindInfo}
                        />
                    )
                }
                {this.state.isResetPwdShow && (
                    <Card
                        title="重置密码"
                        visible={this.state.isResetPwdShow}
                    >
                        <Input
                            value={this.state.resetpwd}
                            onChange={(e) => this.setState({ resetpwd: e.target.value })}
                        />
                        <div style={{ height: "10px" }}></div>
                        <LinkButton onClick={() => this.handleResetpwd()}>
                            确定
                        </LinkButton>
                    </Card>
                )}
                {
                    this.state.isShowProxySetting && (
                        <PopProxySetting
                            recordID={this.props.recordID}
                        />
                    )
                }
                {
                    this.state.isShowPopProxyhistory && (
                        <PopProxyhistory
                            recordID={this.props.recordID}
                        />
                    )
                }
                {
                    this.state.isRestrictingShow && (
                        <Card
                            title="限制玩家登陆"
                            visible={this.state.isRestrictingShow}
                        >
                            <LinkButton onClick={() => this.setuserstatus(this.props.recordID, 0)}>
                                增加限制
                            </LinkButton>
                            <LinkButton onClick={() => this.setuserstatus(this.props.recordID, 1)}>
                                取消限制
                            </LinkButton>
                        </Card>
                    )
                }
                {
                    this.state.isShowChangeProxy && (
                        <Card
                            title="转移代理链"
                        >
                            <Input
                                placeholder="请输入转移后的推广员ID"
                                value={this.state.new_proxy_user_id}
                                onChange={(e) => this.setState({ new_proxy_user_id: e.target.value })}
                            />
                            <div style={{ height: "10px" }}></div>
                            <LinkButton onClick={() => this.changePid(this.props.recordID)}>确认</LinkButton>
                        </Card>
                    )
                }
                {
                    this.state.isShowUserGameData && (
                        <PopUserGameData
                            recordID={this.props.recordID}
                        />
                    )
                }
                {
                    this.state.isShowSetAgent && (
                        <Card
                            title="设置代充"
                        >
                            <p>玩家ID： {this.props.recordID}</p>
                            <p>代充账号 <Input
                                placeholder="请输入代充账号"
                                value={this.state.setAgentAccount}
                                onChange={(e) => this.setState({ setAgentAccount: e.target.value })}
                            /></p>
                            <p>代充密码 <Input
                                placeholder="请输入代充密码"
                                value={this.state.setAgentpassword}
                                onChange={(e) => this.setState({ setAgentpassword: e.target.value })}
                            /></p>
                            <div style={{ height: "10px" }}></div>
                            <LinkButton onClick={() => this.handSetAgent()}>确定</LinkButton>
                        </Card>
                    )
                }
                 {
                    this.state.isShowPopUserCashDetail && (
                        <PopUserCashDetail
                            user_id={this.props.recordID}
                            package_id={this.props.recordPid}
                        />
                    )
                }
                 {
                    this.state.isShowPopUserRechargeDetail && (
                        <PopUserRechargeDetail
                            user_id={this.props.recordID}
                            package_id={this.props.recordPid}
                        />
                    )
                }
            </Card>
        );
    }
}
export default UserListRouter;
