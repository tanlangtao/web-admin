import React, { Component } from "react";
import { Card, Table, Input, Select, message } from "antd";
import LinkButton from "../../../components/link-button/index";
import { getAIList, reqLoadGold } from "../../../api";

class Withdraw_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0
    };
  }
  getUsers = async (page, limit) => {
    const result = await getAIList(page, limit, 5);
    this.setState({
      data: result.data.game_user,
      count: parseInt(result.count)
    });
  };
  onSearchData = async () => {
    let value = {
      [this.filed]: this.input.input.value
    };
    const result = await getAIList(1, 20, 5, value);
    this.setState({
      data: result.data.game_user,
      count: parseInt(result.count)
    });
  };
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Select
              placeholder="请选择"
              style={{ width: 150 }}
              onSelect={value => (this.filed = value)}
            >
              <Select.Option value="game_nick">昵称</Select.Option>
              <Select.Option value="user_id">user_id</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <Input
              type="text"
              placeholder="请输入关键字"
              style={{ width: 150 }}
              ref={Input => (this.input = Input)}
            />
          </div>
        }
        extra={
          <span>
            <LinkButton
              style={{ float: "right" }}
              onClick={() => {
                window.location.reload();
              }}
              icon="reload"
              size="default"
            />
          </span>
        }
      >
        <Table
          bordered
          size="small"
          rowKey="id"
          dataSource={this.state.data}
          columns={this.initColumns()}
        />
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "user_id",
      dataIndex: "id"
    },
    {
      title: "昵称",
      dataIndex: "game_nick"
    },
    {
      title: "账户余额",
      dataIndex: "game_gold"
    },
    {
      title: "实时余额",
      dataIndex: "",
      render: record => (
        <span>
          <LinkButton onClick={() => this.check(record)}>查看</LinkButton>
        </span>
      )
    }
  ];
  check = async record => {
    const res = await reqLoadGold(record.id);
    message.info(res.data[0].game_gold);
  };
}

export default Withdraw_list;
