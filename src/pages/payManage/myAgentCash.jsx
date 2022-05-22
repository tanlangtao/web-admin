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
import AgentAccountDetail from "./agentAccountDetail";
import riskcontrolfn from "../../components/riskcontrol";
import { formateDate } from "../../utils/dateUtils";
import moment from "moment";
import {
  reqApplyDaiWithdraw,
  reqUsers,
  reqDaiWithdrawOrderList,
  reqDaiWithdrawOrderListByLoginId

} from "../../api/index";

const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputValue: "",
  inputStatus: 0,
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowAccountDetail:false
};
export default class MyAgentCash extends Component {
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
      width: 120
    },
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
      align: 'center',
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
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (text, record) => {
        return this.getStatusString(record.status);
      },
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
      title: "代付操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          { record.status != 4 && <LinkButton type="default" onClick={() => this.handleApply(record)}>
              我已付款
              </LinkButton>
          }
        </span>
      ),
    },
    {
      title: "账号详情",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.showAccountDetail(record)}>
            查看
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
  ];
  showAccountDetail = (record) => {
    this.setState({
      isShowAccountDetail: true
    })
    this.recordID = record.user_id
  }
  handleApply = async (record) => {
    const result = await reqApplyDaiWithdraw(
      this.props.admin_user_id,
      record.package_id,
      record.order_id,
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getReqDaiWithdrawOrderListByLoginId(1,20)
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }

  getReqDaiWithdrawOrderListByLoginId = async (page,limit)=>{
    const result = await reqDaiWithdrawOrderListByLoginId({
      start_time:this.state.startTime,
      end_time:this.state.endTime,
      export:1,
      page:page,
      limit:limit,
      package_id:this.props.package_id,
      flag:3,  
      user_id:this.props.admin_user_id,
      order_status:Number(this.state.inputStatus),
    })
    if(result.status === 0) {
      let data =result.data && JSON.parse(result.data)
      if(this.state.inputValue != ""){
        let newData = []
        data.forEach(e => {
          if(e.user_id == this.state.inputValue){
            newData.push(e)
          }
        });
        this.setState({
          data:newData,
          count: newData.length,
          loading: false,
        })
      }else{
        this.setState({
          data: data,
          count: data.length,
          loading: false,
        });
      }
    }else{
      message.error(`失败！${result.data}`)
    }
  }
  getStatusString(status){
    let statusStr = ''
    switch(status){
      case 1:
        statusStr = "待审核"
        break
      case 2:
        statusStr = "处理中"
        break
      case 3:
        statusStr = "已提交"
        break
      case 4:
        statusStr = "已完成"
        break
      case 5:
        statusStr = "已失败"
        break
      default:
        statusStr = "已失败"
        break
    }
    return statusStr;
  }
  componentDidMount() {
    //默认查询一周数据
    let start = moment().startOf("day").subtract(1, "week");
    let end = moment().startOf("day").subtract(-1, "day").subtract(1, "seconds");
    this.setState({
      startTime:start.format("YYYY-MM-DD HH:mm:ss"),
      endTime:end.format("YYYY-MM-DD HH:mm:ss"),
      
    },()=>{
        this.getReqDaiWithdrawOrderListByLoginId(1,20)
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
            this.setState({ inputValue: e.target.value });
          }}
          value={this.state.inputValue}
        />
        &nbsp; &nbsp;
              <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputStatus == 0 ?"全部" :(
            this.state.inputStatus == 3 ?"已提交" :(
              this.state.inputStatus == 4?"已完成" :""
            )
          )}
          onChange={(val) => {
            this.setState({ inputStatus: val });
          }}
        >
          <Option value="0">全部</Option>
          <Option value="3">已提交</Option>
          <Option value="4">已完成</Option>
        </Select>
        &nbsp; &nbsp;
              <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getReqDaiWithdrawOrderListByLoginId(1, this.state.pageSize);
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
          this.getReqDaiWithdrawOrderListByLoginId(page, limit);
        }}
        setPagination={(current, pageSize) => {
            if (pageSize) {
                this.setState({ current, pageSize });
            } else {
                this.setState({ current });
            }
        }}
      />
      {this.state.isShowAccountDetail && (
        <Modal
          title="账号详情"
          visible={this.state.isShowAccountDetail}
          onCancel={() => {
            this.setState({ isShowAccountDetail: false });
          }}
          footer={null}
          width="85%"
          maskClosable={false}
          style={{ top: 10 }}
        >
          <AgentAccountDetail recordID = {this.recordID}></AgentAccountDetail>
        </Modal>
      )}
    </Card>
  }
}
