import React, { Component } from "react";
import { Card, Table, message, Icon, Input, Select, Modal, Button } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import {
  reqOrder_list,
  orderReviewEdit,
  getSubOrderRemark,
  reqPay_account,
  reqPay_accountereadonly,
} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { toDecimal } from "../../../utils/commonFuntion";
import {
  switchChannelType,
  switchType,
  switchStatus,
} from "../../../utils/switchType";
import Diaodan from "./editData";
import moment from "moment";
import ExportJsonExcel from "js-export-excel";

class Order_list extends Component {
  constructor(props) {
    super(props);
    this.reqData = {
      start_time: "",
      end_time: "",
      order_status: "",
      type: null,
    };
    this.inputKey = "user_id";
    this.inputValue = "";
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isQueryShow: false,
      isEditShow: false,
      printData: [],
      isAccountShow: false,
    };
  }
  getUsers = async (page, limit, reqData) => {
    const result = await reqOrder_list(page, limit, reqData);
    if (result.status === 0) {
      this.setState({
        data: result.data && result.data.list,
        count: result.data && result.data.count,
      });
    }
    if (result.status === -1) {
      message.info(result.msg);
      this.setState({
        data: [],
        count: 0,
      });
    }
  };
  PlayerLossOrderSearch = async () => {
    this.setState({ isQueryShow: true });
  };
  onSearchData = (page, limit) => {
    //处理要发送的数据
    let reqData = {
      ...this.reqData,
    };
    if (this.inputKey === "1" || this.inputKey === "2") {
      reqData.time_type = this.inputKey;
    } else if (this.inputKey) {
      reqData[this.inputKey] = this.inputValue;
    }
    this.getUsers(page, limit, reqData);
  };

  download = async () => {
    let data = {
      ...this.reqData,
    };
    if (this.inputKey === "1" || this.inputKey === "2") {
      data.time_type = this.inputKey;
    } else if (this.inputKey) {
      data[this.inputKey] = this.inputValue;
    }

    const res = await reqOrder_list(1, this.state.count, data);
    if (res.data) {
      this.setState({
        printData: res.data.list || [],
      });
    } else {
      this.setState({
        printData: [],
      });
      message.info(JSON.stringify(res));
    }
    console.log("downloadres", res);

    var option = {};
    let dataTable = [];
    this.state.printData &&
      this.state.printData.forEach((ele) => {
        let obj = {
          订单ID: ele.order_id,
          user_id: ele.user_id,
          昵称: ele.user_name,
          所属品牌: ele.package_nick,
          所属代理: ele.proxy_user_id,
          支付渠道: switchChannelType(ele.channel_type, ele.replace_id),
          支付类型: switchType(ele.type),
          下单金额: toDecimal(ele.amount),
          到账金额: toDecimal(ele.arrival_amount),
          订单状态: switchStatus(ele.status),
          支付姓名显示: ele.pay_name,
          订单IP: ele.order_ip,
          创建时间: formateDate(ele.created_at),
          到账时间: formateDate(ele.arrival_at),
        };
        dataTable.push(obj);
      });
    let current = moment().format("YYYYMMDDHHmm");
    option.fileName = `充值订单${current}`;
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetHeader: [
          "订单ID",
          "user_id",
          "昵称",
          "所属品牌",
          "所属代理",
          "支付渠道",
          "支付类型",
          "下单金额",
          "到账金额",
          "订单状态",
          "支付姓名显示",
          "订单IP",
          "创建时间",
          "到账时间",
        ],
      },
    ];

    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };

  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <div>
            <div>
              <Select
                placeholder="请选择"
                style={{ width: 120 }}
                defaultValue="user_id"
                onSelect={(value) => (this.inputKey = value)}
              >
                <Select.Option value="order_id">订单id</Select.Option>
                <Select.Option value="user_id">user_id</Select.Option>
                <Select.Option value="package_nick">所属品牌</Select.Option>
                <Select.Option value="1">创建时间</Select.Option>
                <Select.Option value="2">到账时间</Select.Option>
                <Select.Option value="proxy_pid">所属代理</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <Input
                type="text"
                placeholder="请输入关键字"
                style={{ width: 150 }}
                onChange={(e) => (this.inputValue = e.target.value)}
              />
              &nbsp; &nbsp;
              <MyDatePicker
                handleValue={(data, val) => {
                  this.reqData.start_time = val[0];
                  this.reqData.end_time = val[1];
                  this.setState({
                    MyDatePickerValue: data,
                  });
                }}
                value={this.state.MyDatePickerValue}
              />
              &nbsp; &nbsp;
              <Select
                defaultValue=""
                style={{ width: 200 }}
                onSelect={(value) => (this.reqData.order_status = value)}
              >
                <Select.Option value="">订单状态</Select.Option>
                <Select.Option value="0">全部</Select.Option>
                <Select.Option value="1">未支付</Select.Option>
                <Select.Option value="3">已分配</Select.Option>
                <Select.Option value="4">已撤销</Select.Option>
                <Select.Option value="5">已支付</Select.Option>
                <Select.Option value="6">已完成</Select.Option>
                <Select.Option value="7">补单初审通过</Select.Option>
                <Select.Option value="8">补单初审拒绝</Select.Option>
                <Select.Option value="9">补单复审通过</Select.Option>
                <Select.Option value="10">补单复审拒绝</Select.Option>
                <Select.Option value="11">充值失败</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <Select
                defaultValue=""
                style={{ width: 120 }}
                onSelect={(value) => (this.reqData.type = value)}
              >
                <Select.Option value="">订单类型</Select.Option>
                <Select.Option value="0">全部</Select.Option>
                <Select.Option value="1">alipay</Select.Option>
                <Select.Option value="2">银行卡转账</Select.Option>
                <Select.Option value="3">人工代充</Select.Option>
                <Select.Option value="4">人工代提</Select.Option>
                <Select.Option value="6">微信支付</Select.Option>
                <Select.Option value="7">银联支付</Select.Option>
                <Select.Option value="8">网银支付</Select.Option>
                <Select.Option value="9">快捷支付</Select.Option>
                <Select.Option value="18">imalipay</Select.Option>
                <Select.Option value="19">imwechat</Select.Option>
                <Select.Option value="20">imbank</Select.Option>
                <Select.Option value="21">imunionpay</Select.Option>
                <Select.Option value="22">支付宝转卡</Select.Option>
                <Select.Option value="23">usdt erc20</Select.Option>
                <Select.Option value="24">usdt trc20</Select.Option>
                <Select.Option value="25">极速充值</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <LinkButton
                onClick={() => this.onSearchData(1, 20)}
                size="default"
              >
                <Icon type="search" />
              </LinkButton>
              &nbsp; &nbsp;
            </div>
            <div style={{ marginTop: 10 }}>
              <LinkButton onClick={this.PlayerLossOrderSearch} size="default">
                <Icon type="search" />
                玩家掉单查询
              </LinkButton>
            </div>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => window.location.reload()}
              icon="reload"
              size="default"
            />
            <br />
            <br />
            <LinkButton
              size="default"
              style={{ float: "right" }}
              onClick={this.download}
              icon="download"
            />
          </span>
        }
      >
        <Table
          bordered
          size="small"
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              this.onSearchData(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size,
              });
              this.onSearchData(current, size);
            },
          }}
          scroll={{ x: "max-content" }}
        />
        <Modal
          title="玩家掉单查询"
          visible={this.state.isQueryShow}
          onCancel={() => {
            this.setState({ isQueryShow: false });
          }}
          footer={null}
          width="70%"
        >
          <Diaodan />
        </Modal>
        {this.state.isEditShow && (
          <Modal
            title="编辑"
            visible={this.state.isEditShow}
            onCancel={() => {
              this.setState({ isEditShow: false });
            }}
            footer={null}
            width="50%"
          >
            <div>
              <div>用户ID：{this.state.editUser_id}</div>
              <br />
              <div>金额：{this.state.editMount}</div>
              <br />
              <div>
                手动到账复审：
                <Button type="primary" onClick={() => this.orderReview(1)}>
                  通过
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.orderReview(0)}>
                  拒绝
                </Button>
              </div>
            </div>
          </Modal>
        )}
        {this.state.isAccountShow && (
          <Modal
            title="退款訊息"
            visible={this.state.isAccountShow}
            onCancel={() => {
              this.setState({ isAccountShow: false });
            }}
            width="25%"
            footer={[
              <Button
                key="back"
                onClick={() => {
                  this.setState({ isAccountShow: false });
                }}
              >
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={
                  this.state.pay_name.length !== 0 &&
                    /^\d{16,19}$/.test(this.state.pay_account)
                    ? this.sendChangepayAccountReadOnly
                    : this.sendChangepayAccount
                }
              >
                确定
              </Button>,
            ]}
          >
            <div>
              <div>
                收款姓名: &nbsp;{this.state.pay_name}
                <Input
                  style={{ width: 150 }}
                  maxLength={19}
                  defaultValue={this.state.pay_name}
                  disabled={this.state.pay_name.length !== 0 ? true : false}
                  onBlur={(e) => {
                    this.pay_name = e.target.value;
                  }}
                />
              </div>
              <br />
              <div>
                收款账号: &nbsp;{this.state.pay_account}
                <Input
                  style={{ width: 150 }}
                  maxLength={19}
                  defaultValue={this.state.pay_account}
                  disabled={
                    /^\d{16,19}$/.test(this.state.pay_account) ? true : false
                  }
                  onBlur={(e) => {
                    this.pay_account = e.target.value;
                  }}
                />
              </div>
              <br />
              <div>退款金额:{this.state.editMount}</div>
            </div>
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
    },
    {
      title: "user_id",
      dataIndex: "user_id",
    },
    {
      title: "昵称",
      dataIndex: "user_name",
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick",
    },
    {
      title: "所属代理",
      dataIndex: "proxy_user_id",
    },
    {
      title: "支付渠道",
      dataIndex: "channel_type",
      render: (text, record, index) => switchChannelType(text, record),
    },
    {
      title: "支付类型",
      dataIndex: "type",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
            word = "alipay";
            break;
          case "2":
            word = "银行卡转账";
            break;
          case "3":
            word = "人工代充";
            break;
          case "4":
            word = "人工代提";
            break;
          case "5":
            word = "被赠送";
            break;
          case "6":
            word = "微信支付";
            break;
          case "7":
            word = "银联支付";
            break;
          case "8":
            word = "网银支付";
            break;
          case "9":
            word = "快捷支付";
            break;
          case "18":
            word = "imalipay";
            break;
          case "19":
            word = "imwechat";
            break;
          case "20":
            word = "imbank";
            break;
          case "21":
            word = "imunionpay";
            break;
          case "22":
            word = "支付宝转卡";
            break;
          case "23":
            word = "usdt erc20";
            break;
          case "24":
            word = "usdt trc20";
            break;
          case "25":
            word = "极速充值";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      },
    },
    {
      title: "下单金额",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (text) => {
        return <span>{toDecimal(text)}</span>;
      },
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      sorter: (a, b) => a.arrival_amount - b.arrival_amount,
      render: (text) => {
        return <span>{toDecimal(text)}</span>;
      },
    },
    {
      title: "订单状态",
      dataIndex: "status",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
            word = "未支付";
            break;
          case "2":
            word = "已过期";
            break;
          case "3":
            word = "已分配";
            break;
          case "4":
            word = "已撤销";
            break;
          case "5":
            word = "已支付";
            break;
          case "6":
            word = "已完成";
            break;
          case "7":
            word = "补单初审通过";
            break;
          case "8":
            word = "初审拒绝";
            break;
          case "9":
            word = "补单复审通过";
            break;
          case "10":
            word = "复审拒绝";
            break;
          case "11":
            word = "充值失败";
            break;
          case "12":
            word = "客服拒绝";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      },
    },
    {
      title: "支付姓名显示",
      dataIndex: "pay_name",
    },
    {
      title: "订单IP",
      dataIndex: "order_ip",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: formateDate,
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      render: (text, record, index) => {
        if (text === "0" || !text) {
          return "";
        } else return formateDate(text);
      },
      sorter: (a, b) => a.arrival_at - b.arrival_at,
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => {
        if (record.status === "7") {
          return (
            <LinkButton size="small" onClick={() => this.edit(record)}>
              编辑
            </LinkButton>
          );
        } else if (record.status === "3") {
          return (
            <LinkButton
              size="small"
              onClick={() => this.changepayAccount(record)}
            >
              发起退款
            </LinkButton>
          );
        }
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      /* 以下因取消LeftJoin subOrder 这里尝试采用[点击查看] jill-20200819 */
      render: (text, record, index) => {
        if (record.type === "2" && !text) {
          return (
            <Button
              size="small"
              onClick={() => this.getSubOrderInfo(record, index, "remark")}
            >
              点击查看
            </Button>
          );
        } else {
          return text;
        }
      },
    },
  ];
  edit = (record) => {
    this.setState({
      isEditShow: true,
      editUser_id: record.user_id,
      editMount: record.amount,
    });
    this.user_id = record.user_id;
    this.order_id = record.order_id;
    this.editType = record.type;
  };
  orderReview = async (action) => {
    let reqData = {
      user_id: this.user_id,
      order_id: this.order_id,
      type: this.editType,
      status: action === 1 ? 9 : 8,
      review_type: 2,
    };
    const res = await orderReviewEdit(reqData);
    if (res.status === 0) {
      message.success(res.msg || "操作成功");
      window.location.reload();
    } else {
      message.info(res.msg || "操作失败");
    }
  };

  changepayAccount = (record) => {
    this.setState({
      isAccountShow: true,
      pay_name: record.pay_name,
      pay_account: record.pay_account,
      editMount: record.amount,
    });
    this.pay_name = record.pay_name;
    this.pay_account = record.pay_account;
    this.order_id = record.order_id;
  };

  sendChangepayAccount = async () => {
    if (this.pay_name.length === 0) {
      message.info("请填入收款姓名");
      return;
    } else if (!/^\d{16,19}$/.test(this.pay_account)) {
      message.info("收款账号不得为空，且只能由16-19位数字组成");
      return;
    } else {
      let reqData = {
        name: this.pay_name,
        order_id: this.order_id,
        account: this.pay_account,
      };
      const res = await reqPay_account(reqData);
      if (res.status === 0) {
        message.success(res.msg || "操作成功");
        window.location.reload();
      } else {
        message.info(res.msg || "操作失败");
      }
    }
  };
  sendChangepayAccountReadOnly = async () => {
    let reqData = {
      order_id: this.order_id,
    };
    const res = await reqPay_accountereadonly(reqData);
    if (res.status === 0) {
      message.success(res.msg || "操作成功");
      window.location.reload();
    } else {
      message.info(res.msg || "操作失败");
    }
  };
  getSubOrderInfo = async (record, i, type) => {
    this.setState({ loading: true });
    //console.log(record, i, type);
    let newdata = this.state.data;
    console.log(newdata);
    try {
      let orderId = record.order_id;
      const res = await getSubOrderRemark(orderId);
      if (res.status === 0) {
        newdata[i][`${type}`] = `${res.data}`;
        this.setState({ data: newdata, loading: false });
      } else {
        message.info(res.msg);
        this.setState({ loading: false });
      }
    } finally {
      this.setState({ loading: false });
      //console.log(this.state.data);
    }
  };
}

export default Order_list;
