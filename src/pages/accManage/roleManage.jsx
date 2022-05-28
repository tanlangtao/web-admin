import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Popconfirm,
    Descriptions,
    Checkbox
} from "antd";
import Mytable from "../../components/MyTable";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
    reqAddrole,
    reqEditrole,
    reqDelrole,
    reqCreditrolelist,
    reqMenulisttotal
} from "../../api/index";
const init_state = {
    current: 1,
    current2: 1,
    pageSize: 20,
    pageSize2: 10,
    count: 1,
    data:[],
    loading: false,
    isShowAddRoleModel:false,
    isShowEditRoleModel:false,
    roleGroup:[],
    groupName:"",
    MenuList:[],
    MenuListCount:0,
};
export default class RoleManage extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "序号",
            dataIndex: "id",
            key: "id",
            align: 'center',
        },
        {
            title: "用户组名称",
            dataIndex: "name",
            key: "name",
            align: 'center',
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    <LinkButton onClick={() => this.handeButton(record, "1")}>
                        权限管理
                    </LinkButton>
                    
                    <Popconfirm
                        title={`您要删除${record.name}。请确认`}
                        onConfirm={() => this.handeButton(record,"2")}
                        okText="确定"
                        cancelText="取消"
                    >
                        <LinkButton>
                            删除用户组
                        </LinkButton>
                    </Popconfirm> 
                </span>
            ),
        },
    ];
    handeButton = (record,num)=>{
        this.record = record
        switch (num) {
            case "1":
                this.getReqMenulisttotal()
                this.setState({
                    roleGroup:record.role.split(","),
                    isShowEditRoleModel:true
                })
             break;
            case "2":
                this.getReqDelrole()
                break;
            default:
                break;
        }
    }
    initMenuListColumns = () => {
        console.log(this.state.roleGroup)
        return [
            {
                title: "菜单ID",
                dataIndex: "id",
                key: "id",
                align: 'center',
            },
            {
                title: "菜单名称",
                dataIndex: "title",
                key: "title",
                align: 'center',
            },
            {
                title: "层级",
                dataIndex: "level",
                key: "level",
                align: 'center',
            },
            {
                title: "请勾选",
                dataIndex: "",
                key: "",
                align: 'center',
                render: (text, record) => (
                    <Checkbox onChange={()=>this.checkMenuList(record)} defaultChecked={this.state.roleGroup.indexOf(`${record.id}`)>-1?true:false}></Checkbox>
                ),
            },
        ];
    }
    checkMenuList(record){
        let {roleGroup} = this.state
        
        let index = roleGroup.indexOf(`${record.id}`)
        if(index >-1){
            let arr1 = roleGroup
            arr1.splice(index,1)
            this.setState({
                roleGroup:arr1
            },()=>{
                console.log("删除",roleGroup)
            })
        }else{
            let arr = roleGroup
            arr.push(`${record.id}`)
            this.setState({
                roleGroup:arr
            },()=>{
                console.log("新增",roleGroup)
            })
        }
    }
    getUsers = async (page, limit) => {
        this.setState({ loading: true });
        const result = await reqCreditrolelist(
        );
        if (result.status === 0) {
           this.setState({
               data:result.data
           })
        }else{
            message.error("失败！")
        }
        this.setState({
            loading:false
        })
    }
    getReqAddrole = async ()=>{
        if(this.state.groupName==""){
            return message.info("用户组名称不能为空！")
        }
        const result = await reqAddrole(
            this.state.groupName,
            this.state.roleGroup.join()
        );
        if (result.status === 0) {
            message.success("操作成功！")
            this.getUsers(1,20)
            this.setState({
                groupName:"",
                roleGroup:[],
                isShowAddRoleModel:false
            })
        }else{
            message.error("操作失败！")
        }
    }
    getReqEditrole = async ()=>{
        const result = await reqEditrole(
            this.record.id,
            this.record.name,
            this.state.roleGroup.join()
        );
        if (result.status === 0) {
            message.success("操作成功！")
            this.getUsers(1,20)
            this.setState({
                roleGroup:[],
                isShowEditRoleModel:false
            })
        }else{
            message.error("操作失败！")
        }
    }
    getReqDelrole = async ()=>{
        const result = await reqDelrole(
            this.record.id,
        );
        if (result.status === 0) {
            message.success("操作成功！")
            this.getUsers(1,20)
        }else{
            message.error("操作失败！")
        }
    }
    getReqMenulisttotal = async () => {
        let result = await reqMenulisttotal()
        if (result.status === 0) {
            let data = result.data
            this.setState({
                MenuList:data,
                MenuListCount: data.length,
            });
        } else {
            message.error(`失败！${result.data}`)
        }
    }
    showAddRoleModel = ()=>{
        this.setState({
            isShowAddRoleModel:true
        })
    }
    componentDidMount() {
        this.getUsers(1, 20)
        this.getReqMenulisttotal()
    }
    render() {
        const { data, count, current,pageSize,loading,MenuList,MenuListCount } = this.state;
        let title = (
            <div>
                
                <LinkButton onClick={()=>this.showAddRoleModel()}>增加用户组</LinkButton>
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
                paginationOnchange={(page, limit) => {
                    this.getUsers(page, limit);
                }}
                setPagination={(current, pageSize) => {
                if (pageSize) {
                    this.setState({ current, pageSize });
                } else {
                    this.setState({ current });
                }
                }}
            />
            {this.state.isShowAddRoleModel && (
                <Modal
                    title={`增加用户组`}
                    visible={this.state.isShowAddRoleModel}
                    onCancel={() => {
                        this.setState({ isShowAddRoleModel: false });
                    }}
                    onOk={()=>this.getReqAddrole()}
                >
                    <p style={{display:"flex"}}>
                        <span style={{width:"100px",lineHeight:"30px"}}>用户组名称</span>
                        <Input
                            placeholder="请输入用户组名称"
                            value={this.state.groupName}
                            onChange={(e) => this.setState({ groupName: e.target.value })}
                        />
                    </p>
                    <p style={{color:"red"}}>说明：需要输入新增用户组名称</p>
                </Modal>
            )}
             {this.state.isShowEditRoleModel && (
                <Modal
                    title={`权限管理`}
                    visible={this.state.isShowEditRoleModel}
                    onCancel={() => {
                        this.setState({ isShowEditRoleModel: false });
                    }}
                    style={{ top: 10 }}
                    onOk={()=>this.getReqEditrole()}
                >
                    <Mytable
                        tableData={{
                            data:MenuList,
                            count:MenuListCount,
                            columns: this.initMenuListColumns(),
                            x: "max-content",
                            pageSize:this.state.MenuListCount
                        }}
                        paginationOnchange={()=>{}}
                        setPagination={()=>{}}
                    />
                </Modal>
            )}
             {this.state.isShowDeleteGroup && (
                <Modal
                    title={`删除用户组`}
                    visible={this.state.isShowDeleteGroup}
                    onCancel={() => {
                        this.setState({ isShowDeleteGroup: false });
                    }}
                    style={{ top: 10 }}
                    onOk={()=>this.getReqEditrole()}
                >
                    <Mytable
                        tableData={{
                            data:MenuList,
                            count:MenuListCount,
                            columns: this.initMenuListColumns(),
                            x: "max-content",
                            pageSize:this.state.MenuListCount
                        }}
                        paginationOnchange={()=>{}}
                        setPagination={()=>{}}
                    />
                </Modal>
            )}
        </Card>
    }
}
