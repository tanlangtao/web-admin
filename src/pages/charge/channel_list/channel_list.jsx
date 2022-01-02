import React, { Component } from "react";
import { Card, Icon, Input, message, Modal, Table } from "antd";
import LinkButton from "../../../components/link-button/index";
import { getChannelList } from "../../../api/index";
import WrappedAddDataForm from "./addorEdit";
import { formateDate } from "../../../utils/dateUtils";

class Channel_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isAddDataShow: false,
      isEditDataShow: false,
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await getChannelList(page, limit);
    if (result.status === 0) {
      this.setState({
        data: result.data && result.data.list,
        count: result.data && result.data.count,
      });
    }
    if (result.status === -1) {
      this.setState({
        data: [],
        count: 0,
      });
    }
  };
  onSearchData = async () => {
    const res = await getChannelList(1, 20, this.state.inputParam);
    if (res.status === 0) {
      this.setState({
        data: res.data && res.data.list,
        count: parseInt(res.data && res.data.count),
      });
    } else {
      message.info(res.msg || "操作失败");
    }
  };
  addData = () => {
    this.setState({
      isAddDataShow: true,
    });
  };
  edit = async (record) => {
    this.editDataRecord = record;
    this.setState({
      isEditDataShow: true,
    });
  };
  refreshPage = () => {
    this.setState({
      data: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isAddDataShow: false,
      isEditDataShow: false,
    });
    this.getUsers(1, 20);
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <span>
            <Input
              type="text"
              placeholder="请输入支付名称"
              style={{ width: 150 }}
              value={this.state.inputParam}
              onChange={(e) => this.setState({ inputParam: e.target.value })}
            />
            &nbsp; &nbsp;
            <LinkButton onClick={this.onSearchData} size="default">
              <Icon type="search" />
            </LinkButton>
            &nbsp; &nbsp;
            <LinkButton onClick={this.addData} size="default">
              <Icon type="user-add" />
              添加
            </LinkButton>
          </span>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()}>
            <Icon type="reload" />
          </LinkButton>
        }
      >
        <Table
          bordered
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            onChange: (page, pageSize) => {
              // this.getUsers(page, pageSize);
              this.setState({
                pageSize: pageSize,
              });
            },
            onShowSizeChange: (current, size) => {
              this.getUsers(current, size);
            },
          }}
          scroll={{ x: "max-content" }}
        />
        <Modal
          title="添加支付方式"
          visible={this.state.isAddDataShow}
          // onOk={this.handleAddData}
          onCancel={() => {
            this.setState({ isAddDataShow: false });
          }}
          footer={null}
        >
          <WrappedAddDataForm
            cancel={() =>
              this.setState({
                isAddDataShow: false,
              })
            }
            refreshPage={this.refreshPage}
          />
        </Modal>
        {this.state.isEditDataShow && (
          <Modal
            title="编辑"
            visible={this.state.isEditDataShow}
            // onOk={this.handleAddData}
            onCancel={() => {
              this.setState({ isEditDataShow: false });
            }}
            footer={null}
          >
            <WrappedAddDataForm
              isEdit
              editDataRecord={this.editDataRecord}
              cancel={() =>
                this.setState({
                  isEditDataShow: false,
                })
              }
              refreshPage={() => this.getUsers(1, 20)}
            />
          </Modal>
        )}
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "支付名称",
      dataIndex: "name",
    },
    {
      title: "渠道昵称",
      dataIndex: "nick_name",
    },
    {
      title: "单笔-最小限额",
      dataIndex: "min_amount",
    },
    {
      title: "单笔-最大限额",
      dataIndex: "max_amount",
    },
    {
      title: "单笔间隔",
      dataIndex: "seed",
    },
    {
      title: "玩家承担的费率%",
      dataIndex: "rate",
      width: 600,
    },
    {
      title: "固定面值",
      dataIndex: "span_amount",
    },
    {
      title: "支付方式",
      dataIndex: "pay_type",
      render: (text, record, index) => {
        let word;
        switch (text) {
          case "7":
            word = "支付宝H5";
            break;
          case "8":
            word = "支付宝扫码";
            break;
          case "2":
            word = "快捷支付";
            break;
          case "4":
            word = "微信H5";
            break;
          case "5":
            word = "微信扫码";
            break;
          case "1":
            word = "网银支付";
            break;
          case "13":
            word = "银联扫码";
            break;
          case "17":
            word = "转账银行卡";
            break;
          case "18":
            word = "im支付宝代充";
            break;
          case "19":
            word = "im微信代充";
            break;
          case "20":
            word = "im网银代充";
            break;
          case "21":
            word = "im银联扫码代充";
            break;
          case "22":
            word = "uc支付宝2";
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
      title: "状态",
      dataIndex: "status",
      render: (text, record, index) => {
        return <span>{parseInt(text) === 1 ? "开启" : "关闭"}</span>;
      },
    },
    {
      title: "授权品牌",
      dataIndex: "package_ids",
    },
    {
      title: "显示顺序",
      dataIndex: "sort",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: formateDate,
    },
    {
      title: "修改时间",
      dataIndex: "updated_at",
      render: formateDate,
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
        </span>
      ),
    },
  ];
}

export default Channel_list;
