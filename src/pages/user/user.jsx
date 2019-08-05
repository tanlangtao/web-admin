import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  DatePicker,
  Select,
  Icon
} from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api/index";
import UserForm from "./user-form";

const { RangePicker } = DatePicker;
const { Option } = Select;
function onChange(value) {
  console.log(`selected ${value}`);
}

function onSearch(val) {
  console.log("search:", val);
}
export default class User extends Component {
  state = {
    data: []
  };

  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "昵称",
      dataIndex: "game_nick",
      key: "game_nick"
    },

    {
      title: "账户余额",
      dataIndex: "game_gold",
      key: "game_gold",
      sorter: (a, b) => a.game_gold - b.game_gold
    },
    {
      title: "所属品牌",
      dataIndex: "unknown",
      key: "unknown"
    },
    {
      title: "所属代理",
      dataIndex: "proxy_user_id",
      key: "proxy_user_id"
    },
    {
      title: "手机",
      dataIndex: "phone_number",
      key: "phone_number"
    },
    {
      title: "账号",
      dataIndex: "role_name",
      key: "role_name"
    },
    {
      title: "注册时间",
      dataIndex: "regin_time",
      key: "regin_time"
    },
    {
      title: "登录IP",
      dataIndex: "login_ip",
      key: "login_ip"
    },
    {
      title: "登陆时间",
      dataIndex: "login_time",
      key: "login_time"
    },
    {
      title: "操作",
      dataIndex: "",
      render: user => (
        <span>
          <LinkButton>修改</LinkButton>
          <LinkButton>删除</LinkButton>
        </span>
      )
    },
    {
      title: "实时余额",
      dataIndex: ""
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
      const { game_user } = result.data;
      this.setState({
        data: game_user
      });
    }
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers("a7b69040250a5", 1, 20);
  }
  render() {
    const { data } = this.state;
    console.log(data);
    const title = (
      <span>
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          placeholder={["开始日期", "结束日期"]}
          // onChange={this.dataPickerOnChange}
          // onOk={this.dataPickerOnOk}
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
          pagination={{ defaultPageSize: 20 }}
        />
      </Card>
    );
  }
}
