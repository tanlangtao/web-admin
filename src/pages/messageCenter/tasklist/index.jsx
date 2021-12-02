import React, { Component } from "react";
import { Card, Table, message, Icon, Input, Select } from "antd";
import { tasksList } from "../../../api/index";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePicker";
import ExportJsonExcel from "js-export-excel";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20,
      isEditFormShow: false,
      loading: false,
    };
  }
  getInitialData = async (page, limit, params) => {
    const res = await tasksList(page, limit, { task_type: 0, ...params });
    this.setState({ page: page, pageSize: limit });
    if (res.status === 0 && res.data && res.data.list) {
      res.data.list.forEach((ele) => {
        Object.assign(ele, JSON.parse(ele.params));
      });
      this.setState({
        data: res.data.list,
        count: parseInt(res.data.count),
      });
    } else {
      message.info(res.msg);
    }
  };
  onSearch = async (page, limit) => {
    let value = {
      start_time: this.start_time || "",
      end_time: this.end_time || "",
      // status: this.status || "",
      operator_nick: this.input.input.value || "",
    };
    if (this.status) {
      value.status = this.status;
    }
    this.getInitialData(page, limit, value);
    // const res = await tasksList(this.state.page, this.state.pageSize, value);
    // this.setState({ data: res.data.list, count: res.data.count });
  };
  componentDidMount() {
    this.getInitialData(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <div>
            <MyDatePicker
              handleValue={(data, val) => {
                this.start_time = val[0];
                this.end_time = val[1];
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Select
              placeholder="任务状态"
              style={{ width: 150 }}
              onChange={(value) => (this.status = value)}
            >
              {/* <Select.Option value="-1">全部</Select.Option> */}
              <Select.Option value="0">待操作</Select.Option>
              <Select.Option value="1">已复审</Select.Option>
              <Select.Option value="2">复审拒绝</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入创建人昵称"
              ref={(Input) => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              type="primary"
              onClick={() => this.onSearch(1, this.state.pageSize)}
              icon="search"
              size="default"
            />
          </div>
        }
        extra={
          <>
            <LinkButton onClick={() => window.location.reload()} size="default">
              <Icon type="reload" />
            </LinkButton>
            <LinkButton
              size="default"
              onClick={() => {
                this.handle_download();
              }}
            >
              导出数据
            </LinkButton>
          </>
        }
      >
        <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            current: this.state.page,
            onChange: (page, pageSize) => {
              this.onSearch(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.onSearch(current, size);
            },
          }}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "任务ID",
      dataIndex: "id",
    },
    {
      title: "amount",
      dataIndex: "amount",
    },
    {
      title: "operator_id",
      dataIndex: "operator_id",
    },
    {
      title: "package_id",
      dataIndex: "package_id",
    },
    {
      title: "proxy_user_id",
      dataIndex: "proxy_user_id",
    },
    {
      title: "user_id",
      dataIndex: "user_id",
    },
    {
      title: "reason",
      dataIndex: "reason",
    },
    // {
    // 	title: "任务信息",
    // 	dataIndex: "params",
    // 	width: 500,
    // 	render: (text, record) => (
    // 		<div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{text}</div>
    // 	),
    // },
    {
      title: "任务来源",
      dataIndex: "task_type",
      width: 150,
      render: (text, record, index) => (
        <span>
          {parseInt(text) === 0
            ? "用户列表资金变动"
            : parseInt(text) === 1
            ? "代理配置列表资金变动"
            : parseInt(text) === 2
            ? "用户重置密码"
            : parseInt(text) === 3
            ? "解绑用户绑定账户"
            : parseInt(text) === 4
            ? "安全码重置"
            : ""}
        </span>
      ),
    },
    {
      title: "创建人昵称",
      dataIndex: "operator_nick",
    },
    {
      title: "复审人昵称",
      dataIndex: "review_nick",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 200,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text.replace("T", " ").replace("+08:00", " ")}
        </div>
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      width: 200,
      render: (text, record) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text.replace("T", " ").replace("+08:00", " ")}
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text, record, index) => {
        let res;
        switch (text) {
          case 0:
            res = "待操作";
            break;
          case 1:
            res = "已复审";
            break;
          case 2:
            res = "复审拒绝";
            break;
          default:
            break;
        }
        return res;
      },
    },
  ];
  handle_download = async () => {
    let value = {
      start_time: this.start_time || "",
      end_time: this.end_time || "",
      // status: this.status || "",
      operator_nick: this.input.input.value || "",
    };
    if (this.status) {
      value.status = this.status;
    }
    const res = await tasksList(1, 20000, { task_type: 0, ...value });
    if (res.data && res.data.list && res.data.list.length !== 0) {
      res.data.list.forEach((ele) => {
        Object.assign(ele, JSON.parse(ele.params));
      });
      this.downloadExcel(res.data.list);
    } else {
      message.info("下载失败,没有资料");
    }
  };
  downloadExcel = (data_for_excel) => {
    // let searchData = reqData.current;
    // let { start_time, end_time } = searchData;
    let option = {};
    let dataTable = [];
    let columns = this.initColumns();
    data_for_excel.forEach((ele) => {
      let obj = {};
      columns.forEach((item) => {
        obj[item.title] = ele[item.dataIndex];
        if (item.dataIndex === "task_type") {
          let res = "";
          switch (parseInt(ele[item.dataIndex])) {
            case 0:
              res = "用户列表资金变动";
              break;
            case 1:
              res = "代理配置列表资金变动";
              break;
            case 2:
              res = "用户重置密码";
              break;
            case 3:
              res = "解绑用户绑定账户";
              break;
            default:
              break;
          }
          obj[item.title] = res;
        }
        if (item.dataIndex === "status") {
          let res = "";
          switch (parseInt(ele[item.dataIndex])) {
            case 0:
              res = "待复审";
              break;
            case 1:
              res = "已复审";
              break;
            case 2:
              res = "复审拒绝";
              break;
            default:
              break;
          }
          obj[item.title] = res;
        }
      });
      dataTable.push(obj);
    });
    console.log(dataTable);
    let sheetFilter = [];
    columns.forEach((item) => {
      if (item.title && item.dataIndex) {
        sheetFilter.push(item.title);
      }
    });
    option.fileName = `任务列表`;
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetFilter: sheetFilter,
        sheetHeader: sheetFilter,
      },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };
}
export default Tasks;
