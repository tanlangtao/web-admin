import React, { Component } from "react";
import {
    Card,
    Modal,
    message,
    Icon,
    Input,
    Select,
    InputNumber,
    Popconfirm
} from "antd";
import Mytable from "../../components/MyTable";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import {
    reqDomainlist,
    reqAdddomain,
    reqEditdomain,
    reqDeldomain
} from "../../api/index";

const { Option } = Select;
const { TextArea } = Input;
const init_state = {
    current: 1,
    pageSize: 20,
    count: 0,
    data: [],
    isShowAddModel: false,
    isShowEditModel: false,
    inputKey: "packageid",
    inputValue: "",
    tip:"",
    packageid:"",
    envtype:"",
    domaintype:"",
    domainlist:"",
};
export default class DomanConfig extends Component {
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
        },
        {
            title: "品牌ID",
            dataIndex: "package_id",
            key: "package_id",
            align: 'center',
        },
        {
            title: "环境",
            dataIndex: "env_type",
            key: "env_type",
            align: 'center',
        },
        {
            title: "域名类型",
            dataIndex: "domain_type",
            key: "domain_type",
            align: 'center',
        },
        {
            title: "域名清单",
            dataIndex: "domain_list",
            key: "domain_list",
            align: 'center',
            render:(record)=>{
                return record.split(",").map((e,index)=>{
                    return <div key={index}>{e}</div>
                })
            }
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            align: 'center',
            render: (text, record) => (
                <span>
                    <LinkButton onClick={() => this.showModel(record, 1)}>
                        修改
                </LinkButton>
                <Popconfirm
                        title={`您要删除ID=${record.id}。请确认`}
                        onConfirm={() => this.getReqDeldomain(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <LinkButton>
                            删除
                        </LinkButton>
                    </Popconfirm> 
                </span>
            ),
        },
    ];

    showModel = (record, num) => {
        this.record = record
        
        let {env_type,domain_type,domain_list} = this.record
        switch (num) {
            case 1:
                this.setState({
                    isShowEditModel: true,
                    envtype:env_type == "PRE" ?2:(env_type == "OL"? 3:1),
                    domaintype:domain_type == "入口域名" ?1 :2,
                    domainlist:domain_list,
                })
                break;
            case 2:
                this.setState({
                    isShowAddModel: true
                })
        }
    }
    getReqDomainlist = async (page, limit) => {
        this.setState({
            loading: true
        })
        const result = await reqDomainlist(
            this.state.inputKey,
            this.reverseInputValue(),
            page
            , limit
        )
        if (result.status === 0) {
            let data = result.data.lists
            this.setState({
                data: data,
                count:result.data.total,
                loading: false,
            });
        } else {
            message.error(`失败！${result.msg}`)
        }
    }
    getReqAdddomain = async (page, limit) => {
        const result = await reqAdddomain(
            Number(this.state.packageid),
            Number(this.state.envtype),
            Number(this.state.domaintype),
            this.state.domainlist
        )
        if (result.status === 0) {
            message.success(`操作成功！`)
            this.getReqDomainlist(1,20)
            this.setState({
                isShowAddModel:false,
                packageid:"",
                envtype:"",
                domaintype:"",
                domainlist:"",
            })
        } else {
            message.error(`失败！${result.msg}`)
        }
    }
    getEditAdddomain = async () => {
        const result = await reqEditdomain(
            this.record.id,
            Number(this.record.package_id),
            Number(this.state.envtype),
            Number(this.state.domaintype),
            this.state.domainlist
        )
        if (result.status === 0) {
            message.success(`操作成功！`)
            this.getReqDomainlist(1,20)
            this.setState({
                isShowEditModel:false,
                packageid:"",
                envtype:"",
                domaintype:"",
                domainlist:"",
            })
        } else {
            message.error(`失败！${result.msg}`)
        }
    }
    getReqDeldomain = async (record) => {
        const result = await reqDeldomain(
            record.id,
        )
        if (result.status === 0) {
            message.success(`操作成功！`)
            this.getReqDomainlist(1,20)
        } else {
            message.error(`失败！${result.msg}`)
        }
    }
    reverseInputValue(){
        let value = 0
        switch(this.state.inputKey){
            case "packageid","envtype","domaintype":
                value = Number(this.state.inputValue)
                break;
            default :
                value = this.state.inputValue
                break;
        }
        return value
    }
    componentDidMount() {
        //默认查询一周数据
        this.getReqDomainlist(1, 20)
    }
    render() {
        const { data, count, current, pageSize, loading } = this.state;
        const title = (
            <span>
                <LinkButton onClick={() => this.showModel({}, 2)}>新增域名配置</LinkButton>
            </span>
        )
        return <Card title={title} >
            <div>
                <Select
                        style={{ width: 200 }}
                        value={this.state.inputKey}
                        onChange={(val) => {
                            
                            let tip = ""
                            switch(val){
                                case "envtype":
                                    tip = "* 环境：1=DEV, 2=PRE,3=OL";
                                    break;
                                case "domaintype":
                                    tip = "* 域名类型 :1=入口域名, 2=后台域名";
                                    break;
                                case "domainlist":
                                    tip = "* 多个域名，请用 ， (逗号）隔开";
                                    break;
                                default:
                                    tip = ""

                            }
                            this.setState({ inputKey: val,tip });
                        }}
                    >
                        <Option value="packageid">品牌ID</Option>
                        <Option value="envtype">环境</Option>
                        <Option value="domaintype">类型</Option>
                        <Option value="domainlist">域名</Option>
                    </Select>
                &nbsp; &nbsp;
                 <Input
                    type="text"
                    placeholder="请输入关键字搜索"
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
                            this.getReqDomainlist(1,20)
                        }}
                    >
                        查询
                </LinkButton>
                <span style={{color:"red"}}>{this.state.tip}</span>
            </div>
            &nbsp; &nbsp;
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
                    this.getReqDomainlist(page, limit);
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
                    title="新增域名配置"
                    visible={this.state.isShowAddModel}
                    onOk={this.getReqAdddomain}
                    onCancel={() => {
                        this.setState({ isShowAddModel: false });
                    }}
                >
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "70px" }}>品牌ID</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入品牌ID"
                            value={this.state.packageid}
                            onChange={(e) => this.setState({ packageid: e.target.value })}
                        />
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>环境</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入环境数字"
                            value={this.state.envtype}
                            onChange={(e) => this.setState({ envtype: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> * 环境：1=DEV, 2=PRE,3=OL</span>
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>类型</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入类型数字"
                            value={this.state.domaintype}
                            onChange={(e) => this.setState({ domaintype: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> * 类型： 1=入口域名 , 2=后台域名</span>
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>域名清单</span>
                        &nbsp;&nbsp;
                        <TextArea
                            placeholder="请输入域名资料"
                            value={this.state.domainlist}
                            onChange={(e) => this.setState({ domainlist: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> *  多个域名，请用 ， (逗号）隔开</span>
                    </div>
                </Modal>
            )}
            {this.state.isShowEditModel && (
                <Modal
                    title="修改"
                    visible={this.state.isShowEditModel}
                    onOk={this.getEditAdddomain}
                    onCancel={() => {
                        this.setState({ isShowEditModel: false });
                    }}
                >
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "70px" }}>品牌ID</span>
                        &nbsp;&nbsp;
                        <span>{this.record.package_id}</span>
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>环境</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入环境数字"
                            value={this.state.envtype}
                            onChange={(e) => this.setState({ envtype: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> * 环境：1=DEV, 2=PRE,3=OL</span>
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>类型</span>
                        &nbsp;&nbsp;
                        <Input
                            placeholder="请输入类型数字"
                            value={this.state.domaintype}
                            onChange={(e) => this.setState({ domaintype: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> * 类型： 1=入口域名 , 2=后台域名</span>
                    </div>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                        <span style={{ width: "100px" }}>域名清单</span>
                        &nbsp;&nbsp;
                        <TextArea
                            placeholder="请输入域名资料"
                            value={this.state.domainlist}
                            onChange={(e) => this.setState({ domainlist: e.target.value })}
                        />
                        &nbsp;
                        <span style={{color:"red",width:"200px"}}> *  多个域名，请用 ， (逗号）隔开</span>
                    </div>
                </Modal>
            )}
        </Card>
    }
}
