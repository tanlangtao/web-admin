import React, { Component } from "react";
import { Card, Table, Modal, message, Icon, Input } from "antd";
import LinkButton from "../../../components/link-button/index";
import { getChannelList, getRuleList } from "../../../api/index";
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
      isEditDataShow: false
    };
    this.initColumns();
  }
  getUsers = async (page, limit) => {
    const result = await getChannelList(page, limit);
    if (result.data) {
      this.setState({
        data: result.data,
        count: parseInt(result.count)
      });
    }
  };
  onSearchData = async () => {
    const res = await getChannelList(1, 20, this.state.inputParam);
    if (res.status === 0) {
      this.setState({
        data: res.data,
        count: parseInt(res.count)
      });
    } else {
      message.error(res.msg || "操作失败");
    }
  };
  addData = () => {
    this.setState({
      isAddDataShow: true
    });
  };
  edit = async record => {
    this.editDataRecord = record;
    this.setState({
      isEditDataShow: true
    });
  };
  refreshPage = () => {
    this.setState({
      data: [],
      count: 0,
      pageSize: 20,
      inputParam: "",
      isAddDataShow: false,
      isEditDataShow: false
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
              onChange={e => this.setState({ inputParam: e.target.value })}
            />
            &nbsp; &nbsp;
            <LinkButton onClick={this.onSearchData}>
              <Icon type="search" />
            </LinkButton>
            &nbsp; &nbsp;
            <LinkButton onClick={this.addData}>
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
              this.getUsers(page, pageSize);
              this.setState({
                pageSize: pageSize
              });
            },
            onShowSizeChange: (current, size) => {
              this.getUsers(current, size);
            }
          }}
          scroll={{ x: 1900, y: "60vh" }}
        />
        <Modal
          title="添加角色"
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
                isAddDataShow: false
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
                  isEditDataShow: false
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
      width: 80
    },
    {
      title: "支付名称",
      dataIndex: "name",
      width: 120
    },
    {
      title: "渠道昵称",
      dataIndex: "nick_name",
      width: 100
    },
    {
      title: "单笔-最小限额",
      dataIndex: "min_amount",
      width: 120
    },
    {
      title: "单笔-最大限额",
      dataIndex: "max_amount",
      width: 120
    },
    {
      title: "单笔间隔",
      dataIndex: "seed",
      width: 100
    },
    {
      title: "玩家承担的费率%",
      dataIndex: "rate",
      width: 150
    },
    {
      title: "固定面值",
      dataIndex: "span_amount",
      width: 250
    },
    {
      title: "支付方式",
      dataIndex: "pay_type",
      width: 100,
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
          default:
            word = "";
            break;
        }
        return <span>{word}</span>;
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 80,
      render: (text, record, index) => {
        return <span>{text === "1" ? "开启" : "关闭"}</span>;
      }
    },
    {
      title: "显示顺序",
      width: 100,
      dataIndex: "sort"
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 200,
      render: formateDate
    },
    {
      title: "修改时间",
      dataIndex: "updated_at",
      width: 200,
      render: formateDate
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <LinkButton onClick={() => this.edit(record)}>编辑</LinkButton>
        </span>
      )
    }
  ];
}

export default Channel_list;
