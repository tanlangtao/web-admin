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
import PopProxySetting from "../user/pop_user_proxy_setting";
import moment from "moment"
import TeamdataQuery from "./teamdataQuery";
import { check, checkPass } from "../../utils/commonFuntion";
import {
    getCreditUserlist,
    getDividendRule,
    reqSetDividendRule,
    reqEditUser,
    reqGetProxyUserNumber
} from "../../api/index";
import { formateDate } from "../../utils/dateUtils";
import GameBetAmount from "./gameBetAmount"
import GameBetData from "./gameBetData"
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
    isResetPwdShow: false,
    resetpwd: "",
    isShowSetTreatMentModel: false,
    isShowEditTreatMentModel: false,
    isShowTeamdataQuery: false,
    setTreatment: "",
    editTreatment: "",
    rule_id: "",
    isShowTeamPerson:false,
    teamPersonData:[],
    teamPersonCount:0,
    teamLoading:false,
    isShowGameBetAmount:false,
    isShowGameBetData:false,
};
export default class PtManage extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    teamColumns = ()=>[
        {
          title: "玩家ID",
          dataIndex: "id",
          key: "id",
          align: 'center',
        },
        {
          title: "团队总人数",
          dataIndex: "count",
          key: "count",
          align: 'center',
        },
      ]

    initColumns = () => [
        {
            title: "账号名称",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            align: 'center',
        },
        {
            title: "玩家ID",
            dataIndex: "user_id",
            key: "user_id",
            fixed: "left",
            align: 'center',
        },
        {
            title: "注册时间",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (record) => {
                return moment(record.created_at).format("YYYY-MM-DD HH:mm:ss")
            },
        },
        {
            title: "用户组",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (record) => {
                let str = ""
                switch (record.role_id) {
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
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    <LinkButton onClick={() => this.handleShowModel(record, 1)}>
                        查看代理链
                    </LinkButton>
                    <LinkButton onClick={() => this.handleShowModel(record, 2)}>
                        重置密码
                    </LinkButton>
                    <LinkButton onClick={() => this.handleShowModel(record, 3)}>
                        查看待遇
                    </LinkButton>
                    <LinkButton onClick={() => this.handleShowModel(record, 7)}>
                        团队输赢流水
                    </LinkButton>
                    <LinkButton onClick={() => this.handleShowModel(record, 8)}>
                        团队有效投注
                    </LinkButton>
                    <LinkButton onClick={() => this.handleShowModel(record, 6)}>
                        团队人数
                    </LinkButton>
                    {/* <LinkButton onClick={() => this.handleShowModel(record, 5)}>
                        团队业绩查询
                    </LinkButton> */}
                    {/* <LinkButton onClick={() => this.handleShowModel(record, 4)}>
                        修改待遇
              </LinkButton> */}
                </span>
            ),
        },
    ];
    handleShowModel = (record, num) => {
        this.record = record
        switch (num) {
            case 1:
                this.setState({
                    isShowPopProxySetting: true
                })
                break;
            case 2:
                this.setState({
                    isResetPwdShow: true,
                })
                break;
            case 3:
                this.setState({
                    isShowSetTreatmentModel: true,
                })
                this.GetDividendRule()
                break;
            case 4:
                this.setState({
                    isShowEditTreatMentModel: true,
                })
                // this.GetDividendRule()
            case 5:
                this.setState({
                    isShowTeamdataQuery: true,
                })
                break;
            case 6:
                this.setState({
                    isShowTeamPerson: true,
                })
                this.GetProxyUserNumber()
                break;
            case 7:
                this.setState({
                    isShowGameBetAmount: true,
                })
                break;
            case 8:
                this.setState({
                    isShowGameBetData: true,
                })
                break;


        }

    }
    handleResetpwd = async () => {
        if (this.state.resetpwd == "") {
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
    GetDividendRule = async () => {
        const res = await getDividendRule(
            this.record.user_id,//id
        );
        if (res.code == 200) {
            this.setState({
                setTreatment: res.msg ? res.msg[0].percent : 0,
                rule_id: res.msg ? res.msg[0]._id : "",
            })
        } else {
            message.info(res.msg);
        }
    }
    handEditTreatment = async () => {
        let newNum = Number(Number(this.state.editTreatment).toFixed(0))
        if (newNum < 0) {
            return message.info("只能设置为正整数");
        }
        const res = await reqSetDividendRule(
            this.props.admin_user_id,
            this.state.rule_id,
            0,
            newNum, //分红比例， 只能传正整数
        );
        if (res.code == 200) {
            message.success("操作成功！");
            this.setState({
                setTreatment: res.msg ? res.msg.percent : 0,
                editTreatment: 0,
                isShowEditTreatMentModel: false
            })
        } else {
            message.info("操作失败:" + res.msg);
        }
    }
    getCreditUserlist = async (page, limit) => {
        this.setState({ loading: true });
        const result = await getCreditUserlist(
            this.props.package_id,
            this.state.inputValue,
            page,
            limit,
            4
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
    GetProxyUserNumber = async (record, status) => {
        this.setState({ teamLoading: true })
        let data = {
            "account_name": this.props.admin_user_id,
            "ids": `[${this.record.user_id}]`
        }
        const res = await reqGetProxyUserNumber(data);
        let data2 = [{id:`${this.recordID}`,"count":0}]
        if (res.code === 200) {
          this.setState({
            teamPersonData:res.msg? res.msg : data2 ,
            teamPersonCount:res.msg ? res.msg.length:1,
          })
        } else {
            message.info(res.msg || "失败");
        }
        this.setState({
            teamLoading: false
        })
    };
    componentDidMount() {
        // console.log('PtManage====', this.props.admin_user_id);
        this.setState({
            start_time: moment().startOf("day").subtract(1, "month"),
            end_time: moment().startOf("day")
        }, () => {
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
            {this.state.isShowPopProxySetting && (
                <Modal
                    title={`查看代理链`}
                    visible={this.state.isShowPopProxySetting}
                    onCancel={() => {
                        this.setState({ isShowPopProxySetting: false });
                    }}
                    footer={null}
                    width="85%"
                    maskClosable={false}
                    style={{ top: 10 }}
                >
                    <PopProxySetting
                        recordID={this.record.user_id}
                    />
                </Modal>
            )}
            {/* 团队业绩查询 */}
            {this.state.isShowTeamdataQuery && (

                <Modal
                    title={`团队业绩查询 ${this.record.user_id}`}
                    visible={this.state.isShowTeamdataQuery}
                    onCancel={() => {
                        this.setState({ isShowTeamdataQuery: false });
                    }}
                    footer={null}
                    width="85%"
                    maskClosable={false}
                    style={{ top: 10 }}
                >
                    <TeamdataQuery user_id={this.record} admin_id={this.props.admin_user_id}></TeamdataQuery>
                </Modal>
            )}

            {this.state.isResetPwdShow && (
                <Modal
                    title={`重置密码${this.record.user_id}`}
                    visible={this.state.isResetPwdShow}
                    onOk={this.handleResetpwd}
                    onCancel={() => {
                        this.setState({ isResetPwdShow: false,resetpwd:"" });
                    }}
                >
                    <span>重置密码</span>
                    <Input
                        value={this.state.resetpwd}
                        onChange={(e) => this.setState({ resetpwd: e.target.value })}
                    />
                </Modal>
            )}
            {this.state.isShowSetTreatmentModel && (
                <Modal
                    title="查看待遇"
                    visible={this.state.isShowSetTreatmentModel}
                    onCancel={() => {
                        this.setState({ isShowSetTreatmentModel: false });
                    }}
                    footer={null}
                >
                    <div>玩家ID : {this.record.user_id}</div>
                    &nbsp; &nbsp;
                    <div><span>分红类型 :</span> <span>亏损分红</span></div>
                    &nbsp; &nbsp;
                    <div>待遇 : <InputNumber
                        disabled={true}
                        placeholder=""
                        size="small"
                        min={0}
                        max={100}
                        value={this.state.setTreatment}
                    />%</div>
                    <div style={{ height: "10px" }}></div>
                </Modal>
            )}
            {this.state.isShowEditTreatMentModel && (
                <Modal
                    title="修改待遇"
                    visible={this.state.isShowEditTreatMentModel}
                    onCancel={() => {
                        this.setState({ isShowEditTreatMentModel: false });
                    }}
                    footer={null}
                >
                    <div>玩家ID : {this.record.user_id}</div>
                    &nbsp; &nbsp;
                    <div><span>分红类型 :</span> <span>亏损分红</span></div>
                    &nbsp; &nbsp;
                    <div>当前待遇 : <InputNumber
                        disabled={true}
                        placeholder=""
                        size="small"
                        min={0}
                        max={100}
                        value={this.state.setTreatment}
                    />%</div>
                    <div>调整待遇 : <InputNumber
                        disabled={this.state.rule_id ? false : true}
                        placeholder=""
                        size="small"
                        min={0}
                        max={100}
                        value={this.state.editTreatment}
                        onBlur={(e) => (this.setState({ editTreatment: e.target.value }, this.handEditTreatment))}
                    />%</div>
                    &nbsp; &nbsp;
                    <div style={{ height: "10px" }}></div>
                </Modal>
            )}
            {this.state.isShowTeamPerson && (
                <Modal
                    title={`团队人数 ${this.record.user_id}`}
                    visible={this.state.isShowTeamPerson}
                    onCancel={() => {
                        this.setState({ isShowTeamPerson: false });
                    }}
                    footer={null}
                >
                    <Mytable
                        tableData={{
                            data: this.state.teamPersonData,
                            count: this.state.teamPersonCount,
                            columns: this.teamColumns(),
                            x: "max-content",
                            loading: this.state.teamLoading
                        }}
                        pagination={false}
                        paginationOnchange={(page, limit) => {
                        }}
                        setPagination={(current, pageSize) => {

                        }}
                    />
                </Modal>
            )}
            {this.state.isShowGameBetAmount && (
                <Modal
                    title={`团队输赢流水 ${this.record.user_id}`}
                    visible={this.state.isShowGameBetAmount}
                    onCancel={() => {
                        this.setState({ isShowGameBetAmount: false });
                    }}
                    width="90%"
                    top={10}
                    footer={null}
                >
                    <GameBetAmount recordID = {this.record.user_id}></GameBetAmount>
                </Modal>
            )}
            {this.state.isShowGameBetData && (
                <Modal
                    title={`团队有效投注 ${this.record.user_id}`}
                    visible={this.state.isShowGameBetData}
                    onCancel={() => {
                        this.setState({ isShowGameBetData: false });
                    }}
                    footer={null}
                    width="90%"
                    top={10}
                >
                    <GameBetData recordID = {this.record.user_id}></GameBetData>
                </Modal>
            )}
        </Card>
    }
}
