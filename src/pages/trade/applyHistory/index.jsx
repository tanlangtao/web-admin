import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Select
} from "antd";
import {
  sellGoldApplyList,
  tradeRemark,
  sellGoldInfoList,
  reviewInfo2,
  remarkInfo2
} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";
import MyDatePicker from "../../../components/MyDatePicker";
import { formateDate } from "../../../utils/dateUtils";
class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      page: 1,
      pageSize: 20,
      isEditFormShow: false,
    };
    this.filed = "id";
  }
  getInitialData = async (page, limit) => {
    const res = await sellGoldApplyList(page, limit);
    if (res.status === 0) {
      this.setState({
        data: res.data&&res.data.list,
        count: parseInt(res.data&&res.data.count)
      });
    } else {
      message.info(res.msg);
    }
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
              handleValue={(data,val) => {
                this.start_time = val[0];
                this.end_time = val[1];
              }}
            ></MyDatePicker>
            &nbsp;&nbsp;&nbsp;
            <Select
              defaultValue="id"
              style={{ width: 150 }}
              onChange={value => (this.filed = value)}
            >
              <Select.Option value="id">ID</Select.Option>
              <Select.Option value="user_id">user_id</Select.Option>
              <Select.Option value="source">所属代理</Select.Option>
              <Select.Option value="group">所属品牌</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Input
              style={{ width: 150 }}
              placeholder="请输入关键字搜索"
              ref={Input => {
                this.input = Input;
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onChange={value => (this.status = value)}
            >
              <Select.Option value="">状态</Select.Option>
              <Select.Option value="1">待初审</Select.Option>
              <Select.Option value="2">初审通过</Select.Option>
              <Select.Option value="3">初审拒绝</Select.Option>
              <Select.Option value="4">复审通过</Select.Option>
              <Select.Option value="5">复审拒绝</Select.Option>
              <Select.Option value="6">已下架</Select.Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <LinkButton
              type="primary"
              onClick={this.onSearch}
              icon="search"
            ></LinkButton>
          </div>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()}>
            <Icon type="reload" />
          </LinkButton>
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
            total: parseInt(this.state.count),
            onChange: (page, pageSize) => {
              this.setState({
                page: page
              });
              this.getInitialData(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size
              });
              this.getInitialData(current, size);
            }
          }}
          scroll={{ x: 1800 }}
        />
        {this.state.isEditFormShow && (
          <Modal
            title={
              this.action === "detail"
                ? "详情"
                : this.action === "check"
                ? "审核详情"
                : "运营备注详情"
            }
            visible={this.state.isEditFormShow}
            onCancel={() => {
              this.setState({ isEditFormShow: false });
            }}
            footer={null}
          >
            <WrappedEditForm
              finished={() => {
                this.getInitialData(this.state.page, this.state.pageSize);
                this.setState({ isEditFormShow: false });
              }}
              record={this.editDataRecord}
              action={this.action}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "user_id",
      dataIndex: "user_id"
    },
    {
      title: "昵称",
      dataIndex: "user_name",
      width: 150
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
      title: "兑换单价",
      dataIndex: "exchange_price"
    },
    {
      title: "上架金币数",
      dataIndex: "gold"
    },
    {
      title: "上架金币余额",
      dataIndex: "last_gold"
    },
    {
      title: "最低兑换额",
      dataIndex: "min_gold"
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text, record, index) => {
        let res;
        switch (parseInt(text)) {
          case 1:
            res = (
              <span>
                <LinkButton size="small">初审通过</LinkButton>
                <LinkButton size="small">初审拒绝</LinkButton>
              </span>
            );
            break;
          case 2:
            res = (
              <span>
                <LinkButton size="small">复审通过</LinkButton>
                <LinkButton size="small">复审拒绝</LinkButton>
              </span>
            );
            break;
          case 3:
            res = <span>一审拒绝</span>;
            break;
          case 4:
            res = <span>已上架</span>;
            break;
          case 5:
            res = <span>二审拒绝</span>;
            break;
          case 6:
            res = <span>已下架</span>;
            break;
          default:
            break;
        }
        return res;
      }
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: formateDate
    },
    {
      title: "风控",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton size="small" type="dashed">
            风控
          </LinkButton>
          <LinkButton size="small" type="dashed">
            游戏数据
          </LinkButton>
        </span>
      )
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton size="small" onClick={() => this.edit(record)}>
            编辑
          </LinkButton>
          <LinkButton size="small" onClick={() => this.checkDetail(record, "detail")}>
            详情
          </LinkButton>
        </span>
      )
    },
    {
      title: "审核详情",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton
            size="small"
            type="default"
            onClick={() => this.checkDetail(record, "check")}
          >
            查看
          </LinkButton>
        </span>
      )
    },
    {
      title: "备注内容",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton
            size="small"
            type="default"
            onClick={() => this.checkDetail(record, "userRemark")}
          >
            用户备注
          </LinkButton>
          <LinkButton
            size="small"
            type="default"
            onClick={() => this.checkDetail(record, "operatorRemark")}
          >
            运营备注
          </LinkButton>
        </span>
      )
    }
  ];
  onSearch = async () => {
    let value = {
      end_time: this.start_time || "",
      start_time: this.start_time || "",
      status: this.status || "",
      [this.filed]: this.input.input.value
    };
    const res = await sellGoldApplyList(
      this.state.page,
      this.state.pageSize,
      value
    );
    this.setState({ data: res.data, count: res.count });
  };
  edit = async record => {
    Modal.info({
      title: "编辑",
      okText: "关闭",
      okType: "default",
      width: "50%",
      content: (
        <div>
          <div>
            <span>备注[用户]&nbsp;&nbsp;&nbsp;</span>
            <Input
              style={{ width: "60%" }}
              placeholder="请输入备注内容，用户查看使用"
              ref={Input => {
                this.userRemarkInput = Input;
              }}
            />
            <span>&nbsp;&nbsp;&nbsp;</span>
            <LinkButton
              onClick={() => {
                this.editComfirm(record, 1);
              }}
            >
              确定
            </LinkButton>
          </div>
          <br />
          <div>
            <span>备注[运营]&nbsp;&nbsp;&nbsp;</span>
            <Input
              style={{ width: "60%" }}
              placeholder="请输入备注内容，运营人员记录使用"
              ref={Input => {
                this.operatorRemarkInput = Input;
              }}
            />
            <span>&nbsp;&nbsp;&nbsp;</span>
            <LinkButton
              onClick={() => {
                this.editComfirm(record, 2);
              }}
            >
              确定
            </LinkButton>
          </div>
        </div>
      )
    });
  };
  editComfirm = async (record, remark_type) => {
    let value = {
      id: record.id,
      temarks:
        remark_type === 1
          ? this.userRemarkInput.input.value
          : this.operatorRemarkInput.input.value,
      remark_type: remark_type
    };
    if (remark_type === 2) {
      value.type = 6;
    }
    const res = await tradeRemark(value);
    if (res.status === 0) {
      message.success(res.msg);
    } else {
      message.info(res.msg);
    }
  };
  checkDetail = async (record, action) => {
    if (action === "userRemark") {
      Modal.info({
        title: `订单ID为【${record.id}】的用户备注`,
        content: <div>{record.user_remark||'无'}</div>,
        okText:'关闭'
      });
    } else {
      let res;
      switch (action) {
        case "detail":
          res = await sellGoldInfoList(1, 100, record.id);
          break;
        case "check":
          res = await reviewInfo2(1, 100, record.id);
          break;
        case "operatorRemark":
          res = await remarkInfo2(1, 100, record.id);
          break;
        default:
          break;
      }
      this.editDataRecord = res.data;
      this.action = action;
      this.setState({ isEditFormShow: true });
    }
  };
}
export default Tasks;
