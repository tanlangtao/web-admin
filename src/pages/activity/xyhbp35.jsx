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
import { formateDate } from "../../utils/dateUtils";
import PopProxySetting from "../user/pop_user_proxy_setting";
import moment from "moment";
import {
    reqreimburseapply,
    reqreimburselist,
} from "../../api/index";

const { Option } = Select;
const init_state = {
    input_user_id :"",
    input_activity_id : "",
    data:[]
};
export default class Xyhbp35 extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }
  componentDidMount() {
    
  }
  getreqreimburseapply = async ()=>{
    if(this.state.input_activity_id == "" || this.state.input_user_id == ""){
        return message.info("user_id和activity_id不能为空！")
    }
    const result = await reqreimburseapply(
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
  getreqreimburselist = async ()=>{
    if(this.state.input_activity_id == "" || this.state.input_user_id == ""){
        return message.info("user_id和activity_id不能为空！")
    }
    const result = await reqreimburselist(
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
    return <Card title="新用户包赔" >
        <div style={{display:"flex",width:"300px"}}>
            <span style={{width:"80px",lineHeight:"30px"}}>活动ID</span> &nbsp; &nbsp;
            <Input
                placeholder="请输入活动ID"
                onChange={(e) => {
                    this.setState({ input_activity_id: e.target.value });
                }}
                value={this.state.input_activity_id}
            ></Input>
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
                onClick={()=>this.getreqreimburseapply()}
            >
                申请
            </LinkButton>
            <LinkButton
                onClick={()=>this.getreqreimburselist()}
            >
                查询
            </LinkButton>
        </div>
        &nbsp;&nbsp;
        <div>
            {JSON.stringify(this.state.data)!= "[]" &&JSON.stringify(this.state.data) }
        </div>
    </Card>
  }
}
