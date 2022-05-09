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
import {
    reqUsers
} from "../../api/index";
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    loading: false,
    data: [],
};
export default class MyGoldDetail extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "时间",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "代充ID",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "玩家ID",
            dataIndex: "",
            key: "",
            align: 'center',
            // width: 150,
        },
        {
            title: "交易前金额",
            dataIndex: "",
            key: "",
            align: 'center',
            // width: 100,
        },
        {
            title: "交易金额",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "交易后金额",
            dataIndex: "",
            key: "",
            align: 'center',
            width: 100,
        },
        {
            title: "备注",
            dataIndex: "",
            key: "",
            align: 'center',
        },
    ];
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
        return <Mytable
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
    }
}
