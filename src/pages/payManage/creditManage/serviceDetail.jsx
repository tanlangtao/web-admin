import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Select,
} from "antd";
import Mytable from "../../../components/MyTable";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button/index";
import GoldDetail from "../goldDetail";
import {
    bindInfo,
    reqUsers,
    createTask
} from "../../../api/index";
const { Option } = Select;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    startTime: '',
    endTime: '',
    inputKey: "玩家ID",
    inputValue: "",
    id: 427223993, // id先写死
    loading: false,
    data: [],
    isShowGoldDetail: false,
    isResetPwdShow:false,
    isShowGoldChange:false,
    resetpwd:"",
    changeGold:""
};
export default class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "代充ID",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "历史总代充",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "历史总代付",
            dataIndex: "",
            key: "",
            align: 'center',
            // width: 150,
        },
        {
            title: "充提差",
            dataIndex: "",
            key: "",
            align: 'center',
            // width: 100,
        },
        {
            title: "当前信用额度",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "注册时间",
            dataIndex: "",
            key: "",
            align: 'center',
            width: 100,
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    <LinkButton type="default" onClick={() => this.showGoldDetail()}>
                        资金明细
              </LinkButton>
                    <LinkButton type="default" onClick={() =>this.resetPwd(record)}>
                        重置密码
              </LinkButton>
                    <LinkButton type="default" onClick={() =>this.goldChange(record)}>
                        资金变动
              </LinkButton>
                </span>
            ),
        },
    ];
    showGoldDetail = () => {
        this.setState({
            isShowGoldDetail: true
        })
    }
    resetPwd = (record) => {
        this.setState({ isResetPwdShow: true });
        this.recordID = record.id;
    };
    goldChange = (record) => {
        this.setState({ isShowGoldChange: true });
        this.recordID = record.id;
    };
    handleResetpwd = async () => {
        const res = await createTask(this.recordID, this.state.resetpwd);
        if (res.status === 0) {
            message.success("操作成功！");
            this.setState({ resetpwd: "", isResetPwdShow: false });
        } else {
             message.success("操作失败:" + res.msg);
        }
    };
    handleGoldChange = async () => {
        const res = await createTask(this.recordID, this.state.changeGold);
        if (res.status === 0) {
            message.success("操作成功！");
            this.setState({ changeGold: "", isShowGoldChange: false });
        } else {
             message.success("操作失败:" + res.msg);
        }
    };
    getUsers = async (page, limit) => {
        this.setState({ loading: true });
        const result = await reqUsers(
            page,
            limit,
            this.state.startTime,
            this.state.endTime,
            this.state.inputKey,
            this.state.inputValue
        );
        if (result.status === 0) {
            const { game_user, proxy_user } = result.data;
            game_user.forEach((element) => {
                proxy_user.forEach((item) => {
                    if (element.id === item.id) {
                        element.proxy_nick = item.proxy_pid;
                    }
                });
            });
            this.setState({
                data: game_user,
                count: result.data && result.data.count,
                loading: false,
                packages: result.data && result.data.packages,
            });
        } else {
            message.info(result.msg || "未检索到数据");
        }
    };
    componentDidMount() {
        this.getUsers(1, 20)
    }
    render() {
        const { data, count, current, pageSize, loading } = this.state;
        const title = (
            <span>
                <Input
                    type="text"
                    placeholder="请输入代充ID"
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
                        this.getUsers(1, this.state.pageSize);
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
            />
            {this.state.isShowGoldDetail && (
                <Modal
                    title={`资金明细`}
                    visible={this.state.isShowGoldDetail}
                    onCancel={() => {
                        this.setState({ isShowGoldDetail: false });
                    }}
                    footer={null}
                    width="85%"
                    maskClosable={false}
                    style={{ top: 10 }}
                >
                    <GoldDetail></GoldDetail>
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
                    title="资金变动"
                    visible={this.state.isShowGoldChange}
                    onOk={this.handleGoldChange}
                    onCancel={() => {
                        this.setState({ isShowGoldChange: false });
                    }}
                >
                    <Input
                        value={this.state.changeGold}
                        onChange={(e) => this.setState({ changeGold: e.target.value })}
                    />
                </Modal>
            )}
        </Card>
    }
}
