import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Select,
    InputNumber,
} from "antd";
import Mytable from "../../../components/MyTable";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button/index";
import GoldDetail from "../goldDetail";
import CreditDetail from "../creditDetail";
import {  check,checkPass } from "../../../utils/commonFuntion";
import moment from "moment";
import {
    reqCreditAdduser,
    getCreditUserlist,
    reqAdduserbalance,
    reqEditUser
} from "../../../api/index";
import { formateDate } from "../../../utils/dateUtils";
const { Option } = Select;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    start_time: '',
    end_time: '',
    inputKey: "user_id",
    inputValue: "",
    id: 427223993, // id先写死
    loading: false,
    data: [],
    isShowGoldDetail: false,
    isShowCreditDetail:false,
    isResetPwdShow:false,
    isShowGoldChange:false,
    resetpwd:"",
    changeGold:"",
    setAgentUserID:"",
    setAgentAccount:"",
    setAgentpassword:"",
    isShowSetAgent:false,
};
export default class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "账号名称",
            dataIndex: "name",
            key: "name",
            align: 'center',
            fixed:"left"
        },
        {
            title: "玩家ID",
            dataIndex: "user_id",
            key: "user_id",
            align: 'center',
            fixed:"left"
        },
        {
            title: "注册时间",
            dataIndex: "",
            key: "",
            align: 'center',
            render:(record)=>{
                return moment(record.created_at).format("YYYY-MM-DD HH:mm:ss")
            },
        },
        {
            title: "用户组",
            dataIndex: "",
            key: "",
            align: 'center',
            render:(record)=>{
                let str = ""
                switch(record.role_id){
                    case 3:
                        str = "充提组"
                        break
                    case 4:
                        str = "推广组"
                        break
                    default:
                        str = "未定义用户组"
                }
                return str
            }
        },
        {
            title: "所属品牌",
            dataIndex: "package_id",
            key: "package_id",
            align: 'center',
        },
        {
            title: "账户余额",
            dataIndex: "user_balance",
            key: "user_balance",
            align: 'center',
        },
        
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                      <LinkButton  onClick={() => this.showCreditDetail(record)}>
                    信用明细
              </LinkButton>
                    <LinkButton  onClick={() => this.showGoldDetail(record)}>
                    充提明细
              </LinkButton>
                    <LinkButton  onClick={() =>this.resetPwd(record)}>
                        重置密码
              </LinkButton>
                    <LinkButton  onClick={() =>this.goldChange(record)}>
                        资金变动
              </LinkButton>
                </span>
            ),
        },
    ];
    showCreditDetail = (record) => {
        this.setState({
            isShowCreditDetail: true
        })
        this.recordID = record.user_id
    }
    showGoldDetail = (record) => {
        this.setState({
            isShowGoldDetail: true
        })
        this.recordID = record.user_id
    }
    resetPwd = (record) => {
        this.setState({ isResetPwdShow: true });
        this.record = record
    };
    goldChange = (record) => {
        this.setState({ isShowGoldChange: true });
        this.record = record;
    };
    handleResetpwd = async () => {
        if(this.state.resetpwd == ""){
            return message.info("密码不能为空！")
        }else if(!check(this.state.resetpwd)){
            return message.info("密码不能包含特殊字符!");
        }else if(!checkPass(this.state.resetpwd)){
            return message.info("密码需包含数字和大小写字母!");
        }
        const res = await reqEditUser(
            this.record.id, 
            this.record.name, 
            this.state.resetpwd,
            this.record.user_id,
            this.record.package_id,
            this.record.role_id
        );
        if (res.status === 0) {
            message.success("操作成功！");
            this.setState({ resetpwd: "", isResetPwdShow: false });
        } else {
             message.success("操作失败:" + res.msg);
             this.setState({ resetpwd: "" });
        }
    };
    handleGoldChange = async () => {
        const res = await reqAdduserbalance(
            this.record.user_id, 
            this.record.package_id, 
            this.state.changeGold,
        );
        if (res.status === 0) {
            message.success("操作成功！");
            this.setState({ changeGold: "", isShowGoldChange: false });
            this.getCreditUserlist(1,20)
        } else {
             message.success("操作失败:" + res.msg);
        }
    };
    getCreditUserlist = async (page, limit) => {
        this.setState({ loading: true });
        const result = await getCreditUserlist(
            this.props.package_id,
            this.state.inputValue,
            page,
            limit,
            3
        );
        if (result.status === 0) {
            this.setState({
                data: result.data.lists,
                count: result.data && result.data.total,
            });
        } else {
            message.info(result.msg || "未检索到数据");
        }
        this.setState({
            loading: false,
        });
    };
    handSetAgent =  async () => {
        if (this.state.setAgentAccount == "" ||this.state.setAgentpassword == "") {
            return message.info("代充账号密码不能为空!");
        }else if (!check(this.state.setAgentAccount) || !check(this.state.setAgentpassword)){
            return message.info("只能输入数字和大小写的字母!");
        }else if (this.state.setAgentAccount.length < 4 || this.state.setAgentAccount.length > 12) {
            return message.info("代充账号需要4-12个字符!");
        }else if(!checkPass(this.state.setAgentAccount)){
            return message.info("账号需包含数字和大小写字母!");
        }else if(!checkPass(this.state.setAgentpassword)){
            return message.info("密码需包含数字和大小写字母!");
        }
        this.setState({
            isShowSetAgent:false
        })
        const res = await reqCreditAdduser(
            this.state.setAgentAccount,
            this.state.setAgentpassword,
            this.state.setAgentUserID,
            String(this.props.package_id),
            3,//代充默认为3
        );
        if (res.status == 0) {
            message.success("操作成功！");
            this.getCreditUserlist(1,20)
        } else {
            message.info("操作失败:" + res.msg);
        }
        this.setState({ setAgentUserID: "",setAgentAccount: "", setAgentpassword: ""});
    }
    componentDidMount() {
        this.setState({
            start_time:moment().startOf("day").subtract(1, "month"),
            end_time:moment().startOf("day")
        },()=>{
            this.getCreditUserlist(1, 20)
        })
    }
    render() {
        const { data, count, current, pageSize, loading } = this.state;
        const title = (
            <span>
                <Input
                    type="text"
                    placeholder="请输入查询玩家ID"
                    style={{ width: 150 }}
                    onChange={(e) => {
                        this.setState({ inputValue: e.target.value });
                    }}
                    value={this.state.inputValue}
                />
                &nbsp; &nbsp;
                <LinkButton
                    onClick={() => {
                        this.setState({ current: 1 });
                        this.getCreditUserlist(1, this.state.pageSize);
                    }}
                    size="default"
                >
                    <Icon type="search" />
                </LinkButton>
                &nbsp; &nbsp;
                <LinkButton
                    onClick={() => {
                        this.setState({ isShowSetAgent: true });
                    }}
                    size="default"
                >新增代充
                </LinkButton>
            </span>
        );
        return <Card title={title} >
            <Mytable
                tableData={{
                    data,
                    count,
                    columns: this.initColumns(),
                    x: "max-content",
                    // y: "65vh",
                    current,
                    pageSize,
                    loading,
                }}
                paginationOnchange={(page, limit) => {
                    this.getCreditUserlist(page, limit);
                }}
                setPagination={(current, pageSize) => {
                    if (pageSize) {
                        this.setState({ current, pageSize });
                    } else {
                        this.setState({ current });
                    }
                }}
            />
            {this.state.isShowCreditDetail && (
                <Modal
                    title={`信用明细 ${this.recordID}`}
                    visible={this.state.isShowCreditDetail}
                    onCancel={() => {
                        this.setState({ isShowCreditDetail: false });
                    }}
                    footer={null}
                    width="85%"
                    maskClosable={false}
                    style={{ top: 10 }}
                >
                    <CreditDetail user_id = {this.recordID}></CreditDetail>
                </Modal>
            )}
            {this.state.isShowGoldDetail && (
                <Modal
                    title={`充提明细 ${this.recordID}`}
                    visible={this.state.isShowGoldDetail}
                    onCancel={() => {
                        this.setState({ isShowGoldDetail: false });
                    }}
                    footer={null}
                    width="85%"
                    maskClosable={false}
                    style={{ top: 10 }}
                >
                    <GoldDetail user_id = {this.recordID}></GoldDetail>
                </Modal>
            )}
            {this.state.isResetPwdShow && (
                <Modal
                    title={`重置密码${this.record.user_id}`}
                    visible={this.state.isResetPwdShow}
                    onOk={this.handleResetpwd}
                    onCancel={() => {
                        this.setState({ isResetPwdShow: false ,resetpwd:''});
                    }}
                >
                    <span>重置密码</span>
                    <Input
                        value={this.state.resetpwd}
                        onChange={(e) => this.setState({ resetpwd: e.target.value })}
                    />
                </Modal>
            )}
             {this.state.isShowGoldChange && (
                <Modal
                    title={`资金变动 ${this.record.user_id}`}
                    visible={this.state.isShowGoldChange}
                    onOk={this.handleGoldChange}
                    onCancel={() => {
                        this.setState({ isShowGoldChange: false });
                    }}
                >
                    <InputNumber
                        value={this.state.changeGold}
                        onBlur={(e) => this.setState({ changeGold: e.target.value })}
                    /> &nbsp; &nbsp;<span style={{color:"red"}}>正数为加钱， 负数为减钱</span>
                </Modal>
            )}
            {
                this.state.isShowSetAgent && (
                    <Modal
                        title="设置代充"
                        visible={this.state.isShowSetAgent}
                        onOk={this.handSetAgent}
                        onCancel={() => {
                            this.setState({ isShowSetAgent: false ,setAgentUserID:"",setAgentAccount: "", setAgentpassword: ""});
                        }}
                    >
                         <p>玩家ID <Input
                            placeholder="请输入玩家ID"
                            value={this.state.setAgentUserID}
                            onChange={(e) => this.setState({ setAgentUserID: e.target.value })}
                        /></p>
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
                    </Modal>
                )
            }
        </Card>
    }
}
