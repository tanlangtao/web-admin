import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Descriptions,
} from "antd";
import Mytable from "../../components/MyTable";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
  bindInfo,
  reqUsers,
  reqSaveAccount
} from "../../api/index";
const init_state = {
  current: 1,
  pageSize: 20,
  count: 1,
  id: 793309415, // id先写死
  loading: false,
  game_user_data: {},
  proxy_user_data: {},
  isShowBindBankModel: false,
  isShowBindAlipayModel: false,
  isShowBindUsdtTrcModel: false,
  isShowBindUsdtErcModel: false,
  card_name:"",
  card_num:"",
  bank_name:"",
  bank_province:"",
  bank_city:"",
  branch_name:"",
  account_card:"",
  account_name:"",
  wallet_addr_erc:"",
  wallet_addr_trc:"",
};
export default class AccountDetail extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "用户ID",
      dataIndex: "",
      key: "",
      fixed: "left",
      align: 'center',
    },
    {
      title: "上级ID",
      dataIndex: "",
      key: "",
      fixed: "left",
      align: 'center',
    },
    {
      title: "账号",
      dataIndex: "top_up",
      key: "top_up",
      align: 'center',
      // width: 150,
    },
    {
      title: "密码",
      dataIndex: "withdraw",
      key: "withdraw",
      align: 'center',
      // width: 100,
    },
    {
      title: "手机号码",
      dataIndex: "",
      key: "",
      align: 'center',
      width: 100,
    },
    {
      title: "支付宝姓名",
      dataIndex: "account_name",
      key: "account_name",
      align: 'center',
      width: 100,
    },
    {
      title: "支付宝账号",
      dataIndex: "account_card",
      key: "account_card",
      align: 'center',
      width: 120,
    },
    {
      title: "银行名称",
      dataIndex: "bank_name",
      key: "bank_name",
      align: 'center',
      // width: 150,
    },
    {
      title: "银行卡账号",
      dataIndex: "card_num",
      key: "card_num",
      align: 'center',
      // width: 150,
    },
    {
      title: "银行卡开户人",
      dataIndex: "card_name",
      key: "card_name",
      align: 'center',
    },
    {
      title: "操作",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => (
        <span>
          <LinkButton type="default" onClick={() => this.reset(record, "2")}>
            绑定支付宝
            </LinkButton>
          <LinkButton type="default" onClick={() => this.reset(record, "3")}>
            绑定银行卡
            </LinkButton>
        </span>
      ),
    },
  ];
  getBindInfo = async (page, limit) => {
    this.setState({ loading: true });
    const res = await bindInfo(
      page,
      limit,
      this.state.id
    );
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log(data);
      let newData = [];
      data.forEach((ele, i) => {
        if (ele.type === "2") {
          newData.push({
            ...data[i],
            ...JSON.parse(data[i].info),
            alipay_created_at: formateDate(data[i].created_at),
          });
        }
        if (ele.type === "3") {
          newData.push({
            ...data[i],
            ...JSON.parse(data[i].info),
            bankcard_created_at: formateDate(data[i].created_at),
          });
        }
        if (ele.type === "4") {
          newData.push({
            ...data[i],
            ...JSON.parse(data[i].info),
          });
        }
        if (ele.type === "5") {
          newData.push({
            ...data[i],
            ...JSON.parse(data[i].info),
          });
        }
      });
      console.log("newData:", newData);
      this.setState({
        data: newData,
        loading: false
      });
    }
  };
  //获取当前玩家信息
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqUsers(
      page,
      limit,
      "",
      "",
      "id",
      this.state.id
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      this.setState({
        game_user_data: game_user[0],
        proxy_user_data: proxy_user[0],
      })
    }
  }
  showBindBankModel() {
    this.setState({
      isShowBindBankModel: true
    })
  }
  showBindAlipayModel() {
    this.setState({
      isShowBindAlipayModel: true
    })
  }
  showBindUsdtErcModel() {
    this.setState({
      isShowBindUsdtErcModel: true
    })
  }
  showBindUsdtTrcModel() {
    this.setState({
      isShowBindUsdtTrcModel: true
    })
  }
  bindBankCard = async () => {
    //绑定银行卡
    let info = JSON.stringify({
      card_num: this.state.card_num,
      card_name: this.state.card_name,
      bank_name: this.state.bank_name,
      branch_name: this.stat.branch_name,
      bank_province: this.state.bank_province,
      bank_city: this.state.bank_city,
    });
    const { game_user_data } = this.state
    const result = await reqSaveAccount(
      {
        user_id: game_user_data.id,
        user_name: game_user_data.game_nick,
        proxy_user_id: game_user_data.proxy_user_id,
        proxy_name: game_user_data.proxy_user_id,
        info: info,
        action: "add",
        type: 3,
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error("操作失败！")
    }
    this.setState({
      isShowBindBankModel:false
    })
  }
  bindAlipay = async () => {
    //绑定支付宝
    let info = JSON.stringify({
      account_card: this.state.account_card,
      account_name: this.state.account_name,
    });
    const { game_user_data } = this.state
    const result = await reqSaveAccount(
      {
        user_id: game_user_data.id,
        user_name: game_user_data.game_nick,
        proxy_user_id: game_user_data.proxy_user_id,
        proxy_name: game_user_data.proxy_user_id,
        info: info,
        action: "add",
        type: 2,
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error("操作失败！")
    }
    this.setState({
      isShowBindAlipayModel:false
    })
  }
  bindUsdtErc = async ()=>{
    let info = JSON.stringify({
      wallet_addr: this.state.wallet_addr_erc,
      protocol:"ERC20"
    });
    const { game_user_data } = this.state
    const result = await reqSaveAccount(
      {
        user_id: game_user_data.id,
        user_name: game_user_data.game_nick,
        proxy_user_id: game_user_data.proxy_user_id,
        proxy_name: game_user_data.proxy_user_id,
        info: info,
        action: "add",
        type: 4,
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error("操作失败！")
    }
    this.setState({
      isShowBindUsdtErcModel:false
    })
  }
  bindUsdtTrc = async ()=>{
    let info = JSON.stringify({
      wallet_addr: this.state.wallet_addr_trc,
      protocol:"TRC20"
    });
    const { game_user_data } = this.state
    const result = await reqSaveAccount(
      {
        user_id: game_user_data.id,
        user_name: game_user_data.game_nick,
        proxy_user_id: game_user_data.proxy_user_id,
        proxy_name: game_user_data.proxy_user_id,
        info: info,
        action: "add",
        type: 5,
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error("操作失败！")
    }
    this.setState({
      isShowBindUsdtTrcModel:false
    })
  }
  componentDidMount() {
    this.getBindInfo(1, 20);
    this.getUsers(1, 20)
  }
  render() {
    const { data, game_user_data, proxy_user_data } = this.state;
    let getItem = () => {
      if (data) {
        let zfb,yhk,trc,erc = null
        data.forEach(e=>{
          if(e.type == 3){
            yhk = e
          }else if(e.type == 4){
            erc = e
          }else if(e.type == 5){
            trc = e
          }else if(e.type == 2){
            zfb = e
          }
        })
        return <div>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="用户ID">{game_user_data.id}</Descriptions.Item>
            <Descriptions.Item label="上级ID">{game_user_data.proxy_user_id}</Descriptions.Item>
            <Descriptions.Item label="账号">{}</Descriptions.Item>
            <Descriptions.Item label="密码">{}</Descriptions.Item>
            <Descriptions.Item label="手机号码">{game_user_data.phone_number}</Descriptions.Item>
            <Descriptions.Item label="支付宝"><LinkButton size="small" disabled={zfb && true } onClick={() => this.showBindAlipayModel()}>绑定支付宝</LinkButton></Descriptions.Item>
            <Descriptions.Item label="支付宝姓名">{zfb && zfb.account_name}</Descriptions.Item>
            <Descriptions.Item label="支付宝账号">{zfb && zfb.account_card}</Descriptions.Item>
            <Descriptions.Item label="银行卡"><LinkButton size="small" disabled={yhk && true } onClick={() => this.showBindBankModel()}>绑定银行卡</LinkButton></Descriptions.Item>
            <Descriptions.Item label="银行名称" >{yhk && yhk.bank_name}</Descriptions.Item>
            <Descriptions.Item label="银行卡号">{yhk && yhk.card_num}</Descriptions.Item>
            <Descriptions.Item label="银行开户人">{yhk && yhk.card_name}</Descriptions.Item>
            <Descriptions.Item label="USDT-TRC20"><LinkButton size="small" disabled={trc &&true } onClick={() => this.showBindUsdtTrcModel()}>绑定USDT-TRC20</LinkButton></Descriptions.Item>
            <Descriptions.Item label="USDT链类型" >{trc && trc.protocol}</Descriptions.Item>
            <Descriptions.Item label="USDT钱包地址">{trc && trc.wallet_addr}</Descriptions.Item>
            <Descriptions.Item label="USDT-ERC20"><LinkButton size="small" disabled={erc && true } onClick={() => this.showBindUsdtErcModel()}>绑定USDT-ERC20</LinkButton></Descriptions.Item>
            <Descriptions.Item label="USDT链类型" >{erc && erc.protocol}</Descriptions.Item>
            <Descriptions.Item label="USDT钱包地址">{erc && erc.wallet_addr}</Descriptions.Item>
            {/* <Descriptions.Item label="直属推广人数">{}</Descriptions.Item>
            <Descriptions.Item label="直属玩家人数 ">{}</Descriptions.Item> */}
          </Descriptions>
        </div>
      }
    }
    return <Card  >
      {/* <Mytable
                    tableData={{
                        data,
                        count,
                        columns: this.initColumns(),
                        x: "max-content",
                        // y: "65vh",
                        current,
                        pageSize,
                        loading,
                    }}
                /> */}
      {
        getItem()
      }
      {this.state.isShowBindBankModel && (
        <Modal
          title="绑定银行卡"
          visible={this.state.isShowBindBankModel}
          onOk={this.bindBankCard}
          onCancel={() => {
            this.setState({ isShowBindBankModel: false });
          }}
        >
          <Input
            placeholder = "输入开户人姓名"
            value={this.state.card_name}
            onChange={(e) => this.setState({ card_name: e.target.value })}
          />
          <Input
            placeholder = "输入银行卡号"
            value={this.state.card_num}
            onChange={(e) => this.setState({ card_num: e.target.value })}
          />
          <Input
            placeholder = "输入开户省"
            value={this.state.bank_province}
            onChange={(e) => this.setState({ bank_province: e.target.value })}
          />
           <Input
            placeholder = "输入开户市"
            value={this.state.bank_city}
            onChange={(e) => this.setState({ bank_city: e.target.value })}
          />
          <Input
            placeholder = "输入开户行"
            value={this.state.bank_name}
            onChange={(e) => this.setState({ bank_name: e.target.value })}
          />
          <Input
            placeholder = "输入开户支行"
            value={this.state.branch_name}
            onChange={(e) => this.setState({ branch_name: e.target.value })}
          />

        </Modal>
      )}
      {this.state.isShowBindAlipayModel && (
        <Modal
          title="绑定支付宝"
          visible={this.state.isShowBindAlipayModel}
          onOk={this.bindAlipay}
          onCancel={() => {
            this.setState({ isShowBindAlipayModel: false });
          }}
        >
          <Input
            placeholder = "输入支付宝姓名"
            value={this.state.card_name}
            onChange={(e) => this.setState({ card_name: e.target.value })}
          />
          <Input
            placeholder = "输入支付宝账号"
            value={this.state.card_num}
            onChange={(e) => this.setState({ card_num: e.target.value })}
          />

        </Modal>
      )}
      {this.state.isShowBindUsdtTrcModel && (
        <Modal
          title="绑定USDT-TRC20"
          visible={this.state.isShowBindUsdtTrcModel}
          onOk={this.bindUsdtTrc}
          onCancel={() => {
            this.setState({ isShowBindUsdtTrcModel: false });
          }}
        >
          <Input
            placeholder = "输入USDT-TRC20钱包地址"
            value={this.state.wallet_addr_trc}
            onChange={(e) => this.setState({ wallet_addr_trc: e.target.value })}
          />

        </Modal>
      )}
      {this.state.isShowBindUsdtErcModel && (
        <Modal
          title="绑定USDT-ERC20"
          visible={this.state.isShowBindUsdtErcModel}
          onOk={this.bindUsdtErc}
          onCancel={() => {
            this.setState({ isShowBindUsdtErcModel: false });
          }}
        >
          <Input
            placeholder = "输入USDT-ERC20钱包地址"
            value={this.state.wallet_addr_erc}
            onChange={(e) => this.setState({ wallet_addr_erc: e.target.value })}
          />

        </Modal>
      )}
    </Card>
  }
}
