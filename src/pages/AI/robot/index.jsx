import React, { Component } from "react";
import { Card, Table, Input, Select, message, Modal } from "antd";
import LinkButton from "../../../components/link-button/index";
import {
  getAIList,
  reqLoadGold,
  setGameUserNickName,
  changeInternalUserBalance,
} from "../../../api";

class Withdraw_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      minGold: "",
      maxGold: "",
    };
  }
  getUsers = async (page, limit) => {
    const result = await getAIList(page, limit, 5);
    this.setState({
      data: result.data.game_user,
      count: parseInt(result.data && result.data.count),
    });
  };
  onSearchData = async () => {
    let value = {
      [this.filed]: this.input.input.value,
    };
    const result = await getAIList(1, 20, 5, value);
    this.setState({
      data: result.data.game_user,
      count: parseInt(result.count),
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
              onSelect={(value) => (this.filed = value)}
            >
              <Select.Option value="game_nick">昵称</Select.Option>
              <Select.Option value="user_id">user_id</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <Input
              type="text"
              placeholder="请输入关键字"
              style={{ width: 150 }}
              ref={(Input) => (this.input = Input)}
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
        <LinkButton onClick={this.changeGold}>批量增减金币</LinkButton>
        <LinkButton onClick={this.changeNickname}>批量修改昵称</LinkButton>
        <br />
        <Table
          rowSelection={this.rowSelection()}
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
      dataIndex: "id",
    },
    {
      title: "昵称",
      dataIndex: "game_nick",
    },
    {
      title: "账户余额",
      dataIndex: "game_gold",
    },
    {
      title: "实时余额",
      dataIndex: "",
      render: (record) => (
        <span>
          <LinkButton onClick={() => this.check(record)}>查看</LinkButton>
        </span>
      ),
    },
  ];
  rowSelection = () => {
    return {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
      getCheckboxProps: (record) => ({
        // disabled: record.name === "Disabled User", // Column configuration not to be checked
        // name: record.name
      }),
    };
  };
  check = async (record) => {
    const res = await reqLoadGold(record.id);
    message.info(res.data[0].game_gold);
  };
  changeGold = async () => {
    if (!this.selectedRows || !this.selectedRows[0]) {
      message.info("user_id为空，请至少选择1位user_id");
    } else {
      console.log(this.selectedRows);
      Modal.confirm({
        title: "添加金额区间",
        okText: "提交",
        okType: "primary",
        width: "30%",
        onOk: () => {
          let { minGold, maxGold } = this.state;
          if (minGold && maxGold) {
            if (minGold > maxGold) {
              message.info("请确认最大值大于最小值");
            } else {
              this.handleOk(minGold, maxGold);
            }
          } else {
            message.info("请输入有效值");
          }
        },
        content: (
          <div>
            <div>金额区间：</div>
            <Input
              type="text"
              style={{ width: "40%" }}
              placeholder="￥最小值"
              // value={this.state.minGold}
              // onChange={e => {
              //   this.setState({ minGold: e.target.value });
              // }}
              onBlur={(e) => this.setState({ minGold: e.target.value })}
              // ref={Input => (this.minInput = Input)}
            />
            --
            <Input
              type="text"
              style={{ width: "40%" }}
              placeholder="￥最大值"
              onBlur={(e) => this.setState({ maxGold: e.target.value })}
              // ref={Input => (this.maxInput = Input)}
            />
          </div>
        ),
      });
    }
  };
  handleOk = async (minGold, maxGold) => {
    let amount = this.randNum(minGold, maxGold);
    for (let i = 0; i < this.selectedRows.length; i++) {
      let user_id = this.selectedRows[i].id;
      const res = await changeInternalUserBalance(user_id, amount);
      message.info(res.msg);
    }
    this.getUsers(1, 20);
  };
  randNum = (min, max) => {
    min = parseInt(min);
    max = parseInt(max);
    var Range = max - min;
    var Rand = Math.random();
    var num = min + Math.round(Rand * Range); //四舍五入
    return num;
  };
  changeNickname = async () => {
    if (this.selectedRows && this.selectedRows[0]) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        let { id } = this.selectedRows[i];
        let game_nick = "VIP" + this.randNum(100000, 999999);
        const res = await setGameUserNickName(id, game_nick);
        message.info(res.msg);
      }
      this.getUsers(1, 20);
    } else {
      message.info("user_id为空，请至少选择1位user_id");
    }
  };
}

export default Withdraw_list;
