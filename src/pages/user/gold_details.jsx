import React, { Component } from "react";
import { Table, Card, Icon } from "antd";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import { userDetail } from "../../api/index";
class GoldDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    this.setState({
      data: this.props.GoldDetailRecord.data
    });
  }
  search = async () => {
    let goldDetails = {
      start: this.startTime ? this.startTime : "",
      end: this.endTime ? this.endTime : "",
      funds_type: 0
    };
    const res = await userDetail(
      1,
      100,
      this.props.GoldDetailRecord.id,
      goldDetails
    );
    this.setState({ data: res.data });
  };
  render() {
    // const { data } = this.props.GoldDetailRecord;
    let title;
    if (!this.props.isBindInfo) {
      title = (
        <span>
          <MyDatePicker
            handleValue={val => {
              this.startTime = val[0];
              this.endTime = val[1];
            }}
          />
          &nbsp; &nbsp;
          <LinkButton onClick={this.search} size="default">
            <Icon type="search" />
          </LinkButton>
        </span>
      );
    }
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
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
