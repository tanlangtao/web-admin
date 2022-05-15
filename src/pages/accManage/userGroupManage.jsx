import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Popconfirm,
    Descriptions,
} from "antd";
import Mytable from "../../components/MyTable";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
    bindInfo,
    reqUsers,
    reqAddrole,
    reqEditrole,
    reqDelrole,
    getCreditUserlist
} from "../../api/index";
const init_state = {
    current: 1,
    pageSize: 20,
    count: 1,
    id: 427223993, // id先写死
    loading: false,
    game_user_data: {},
    proxy_user_data: {},
    userGroup:""
};
export default class AccountDetail extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "序号",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "用户组名称",
            dataIndex: "",
            key: "",
            align: 'center',
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    <LinkButton type="default" onClick={() => this.reset(record, "2")}>
                        权限详情
                    </LinkButton>
                    <LinkButton type="default" onClick={() => this.reset(record, "3")}>
                        修改权限
                    </LinkButton>
                    <LinkButton type="default" onClick={() => this.reset(record, "3")}>
                        删除用户组
                    </LinkButton>
                </span>
            ),
        },
    ];
    //获取当前玩家信息
    getUsers = async (page, limit) => {
        this.setState({ loading: true });
        const result = await getCreditUserlist(
        );
        if (result.status === 0) {
           
        }
        this.setState({
            loading:false
        })
    }
    getReqAddrole = async ()=>{
        const result = await reqAddrole(
            this.state.userGroup,
            "1,2,3,4,5"
        );
        if (result.status === 0) {
            message.success("操作成功！")
        }else{
            message.error("操作失败！")
        }
    }
    componentDidMount() {
        this.getUsers(1, 20)
    }
    render() {
        const { data, count, current,pageSize,loading } = this.state;
        let title = (
            <div>
                <Input
                    placeholder="输入用户组名称"
                    value={this.state.userGroup}
                    onChange={(e) => this.setState({ userGroup: e.target.value })}
                />
                <LinkButton onClick={()=>this.getReqAddrole()}>增加用户组</LinkButton>
            </div>
        )
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
        </Card>
    }
}
