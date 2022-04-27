import React, { Component } from "react";

import {
  Card,
  Table,
  Modal,
  Icon,
  Input,
  Select,
  Popover,
  message,
  Button,
  Tooltip,
} from "antd";
import LinkButton from "../../../components/link-button/index";
import riskcontrolfn from "../../../components/riskcontrol";
import moment from "moment";
import { formateDate } from "../../../utils/dateUtils";
import MyDatePicker from "../../../components/MyDatePicker";
import {
  withDraw,
  downloadWithdrawList,
  reviewInfo,
  remarkInfo,
  auditOrder,
  orderWithDrawReview,
} from "../../../api";
import WrappedComponent from "./details";
import WrappedEdit from "./edit";

class Withdraw_list extends Component {
  constructor(props) {
    super(props);
    this.reqData = {
      start_time: "",
      end_time: "",
      order_status: "",
      type: "",
    };
    this.inputKey = "user_id";
    this.inputValue = "";
    this.index = null;
    this.currentLogin = localStorage.name;
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20,
      isBindInfoShow: false,
      isEditShow: false,
      isGoldDetailShow: false,
      goldDetail_data: [],
      goldDetail_count: 0,
      goldDetail_sumData: null,
      detailRecord: {
        data: [],
        count: 0,
        id: "",
      },
    };
  }
  getUsers = async (page, pageSize, reqData) => {
    const res1 = await withDraw(page, pageSize, reqData);
    //取得訂單列表
    if (res1.status === 0 && res1.data) {
      let data1 = res1.data && res1.data.list;
      let count = parseInt(res1.data && res1.data.count);
      const newData = data1.sort((a, b) => {
        if (a.claim_name === this.currentLogin && a.status < 3) {
          return -1;
        } else {
          return 0;
        }
      });
      this.setState({
        data: newData,
        count: count,
      });
    }
    if (res1.status === -1 || !res1.data) {
      message.info(JSON.stringify(res1?.msg) || "操作失败");
      this.setState({
        data: [],
        count: 0,
      });
    }
  };
  onSearchData = (page, limit) => {
    let reqData = {
      flag: 3,
      ...this.reqData,
    };
    if (this.inputKey === "1" || this.inputKey === "2") {
      reqData.time_type = this.inputKey;
    } else if (this.inputKey) {
      if (this.inputKey === "user_id") {
        reqData[this.inputKey] = this.inputValue;
      } else {
        reqData[this.inputKey] = this.inputValue;
      }
    }
    this.getUsers(page, limit, reqData);
  };
  onAfterCloseSearchData = async () => {
    let index = this.index,
      previousCount = this.state.count,
      newCount = 0,
      previousPage = this.state.page;
    let reqData = {
      flag: 3,
      ...this.reqData,
    };
    if (this.inputKey === "1" || this.inputKey === "2") {
      reqData.time_type = this.inputKey;
    } else if (this.inputKey) {
      if (this.inputKey === "user_id") {
        reqData[this.inputKey] = this.inputValue;
      } else {
        reqData[this.inputKey] = this.inputValue;
      }
    }
    const result = await withDraw(1, 20, reqData);
    if (result.status === 0) {
      newCount = parseInt(result.data && result.data.count);
      console.log(newCount, previousCount, index, this.state.pageSize);
      if (newCount - previousCount + index < this.state.pageSize) {
        console.log("1");
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.getUsers(this.state.page, this.state.pageSize, reqData);
      } else {
        console.log("2");
        this.setState({
          page:
            previousPage +
            parseInt((newCount - previousCount + index) / this.state.pageSize),
        });
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.getUsers(
          previousPage +
          parseInt((newCount - previousCount + index) / this.state.pageSize),
          this.state.pageSize,
          reqData
        );
      }
    }
  };
  download = () => {
    let data = {
      flag: 3,
      ...this.reqData,
      inputValue: this.inputValue,
      inputKey: this.inputKey,
    };
    downloadWithdrawList(data);
  };
  componentDidMount() {
    this.getUsers(1, 20, { flag: 3 });
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Select
              placeholder="请选择"
              style={{ width: 150 }}
              onSelect={(value) => (this.inputKey = value)}
              defaultValue="user_id"
            >
              <Select.Option value="order_id">订单id</Select.Option>
              <Select.Option value="user_id">user_id</Select.Option>
              <Select.Option value="package_nick">所属品牌</Select.Option>
              <Select.Option value="proxy_pid">所属代理</Select.Option>
              <Select.Option value="1">创建时间</Select.Option>
              <Select.Option value="2">到账时间</Select.Option>
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
              }}
            />
            &nbsp; &nbsp;
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onSelect={(value) => (this.reqData.order_status = value)}
              placeholder="订单状态"
            >
              <Select.Option value="">订单状态</Select.Option>
              <Select.Option value="1">待审核</Select.Option>
              <Select.Option value="2">处理中</Select.Option>
              <Select.Option value="3">已提交</Select.Option>
              <Select.Option value="4">已成功</Select.Option>
              <Select.Option value="5">已失败</Select.Option>
              <Select.Option value="6">复审拒绝</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onSelect={(value) => (this.reqData.type = value)}
            >
              <Select.Option value="">兑换方式</Select.Option>
              <Select.Option value="1">alipay</Select.Option>
              <Select.Option value="2">gudubank</Select.Option>
              <Select.Option value="3">bank</Select.Option>
              <Select.Option value="7">onepaybank</Select.Option>
              <Select.Option value="8">聚鑫代付</Select.Option>
              <Select.Option value="9">聚鑫ERC20</Select.Option>
              <Select.Option value="10">聚鑫TRC20</Select.Option>
              <Select.Option value="11">jisuwithdraw</Select.Option>
              <Select.Option value="12">pipeiwithdraw</Select.Option>
              <Select.Option value="13">jisuwithdraw2</Select.Option>
              <Select.Option value="14">UC代付</Select.Option>
              <Select.Option value="15">jisuwithdrawiframe</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <LinkButton
              onClick={() =>
                this.onSearchData(this.state.page, this.state.pageSize)
              }
              size="default"
            >
              <Icon type="search" />
            </LinkButton>
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => this.getUsers(1, 20, { flag: 3 })}
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
          id="antdTable"
          bordered
          size="small"
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            current: this.state.page,
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "40", "80", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              // document.body.scrollTop = document.documentElement.scrollTop = 0;
              this.setState({
                page,
              });
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
        {this.state.isDetailShow && (
          <Modal
            title={this.action === "check" ? "审核信息" : "运营备注"}
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
            <WrappedEdit
              editData={this.editData}
              onclose={() => {
                this.setState({ isEditShow: false });
                this.onAfterCloseSearchData();
              }}
              detailRecord={this.state.detailRecord}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button
            type="primary"
            size="small"
            onClick={() => this.edit(record, index)}
          >
            编辑
          </Button>
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
          case 1:
            word = "待审核";
            break;
          case "2":
          case 2:
            word = "处理中";
            break;
          case "3":
          case 3:
            word = "已提交";
            break;
          case "4":
          case 4:
            word = "已成功";
            break;
          case "5":
          case 5:
            word = "已失败";
            break;
          case "6":
          case 6:
            word = "复审拒绝";
            break;
          case "7":
          case 7:
            word = "已匹配";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      },
    },
    {
      title: "风控",
      dataIndex: "",
      render: (text, record) => (
        <span>
          <Button
            size="small"
            onClick={() => {
              riskcontrolfn(record);
            }}
            type="default"
          >
            风控
          </Button>
        </span>
      ),
    },
    {
      title: "审核详情",
      dataIndex: "",
      render: (record) => (
        <span>
          <Button
            size="small"
            onClick={() => this.getDetail(record, "check")}
            type="default"
          >
            查看
          </Button>
        </span>
      ),
    },
    {
      title: "订单ID",
      dataIndex: "order_id",
    },
    {
      title: (
        <div>
          {" "}
          认领人
          <Tooltip
            color="#f50"
            title={
              <>
                1. 订单认领人同初审人 <br />
                2. 超过1个自然月的历史订单将不再显示认领人名称
              </>
            }
          >
            <Icon
              type="exclamation-circle-o"
              style={{ color: "#faad14", fontSize: "14px", marginLeft: "3px" }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "claim_name",
      render: (text, record, index) => {
        const diffDays = moment().diff(moment.unix(record.created_at), "days");
        if (diffDays < 31 && record.status == 1) {
          return (
            text || (
              <Button
                type="default"
                size="small"
                onClick={() => this.pick(record, index)}
              >
                认领
              </Button>
            )
          );
        }
        if (diffDays < 31 && record.status !== 1) {
          return text || "-";
        }
      },
      onCell: (record, rowIndex) => {
        if (record.claim_name == this.currentLogin)
          return { style: { color: "#f5222d" } };
      },
    },
    {
      title: "user_id",
      dataIndex: "user_id",
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
      title: "下单金额",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "申请费率",
      dataIndex: "handling_fee",
    },
    {
      title: "实际费率",
      dataIndex: "gold",
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      sorter: (a, b) => a.arrival_amount - b.arrival_amount,
    },
    {
      title: "兑换方式",
      dataIndex: "order_type",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "1":
          case 1:
            word = "alipay";
            break;
          case "2":
          case 2:
            word = "gudubank";
            break;
          case "3":
          case 3:
            word = "bank";
            break;
          case "4":
          case 4:
            word = "人工兑换";
            break;
          case "5":
          case 5:
            word = "人工代充";
            break;
          case "6":
          case 6:
            word = "赠送";
            break;
          case "7":
          case 7:
            word = "onepaybank";
            break;
          case "8":
          case 8:
            word = "聚鑫代付";
            break;
          case "9":
          case 9:
            word = "聚鑫ERC20";
            break;
          case "10":
          case 10:
            word = "聚鑫TRC20";
            break;
          case "10":
          case 10:
            word = "聚鑫TRC20";
            break;
          case "11":
          case 11:
            word = "jisuwithdraw";
            break;
          case "12":
          case 12:
            word = "pipeiwithdraw";
            break;
          case "13":
          case 13:
            word = "jisuwithdraw2";
            break;
          case "14":
          case 14:
            word = "UC代付";
            break;
          case "15":
          case 15:
            word = "jisuwithdrawiframe";
            break;
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      },
    },
    {
      title: "兑换账号",
      dataIndex: "pay_account",
    },
    {
      title: "账号名称",
      dataIndex: "pay_name",
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
      title: "备注内容",
      dataIndex: "",
      render: (record) => (
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
      ),
    },
  ];
  getDetail = async (record, action) => {
    this.action = action;
    this.detailRecord = {
      data: [],
      count: 0,
      id: record.user_id,
    };
    const res =
      action === "check"
        ? await reviewInfo(1, 20, record.order_id)
        : await remarkInfo(1, 20, record.order_id);
    if (res.data && res.data.list) {
      this.detailRecord.data = res.data.list;
      this.detailRecord.count = res.data.count;
    }
    if (
      this.state.data
        .filter((data) => {
          return data.order_id === record.order_id;
        })
        .some((data) => {
          return data.claim_time !== 0;
        })
    ) {
      let claimData = this.state.data
        .filter((data) => {
          return data.order_id === record.order_id;
        })
        .map((data) => {
          return {
            review_name: data.claim_name,
            status: 7,
            review_at: data.claim_time,
          };
        });
      this.detailRecord.data.unshift(claimData[0]);
    }
    this.setState({ isDetailShow: true });
  };
  edit = async (record, index) => {
    this.index = index;
    let reqData = {
      flag: 3,
      order_id: record.order_id,
    };
    const res = await auditOrder(reqData);
    if (res.status === 0) {
      this.editData = res.data && res.data.list[0];
      this.setState({ isEditShow: true });
    } else {
      message.info("操作失败");
    }
    const res2 = await reviewInfo(1, 20, record.order_id);
    if (res2.data && res2.data.list) {
      this.setState({
        detailRecord: {
          data: res2.data.list,
          count: res2.data.count,
          id: record.user_id,
        },
      });
    }
  };
  pick = async (record, index) => {
    this.index = index;
    let reqData = {
      order_id: record.order_id,
      user_id: parseInt(record.user_id),
      review_status: 1,
      review_type: 3,
      is_pass: 1,
    };
    const res = await orderWithDrawReview(reqData);
    if (res.status === 0) {
      message.success(res.msg);
      this.onSearchData(this.state.page, this.state.pageSize);
    } else {
      message.info(res.msg || "操作失败");
    }
  };
}

export default Withdraw_list;
