import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Descriptions,
  Select
} from "antd";
import Mytable from "../../components/MyTable";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import CreditDetail from "../payManage/creditDetail";
import GoldDetail from "../payManage/goldDetail";
import {getCities,getBankName}  from "../../utils/commonFuntion";
import {
  bindInfo,
  reqUsers,
  reqSaveAccount,
  getCreditUserlist
} from "../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 1,
  loading: false,
  game_user_data: {},
  proxy_user_data: {},
  isShowBindBankModel: false,
  isShowBindAlipayModel: false,
  isShowBindUsdtTrcModel: false,
  isShowBindUsdtErcModel: false,
  isShowCreditDetail: false,
  isShowGoldDetail: false,
  card_name: "",
  card_num: "",
  bank_name: "选择开户行",
  bank_province: "选择开户省",
  bank_city: "选择开户市",
  branch_name: "",
  account_card: "",
  account_name: "",
  wallet_addr_erc: "",
  wallet_addr_trc: "",
  user_balance: 0,
  bankProvinceData:[],
  bankNameData:[],
  provinces:[],
  cities:[],
};
export default class AccountDetail extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }
  getBindInfo = async (page, limit) => {
    if(this.props.role_id == 1){
      return 
    }
    this.setState({
      card_name: "",
      card_num: "",
      bank_name: "选择开户行",
      bank_province: "选择开户省",
      bank_city: "选择开户市",
      branch_name: "",
      account_card: "",
      account_name: "",
      wallet_addr_erc: "",
      wallet_addr_trc: "",
      loading: true,
    })
    const res = await bindInfo(
      page,
      limit,
      this.props.admin_user_id
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
    } else {
      this.setState({
        data: [],
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
      this.props.admin_user_id
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      this.setState({
        game_user_data: game_user[0],
        proxy_user_data: proxy_user[0],
      })
    }
  }
  //获取当前玩家信息
  reqGetCreditUserlist = async (page, limit) => {
    const result = await getCreditUserlist(
      this.props.package_id,
      this.props.admin_user_id,
      page,
      limit,
    );
    if (result.status === 0) {
      this.setState({
        user_balance: result.data.lists.length>0 && result.data.lists[0].user_balance
      })
    } else {
      message.info(result.msg || "未检索到数据");
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
    if (this.state.card_num == "" || this.state.card_name == "" ||
      this.state.bank_name == "选择开户行" || this.state.branch_name == "" ||
      this.state.bank_province == "选择开户省" || this.state.bank_city == "选择开户市") {
      return message.info("银行卡信息不能为空！")
    }
    //绑定银行卡
    let info = JSON.stringify({
      card_num: this.state.card_num,
      card_name: this.state.card_name,
      bank_name: this.state.bank_name,
      branch_name: this.state.branch_name,
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
        package_id: this.props.package_id
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error(result.msg)
    }
    this.setState({
      isShowBindBankModel: false
    })
  }
  bindAlipay = async () => {
    if (this.state.account_card == "" || this.state.account_name == "") {
      return message.info("支付宝账号姓名不能为空！")
    }
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
        package_id: this.props.package_id
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error(result.msg)
    }
    this.setState({
      isShowBindAlipayModel: false
    })
  }
  bindUsdtErc = async () => {
    if (this.state.wallet_addr_erc == "") {
      return message.info("地址不能为空！")
    }
    let info = JSON.stringify({
      wallet_addr: this.state.wallet_addr_erc,
      protocol: "ERC20"
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
        package_id: this.props.package_id
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error(result.msg)
    }
    this.setState({
      isShowBindUsdtErcModel: false
    })
  }
  bindUsdtTrc = async () => {
    if (this.state.wallet_addr_trc == "") {
      return message.info("地址不能为空！")
    }
    let info = JSON.stringify({
      wallet_addr: this.state.wallet_addr_trc,
      protocol: "TRC20"
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
        package_id: this.props.package_id
      }
    )
    if (result.status === 0) {
      message.success("操作成功！")
      this.getBindInfo(1, 20);
    } else {
      message.error(result.msg)
    }
    this.setState({
      isShowBindUsdtTrcModel: false
    })
  }
  componentDidMount() {
    this.getBindInfo(1, 20);
    this.getUsers(1, 20)
    this.reqGetCreditUserlist(1, 20)
    let data = getCities()
    let provinces = []
    for(var k in data){
      provinces.push(k)
    } 
    this.setState({
      provinces,
      bankProvinceData:data,
      bankNameData:getBankName()
    })
  }
  render() {
    let { data, game_user_data } = this.state;
    if(JSON.stringify(game_user_data) == "{}" || game_user_data == undefined){
      game_user_data = {
        id:"",
        proxy_user_id:"",
        phone_number:""
      }
    }
    let getItem = () => {
      if (data) {
        let zfb, yhk, trc, erc = null
        data.forEach(e => {
          if (e.type == 3) {
            yhk = e
          } else if (e.type == 4) {
            erc = e
          } else if (e.type == 5) {
            trc = e
          } else if (e.type == 2) {
            zfb = e
          }
        })

        return <div>
          <LinkButton
            style={{ float: "right" }}
            onClick={() => {
              this.setState(init_state, () => {
                this.getUsers(1, 20);
                this.getBindInfo(1, 20);
                this.reqGetCreditUserlist(1, 20);
                let data = getCities()
                let provinces = []
                for(var k in data){
                  provinces.push(k)
                } 
                this.setState({
                  provinces,
                  bankProvinceData:data,
                  bankNameData:getBankName()
                })
              });
            }}
            icon="reload"
            size="default"
          />
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="用户ID">{game_user_data.id}</Descriptions.Item>
            <Descriptions.Item label="上级ID">{game_user_data.proxy_user_id}</Descriptions.Item>
            <Descriptions.Item label="账号">{this.props.account}</Descriptions.Item>
            <Descriptions.Item label="密码">******</Descriptions.Item>
            <Descriptions.Item label="账号余额">{this.state.user_balance} 
              &nbsp;&nbsp;
              <LinkButton onClick={() => this.setState({ isShowCreditDetail: true })}>信用明细</LinkButton>
              &nbsp;&nbsp;
              <LinkButton onClick={() => this.setState({ isShowGoldDetail: true })}>充提明细</LinkButton>
            </Descriptions.Item>
            <Descriptions.Item label="手机号码">{game_user_data.phone_number}</Descriptions.Item>
            <Descriptions.Item label="支付宝"><LinkButton size="small" disabled={zfb && true} onClick={() => this.showBindAlipayModel()}>绑定支付宝</LinkButton></Descriptions.Item>
            <Descriptions.Item label="支付宝姓名">{zfb && zfb.account_name}</Descriptions.Item>
            <Descriptions.Item label="支付宝账号">{zfb && zfb.account_card}</Descriptions.Item>
            <Descriptions.Item label="银行卡"><LinkButton size="small" disabled={yhk && true} onClick={() => this.showBindBankModel()}>绑定银行卡</LinkButton></Descriptions.Item>
            <Descriptions.Item label="银行名称" >{yhk && yhk.bank_name}</Descriptions.Item>
            <Descriptions.Item label="银行卡号">{yhk && yhk.card_num}</Descriptions.Item>
            <Descriptions.Item label="银行开户人">{yhk && yhk.card_name}</Descriptions.Item>
            <Descriptions.Item label="USDT-TRC20"><LinkButton size="small" disabled={trc && true} onClick={() => this.showBindUsdtTrcModel()}>绑定USDT-TRC20</LinkButton></Descriptions.Item>
            <Descriptions.Item label="USDT链类型" >{trc && trc.protocol}</Descriptions.Item>
            <Descriptions.Item label="USDT钱包地址">{trc && trc.wallet_addr}</Descriptions.Item>
            <Descriptions.Item label="USDT-ERC20"><LinkButton size="small" disabled={erc && true} onClick={() => this.showBindUsdtErcModel()}>绑定USDT-ERC20</LinkButton></Descriptions.Item>
            <Descriptions.Item label="USDT链类型" >{erc && erc.protocol}</Descriptions.Item>
            <Descriptions.Item label="USDT钱包地址">{erc && erc.wallet_addr}</Descriptions.Item>
            {/* <Descriptions.Item label="直属推广人数">{}</Descriptions.Item>
            <Descriptions.Item label="直属玩家人数 ">{}</Descriptions.Item> */}
          </Descriptions>
        </div>
      }
    }
    return <Card  >
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
          <li style={{display:"flex"}} >&nbsp;开户人姓名:
            &nbsp; &nbsp;
            <Input
              placeholder="输入开户人姓名"
              value={this.state.card_name}
              style={{ width: 200 }}
              onChange={(e) => this.setState({ card_name: e.target.value })}
            />
          </li>
          &nbsp; 
          <li>&nbsp;开户行: 
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
            style={{ width: 200 }}
            placeholder="选择开户行"
            value={this.state.bank_name}
            onChange={(val) => {
              this.setState({ bank_name: val});
            }}
          >
            {
              this.state.bankNameData.map((e,index)=>{
                return <Option value={e} key ={index}>{e}</Option>
              })
            }
          </Select>
          </li>
          &nbsp; 
          <li style={{display:"flex"}}>&nbsp;银行卡号: 
            &nbsp; &nbsp; &nbsp;&nbsp;
            <Input
              placeholder="输入银行卡号"
              value={this.state.card_num}
              style={{ width: 200 }}
              onChange={(e) => this.setState({ card_num: e.target.value })}
            />
          </li>
          &nbsp; 
          <li>&nbsp;开户省: 
            &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 200 }}
              placeholder="选择开户省"
              value={this.state.bank_province}
              onChange={(val) => {
                this.setState({ bank_province: val,cities:this.state.bankProvinceData[val],bank_city:"选择开户市"});
              }}
            >
              {
                this.state.provinces.map((e,index)=>{
                  return <Option value={e} key ={index}>{e}</Option>
                })
              }
            </Select>
            &nbsp; &nbsp; 
          </li>
          &nbsp; 
          <li>&nbsp;开户市:
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 200 }}
              placeholder="选择开户市"
              value={this.state.bank_city}
              onChange={(val) => {
                this.setState({ bank_city: val });
              }}
            >
              {
                this.state.cities.map((e,index)=>{
                  return <Option value={e} key ={index} >{e}</Option>
                })
              }
            </Select>
            &nbsp; &nbsp;
          </li>
          &nbsp;
          <li style={{display:"flex"}}>&nbsp;开户支行:
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            <Input
              placeholder="输入开户支行"
              style={{width:200}}
              value={this.state.branch_name}
              onChange={(e) => this.setState({ branch_name: e.target.value })}
            />
          </li>
          

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
          <li>&nbsp;支付宝姓名:</li>
          <Input
            placeholder="输入支付宝姓名"
            value={this.state.account_name}
            onChange={(e) => this.setState({ account_name: e.target.value })}
          />
          <li>&nbsp;支付宝账号:</li>
          <Input
            placeholder="输入支付宝账号"
            value={this.state.account_card}
            onChange={(e) => this.setState({ account_card: e.target.value })}
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
          <li>&nbsp;USDT-TRC20钱包地址:</li>
          <Input
            placeholder="输入USDT-TRC20钱包地址"
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
          <li>&nbsp;USDT-TRC20钱包地址:</li>
          <Input
            placeholder="输入USDT-ERC20钱包地址"
            value={this.state.wallet_addr_erc}
            onChange={(e) => this.setState({ wallet_addr_erc: e.target.value })}
          />

        </Modal>
      )}
      {this.state.isShowCreditDetail && (
        <Modal
          title={`信用明细 ${this.props.admin_user_id}`}
          visible={this.state.isShowCreditDetail}
          onCancel={() => {
            this.setState({ isShowCreditDetail: false });
          }}
          footer={null}
          width="85%"
          maskClosable={false}
          style={{ top: 10 }}
        >
          <CreditDetail user_id={this.props.admin_user_id}></CreditDetail>
        </Modal>
      )}
      {this.state.isShowGoldDetail && (
        <Modal
            title={`充提明细 ${this.props.admin_user_id}`}
            visible={this.state.isShowGoldDetail}
            onCancel={() => {
                this.setState({ isShowGoldDetail: false });
            }}
            footer={null}
            width="85%"
            maskClosable={false}
            style={{ top: 10 }}
        >
            <GoldDetail user_id = {this.props.admin_user_id}></GoldDetail>
        </Modal>
      )}
    </Card>
  }
}
