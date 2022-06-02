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
import Mytable from "../../components/MyTable";
import LinkButton from "../../components/link-button/index";
import GoldDetail from "../payManage/goldDetail";
import CreditDetail from "../payManage/creditDetail";
import moment from "moment";
import {
    reqCreditAdduser,
    getCreditUserlists,
    reqAdduserbalance,
    reqEditUser
} from "../../api/index";
const { Option } = Select;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    start_time: '',
    end_time: '',
    inputKey: "user_id",
    inputValue: "",
    loading: false,
    data: [],
    isShowGoldDetail: false,
    isShowCreditDetail:false,
    isResetPwdShow:false,
    isShowGoldChange:false,
    resetpwd:"",
    changeGold:"",
    inputPackageId:"",
    inputAccount:"",
    inputPassword:"",
    inputUserId:"",
    isShowAddChaoguan:false,
    isShowAddCaopan:false,
};
export default class AccList extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: 'center',
            fixed:"left"
        },
        {
            title: "账号",
            dataIndex: "account",
            key: "account",
            align: 'center',
        },
        {
            title: "玩家ID",
            dataIndex: "user_id",
            key: "user_id",
            align: 'center',
        },
        {
            title: "品牌ID",
            dataIndex: "package_id",
            key: "package_id",
            align: 'center',
        },
        {
            title: "角色ID",
            dataIndex: "role_id",
            key: "role_id",
            align: 'center',
        },
        {
            title: "账户余额",
            dataIndex: "user_balance",
            key: "user_balance",
            align: 'center',
        },
        {
            title: "创建时间",
            dataIndex: "",
            key: "",
            align: 'center',
            render:(record)=>{
                return moment(record.created_at).format("YYYY-MM-DD HH:mm:ss")
            },
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
        const result = await getCreditUserlists(
            this.state.inputKey,
            this.state.inputValue,
            page,
            limit,
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
    handlAddChaoguan =  async () => {
        if (this.state.inputAccount == "" ||this.state.inputPassword == "") {
            return message.info("账号密码不能为空!");
        }
        if(this.state.inputPackageId == ""){
            return message.info("授权品牌不能为空！")
        }
        const res = await reqCreditAdduser(
            this.state.inputAccount,
            this.state.inputPassword,
            "",
            this.state.inputPackageId,
            1,//超管默认为1
        );
        if (res.status == 0) {
            message.success("操作成功！");
            this.setState({ inputPackageId: "",inputAccount: "", inputPassword: "",isShowAddChaoguan:false });
            this.getCreditUserlist(1,20)
        } else {
            message.info("操作失败:" + res.msg);
        }
    }
    handlAddCaopan =  async () => {
        if (this.state.inputAccount == "" ||this.state.inputPassword == "") {
            return message.info("账号密码不能为空!");
        }
        if(this.state.inputPackageId == ""){
            return message.info("授权品牌不能为空！")
        }else if(this.state.inputPackageId.split("").length>2){
            return message.info("授权品牌只能传1个")
        }
        const res = await reqCreditAdduser(
            this.state.inputAccount,
            this.state.inputPassword,
            this.state.inputUserId,
            this.state.inputPackageId,
            2,//操盘默认为2
        );
        if (res.status == 0) {
            message.success("操作成功！");
            this.setState({ inputPackageId: "",inputAccount: "", inputPassword: "",inputUserId:"",isShowAddCaopan:false });
            this.getCreditUserlist(1,20)
        } else {
            message.info("操作失败:" + res.msg);
        }
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
                &nbsp; &nbsp;
                <Select
                    placeholder="查询下拉选项"
                    style={{ width: 200 }}
                    value={this.state.inputKey}
                    onChange={(val) => {
                        this.setState({ inputKey: val });
                    }}
                >
                    <Option value="account">账号</Option>
                    <Option value="user_id">玩家ID</Option>
                    <Option value="package_id">品牌ID</Option>
                    <Option value="role_id">角色ID</Option>
                </Select>
                &nbsp; &nbsp;
                <Input
                    type="text"
                    placeholder="请输入查询内容"
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
                        this.setState({ isShowAddChaoguan: true });
                    }}
                    size="default"
                >新增超管
                </LinkButton>
                &nbsp; &nbsp;
                <LinkButton
                        onClick={() => {
                            this.setState({ isShowAddCaopan: true });
                        }}
                        size="default"
                    >新增操盘
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
                this.state.isShowAddChaoguan && (
                    <Modal
                        title="新增超管"
                        visible={this.state.isShowAddChaoguan}
                        onOk={this.handlAddChaoguan}
                        onCancel={() => {
                            this.setState({ isShowAddChaoguan: false });
                        }}
                    >
                        <p>超管账号 <Input
                            placeholder="请输入账号"
                            value={this.state.inputAccount}
                            onChange={(e) => this.setState({ inputAccount: e.target.value })}
                        /></p>
                        <p>超管密码 <Input
                            placeholder="请输入密码"
                            value={this.state.inputPassword}
                            onChange={(e) => this.setState({ inputPassword: e.target.value })}
                        /></p>
                        <p>授权品牌 <Input
                            placeholder="请输入授权品牌"
                            value={this.state.inputPackageId}
                            onChange={(e) => this.setState({ inputPackageId: e.target.value })}
                        /></p>
                        <p style={{color:"red"}}>说明:授权品牌可以传多个,中间用逗号间隔</p>
                    </Modal>
                )
            }
             {
                this.state.isShowAddCaopan && (
                    <Modal
                        title="新增操盘"
                        visible={this.state.isShowAddCaopan}
                        onOk={this.handlAddCaopan}
                        onCancel={() => {
                            this.setState({ isShowAddCaopan: false });
                        }}
                    >
                        <p>操盘账号 <Input
                            placeholder="请输入账号"
                            value={this.state.inputAccount}
                            onChange={(e) => this.setState({ inputAccount: e.target.value })}
                        /></p>
                        <p>操盘密码 <Input
                            placeholder="请输入密码"
                            value={this.state.inputPassword}
                            onChange={(e) => this.setState({ inputPassword: e.target.value })}
                        /></p>
                        <p>玩家ID <Input
                            placeholder="请输入玩家ID"
                            value={this.state.inputUserId}
                            onChange={(e) => this.setState({ inputUserId: e.target.value })}
                        /></p>
                        <p>授权品牌 <Input
                            placeholder="请输入授权品牌"
                            value={this.state.inputPackageId}
                            onChange={(e) => this.setState({ inputPackageId: e.target.value })}
                        /></p>
                        <p style={{color:"red"}}>说明:授权品牌只能传1个</p>
                    </Modal>
                )
            }
        </Card>
    }
}
