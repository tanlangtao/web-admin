import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  DatePicker,
  Icon,
  Select,
  Input,
  LocaleProvider
} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
// import moment from "moment";
import "moment/locale/zh-cn";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
  reqUsers,
  setGameUserNickName,
  searchData,
  reqLoadGold
} from "../../api/index";
import WrappedNormalLoginForm from "././user-nick";

const { RangePicker } = DatePicker;
const { Option } = Select;
export default class User extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    data: [],
    count: 0,
    pageSize: 20,
    isNickShow: false,
    isGoldShow: false,
    game_nick: "",
    startTime: "",
    endTime: "",
    inputParam: {
      key: "id",
      val: ""
    }
  };

  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 150
    },
    {
      title: "昵称",
      dataIndex: "game_nick",
      key: "game_nick",
      fixed: "left",
      width: 150,
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
            this.game_gold = record.game_gold;
            this.id = record.id;
            this.rowIndex = rowIndex;
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
      width: 200
    },
    {
      title: "登陆时间",
      dataIndex: "login_time",
      render: formateDate,
      key: "login_time",
      sorter: (a, b) => a.login_time - b.login_time,
      width: 200
    },
    {
      title: "操作",
      dataIndex: "handle",
      render: record => (
        <span>
          <LinkButton onClick={() => this.getGoldDetail(record)}>
            资金明细
          </LinkButton>
          <LinkButton onClick={() => this.moreDetail(record)}>更多</LinkButton>
        </span>
      )
    },
    {
      title: "实时余额",
      width: 100,
      render: record => (
        <span>
          <LinkButton onClick={() => this.getLoadGold(record)}>查看</LinkButton>
        </span>
      )
    }
  ];

  getUsers = async (page, limit) => {
    const result = await reqUsers(page, limit);
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      game_user.forEach(element => {
        proxy_user.forEach(item => {
          if (element.id === item.id) {
            element.proxy_nick = item.proxy_pid;
          }
        });
      });
      this.setState({
        data: game_user,
        count: result.count
      });
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
  // changeGold=()=>{
  //   //注意这里直接复用了user-nick的模态框，所以取input的值时用value.name
  //   let form = this.refs.getFormValue;
  //   form.validateFields(async (err, value) => {
  //     if (!err) {
  //       this.setState({ isGoldShow: false });
  //       if (value.name !== this.game_gold) {
  //         const result = await setGameUserNickName( this.id, value.name);
  //         console.log(result);
  //         if (result.status === 0) {
  //           message.success("修改成功!");
  //           // 首先拿到索引, 也可以从参数中传递过来
  //           let index = this.rowIndex;
  //           // 然后根据索引修改
  //           this.state.data[index][`game_nick`] = value.name;
  //           // 这个时候并不会更新视图, 需要 setState更新 arr
  //           console.log(this.state.data);
  //           this.setState({
  //             data: this.state.data
  //           });
  //         }
  //       }
  //     }
  //     form.resetFields();
  //   });
  // }
  dataPickerOnChange = (date, dateString) => {
    let startTime = dateString[0] + " 00:00:00";
    let endTime = dateString[1] + " 00:00:00";
    this.setState({
      startTime: startTime,
      endTime: endTime
    });
  };
  handleChange(event) {
    let data = Object.assign({}, this.state.inputParam, {
      val: event.target.value
    });
    this.setState({ inputParam: data });
  }
  onSearchData = async () => {
    const result = await searchData(
      1,
      this.state.pageSize,
      this.state.startTime,
      this.state.endTime,
      this.state.inputParam
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      game_user.forEach(element => {
        proxy_user.forEach(item => {
          if (element.id === item.id) {
            element.proxy_nick = item.proxy_pid;
          }
        });
      });
      this.setState({
        data: game_user,
        count: result.count
      });
    } else {
      message.error("查不到输入的关键字");
    }
  };
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
  getGoldDetail=async record=>{
    // const id = record.id;
    // const result = await reqLoadGold(id);
      // Modal.success({
      //   title: "资金明细",
      //   content: `用户${record.id}实时余额是 : ${result.data[0].game_gold}`
      // });
  }
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    const { data, count } = this.state;
    const title = (
      <span>
        <LocaleProvider locale={zh_CN}>
          <RangePicker
            // defaultValue={[moment().locale("zh-cn")]}
            // showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD"
            placeholder={["开始日期", "结束日期"]}
            onChange={this.dataPickerOnChange}
          />
        </LocaleProvider>
        &nbsp; &nbsp;
        <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          defaultValue="id"
          onChange={val => {
            let data = Object.assign({}, this.state.inputParam, { key: val });
            this.setState(
              {
                inputParam: data
              },
              () => {
                console.log(this.state);
              }
            );
          }}
        >
          <Option value="id">user_id</Option>
          <Option value="game_nick">昵称</Option>
          <Option value="phone_number">手机号</Option>
          <Option value="role_name">账号</Option>
          <Option value="proxy_nick">所属代理</Option>
          <Option value="package_nick">所属品牌</Option>
        </Select>
        &nbsp; &nbsp;
        <Input
          type="text"
          placeholder="请输入关键字搜索"
          style={{ width: 150 }}
          value={this.state.inputParam.val}
          onChange={this.handleChange}
        />
        &nbsp; &nbsp;
        <button onClick={this.onSearchData}>
          <Icon type="search" />
        </button>
      </span>
    );
    const extra = (
      <button onClick={() => this.getUsers(1, 20)}>
        <Icon type="reload" />
      </button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            total: count,
            onChange: (page, pageSize) => {
              this.getUsers(page, pageSize);
              this.setState({
                pageSize: pageSize
              });
            }
          }}
          scroll={{ x: 2000, y: 550 }}
        />
        <Modal
          title="修改昵称"
          visible={this.state.isNickShow}
          onOk={this.changeNickName}
          onCancel={() => {
            this.setState({ isNickShow: false });
          }}
        >
          <WrappedNormalLoginForm ref="getFormValue" val={this.game_nick} />
        </Modal>
        {/* <Modal
          title="修改金额"
          visible={this.state.isGoldShow}
          onOk={this.changeGold}
          onCancel={() => {
            this.setState({ isGoldShow: false });
          }}
        >
          <WrappedNormalLoginForm ref="getFormValue" val={this.game_gold} />
        </Modal> */}
      </Card>
    );
  }
}
