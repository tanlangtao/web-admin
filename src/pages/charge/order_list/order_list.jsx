import React, { Component } from "react";
import { Card, Table, message, Icon, Input, Select, Modal, Button } from "antd";
import { formateDate } from "../../../utils/dateUtils";
import {
  reqOrder_list,
  downloadList,
  orderReviewEdit
} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import { toDecimal } from "../../../utils/commonFuntion";
import Diaodan from "./editData";

class Order_list extends Component {
  constructor(props) {
    super(props);
    this.reqData = {
      start_time: "",
      end_time: "",
      order_status: "",
      type: ""
    };
    this.inputKey = "";
    this.inputValue = "";
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isQueryShow: false,
      isEditShow: false
    };
  }
  getUsers = async (page, limit, reqData) => {
    const result = await reqOrder_list(page, limit, reqData);
    if (result.data) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    }
    if (result.status === -1) {
      this.setState({
        data: [],
        count: 0
      });
    }
  };
  PlayerLossOrderSearch = async () => {
    this.setState({ isQueryShow: true });
  };
  onSearchData = (page, limit) => {
    //处理要发送的数据
    let reqData = {
      ...this.reqData
    };
    if (this.inputKey === "1" || this.inputKey === "2") {
      reqData.time_type = this.inputKey;
    } else if (this.inputKey) {
      reqData[this.inputKey] = this.inputValue;
    }
    this.getUsers(page, limit, reqData);
  };
  download = () => {
    let data = {
      ...this.reqData,
      inputParam: this.inputValue,
      paramKey: this.inputKey
    };
    downloadList(data);
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
                onSelect={value => (this.inputKey = value)}
              >
                <Select.Option value="order_id">订单id</Select.Option>
                <Select.Option value="user_id">user_id</Select.Option>
                <Select.Option value="package_nick">所属品牌</Select.Option>
                <Select.Option value="1">创建时间</Select.Option>
                <Select.Option value="2">到账时间</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <Input
                type="text"
                placeholder="请输入关键字"
                style={{ width: 150 }}
                onChange={e => (this.inputValue = e.target.value)}
              />
              &nbsp; &nbsp;
              <MyDatePicker
                handleValue={val => {
                  this.reqData.start_time = val[0];
                  this.reqData.end_time = val[1];
                }}
              />
              &nbsp; &nbsp;
              <Select
                defaultValue=""
                style={{ width: 200 }}
                onSelect={value => (this.reqData.order_status = value)}
              >
                <Select.Option value="">订单状态</Select.Option>
                <Select.Option value="0">全部</Select.Option>
                <Select.Option value="1">未支付</Select.Option>
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
                onSelect={value => (this.reqData.type = value)}
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
            ></LinkButton>
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
                pageSize: size
              });
              this.onSearchData(current, size);
            }
          }}
          scroll={{ x: 2000 }}
        />
        <Modal
          title="玩家调单查询"
          visible={this.state.isQueryShow}
          onCancel={() => {
            this.setState({ isQueryShow: false });
          }}
          footer={null}
          width="70%"
        >
          <Diaodan />
        </Modal>
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
              <Button type="primary" onClick={() => this.orderReview(0)}>
                拒绝
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      width: 320
    },
    {
      title: "user_id",
      dataIndex: "user_id"
    },
    {
      title: "昵称",
      dataIndex: "user_name"
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick"
    },
    {
      title: "所属代理",
      dataIndex: "proxy_user_id"
    },
    {
      title: "支付渠道",
      dataIndex: "channel_type",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "0":
            word = record.replace_id;
            break;
          case "5":
            word = "充提UC";
            break;
          case "12":
            word = "onePay";
            break;
          case "11":
            word = "古都";
            break;
          case "10":
          case "13":
          case "14":
          case "15":
          case "16":
            word = "聚鑫";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      }
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
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      }
    },
    {
      title: "下单金额",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: text => {
        return <span>{toDecimal(text)}</span>;
      }
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      sorter: (a, b) => a.arrival_amount - b.arrival_amount,
      render: text => {
        return <span>{toDecimal(text)}</span>;
      }
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
      }
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: formateDate,
      width: 200,
      sorter: (a, b) => a.created_at - b.created_at
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      width: 200,
      render: (text, record, index) => {
        if (text === "0" || !text) {
          return "";
        } else return formateDate(text);
      },
      sorter: (a, b) => a.arrival_at - b.arrival_at
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
        } else {
          return;
        }
      }
    },
    {
      title: "备注",
      dataIndex: "remark"
    }
  ];
  edit = record => {
    this.setState({
      isEditShow: true,
      editUser_id: record.user_id,
      editMount: record.amount
    });
    this.user_id = record.user_id;
    this.order_id = record.order_id;
    this.editType = record.type;
  };
  orderReview = async action => {
    let reqData = {
      user_id: this.user_id,
      order_id: this.order_id,
      type: this.editType,
      status: action === 1 ? 9 : 8,
      review_type: 2
    };
    const res = await orderReviewEdit(reqData);
    if (res.status === 0) {
      message.success(res.msg || "操作成功");
      window.location.reload();
    } else {
      message.error(res.msg || "操作失败");
    }
  };
}

export default Order_list;
