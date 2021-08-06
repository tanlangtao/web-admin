import React, { Component } from "react";
import { Card, Table, Modal, Icon, Input, Select, Popover } from "antd";
import LinkButton from "../../../components/link-button/index";
import { formateDate } from "../../../utils/dateUtils";
import MyDatePicker from "../../../components/MyDatePicker";
import {
  withDraw,
  downloadWithdrawList,
  userDetail,
  reviewInfo,
  remarkInfo
} from "../../../api";
import WrappedComponent from "./details";
import EditForm from "./editForm";

class Withdraw_list extends Component {
  constructor(props) {
    super(props);
    this.reqData = {
      start_time: "",
      end_time: "",
      order_status: null,
      type: "5"
    };
    this.inputKey = "user_id";
    this.inputValue = null;
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isBindInfoShow: false,
      isEditFormShow: false
    };
  }
  getUsers = async (page, pageSize, reqData) => {
    const result = await withDraw(page, pageSize, reqData);
    this.setState({
      data: result.data && result.data.list,
      count: parseInt(result.data && result.data.count)
    });
  };
  onSearchData = (page, limit) => {
    //处理要发送的数据
    let reqData = {
      flag: 1,
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
    downloadWithdrawList(this.state);
  };
  componentDidMount() {
    this.getUsers(1, 20, { flag: 1, type: "5" });
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Select
              placeholder="请选择"
              style={{ width: 150 }}
              defaultValue="user_id"
              onSelect={value => (this.inputKey = value)}
            >
              <Select.Option value="order_id">订单id</Select.Option>
              <Select.Option value="user_id">user_id</Select.Option>
              <Select.Option value="replace_id">被赠人ID</Select.Option>
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
              handleValue={(data,val) => {
                this.reqData.start_time = val[0];
                this.reqData.end_time = val[1];
              }}
            />
            &nbsp; &nbsp;
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onSelect={value => (this.reqData.order_status = value)}
            >
              <Select.Option value="">订单状态</Select.Option>
              <Select.Option value="1">待审核</Select.Option>
              <Select.Option value="2">处理中</Select.Option>
              <Select.Option value="3">已提交</Select.Option>
              <Select.Option value="4">已成功</Select.Option>
              <Select.Option value="5">已失败</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <LinkButton onClick={() => this.onSearchData(1, 20)} size="default">
              <Icon type="search" />
            </LinkButton>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => {
                window.location.reload();
              }}
              icon="reload"
              size="default"
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
                pageSize: size
              });
              this.onSearchData(current, size);
            }
          }}
          scroll={{ x: 2200 }}
        />
        {this.state.isDetailShow && (
          <Modal
            title={
              this.action === "check"
                ? "审核信息"
                : this.action === "risk"
                  ? "资金明细"
                  : "运营备注"
            }
            visible={this.state.isDetailShow}
            onCancel={() => {
              this.setState({ isDetailShow: false });
            }}
            footer={null}
            width="70%"
          >
            <WrappedComponent
              detailRecord={this.detailRecord}
              action={this.action}
            />
          </Modal>
        )}
        {this.state.isEditFormShow && (
          <Modal
            title="编辑"
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
            width="70%"
          >
            <EditForm record={this.editRecord} />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "订单ID",
      dataIndex: "order_id",
      width: 300
    },
    {
      title: "user_id",
      dataIndex: "user_id",
      width: 100
    },
    {
      title: "昵称",
      dataIndex: "user_name",
      width: 100
    },
    {
      title: "下单金额",
      dataIndex: "amount",
      width: 100,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "申请费率",
      dataIndex: "handling_fee",
      width: 100
    },
    {
      title: "实际费率",
      dataIndex: "gold",
      width: 100
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      width: 100,
      sorter: (a, b) => a.arrival_amount - b.arrival_amount
    },
    {
      title: "兑换方式",
      dataIndex: "order_type",
      width: 100
    },
    {
      title: "被赠人ID",
      dataIndex: "replace_id",
      width: 100
    },
    {
      title: "被赠人昵称",
      dataIndex: "replace_name",
      width: 100
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
            word = "待审核";
            break;
          case "2":
            word = "处理中";
            break;
          case "3":
            word = "已提交";
            break;
          case "4":
            word = "已成功";
            break;
          case "5":
            word = "已失败";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      }
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick",
      width: 100
    },
    {
      title: "所属代理",
      dataIndex: "proxy_user_id",
      width: 100
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 150,
      render: formateDate,
      sorter: (a, b) => a.created_at - b.created_at
    },
    {
      title: "到账时间",
      dataIndex: "arrival_at",
      width: 150,
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
      width: 100,
      render: record => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
        </span>
      )
    },
    {
      title: "审核详情",
      dataIndex: "",
      width: 100,
      render: record => (
        <span>
          <LinkButton
            onClick={() => this.getDetail(record, "check")}
            type="default"
          >
            查看
          </LinkButton>
        </span>
      )
    },
    {
      title: "备注内容",
      dataIndex: "",
      render: record => (
        <span>
          <Popover
            content={record.user_remark}
            title={record.user_id + "用户备注"}
            trigger="click"
          >
            <LinkButton type="default">用户备注</LinkButton>
          </Popover>
          <LinkButton
            onClick={() => this.getDetail(record, "operatorRemark")}
            type="default"
          >
            运营备注
          </LinkButton>
        </span>
      )
    }
  ];
  getDetail = async (record, action) => {
    this.action = action;
    this.detailRecord = {
      data: [],
      count: 0,
      id: record.user_id
    };
    const res =
      action === "risk"
        ? await userDetail(1, 20, record.user_id)
        : action === "check"
          ? await reviewInfo(1, 20, record.order_id)
          : await remarkInfo(1, 20, record.order_id);
    if (res.status === 0) {
      this.detailRecord.data = res.data;
      this.detailRecord.count = res.count;
    }
    this.setState({ isDetailShow: true });
  };
  edit = record => {
    this.editRecord = record;
    this.setState({ isEditFormShow: true });
  };
}

export default Withdraw_list;
