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
import moment from "moment";
import {
    getCreditUserlist,
    reqGetDividendRule,
    reqSetDividendRule,
    reqEditUser
} from "../../api/index";
import { formateDate } from "../../utils/dateUtils";
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
    setTreatment: "",
    editTreatment: "",
    rule_id:""
};
export default class PtManage extends Component {
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
        },
        {
            title: "玩家ID",
            dataIndex: "user_id",
            key: "user_id",
            align: 'center',
        },
        {
            title: "注册时间",
            dataIndex: "created_at",
            key: "created_at",
            align: 'center',
            render: (record) => {
                return moment(record.created_at).format("YYYY-MM-DD HH:mm:ss")
            },
        },
        {
            title: "用户组",
            dataIndex: "role_id",
            key: "role_id",
            align: 'center',
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
                    <LinkButton onClick={() => this.handleShowModel(record, 4)}>
                        修改待遇
              </LinkButton>
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
                this.GetDividendRule()
                break;

        }

    }
    handleResetpwd = async () => {
        if (this.state.resetpwd == "") {
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
    GetDividendRule = async () => {
        const res = await reqGetDividendRule(
            this.props.admin_user_id,
            this.record.user_id,//id
            4, //type
            0, //game_tag
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
                data: result.data,
                count: result.data && result.data.length,
            });
        } else {
            message.info(result.msg || "未检索到数据");
        }
        this.setState({
            loading: false,
        });
    };
    componentDidMount() {
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
        </Card>
    }
}
