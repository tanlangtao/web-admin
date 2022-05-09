import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Select,
} from "antd";
import Mytable from "../../components/MyTable";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import GoldDetail from "./goldDetail";
import {
    bindInfo,
    reqUsers
} from "../../api/index";
const { Option } = Select;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    id: 427223993, // id先写死
    loading: false,
    data: [],
    isShowGoldDetail: false,
};
export default class MyGoldDetail extends Component {
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
                </span>
            ),
        },
    ];
    showGoldDetail = () => {
        this.setState({
            isShowGoldDetail: true
        })
    }
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
        return <Card>
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
        </Card>
    }
}
