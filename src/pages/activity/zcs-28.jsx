import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Select,
  Table
} from "antd";
import Mytable from "../../components/MyTable";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import { formateDate } from "../../utils/dateUtils";
import PopProxySetting from "../user/pop_user_proxy_setting";
import moment from "moment";
import {
    reqapply28Gold,
    reqlist28Gold,
} from "../../api/index";

const { Option } = Select;
const init_state = {
    input_user_id :"",
    input_activity_id : "",
    data:[]
};
export default class Zcs28 extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }
  initColumns = () => [
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
      align: 'center',
    },
    {
        title: "活动ID",
        dataIndex: "activity_id",
        key: "activity_id",
        align: 'center',
    },
    {
        title: "活动名称",
        dataIndex: "activity_name",
        key: "activity_name",
        align: 'center',
    },
    {
        title: "申请时间",
        dataIndex: "created_at",
        key: "created_at",
        align: 'center',
        render:formateDate
    },
]
  componentDidMount() {
    
  }
  getapply28Gold = async ()=>{
    if(this.state.input_activity_id == "" || this.state.input_user_id == ""){
        return message.info("user_id和activity_id不能为空！")
    }
    const result = await reqapply28Gold(
        this.state.input_user_id,
        this.state.input_activity_id,
        this.props.package_id
    )
    if(result.status == -1){
        message.info(result.msg)
    }else if(result.status == 0){
        message.info(result.msg)
    }
  }
  getreqlist28Gold = async ()=>{
    if(this.state.input_activity_id == "" || this.state.input_user_id == ""){
        return message.info("user_id和activity_id不能为空！")
    }
    const result = await reqlist28Gold(
        this.state.input_user_id,
        this.state.input_activity_id,
        this.props.package_id
    )
    if(result.status == -1){
        message.info(result.msg)
    }else if(result.status == 0){
        message.info(result.msg)
        this.setState({
            data:result.data,
        })
    }
  }
  render() {
    return <Card title="注册送28元" >
        <div style={{display:"flex",width:"300px"}}>
            <span style={{width:"80px",lineHeight:"30px"}}>活动ID</span> &nbsp; &nbsp;
            <Input
                placeholder="请输入活动ID"
                onChange={(e) => {
                    this.setState({ input_activity_id: e.target.value });
                }}
                value={this.state.input_activity_id}
            ></Input>
            <span style={{color:"red",fontSize:"20px",width:"250px",position:"absolute",left:"350px"}}>* 请输入活动ID = 182 *</span>
        </div>
        <div style={{display:"flex",width:"300px"}}>
            <span style={{width:"80px",lineHeight:"30px"}}>玩家ID</span> &nbsp; &nbsp;
            <Input
                placeholder="请输入玩家ID"
                onChange={(e) => {
                    this.setState({ input_user_id: e.target.value });
                }}
                value={this.state.input_user_id}
            ></Input>
        </div>
        <div>
            <LinkButton
                onClick={()=>this.getapply28Gold()}
            >
                申请
            </LinkButton>
            <LinkButton
                onClick={()=>this.getreqlist28Gold()}
            >
                查询
            </LinkButton>
        </div>
        &nbsp;&nbsp;
        {
            this.state.data.length > 0 && <Table
            bordered
            rowKey={(record, index) => `${index}`}
            dataSource={this.state.data}
            columns={this.initColumns()}
            size="small"
            pagination={false}
          />
        }
    </Card>
  }
}
