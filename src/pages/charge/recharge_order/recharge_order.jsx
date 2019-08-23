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
import LinkButton from "../../../components/link-button/index";
import { formateDate } from "../../../utils/dateUtils";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { rechargeOrder, reqOrder_list, downloadList } from "../../../api/index";

const { RangePicker } = DatePicker;
class Recharge_order extends Component {
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
      type: "14",
      paramKey: "",
      inputParam: "",
      user_id: "",
      order_id: ""
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await rechargeOrder(page, limit);
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
                style={{ width: 100 }}
                onSelect={value => this.setState({ order_status: value })}
              >
                <Select.Option value="">状态</Select.Option>
                <Select.Option value="0">未成功</Select.Option>
                <Select.Option value="1">已分配</Select.Option>
                <Select.Option value="4">已撤销</Select.Option>
                <Select.Option value="6">已完成</Select.Option>
                <Select.Option value="7">初审通过</Select.Option>
                <Select.Option value="8">初审拒绝</Select.Option>
                <Select.Option value="9">复审通过</Select.Option>
                <Select.Option value="10">复审拒绝</Select.Option>
              </Select>
              &nbsp; &nbsp;
              <button onClick={this.onSearchData}>
                <Icon type="search" />
              </button>
              &nbsp; &nbsp;
            </div>
          </div>
        }
        extra={
          <span>
            <Button
              style={{ float: "right" }}
              onClick={() => this.getUsers(1, 20)}
              icon="reload"
            />
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
      title: "代充ID",
      dataIndex: "replace_id",
      width: 100
    },
    {
      title: "代充昵称",
      dataIndex: "replace_name",
      width: 100
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

export default Recharge_order;
