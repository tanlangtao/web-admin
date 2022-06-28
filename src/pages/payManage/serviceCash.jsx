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
import riskcontrolfn from "../../components/riskcontrol";
import { formateDate } from "../../utils/dateUtils";
import AgentAccountDetail from "./agentAccountDetail";
import {
  reqUpdateDaiWithdrawID,
  reqModifyDaiWithdrawID,
  reqReviewDaiWithdraw,
  reqDaiWithdrawOrderList,
  
} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 10,
  count: 0,
  startTime: '',
  endTime: '',
  inputKey: "user_id",
  inputValue: "",
  inputStatus: 0,
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowChangeModal:false,
  changeID:"",
  total_amount:0,
  Total_arrival_amount:0,
  time_type:1,
  isShowAccountDetailModel:false,
};
export default class ServiceCash extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      key: "order_id",
      fixed: "left",
      align: 'center',
      width:120
    },
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "玩家昵称",
      dataIndex: "user_name",
      key: "user_name",
      align: 'center',
      // width: 150,
    },
    {
      title: "所属品牌",
      dataIndex: "package_id",
      key: "package_id",
      align: 'center',
      // width: 100,
    },
    {
      title: "上级代理",
      dataIndex: "proxy_user_id",
      key: "proxy_user_id",
      align: 'center',
      width: 100,
    },
    {
      title: "订单金额",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
      width: 100,
    },
    {
      title: "账号详情",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
				<span>
					<LinkButton
						onClick={() => {
							this.showAccountDetailModel(record);
						}}
						type="default"
					>
						查看
					</LinkButton>
				</span>
			),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      width: 120,
      render:formateDate,
    },
    {
      title: "实际费率",
      dataIndex: "handling_fee",
      key: "handling_fee",
      align: 'center',
      // width: 150,
    },
    {
      title: "兑换方式",
      dataIndex: "type",
      key: "type",
      align: 'center',
      render: (text, record) => {
        let statusStr = ''
        if (record.type == 12 && record.order_type == 17) {
          statusStr = "银行卡"
        } else if (record.type == 12 && record.order_type == 16) {
          statusStr = "支付宝"
        }else{
          statusStr = ""
        }
        return statusStr;
      },
    },
    {
      title: "风控",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
				<span>
					<LinkButton
						onClick={() => {
							riskcontrolfn(record);
						}}
						type="default"
					>
						风控
					</LinkButton>
				</span>
			),
    },
    {
      title: "运营审核",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.rejectCheck(record)}>
            拒绝
              </LinkButton>
          <LinkButton type="default" onClick={() => this.passCheck(record)}>
            通过
              </LinkButton>
        </span>
      ),
    },
    {
      title: "代提ID",
      dataIndex: "replace_id",
      key: "replace_id",
      align: 'center',
    },
    {
      title: "代提昵称",
      dataIndex: "replace_name",
      key: "replace_name",
      align: 'center',
    },
    {
      title: "运营操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.handleUpdateId(record)}>
            更新代付
              </LinkButton>
          <LinkButton type="default" onClick={() => this.showChangeModel(record)}>
            修改代付
              </LinkButton>
        </span>
      ),
    },
    
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      key: "arrival_amount",
      align: 'center',
      render: (text, record) => {
        let arrival_amount = 0
        if (record.arrival_at != 0) {
          arrival_amount = record.arrival_amount
        }
        return arrival_amount;
      },
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      key: "arrival_at",
      align: 'center',
      render:formateDate,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (text, record) => {
        let statusStr = ''
        if (record.status == 1) {
          statusStr = "待审核"
        } else if (record.status == 2) {
          statusStr = "处理中"
        }else if (record.status == 3) {
          statusStr = "已提交"
        }else if (record.status == 4 ) {
          statusStr = "已成功"
        }else if (record.status == 5 ) {
          statusStr = "已失败"
        }
        return statusStr;
      },
    },

  ];
  getReqDaiWithdrawOrderList = async (page,limit)=>{
    const result = await reqDaiWithdrawOrderList({
        proxy_pid:this.state.proxy_pid,
        start_time:this.state.startTime,
        end_time:this.state.endTime,
        export:1,
        page:page,
        limit:limit,
        package_id:this.props.package_id,
        flag:3,
        order_status:Number(this.state.inputStatus),
        time_type:this.state.time_type
    },this.state.inputKey,this.state.inputValue)
    if(result.status === 0) {
      let data =result.data && result.data.lists
      console.log(data)
      this.setState({
        data: data,
        count: result.data.total,
        loading: false,
        total_amount: result.data.total_amount,
        total_arrival_amount: result.data.Total_arrival_amount,
      });
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  showChangeModel = (record)=>{
    this.setState({
      isShowChangeModal:true
    })
    this.recordID = record.user_id
    this.package_id = record.package_id
    this.order_id = record.order_id
  }
  showAccountDetailModel =  (record)=>{
    this.recordID = record.user_id
    this.recordPID = record.package_id
    this.setState({
      isShowAccountDetailModel:true
    });
  }
  // 更新代付ID
  handleUpdateId = async (record)=>{
    this.package_id = record.package_id
    this.order_id = record.order_id
    const result = await reqUpdateDaiWithdrawID(
      this.package_id,
      this.order_id,
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiWithdrawOrderList(1,10)
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  // 修改代付
  handleChange=  async ()=>{
    const result = await reqModifyDaiWithdrawID(
      Number(this.state.changeID),
      this.package_id,
      this.order_id,
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiWithdrawOrderList(1,10)
    }else{
      message.error(`操作失败！${result.data}`)
    }
    this.setState({
      isShowChangeModal :false,
      changeID:""
    })
  }
  // 审核-拒绝
  rejectCheck=  async (record)=>{
    const result = await reqReviewDaiWithdraw(
      record.order_id,
      3,
      this.props.admin_user_id, //运营后台绑定id
      record.package_id,
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiWithdrawOrderList(1,10)
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  // 审核-通过
  passCheck=  async (record)=>{
    const result = await reqReviewDaiWithdraw(
      record.order_id,
      1,
      this.props.admin_user_id,
      record.package_id,
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiWithdrawOrderList(1,10)
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  componentDidMount() {
    this.getReqDaiWithdrawOrderList(1,10)
    let self = this;
    this.timer = setInterval(e=>{
      self.getReqDaiWithdrawOrderList(1,10)
    },1000*90)
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    const title = (
      <span>
        <Select
          style={{ width: 200 }}
          value={this.state.time_type}
          onChange={(val) => {
            this.setState({ time_type: val });
          }}
        >
          <Option value={1}>创建时间</Option>
          <Option value={2}>到账时间</Option>
        </Select>
        &nbsp; &nbsp;
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
              <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputKey}
          onChange={(val) => {
            this.setState({ inputKey: val });
          }}
        >
          <Option value="user_id">玩家ID</Option>
          <Option value="replace_id">代提ID</Option>
          <Option value="order_id">订单ID</Option>
          {/* <Option value="start_time">创建时间</Option> */}
          {/* <Option value="game_nick">金额区间</Option> */}
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
              <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputStatus == 0 ? "全部":(this.state.inputStatus == 4 ? "已完成":"未支付")}
          onChange={(val) => {
            this.setState({ inputStatus: val });
          }}
        >
          <Option value="0">全部</Option>
          <Option value="1">未完成</Option>
          <Option value="4">已完成</Option>
        </Select>
        &nbsp; &nbsp;
              <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getReqDaiWithdrawOrderList(1, this.state.pageSize);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
        <span style={{display:"flex"}}>
        <span style={{display:"block"}}>总订单金额:{this.state.total_amount} <br />总到账金额:{this.state.total_arrival_amount}</span>
            {/* <span>总到账金额:{this.state.total_arrival_amount}</span> */}
        </span>
      </span>
    );
    let daiFuTitle = (
      <span>
        修改代付
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        <span style={{color:"red"}}>
          请输入 代充账号对应的代付ID信息（9位数字）
        </span>
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
            this.getReqDaiWithdrawOrderList(page, limit);
        }}
        setPagination={(current, pageSize) => {
            if (pageSize) {
                this.setState({ current, pageSize });
            } else {
                this.setState({ current });
            }
        }}
      />
      {this.state.isShowChangeModal && (
        <Modal
          title={daiFuTitle}
          visible={this.state.isShowChangeModal}
          onOk={this.handleChange}
          onCancel={() => {
            this.setState({ isShowChangeModal: false,changeID:"" });
          }}
        >
          <Input
            value={this.state.changeID}
            onChange={(e) => this.setState({ changeID: e.target.value })}
          />
        </Modal>
      )}
      {
        this.state.isShowAccountDetailModel && (
          <Modal
            title={`${this.recordID} 账号详情`}
            visible={this.state.isShowAccountDetailModel}
            onCancel={() => {
              this.setState({ isShowAccountDetailModel: false });
            }}
            footer={null}
          >
            <AgentAccountDetail recordID = {this.recordID}></AgentAccountDetail>
          </Modal>
        )
      }
    </Card>
  }
}
