import React, {Component} from "react";

import { Table, message, Card, Icon } from "antd";
import _, { conforms } from "lodash-es";

import MyDatePicker from "../../components/MyDatePicker";
import { getriskcontrol } from "../../api";
import { reverseNumber } from "../../utils/commonFuntion";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
const initColumns = [
        {
            title: "游戏名称",
            dataIndex: "name",
            align: 'center',
        },
        {
            title: "盈利局数",
            dataIndex: "winround",
            align: 'center',
        },
        {
            title: "盈利金额",
            dataIndex: "wingold",
            align: 'center',
            render: reverseNumber,
        },
        {
            title: "亏损局数",
            dataIndex: "loseround",
            align: 'center',
        },

        {
            title: "亏损金额",
            dataIndex: "losegold",
            align: 'center',
            render: reverseNumber,
        },

        // {
        //     title: "总局数",
        //     dataIndex: "",
        //     render: (text, record) => (record.winround || 0) + (record.loseround || 0),
        // },
        {
            title: "总盈亏",
            dataIndex: "",
            align: 'center',
            render: (text, record) => reverseNumber((record.wingold || 0) + (record.losegold || 0)),
        },
    ];
    
class PopUserGameData extends Component {
	constructor(props) {
		super(props);
		this.state = {
            recordID:"",
            current:{
                start_time:"",
                end_time:"",
            },
            table_data:[],
            other_data:{}
		};
    }
    componentDidMount(){
        //默认显示一个月数据
        let start_time = moment().startOf("day").subtract(1, "month")._d.getTime() /1000
        let end_time = parseInt(moment().endOf("day")._d.getTime() /1000)
        this.setState({
            recordID : this.props.recordID,
            current:{
                start_time,
                end_time
            }
        },()=>{
            this.onSearchButtonHandled()
        })
    }
    onSearchButtonHandled = async (value) => {
        let { start_time, end_time } = this.state.current;
        console.log(start_time,end_time)
        if (!start_time || !end_time) {
            message.info("请选择时间范围");
            return;
        }
        const res = await getriskcontrol({
            user_id: this.state.recordID,
            start_time,
            end_time,
            action: 1,
        });
        if (res.status === 0 && res.data) {
            let riskData = [],
                // sumround = 0,
                sumgold = 0,
                sumincome = 0;
            _.forEach(res.data, (value, key) => {
                if (_.has(value, "game_id") && key !== "Proxy") {
                    riskData.push(value);
                } else if (_.has(value, "totalgold")) {
                    // extraData.push({ name: key, totalgold: value.totalgold });
                    value.totalgold = reverseNumber(value.totalgold);
                }
            });
            _.forEach(riskData, (value) => {
                // sumround += (value.winround || 0) + (value.loseround || 0);
                sumgold += (value.wingold || 0) + (Math.abs(value.losegold) || 0);
                sumincome += (value.wingold || 0) + (value.losegold || 0);
            });
            let charge = [
                res.data["人工充值订单增加金币"]?.totalgold,
                res.data["人工充值订单补单增加金币"]?.totalgold,
                res.data["银行卡充值增加金币"]?.totalgold,
                res.data["银行卡充值订单补单增加金币"]?.totalgold,
                res.data["渠道充值增加金币"]?.totalgold,
                res.data["渠道充值订单补单增加金币"]?.totalgold,
                res.data["极速支付2增加金币"]?.totalgold,
                res.data["匹配充值增加金币"]?.totalgold,
            ];
            var afterdeal_charge = _.compact(charge);
            let sumcharge = _.sumBy(afterdeal_charge, _.toNumber);

            this.setState({
                table_data:riskData
            })
            // for (const key in res.data) {
            //     res.data[key].totalgold = reverseNumber(ele.totalgold);
            // }
            this.setState({
                other_data:{
                    sumgold: reverseNumber(sumgold),
                    sumcharge: reverseNumber(sumcharge),
                    sumincome: reverseNumber(sumincome),
                    ...res.data,
                }
            })
        } else {
            message.info(res.msg || JSON.stringify(res));
        }
    };
    render(){
        return (
            <Card
                title={
                    <div>
                        <MyDatePicker
                            handleValue={(date, val) => {
                                let diffDays = moment(val[1]).diff(moment(val[0]), "days");
                                if (diffDays > 31) {
                                    message.info("请选择时间范围不大于31天");
                                } else if (date && date.length !== 0) {
                                    this.setState({
                                        current:{
                                            start_time:date[0].valueOf() / 1000,
                                            end_time:Math.ceil(date[1].valueOf() / 1000) - 1
                                        }
                                    })
                                } else {
                                    this.setState({
                                        current:{
                                            start_time:"",
                                            end_time:""
                                        }
                                    })
                                }
                            }}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <LinkButton
                            onClick={() => this.onSearchButtonHandled(this.state.recordID)}
                            size="default"
                            >
                            <Icon type="search" />
                        </LinkButton>
                    </div>
                }
            >
                <Table
                    bordered
                    rowKey={(record, index) => `${index}`}
                    dataSource={this.state.table_data}
                    columns={initColumns}
                    size="small"
                    pagination={false}
                />
            </Card>
        );
    }
}
export default PopUserGameData;