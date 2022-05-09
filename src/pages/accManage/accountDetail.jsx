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
    reqUsers
} from "../../api/index";
const init_state = {
    current:1,
    pageSize:20,
    count:1,
    id:427223993, // id先写死
    loading:false,
    game_user_data :{},
    proxy_user_data :{}
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
            loading:false
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
                game_user_data:game_user[0],
                proxy_user_data:proxy_user[0],
            })            
        }
    }
    bindBankCard(){
        //绑定银行卡
    }
    bindAlipay(){
        //绑定支付宝
    }
    componentDidMount(){
        this.getBindInfo(1, 20);
        this.getUsers(1,20)
    }
    render(){
        const { data, game_user_data, proxy_user_data } = this.state;
    
        let getItem = ()=>{
            if(data){
                console.log("data",data)
                return <div>
                    <Descriptions bordered size = "small" column= {1}>
                        <Descriptions.Item label="用户ID">{game_user_data.id}</Descriptions.Item>
                        <Descriptions.Item label="上级ID">{proxy_user_data.proxy_pid}</Descriptions.Item>
                        <Descriptions.Item label="账号">{}</Descriptions.Item>
                        <Descriptions.Item label="密码">{}</Descriptions.Item>
                        <Descriptions.Item label="手机号码">{game_user_data.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="支付宝姓名">
                            { data[0].account_card && data[0].account_card != "" ?data[0].account_card :<LinkButton  type="default" onClick={() => this.bindAlipay()}>绑定支付宝</LinkButton> }
                        </Descriptions.Item>
                        <Descriptions.Item label="支付宝账号">{data[0].account_name && data[0].account_name }</Descriptions.Item>
                        <Descriptions.Item label="银行名称" >
                            { data[0].bank_name != "" ?data[0].bank_name :<LinkButton  type="default" onClick={() => this.bindBankCard()}>绑定银行卡</LinkButton> }
                        </Descriptions.Item>
                        <Descriptions.Item label="银行卡账号">{data[0].card_num}</Descriptions.Item>
                        <Descriptions.Item label="银行卡开户人">{data[0].card_name}</Descriptions.Item>
                        <Descriptions.Item label="直属推广人数">{}</Descriptions.Item>
                        <Descriptions.Item label="直属玩家人数 ">{}</Descriptions.Item>
                    </Descriptions>
                </div>
            } 
        }
    return  <Card  >
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
    </Card>
    }
}
