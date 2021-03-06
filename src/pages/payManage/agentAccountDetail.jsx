import React, { Component } from "react";
import {
  Card,
  Descriptions,
} from "antd";
import { formateDate } from "../../utils/dateUtils";
import {
  bindInfo,
} from "../../api/index";
const init_state = {
  current: 1,
  pageSize: 20,
  count: 1,
  id:0,
  loading: false,
};
export default class AgentAccountDetail extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
    this.recordID = this.props.recordID
  }
  getBindInfo = async (page, limit) => {
    this.setState({ loading: true });
    const res = await bindInfo(
      page,
      limit,
      this.recordID
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
  componentDidMount() {
    this.getBindInfo(1, 20);
  }
  render() {
    const { data, game_user_data } = this.state;
    let getItem=()=>{
			if(data){
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
				console.log(zfb,yhk,trc,erc)
				return <Descriptions bordered size="small" column={1}>
					<Descriptions.Item label="?????????">{!zfb && "?????????"}</Descriptions.Item>
					<Descriptions.Item label="???????????????">{zfb && zfb.account_name}</Descriptions.Item>
					<Descriptions.Item label="???????????????">{zfb && zfb.account_card}</Descriptions.Item>
					<Descriptions.Item label="?????????">{!yhk && "?????????"}</Descriptions.Item>
					<Descriptions.Item label="????????????" >{yhk && yhk.bank_name}</Descriptions.Item>
					<Descriptions.Item label="????????????">{yhk && yhk.card_num}</Descriptions.Item>
					<Descriptions.Item label="???????????????">{yhk && yhk.card_name}</Descriptions.Item>
					<Descriptions.Item label="USDT-TRC20">{!trc && "?????????"}</Descriptions.Item>
					<Descriptions.Item label="USDT?????????" >{trc&&trc.protocol}</Descriptions.Item>
					<Descriptions.Item label="USDT????????????">{trc&&trc.wallet_addr}</Descriptions.Item>
					<Descriptions.Item label="USDT-ERC20">{!erc && "?????????"}</Descriptions.Item>
					<Descriptions.Item label="USDT?????????" >{erc&&erc.protocol}</Descriptions.Item>
					<Descriptions.Item label="USDT????????????">{erc&&erc.wallet_addr}</Descriptions.Item>
				</Descriptions>
      }
    }
    return <Card  >
      {
        getItem()
      }
    </Card>
  }
}
