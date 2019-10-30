import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Select,
  Input,
  Popconfirm,
  Button
} from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
  reqUsers,
  setGameUserNickName,
  changeGold,
  reqLoadGold,
  userDetail,
  bindInfo,
  saveUserBlack,
  createTask,
  setCustomer
} from "../../api/index";
import WrappedNormalLoginForm from "././user-nick";
import WrappedComponent from "./gold_details";
import MyDatePicker from "../../components/MyDatePicker";

const { Option } = Select;
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      pageSize: 20,
      isNickShow: false,
      isGoldShow: false,
      isGoldDetailShow: false,
      isBindInfoShow: false,
      isResetPwdShow: false,
      resetpwd: "",
      game_nick: "",
      startTime: "",
      endTime: "",
      loading: false
    };
    this.inputKey = "id";
    this.inputValue = "";
  }

  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 100
    },
    {
      title: "昵称",
      dataIndex: "game_nick",
      key: "game_nick",
      fixed: "left",
      width: 100,
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            this.game_nick = record.game_nick;
            this.id = record.id;
            this.rowIndex = rowIndex;
            this.setState({
              isNickShow: true
            });
          }, // 点击行
          onDoubleClick: event => {},
          onContextMenu: event => {},
          onMouseEnter: event => {
            event.target.style.cursor = "pointer";
          }, // 鼠标移入行
          onMouseLeave: event => {}
        };
      }
    },

    {
      title: "账户余额",
      dataIndex: "game_gold",
      key: "game_gold",
      sorter: (a, b) => a.game_gold - b.game_gold,
      width: 150,
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            this.goldRecord = record;
            this.setState({
              isGoldShow: true
            });
          }, // 点击行
          onDoubleClick: event => {},
          onContextMenu: event => {},
          onMouseEnter: event => {
            event.target.style.cursor = "pointer";
          }, // 鼠标移入行
          onMouseLeave: event => {}
        };
      }
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick",
      key: "package_nick",
      width: 100
    },
    {
      title: "所属代理",
      dataIndex: "proxy_nick",
      key: "proxy_nick",
      width: 150
    },
    {
      title: "手机",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150
    },
    {
      title: "账号",
      dataIndex: "role_name",
      key: "role_name",
      width: 100
    },
    {
      title: "注册IP",
      dataIndex: "regin_ip",
      key: "regin_ip",
      width: 150
    },
    {
      title: "注册时间",
      dataIndex: "regin_time",
      render: formateDate,
      key: "regin_time",
      sorter: (a, b) => a.regin_time - b.regin_time,
      width: 200
    },
    {
      title: "登录IP",
      dataIndex: "login_ip",
      key: "login_ip",
      width: 150
    },
    {
      title: "登陆时间",
      dataIndex: "login_time",
      render: formateDate,
      sorter: (a, b) => a.login_time - b.login_time,
      width: 200
    },
    {
      title: "操作",
      dataIndex: "",
      width: 200,
      render: record => (
        <span>
          <LinkButton onClick={() => this.getGoldDetail(record)} type="default">
            资金明细
          </LinkButton>
          <LinkButton onClick={() => this.getMoreDetail(record)}>
            更多
          </LinkButton>
        </span>
      )
    },
    {
      title: "实时余额",
      width: 100,
      render: record => (
        <span>
          <LinkButton type="default" onClick={() => this.getLoadGold(record)}>
            查看
          </LinkButton>
        </span>
      )
    },
    {
      title: "是否为客服账号",
      dataIndex: "game_user_type",
      render: (text, record, index) => (
        <span>{parseInt(text) === 4 ? "是" : ""}</span>
      )
    }
  ];

  getUsers = async (page, limit) => {
    const result = await reqUsers(
      page,
      limit,
      this.state.startTime,
      this.state.endTime,
      this.inputKey,
      this.inputValue
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      game_user.forEach(element => {
        proxy_user.forEach(item => {
          if (element.id === item.id) {
            element.proxy_nick = item.proxy_pid;
            // element.proxy_user_type = item.proxy_user_type;
          }
        });
      });
      this.setState({
        data: game_user,
        count: result.count
      });
    } else {
      message.error(result.msg + "接口异常,未检索到数据");
    }
  };
  changeNickName = () => {
    let form = this.refs.getFormValue; //通过refs属性可以获得对话框内form对象
    form.validateFields(async (err, value) => {
      if (!err) {
        this.setState({ isNickShow: false });
        if (value.name !== this.game_nick) {
          const result = await setGameUserNickName(this.id, value.name);
          if (result.status === 0) {
            message.success("修改成功!");
            // 首先拿到索引, 也可以从参数中传递过来
            let index = this.rowIndex;
            // 然后根据索引修改
            this.state.data[index][`game_nick`] = value.name;
            // 这个时候并不会更新视图, 需要 setState更新 arr
            this.setState({
              data: this.state.data
            });
          }
        }
      }
      form.resetFields();
    });
  };
  changeGold = () => {
    this.setState({ loading: true });
    //这里直接复用了user-nick的模态框，所以取input的值时用value.name
    let form = this.refs.getFormValue;
    let goldRecord = this.goldRecord;
    form.validateFields(async (err, value) => {
      const res = await changeGold(goldRecord, value);
      if (res.status === 0) {
        message.success(res.msg);
        this.setState({ isGoldShow: false, loading: false });
      } else {
        this.setState({ loading: false });
        message.error(res.msg);
      }
      form.resetFields();
    });
  };
  handleChange(event) {
    let data = Object.assign({}, this.state.inputParam, {
      val: event.target.value
    });
    this.setState({ inputParam: data });
  }
  getLoadGold = async record => {
    const id = record.id;
    const result = await reqLoadGold(id);
    if (result.status === 0) {
      Modal.success({
        title: "实时余额",
        content: `用户${record.id}实时余额是 : ${result.data[0].game_gold}`
      });
    }
  };
  getGoldDetail = async (record, isBindInfo) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.isBindInfo = isBindInfo;
    this.GoldDetailRecord = {
      data: [],
      count: 0,
      id: record.id
    };
    const res = !isBindInfo
      ? await userDetail(1, 20, record.id)
      : await bindInfo(1, 20, record.id);
    if (res.status === 0) {
      this.GoldDetailRecord.data = res.data;
      this.GoldDetailRecord.count = res.count;
    }
    this.setState({ isGoldDetailShow: true });
  };
  saveUserBlack = async (record, isAdd) => {
    let action = isAdd ? "add" : "remove";
    const res = await saveUserBlack(record.id, action);
    if (res.status === 0) {
      message.success("操作成功！");
    } else {
      message.success("操作失败:" + res.msg);
    }
  };
  resetPwd = record => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isResetPwdShow: true });
    this.resetPwdId = record.id;
  };
  handleResetpwd = async () => {
    const res = await createTask(this.resetPwdId, this.state.resetpwd);
    if (res.status === 0) {
      message.success("操作成功！");
      this.setState({ resetpwd: "", isResetPwdShow: false });
    } else {
      message.success("操作失败:" + res.msg);
    }
  };
  getMoreDetail = record => {
    this.moreModal = Modal.info({
      title: "更多",
      okText: "关闭",
      width: "50%",
      content: (
        <div>
          <LinkButton
            onClick={() => this.getGoldDetail(record, true)}
            size="small"
          >
            查看绑定信息
          </LinkButton>
          <Popconfirm
            title="交易所黑名单"
            onConfirm={() => this.saveUserBlack(record, true)}
            onCancel={() => this.saveUserBlack(record, false)}
            okText="添加"
            cancelText="移除"
          >
            <LinkButton size="small">交易所黑名单</LinkButton>
          </Popconfirm>
          <LinkButton onClick={() => this.resetPwd(record)} size="small">
            重置密码
          </LinkButton>
          <Popconfirm
            title="确定要设置为客户账号吗？"
            onConfirm={() => this.setCustomerAccount(record)}
            okText="确定"
            cancelText="取消"
          >
            <LinkButton size="small">设置客户账号</LinkButton>
          </Popconfirm>
        </div>
      )
    });
  };
  setCustomerAccount = async record => {
    let id = record.id;
    const res = await setCustomer(id);
    if (res.status === 0) {
      message.success(res.msg + "操作成功");
    } else {
      message.error(res.msg + "操作失败");
    }
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    const { data, count } = this.state;
    const title = (
      <span>
        <MyDatePicker
          handleValue={val => {
            this.setState({
              startTime: val[0],
              endTime: val[1]
            });
          }}
        />
        &nbsp; &nbsp;
        <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          defaultValue="id"
          onChange={val => {
            this.inputKey = val;
          }}
        >
          <Option value="id">user_id</Option>
          <Option value="game_nick">昵称</Option>
          <Option value="phone_number">手机号</Option>
          <Option value="role_name">账号</Option>
          <Option value="proxy_nick">所属代理</Option>
          <Option value="package_nick">所属品牌</Option>
          <Option value="regin_ip">注册IP</Option>
        </Select>
        &nbsp; &nbsp;
        <Input
          type="text"
          placeholder="请输入关键字搜索"
          style={{ width: 150 }}
          ref={Input => (this.input = Input)}
        />
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => {
            this.inputValue = this.input.input.value;
            this.getUsers(1, this.state.pageSize);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
      </span>
    );
    const extra = (
      <LinkButton
        onClick={() => {
          window.location.reload();
        }}
        size="default"
      >
        <Icon type="reload" />
      </LinkButton>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              this.getUsers(current, size);
            }
          }}
          scroll={{ x: 2000, y: "65vh" }}
        />
        <Modal
          title="修改昵称"
          visible={this.state.isNickShow}
          onOk={this.changeNickName}
          onCancel={() => {
            this.setState({ isNickShow: false });
          }}
        >
          <WrappedNormalLoginForm
            ref="getFormValue"
            val={this.game_nick}
            isNickModal
          />
        </Modal>
        <Modal
          title="修改金额"
          visible={this.state.isGoldShow}
          // onOk={this.changeGold}
          onCancel={() => {
            this.setState({ isGoldShow: false });
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({ isGoldShow: false });
              }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.changeGold}
            >
              确定
            </Button>
          ]}
        >
          <WrappedNormalLoginForm
            ref="getFormValue"
            goldRecord={this.goldRecord}
          />
        </Modal>
        <Modal
          title={this.isBindInfo ? "查看绑定信息" : "资金明细"}
          visible={this.state.isGoldDetailShow}
          onCancel={() => {
            this.setState({ isGoldDetailShow: false });
          }}
          footer={null}
          width="80%"
        >
          <WrappedComponent
            GoldDetailRecord={this.GoldDetailRecord}
            isBindInfo={this.isBindInfo}
          />
        </Modal>
        <Modal
          title="重置密码"
          visible={this.state.isResetPwdShow}
          onOk={this.handleResetpwd}
          onCancel={() => {
            this.setState({ isResetPwdShow: false });
          }}
        >
          <span>重置密码</span>
          <Input
            value={this.state.resetpwd}
            onChange={e => this.setState({ resetpwd: e.target.value })}
          />
        </Modal>
      </Card>
    );
  }
}
