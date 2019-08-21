import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Select,
  ConfigProvider,
  DatePicker,
  Button
} from "antd";
import "moment/locale/zh-cn";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import LinkButton from "../../../components/link-button/index";
import { formateDate } from "../../../utils/dateUtils";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import { reqOrder_list, downloadList } from "../../../api/index";

const { RangePicker } = DatePicker;
class Order_list extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      start_time: "",
      end_time: "",
      order_status: "",
      type: "",
      paramKey: "",
      inputParam: "",
      user_id: "",
      order_id: ""
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await reqOrder_list(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    } else {
      message.error("网络问题");
    }
  };
  handleChange(event) {
    this.setState({ inputParam: event.target.value });
  }
  onSearchData = async () => {
    const result = await reqOrder_list(1, 20, this.state);
    if (result.status === 0) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    }
  };
  download = () => {
    downloadList(this.state);
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
              <ConfigProvider locale={zh_CN}>
                <RangePicker
                  // defaultValue={[moment().locale("zh-cn")]}
                  // showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD"
                  placeholder={["开始日期", "结束日期"]}
                  onChange={this.dataPickerOnChange}
                />
              </ConfigProvider>
              &nbsp; &nbsp;
              <Select
                placeholder="请选择"
                style={{ width: 120 }}
                onSelect={value => this.setState({ paramKey: value })}
              >
                <Select.Option value="order_id">订单id</Select.Option>
                <Select.Option value="user_id">user_id</Select.Option>
                <Select.Option value="1">创建时间</Select.Option>
                <Select.Option value="2">到账时间</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <Input
                type="text"
                placeholder="请输入关键字"
                style={{ width: 150 }}
                value={this.state.inputParam}
                onChange={this.handleChange}
              />
              &nbsp; &nbsp;
              <Select
                defaultValue=""
                style={{ width: 200 }}
                onSelect={value => this.setState({ order_status: value })}
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
                onSelect={value => this.setState({ type: value })}
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
              <button onClick={this.onSearchData}>
                <Icon type="search" />
                订单查询
              </button>
              &nbsp; &nbsp;
            </div>
            <div style={{ marginTop: 10 }}>
              <Input
                type="text"
                placeholder="user_id"
                style={{ width: 150 }}
                value={this.state.user_id}
                onChange={e => this.setState({ user_id: e.target.value })}
              />
              &nbsp; &nbsp;
              <Input
                type="text"
                placeholder="订单Id"
                style={{ width: 300 }}
                value={this.state.order_id}
                onChange={e => this.setState({ order_id: e.target.value })}
              />
              &nbsp; &nbsp;
              <button onClick={this.onSearchData}>
                <Icon type="search" />
                玩家掉单查询
              </button>
            </div>
          </div>
        }
        extra={
          <span>
            <Button style={{ float: "right" }} onClick={() => this.getUsers(1, 20)} icon="reload" />
            <br />
            <br />
            <Button onClick={this.download} icon="download">
              下载列表
            </Button>
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
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              if (page && pageSize) {
                this.setState({
                  pageSize: pageSize
                });
                this.getUsers(page, pageSize);
              } else return;
            },
            onShowSizeChange: (current, size) => {
              if (size) {
                this.getUsers(current, size);
              } else return;
            }
          }}
          scroll={{ x: 1900, y: 600 }}
        />
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
      title: "支付渠道",
      dataIndex: "channel_type",
      width: 100,
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
          case ["10", "13", "14", "15", "16"]:
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
      width: 100,
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
      width: 100,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "到账金额",
      dataIndex: "arrival_amount",
      width: 100,
      sorter: (a, b) => a.arrival_amount - b.arrival_amount
    },
    {
      title: "订单状态",
      dataIndex: "status",
      width: 130,
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
      width: 200,
      render: formateDate,
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
      dataIndex: "handle",
      width: 100
    },
    {
      title: "备注",
      dataIndex: "remark"
    }
  ];
  dataPickerOnChange = (date, dateString) => {
    let startTime = dateString[0] + " 00:00:00";
    let endTime = dateString[1] + " 00:00:00";
    this.setState({
      start_time: startTime,
      end_time: endTime
    });
  };
}

export default Order_list;
