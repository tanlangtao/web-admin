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
    reqActivityList
} from "../../api/index";

const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputUserId: "",
  inputActivityId: "",
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowProxySetting:false
};
export default class ActivityManage extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "user_id",
      key: "user_id",
      // fixed: "left",
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
      title: "品牌ID",
      dataIndex: "package_id",
      key: "package_id",
      align: 'center',
    },
    {
      title: "领取日期",
      dataIndex: "receive_date",
      key: "receive_date",
      align: 'center',
    },
    {
      title: "领取金额",
      dataIndex: "receive_amount",
      key: "receive_amount",
      align: 'center',
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      render:formateDate,
    },
    {
      title: "操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render:(record)=>{
        
        return <LinkButton onClick={()=>{
          this.record = record
          this.setState({
            isShowProxySetting:true,
  
          })
        }}>
          查询代理链
        </LinkButton>
      }
    },
  ];
  getReqActivityList = async (page,limit)=>{
    const result = await reqActivityList(
        this.props.package_id,
        this.state.inputUserId,
        this.state.inputActivityId,
        this.state.startTime,
        this.state.endTime,
        page,
        limit
    )
    if(result.status === 0) {
        let newdata = []
        result.data.data.forEach(e=>{
            if(this.state.inputUserId != "" && e.user_id == this.state.inputUserId){
                newdata.push(e)
            }else if(this.state.inputActivityId != "" && e.activity_id == this.state.inputActivityId ){
                newdata.push(e)
            }else if(this.state.inputUserId != "" && this.state.inputActivityId != "" && e.user_id == this.state.inputUserId && e.activity_id == this.state.inputActivityId){
                newdata.push(e)
            }else if(this.state.inputUserId == "" && this.state.inputActivityId == ""){
                newdata.push(e)
            }
        })
        console.log(this.state.inputUserId,"newdata",newdata)
        this.setState({
            data:newdata,
            count: newdata.count,
            loading: false,
        })
    }else{
      message.error(`失败！${result.data}`)
    }
  }
  componentDidMount() {
    //默认查询一周数据
    let start = moment().startOf("day").subtract(1, "week");
    let end = moment().startOf("day").subtract(-1, "day").subtract(1, "seconds");
    this.setState({
      startTime:start.format("YYYY-MM-DD HH:mm:ss"),
      endTime:end.format("YYYY-MM-DD HH:mm:ss"),
      
    },()=>{
        this.getReqActivityList(1,20)
    })
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    const title = (
      <span>
        <MyDatePicker
          handleValue={(data, dateString) => {
            this.setState({
              startTime: dateString[0],
              endTime: dateString[1],
              MyDatePickerValue: data,
            });
          }}
          value={this.state.MyDatePickerValue}
        />
        &nbsp; &nbsp;
              <Input
          type="text"
          placeholder="请输入玩家ID"
          style={{ width: 150 }}
          onChange={(e) => {
            this.setState({ inputUserId: e.target.value });
          }}
          value={this.state.inputUserId}
        />
        &nbsp; &nbsp;
              <Input
          type="text"
          placeholder="请输入活动ID"
          style={{ width: 150 }}
          onChange={(e) => {
            this.setState({ inputActivityId: e.target.value });
          }}
          value={this.state.inputActivityId}
        />
        &nbsp; &nbsp;
              <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getReqActivityList(1, this.state.pageSize);
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
          this.getReqActivityList(page, limit);
        }}
        setPagination={(current, pageSize) => {
            if (pageSize) {
                this.setState({ current, pageSize });
            } else {
                this.setState({ current });
            }
        }}
      />
        {this.state.isShowProxySetting && (
        <Modal
          title={`代理链信息 ${this.record.user_id}`}
          visible={this.state.isShowProxySetting}
          onCancel={() => {
            this.setState({ isShowProxySetting: false });
          }}
          footer={null}
          width="90%"
          top={10}
        >
          <PopProxySetting
              recordID={this.record.user_id}
          />
        </Modal>
      )}
    </Card>
  }
}
