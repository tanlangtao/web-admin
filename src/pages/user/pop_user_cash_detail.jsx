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
import moment from "moment";
import {
  reqUpdateDaiWithdrawID,
  reqModifyDaiWithdrawID,
  reqReviewDaiWithdraw,
  reqDaiWithdrawOrderList
} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputStatus: 0,
  loading: false,
  data: [],
  MyDatePickerValue: null,
  isShowChangeModal:false,
  changeID:"",

};
 class PopUserCashDetail extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      key: "order_id",
      align: 'center',
    },
    {
      title: "玩家ID",
      dataIndex: "user_id",
      key: "user_id",
      align: 'center',
    },
    {
      title: "订单金额",
      dataIndex: "amount",
      key: "amount",
      align: 'center',
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      align: 'center',
      width: 110,

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
      title: "代提ID",
      dataIndex: "replace_id",
      key: "replace_id",
      align: 'center',
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
      width: 110,
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
        user_id:Number(this.props.user_id),
        order_status:Number(this.state.inputStatus),
    },"user_id","")
    if(result.status === 0) {
      let data =result.data && result.data.lists
      console.log(data)
      this.setState({
        data: data,
        count: result.data.total,
        loading: false,
      });
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  showChangeModel = (record)=>{
    this.setState({
      isShowChangeModal:true
    })
    this.recordID = record.id
    this.package_id = record.package_id
    this.order_id = record.order_id
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
      this.getReqDaiWithdrawOrderList()
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
      this.getReqDaiWithdrawOrderList()
    }else{
      message.error(`操作失败！${result.data}`)
    }
    this.setState({
      isShowChangeModal :false
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
      this.getReqDaiWithdrawOrderList()
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
      this.getReqDaiWithdrawOrderList()
    }else{
      message.error(`操作失败！${result.data}`)
    }
  }
  componentDidMount() {
    this.setState({
        start_time:moment().startOf("day").subtract(1, "weeks"),
        end_time:moment().startOf("day")
    },()=>{
      this.getReqDaiWithdrawOrderList(1, 20)
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
      />
      {this.state.isShowChangeModal && (
        <Modal
          title="修改代付"
          visible={this.state.isShowChangeModal}
          onOk={this.handleChange}
          onCancel={() => {
            this.setState({ isShowChangeModal: false });
          }}
        >
          <Input
            value={this.state.changeID}
            onChange={(e) => this.setState({ changeID: e.target.value })}
          />
        </Modal>
      )}
    </Card>
  }
}
export default PopUserCashDetail;
