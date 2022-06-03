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
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import riskcontrolfn from "../../components/riskcontrol";
import { formateDate } from "../../utils/dateUtils";
import moment from "moment";
import {
    reqMenulist,
    reqAddmenu,
    reqEditmenu,
    reqMenulisttotal

} from "../../api/index";

const { Option } = Select;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    data: [],
    dataLevel1:[],
    isShowAddModel:false,
    isShowEditModel:false,
    inputTitle:"",
    inputId:"0",
    inputSort:"",
    inputStatus:"",
    version:1654155035
};
export default class MenuManage extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }

    initColumns = () => [
        {
            title: "菜单ID",
            dataIndex: "id",
            key: "id",
            fixed: "left",
            align: 'center',
            width: 120
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
            title: "菜单上级",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (record) => {
                let str = ""
                switch (record.pid) {
                    case 1:
                        str = "用户管理"
                        break;
                    case 2:
                        str = "支付管理"
                        break;
                    case 3:
                        str = "活动管理"
                        break;
                    case 4:
                        str = "报表管理"
                        break;
                    case 5:
                        str = "推广员管理"
                        break;  
                    case 6:
                        str = "账户管理"
                        break;
                    default:
                        str = ""
                        break;
                }
                return str
            }
        },
        {
            title: "当前层级排序",
            dataIndex: "sort",
            key: "sort",
            align: 'center',
        },
        {
            title: "显示状态",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (record) => {
                return record.status == "1" ? "是" : "否"
            }
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    {<LinkButton onClick={() => this.showModel(record, 1)}>
                        编辑
                </LinkButton>
                    }
                </span>
            ),
        },
    ];

    showModel = (record, num) => {
        this.record = record
        let {pid,sort,status} = this.record
        switch (num) {
            case 1:
                this.setState({
                    isShowEditModel: true,
                    inputId:`${pid}`,
                    inputSort:`${sort}`,
                    inputStatus:`${status}`,
                })
                break;
            case 2:
                this.setState({
                    isShowAddModel: true
                })
        }
    }
    handleAddMenu = async ()=>{
        if(this.state.inputTitle == "" || this.state.inputId == "" || this.state.inputSort == "" || this.state.inputStatus==""){
            return message.info("输入不能为空")
        }
        const result = await reqAddmenu(
            this.state.inputTitle,
            Number(this.state.inputId),
            Number(this.state.inputSort),
            Number(this.state.inputStatus),
            this.state.inputId == 0 ? 0 :1 // level
        )
        if (result.status == 0){
            message.success("操作成功")
            this.setState({
                isShowAddModel:false,
                inputTitle:"",
                inputId:"",
                inputSort:"",
                inputStatus:"",
                isShowAddModel:false
            })
            this.getReqMenulisttotal()
        }else{
            message.error(`失败！${result.data}`)
        }
    }
    handleEditMenu = async ()=>{
        if(this.state.inputId == "" || this.state.inputSort == "" || this.state.inputStatus==""){
            return message.info("输入不能为空")
        }
        const result = await reqEditmenu(
            this.record.title,
            this.record.id,
            Number(this.state.inputId),
            Number(this.state.inputSort),
            Number(this.state.inputStatus),
            this.state.inputId == 0 ? 0:1 // level
        )
        if (result.status == 0){
            message.success("操作成功")
            this.setState({
                isShowAddModel:false,
                inputTitle:"",
                inputId:"",
                inputSort:"",
                inputStatus:"",
                isShowEditModel:false
            })
            this.getReqMenulisttotal()
        }else{
            message.error(`失败！${result.data}`)
        }
    }
    
    getReqMenulist = async (page, limit) => {
        const result = await reqMenulist(page,limit)
        if (result.status === 0) {
            let data = result.data
            this.setState({
                data: data,
                loading: false,
            });
        } else {
            message.error(`失败！${result.data}`)
        }
    }
    getReqMenulisttotal = async () => {
        const result = await reqMenulisttotal()
        this.getReqMenulist(1,20)
        if (result.status === 0) {
            let data = result.data
            this.setState({
                count: data.length,
                dataLevel1:data
            });
        } else {
            message.error(`失败！${result.data}`)
        }
    }
    componentDidMount() {
        //默认查询一周数据
        this.getReqMenulisttotal()
    }
    render() {
        const { data, count, current, pageSize, loading } = this.state;
        const title = (
            <span>
                <LinkButton onClick={()=>this.showModel({},2)}>增加菜单</LinkButton>
                <li style={{display: "inline", marginLeft: "70%"}}>版本号:{this.state.version}</li>
                
            </span>
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
                    this.getReqMenulist(page, limit);
                }}
                setPagination={(current, pageSize) => {
                    if (pageSize) {
                        this.setState({ current, pageSize });
                    } else {
                        this.setState({ current });
                    }
                }}
            />
            {this.state.isShowAddModel && (
                <Modal
                    title="增加菜单"
                    visible={this.state.isShowAddModel}
                    onOk={this.handleAddMenu}
                    onCancel={() => {
                        this.setState({ isShowAddModel: false });
                    }}
                >
                    <div style={{display:"flex"}}> 
                        <span style={{width:"80px"}}>菜单名称</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入菜单名称"
                            value={this.state.inputTitle}
                            onChange={(e) => this.setState({ inputTitle: e.target.value })}
                        />
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>菜单上级</span>
                        &nbsp;&nbsp;
                        <Select
                            style={{ width: 200 }}
                            placeholder=""
                            value={this.state.inputId}
                            onChange={(val) => {
                                this.setState({ inputId: val });
                            }}
                            >
                            <Option value='0'>无</Option>
                            {
                                this.state.dataLevel1.map((e,i)=>{
                                    return <Option value={`${e.id}`} key={i}>{e.title}</Option>
                                })
                            }
                        </Select>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>当前层级排序</span>
                        &nbsp;&nbsp;
                        <InputNumber
                            min = {1}
                            precision={0}
                            placeholder="请输入层级排序数字"
                            value={this.state.inputSort}
                            onBlur={(e) => this.setState({ inputSort: e.target.value })}
                        />
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>显示状态</span>
                        &nbsp;&nbsp;
                        <Select
                            style={{ width: 200 }}
                            placeholder=""
                            value={this.state.inputStatus}
                            onChange={(val) => {
                                this.setState({ inputStatus: val });
                            }}
                            >
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    </div>
                </Modal>
            )}
            {this.state.isShowEditModel && (
                <Modal
                    title="编辑菜单"
                    visible={this.state.isShowEditModel}
                    onOk={this.handleEditMenu}
                    onCancel={() => {
                        this.setState({ isShowEditModel: false });
                    }}
                >
                    <div style={{display:"flex"}}> 
                        <span style={{width:"80px"}}>菜单名称</span>
                        &nbsp;&nbsp;
                        <span>{this.record.title}</span>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>菜单上级</span>
                        &nbsp;&nbsp;
                        <Select
                            style={{ width: 200 }}
                            placeholder=""
                            value={this.state.inputId}
                            onChange={(val) => {
                                this.setState({ inputId: val });
                            }}
                            >
                            <Option value='0'>无</Option>
                            {
                                this.state.dataLevel1.map((e,i)=>{
                                    return <Option value={`${e.id}`} key={i}>{e.title}</Option>
                                })
                            }
                        </Select>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>当前层级排序</span>
                        &nbsp;&nbsp;
                        <InputNumber
                            min = {1}
                            precision={0}
                            placeholder="请输入层级排序数字"
                            value={this.state.inputSort}
                            onBlur={(e) => this.setState({ inputSort: e.target.value })}
                        />
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <span>显示状态</span>
                        &nbsp;&nbsp;
                        <Select
                            style={{ width: 200 }}
                            placeholder=""
                            value={this.state.inputStatus}
                            onChange={(val) => {
                                this.setState({ inputStatus: val });
                            }}
                            >
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    </div>
                </Modal>
            )}
        </Card>
    }
}
