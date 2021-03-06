import React, { Component } from "react";

// import { Table, Menu, Card } from "antd";
import { Menu, Card, Modal, message, Input, Popconfirm, Button, InputNumber } from 'antd';

import {
    setAccountPass,
    setgameuserstatus,
    changeProxyUserProxyPid,
    reqCreditAdduser,
    reqDaichangeUserBalance,
    getDividendRule,
    reqSetDividendRule,
    reqGetGameAccountsInfo
} from "../../api/index";
import WrappedComponent from "./gold_details";
import PopProxySetting from "./pop_user_proxy_setting";
import PopProxyhistory from "./pop_user_proxy_history";

import PopUserGameData from "./pop_user_game_data";
import PopUserCashDetail from "./pop_user_cash_detail";
import PopUserRechargeDetail from "./pop_user_recharge_detail";
import LinkButton from "../../components/link-button/index";
import { toNonExponential,reverseNumber ,check,checkPass} from "../../utils/commonFuntion";
import { gameRouter,thirdPartyGameRouter } from "../../utils/public_variable";
let gameNameMap = {
    ...gameRouter,
    ...thirdPartyGameRouter
}
const init_state = {
    isGoldDetailShow: false,
    isResetPwdShow: false,
    isRestrictingShow: false,
    isShowProxySetting: false,
    isShowPopProxyhistory: false,
    isShowUserGameData: false,
    isShowPopUserCashDetail: false,
    isShowPopUserRechargeDetail: false,
    isShowGameBalanceChange: false,
    isShowProxyBalanceChange: false,
    isShowEditTreatMentModel: false,
    isShowAddGameBanlance: false,
    isShowCeilGameBanlance: false,
    isShowAddProxyBanlance: false,
    isShowCeilProxyBanlance: false,
    isShowAccountDetailModel:false,
    resetpwd: "",
    new_proxy_user_id: "",
    isShowChangeProxy: false,
    isShowSetAgent: false,
    setAgentAccount: '',
    setAgentpassword: '',
    change_banlance_amount: '',
    setTreatment:0,
    canSetTreatment:false,
    editTreatment:0,
    rule_id:"",
    proxy_user_id:0,
    game_user:{},
    accounts:[],
    game_user_balance:0,
    game_total_balance:0,
}
class UserListRouter extends Component {
    constructor(props) {
        super(props);
        this.state = init_state
    }
    componentDidMount() {
        this.isBindInfo = true
        console.log("recordID ===",this.props.recordID,'recordPid====',this.props.recordPid);    
    }
    handleClick = e => {
        console.log('click ', e);
        this.setState(init_state, () => {
            switch (e.key) {
                case "1":
                    //????????????
                    this.isBindInfo = true
                    this.setState({ isGoldDetailShow: true });
                    break
                case "2":
                    //????????????
                    this.setState({ isResetPwdShow: true });
                    break
                case "3":
                    //??????????????????
                    this.setState({ isRestrictingShow: true });
                    break
                case "4":
                    //???????????????
                    this.setState({ isShowProxySetting: true });
                    break
                case "5":
                    //???????????????
                    this.setState({ isShowChangeProxy: true });
                    break
                case "6":
                    //????????????
                    this.isBindInfo = false
                    this.setState({ isGoldDetailShow: true });
                    break
                case "7":
                    //????????????
                    this.setState({ isShowUserGameData: true });
                    break
                case "8":
                    //????????????
                    this.setState({ isShowPopProxyhistory: true });
                    break
                case "9":
                    //????????????
                    this.setState({ isShowSetAgent: true });
                    break
                case "10":
                    //????????????
                    this.setState({ isShowPopUserCashDetail: true });
                    break
                case "11":
                    //????????????
                    this.setState({ isShowPopUserRechargeDetail: true });
                    break
                case "12":
                    //??????????????????
                    this.setState({ isShowGameBalanceChange: true });
                    break
                case "13":
                    //??????????????????
                    this.setState({ isShowProxyBalanceChange: true });
                    break
                case "14":
                    //??????
                    this.setState({ isShowEditTreatMentModel: true });
                    this.GetDividendRule()
                    break
                case "15":
                    //????????????
                    this.setState({ isShowAccountDetailModel: true });
                    this.GetGameAccountsInfo()
                    break

            }
        })
        this.setState({
            current: e.key
        })
    };
    GetDividendRule = async ()=>{
        const res = await getDividendRule(
          String(this.props.recordID),
        );
        if (res.code == 200) {
          if(res.msg ){
            this.setState({
              
              setTreatment:res.msg[0].percent,
              rule_id:res.msg[0]._id,
              proxy_user_id:res.msg[0].proxy_user_id,
            })
          }else{
            this.setState({
              setTreatment:0,
              rule_id:"",
              proxy_user_id:0
            })
          }
          
        } else {
            message.info("????????????:" + res.msg);
        }
      }
      GetGameAccountsInfo = async ()=>{
        const res = await reqGetGameAccountsInfo(
            this.props.recordID,
        );
        if (res.code == 200) {
            console.log(res.msg.accounts)
            this.setState({
                game_user:res.msg.game_user && res.msg.game_user,
                accounts:`${res.msg.accounts}` != "null" && res.msg.accounts,
                game_user_balance:res.msg.game_user && res.msg.game_user.game_gold,
                game_total_balance:res.msg.game_user && res.msg.game_user.game_gold,
            })
            if(`${res.msg.accounts}` != "null"){
                let sum = 0
                res.msg.accounts.forEach((e)=>{
                    sum += e.balance
                })
                sum += res.msg.game_user.game_gold
                console.log("sum",sum)
                this.setState({
                    game_total_balance:sum
                })
            }
        } else {
            message.info("????????????:" + res.msg);
        }
      }
    handEditTreatment = async () => {
        let newNum = Number(Number(this.state.editTreatment).toFixed(0))
        if (newNum < 0) {
            return message.info("????????????????????????");
        }
        const res = await reqSetDividendRule(
            this.state.proxy_user_id,
            this.state.rule_id,
            0,
            newNum, //??????????????? ??????????????????
        );
        if (res.code == 200) {
            message.success("???????????????");
            this.setState({
                setTreatment: res.msg ? res.msg.percent : 0,
                editTreatment: 0,
                isShowEditTreatMentModel: false
            })
        } else {
            message.info("????????????:" + res.msg);
        }
    }
    changePid = async (recordID) => {
        if (this.state.new_proxy_user_id == "") {
            return message.info("ID????????????!")
        }
        const res = await changeProxyUserProxyPid({
            id: recordID,
            proxy_user_id: this.state.new_proxy_user_id,
        });
        if (res.status == 0) {
            message.success(res.msg || "????????????");
            this.setState({
                isShowChangeProxy: false,
                isShowProxySetting: true,
                current: 4
            })
        } else {
            message.info(res.msg || "????????????");
        }
    };
    handleResetpwd = async () => {
        if (this.state.resetpwd == "") {
            return message.info("?????????????????????!");
        }
        const res = await setAccountPass(this.props.recordID, this.state.resetpwd);
        if (res.code == 200) {
            message.success("???????????????");
            this.setState({ resetpwd: "", isResetPwdShow: false });
        } else {
            message.info("????????????:" + res.msg);
        }
    };
    handSetAgent = async () => {
        if (this.state.setAgentAccount == "" || this.state.setAgentpassword == "") {
            return message.info("??????????????????????????????!");
        }else if (!check(this.state.setAgentAccount) || !check(this.state.setAgentpassword)){
            return message.info("???????????????????????????????????????!");
        }else if (this.state.setAgentAccount.length < 4 || this.state.setAgentAccount.length > 12) {
            return message.info("??????????????????4-12?????????!");
        }else if(!checkPass(this.state.setAgentAccount)){
            return message.info("???????????????????????????????????????!");
        }else if(!checkPass(this.state.setAgentpassword)){
            return message.info("???????????????????????????????????????!");
        }
        this.setState({
            isShowSetAgent:false
        })
        const res = await reqCreditAdduser(
            this.state.setAgentAccount,
            this.state.setAgentpassword,
            String(this.props.recordID),
            String(this.props.recordPid),
            3,//???????????????3
        );
        if (res.status == 0) {
            message.success("???????????????");
        } else {
            message.info("????????????:" + res.msg);
        }
        this.setState({ setAgentAccount: "", setAgentpassword: "" });
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
    getDaichangeUserBalance = async (pay_type) => {
        if (this.state.change_banlance_amount == "") {
            return message.info("???????????????")
        }
        const res = await reqDaichangeUserBalance(
            this.props.admin_user_id,
            this.props.recordID,
            this.props.recordPid,
            pay_type,
            Number(this.state.change_banlance_amount),
        );
        if (res.status === 0) {
            message.success(res.msg);
            this.setState({
                isShowAddGameBanlance: false,
                isShowCeilGameBanlance: false,
                isShowAddProxyBanlance: false,
                isShowCeilProxyBanlance: false,
                change_banlance_amount: ""
            })
        } else {
            message.info(res.data);
        }
    };
    getMenu() {
        return <Menu style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} onClick={this.handleClick} selectedKeys={[this.state.current]}>
            <Menu.Item key="6">????????????</Menu.Item>
            <Menu.Item key="11">????????????</Menu.Item>
            <Menu.Item key="10">????????????</Menu.Item>
            <Menu.Item key="7">????????????</Menu.Item>
            <Menu.Item key="1">????????????</Menu.Item>
            <Menu.Item key="2">????????????</Menu.Item>
            <Menu.Item key="3">??????????????????</Menu.Item>
            <Menu.Item key="4">???????????????</Menu.Item>
            <Menu.Item key="5">???????????????</Menu.Item>
            <Menu.Item key="14">??????????????????</Menu.Item>
            <Menu.Item key="8">????????????</Menu.Item>
            <Menu.Item key="12">??????????????????</Menu.Item>
            <Menu.Item key="13">??????????????????</Menu.Item>
            <Menu.Item key="15">????????????</Menu.Item>
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
                        title="????????????"
                        visible={this.state.isResetPwdShow}
                    >
                        <Input
                            value={this.state.resetpwd}
                            onChange={(e) => this.setState({ resetpwd: e.target.value })}
                        />
                        <div style={{ height: "10px" }}></div>
                        <LinkButton onClick={() => this.handleResetpwd()}>
                            ??????
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
                            title="??????????????????"
                            visible={this.state.isRestrictingShow}
                        >
                            <LinkButton onClick={() => this.setuserstatus(this.props.recordID, 0)}>
                                ????????????
                            </LinkButton>
                            <LinkButton onClick={() => this.setuserstatus(this.props.recordID, 1)}>
                                ????????????
                            </LinkButton>
                        </Card>
                    )
                }
                {
                    this.state.isShowChangeProxy && (
                        <Card
                            title="???????????????"
                        >
                            <Input
                                placeholder="??????????????????????????????ID"
                                value={this.state.new_proxy_user_id}
                                onChange={(e) => this.setState({ new_proxy_user_id: e.target.value })}
                            />
                            <div style={{ height: "10px" }}></div>
                            <LinkButton onClick={() => this.changePid(this.props.recordID)}>??????</LinkButton>
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
                            title="????????????"
                        >
                            <p>??????ID??? {this.props.recordID}</p>
                            <p>???????????? <Input
                                placeholder="?????????????????????"
                                value={this.state.setAgentAccount}
                                onChange={(e) => this.setState({ setAgentAccount: e.target.value })}
                            /></p>
                            <p>???????????? <Input
                                placeholder="?????????????????????"
                                value={this.state.setAgentpassword}
                                onChange={(e) => this.setState({ setAgentpassword: e.target.value })}
                            /></p>
                            <div style={{ height: "10px" }}></div>
                            <LinkButton onClick={() => this.handSetAgent()}>??????</LinkButton>
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
                {
                    this.state.isShowGameBalanceChange && (
                        <Card
                            title="??????????????????"
                        >
                            <LinkButton onClick={() => this.setState({
                                isShowAddGameBanlance: true
                            })}>??????????????????</LinkButton>
                            <LinkButton onClick={() => this.setState({
                                isShowCeilGameBanlance: true
                            })}>??????????????????</LinkButton>
                        </Card>
                    )
                }
                {
                    this.state.isShowProxyBalanceChange && (
                        <Card
                            title="??????????????????"
                        >
                            <LinkButton onClick={() => this.setState({
                                isShowAddProxyBanlance: true
                            })}>??????????????????</LinkButton>
                            <LinkButton onClick={() => this.setState({
                                isShowCeilProxyBanlance: true
                            })}>??????????????????</LinkButton>
                        </Card>
                    )
                }
                {this.state.isShowEditTreatMentModel && (
                 
                    <Modal
                        title="????????????"
                        visible={this.state.isShowEditTreatMentModel}
                        onCancel={() => {
                            this.setState({ isShowEditTreatMentModel: false });
                        }}
                        onOk={this.handEditTreatment}
                    >
                        <div>??????ID : {this.props.recordID}</div>
                        &nbsp; &nbsp;
                        <div><span>???????????? :</span> <span>????????????</span></div>
                        &nbsp; &nbsp;
                        <div>???????????? : <InputNumber
                            disabled={true}
                            placeholder=""
                            size="small"
                            min={0}
                            max={100}
                            value={this.state.setTreatment}
                        />%</div>
                        <div>???????????? : <InputNumber
                            disabled={this.state.rule_id ? false : true}
                            placeholder=""
                            size="small"
                            min={0}
                            max={100}
                            value={this.state.editTreatment}
                            onBlur={(e) => (this.setState({ editTreatment: e.target.value }))}
                        />%</div>
                        &nbsp; &nbsp;
                        <div style={{ height: "10px" }}></div>
                    </Modal>
                )}
                {
                    this.state.isShowAddGameBanlance && (
                        <Modal
                            title="??????????????????"
                            visible={this.state.isShowAddGameBanlance}
                            onOk={() => this.getDaichangeUserBalance(600)}
                            onCancel={() => {
                                this.setState({ isShowAddGameBanlance: false });
                            }}
                        >
                            <p>
                                <span>??????ID</span>
                                &nbsp;&nbsp;
                                <span>{this.props.recordID}</span>
                            </p>
                            <div>
                                <span>????????????</span>
                                &nbsp;&nbsp;
                                <InputNumber
                                    min = {0}
                                    step="0.1"
                                    placeholder="???????????????"
                                    value={this.state.change_banlance_amount}
                                    onBlur={(e) => this.setState({ change_banlance_amount: e.target.value })}
                                />
                                &nbsp;&nbsp;
                                <span style={{ color: "red" }}>*??????????????????0*</span>
                            </div>
                        </Modal>
                    )
                }
                {
                    this.state.isShowCeilGameBanlance && (
                        <Modal
                            title="??????????????????"
                            visible={this.state.isShowCeilGameBanlance}
                            onOk={() => this.getDaichangeUserBalance(601)}
                            onCancel={() => {
                                this.setState({ isShowCeilGameBanlance: false });
                            }}
                        >
                            <p>
                                <span>??????ID</span>
                                &nbsp;&nbsp;
                                <span>{this.props.recordID}</span>
                            </p>
                            <div>
                                <span>????????????</span>
                                &nbsp;&nbsp;
                                <InputNumber
                                    max = {0}
                                    step="0.1"
                                    placeholder="???????????????"
                                    value={this.state.change_banlance_amount}
                                    onBlur={(e) => this.setState({ change_banlance_amount: e.target.value })}
                                />
                                &nbsp;&nbsp;
                                <span style={{ color: "red" }}>*??????????????????0*</span>
                            </div>
                        </Modal>
                    )
                }
                {
                    this.state.isShowAddProxyBanlance && (
                        <Modal
                            title="??????????????????"
                            visible={this.state.isShowAddProxyBanlance}
                            onOk={() => this.getDaichangeUserBalance(602)}
                            onCancel={() => {
                                this.setState({ isShowAddProxyBanlance: false });
                            }}
                        >
                            <p>
                                <span>??????ID</span>
                                &nbsp;&nbsp;
                                <span>{this.props.recordID}</span>
                            </p>
                            <div>
                                <span>????????????</span>
                                &nbsp;&nbsp;
                                <InputNumber
                                    min = {0}
                                    step="0.1"
                                    placeholder="???????????????"
                                    value={this.state.change_banlance_amount}
                                    onBlur={(e) => this.setState({ change_banlance_amount: e.target.value })}
                                />
                                &nbsp;&nbsp;
                                <span style={{ color: "red" }}>*??????????????????0*</span>
                            </div>
                        </Modal>
                    )
                }
                {
                    this.state.isShowCeilProxyBanlance && (
                        <Modal
                            title="??????????????????"
                            visible={this.state.isShowCeilProxyBanlance}
                            onOk={() => this.getDaichangeUserBalance(603)}
                            onCancel={() => {
                                this.setState({ isShowCeilProxyBanlance: false });
                            }}
                        >
                            <p>
                                <span>??????ID</span>
                                &nbsp;&nbsp;
                                <span>{this.props.recordID}</span>
                            </p>
                            <div>
                                <span>????????????</span>
                                &nbsp;&nbsp;
                                <InputNumber
                                    max = {0}
                                    step="0.1"
                                    placeholder="???????????????"
                                    value={this.state.change_banlance_amount}
                                    onBlur={(e) => this.setState({ change_banlance_amount: e.target.value })}
                                />
                                &nbsp;&nbsp;
                                <span style={{ color: "red" }}>*??????????????????0*</span>
                            </div>
                        </Modal>
                    )
                }
                {
                    this.state.isShowAccountDetailModel && (
                        <Modal
                            title={`???????????? ${this.props.recordID}`}
                            visible={this.state.isShowAccountDetailModel}
                            onCancel={() => {
                                this.setState({ isShowAccountDetailModel: false });
                            }}
                            footer={null}
                        >
                            <div style ={{display:"flex",height:"30px"}}>
                                <div style ={{width:"100px"}}>??????????????????</div>
                                &nbsp;&nbsp;
                                <div>{reverseNumber(toNonExponential(this.state.game_user_balance))}</div>
                            </div>
                            
                            {
                                this.state.accounts.length>0 && this.state.accounts.map((e,index)=>{
                                    return <div key={index} style ={{display:"flex",height:"30px"}}>
                                        <div style ={{width:"100px"}}>{gameNameMap[e.game_id].name}</div>
                                        &nbsp;&nbsp;
                                    <div>{reverseNumber(toNonExponential(e.balance))}</div>
                                </div>
                                })
                            }
                            <div style ={{display:"flex",height:"30px"}}>
                                <div style ={{width:"100px"}}>??????</div>
                                &nbsp;&nbsp;
                                <div>{reverseNumber(toNonExponential(this.state.game_total_balance)) }</div>
                            </div>
                        </Modal>
                    )
                }
                
            </Card>
        );
    }
}
export default UserListRouter;
