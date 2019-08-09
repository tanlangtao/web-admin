import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  DatePicker,
  Icon,
  Pagination,
  IForm,
  Select,
  Input
} from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api/index";
import UserForm from "./user-form";
import WrappedNormalLoginForm from "././user-nick";

const { RangePicker } = DatePicker;
const { Option } = Select;
function onChange(value) {
  console.log(`selected ${value}`);
}

function onSearch(val) {
  console.log("search:", val);
}
const token = "e3a4305f33519";
export default class User extends Component {
  state = {
    data: [],
    count: 0,
    isNickShow: false,
    game_nick: ""
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
            this.game_nick=record.game_nick
            this.setState({
              isNickShow: true,
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
      width: 150
    },
    {
      title: "所属品牌",
      dataIndex: "package_nick",
      key: "package_nick",
      width: 100
    },
    {
      title: "所属代理",
      dataIndex: "unknow",
      key: "unknow",
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
      dataIndex: "",
      render: user => (
        <span>
          <LinkButton>资金明细</LinkButton>
          <LinkButton>更多</LinkButton>
        </span>
      )
    },
    {
      title: "实时余额",
      dataIndex: "",
      width: 100
    }
  ];
  dataPickerOnChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  dataPickerOnOk = value => {
    console.log("onOk: ", value);
  };
  getUsers = async (token, page, limit) => {
    const result = await reqUsers(token, page, limit);
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      this.setState({
        data: game_user,
        count: result.count
      });
    }
  };
  changeNickName = () => {
    let newNick = this.refs.getFormVlaue; //通过refs属性可以获得对话框内form对象
    newNick.validateFields((err, value) => {
      if (!err) {
        this.setState({ isNickShow: false });
        console.log(value); //这里可以拿到数据
        if(value!==this.game_nick){
          console.log("gaibianle!");
          
        }
      }
    });
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers(token, 1, 20);
  }
  render() {
    const { data, count } = this.state;
    const title = (
      <span>
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          placeholder={["开始日期", "结束日期"]}
          onOk={this.dataPickerOnOk}
        />
        &nbsp; &nbsp;
        <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          onChange={onChange}
          onSearch={onSearch}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option>
        </Select>
        &nbsp; &nbsp;
        <button>
          {" "}
          <Icon type="search" />
        </button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={data}
          columns={this.initColumns()}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultCurrent: 1,
            total: count,
            onChange: (page, pageSize) => {
              this.getUsers(token, page, pageSize);
            }
          }}
          scroll={{ x: 2000, y: 500 }}
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
            ref="getFormVlaue"
            val={this.game_nick}
          />
        </Modal>
      </Card>
    );
  }
}
