import React, { Component } from "react";
import { Table, Card, Icon, message } from "antd";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import { userDetail, bindInfo } from "../../api/index";
class GoldDetail extends Component {
  constructor(props) {
    super(props);
    this.startTime = "";
    this.endTime = "";
    this.state = {
      data: [],
      count: 0
    };
  }
  getUsers = async (page, limit) => {
    let isBindInfo = this.props.isBindInfo;
    let id = this.props.recordID;
    const res = !isBindInfo
      ? await userDetail(page, limit, id)
      : await bindInfo(page, limit, id);
    if (res.status === 0) {
      this.setState({
        data: res.data,
        count: res.count
      });
    }
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  onSearchData = async (page, limit) => {
    if (!this.startTime || !this.endTime) {
      message.error("请选择有效的时间日期");
      return;
    }
    let reqData = {
      start: this.startTime,
      end: this.endTime,
      funds_type: 0
    };
    let id = this.props.recordID;
    const res = await userDetail(page, limit, id, reqData);
    if (res.status === 0) {
      this.setState({ data: res.data, count: res.count });
    } else {
      message.info(res.msg || "没有数据");
    }
  };
  render() {
    // const { data } = this.props.GoldDetailRecord;
    let title;
    if (!this.props.isBindInfo) {
      title = (
        <span>
          <MyDatePicker
            handleValue={val => {
              let diffDays = moment(val[1]).diff(moment(val[0]), "days");
              if (diffDays > 1) {
                message.error("请选择时间范围不大于1天");
              } else {
                this.startTime = val[0];
                this.endTime = val[1];
              }
            }}
          />
          &nbsp; &nbsp;
          <LinkButton onClick={() => this.onSearchData(1, 20)} size="default">
            <Icon type="search" />
          </LinkButton>
        </span>
      );
    }
    return (
      <Card title={title}>
        <Table
          bordered
          size="small"
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: 20,
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
        />
      </Card>
    );
  }
  initColumns = () => {
    if (this.props.isBindInfo) {
      return [
        {
          title: "支付宝账号",
          dataIndex: "alipay_account"
        },
        {
          title: "绑定支付宝时间",
          dataIndex: "bind_alipay_at"
        },

        {
          title: "开户人姓名",
          dataIndex: "card_name"
        },
        {
          title: "银行名称",
          dataIndex: "bank_name"
        },
        {
          title: "银行卡号",
          dataIndex: "bank_num"
        },
        {
          title: "绑定银行卡时间",
          dataIndex: "bind_bank_at"
        },
        {
          title: "是否灰名单",
          dataIndex: "is_gray"
        },
        {
          title: "灰名单备注",
          dataIndex: "black_remark"
        },
        {
          title: "备注人",
          dataIndex: "remark_name"
        },
        {
          title: "备注时间",
          dataIndex: "remark_at"
        },
        {
          title: "操作",
          dataIndex: "option"
        }
      ];
    } else {
      return [
        {
          title: "user_id",
          dataIndex: "id"
        },
        {
          title: "产生来源",
          dataIndex: "pay_account_name"
        },

        {
          title: "余额(变动前)",
          dataIndex: "total_balance"
        },
        {
          title: "变动金额",
          dataIndex: "final_pay",

          sorter: (a, b) => a.total_balance - b.total_balance
        },
        {
          title: "税收",
          dataIndex: "tax"
        },
        {
          title: "余额(变动后)",
          dataIndex: "total_final_balance"
        },
        {
          title: "备注",
          dataIndex: "pay_reason"
        },
        {
          title: "创建时间",
          dataIndex: "create_time"
        }
      ];
    }
  };
}

export default GoldDetail;
