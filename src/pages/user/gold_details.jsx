import React, { Component } from "react";
import { Table, Card, Icon, message, Modal,Descriptions } from "antd";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import {
	userDetail,
	bindInfo,
	reqCancelAccount,
	GoldDetailorRiskControlSUMdata,
} from "../../api/index";
import { formateDate } from "../../utils/dateUtils";
import ExportJsonExcel from "js-export-excel";
import GoldDetailorRiskControl from "../../components/golddetailorRiskcontrol";

class GoldDetail extends Component {
	constructor(props) {
		super(props);
		this.startTime = "";
		this.endTime = "";
		this.state = {
			data: [],
			count: 0,
			sumData: null,
			current: 1,
			printData: [],
		};
	}
	getUsers = async (page, limit) => {
		let isBindInfo = this.props.isBindInfo;
		let id = this.props.recordID;
		const res = !isBindInfo
			? await userDetail(page, limit, id)
			: await bindInfo(page, limit, id);
		if (!isBindInfo && res.data.account_change) {
			this.setState({
				data: res.data.account_change,
				count: res.data.count,
			});
		}
		if (isBindInfo && res.data) {
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
			});
		}else if(isBindInfo){
			this.setState({
				data: [],
			});
		}

		//资金明细总计部分的数据
		if (!isBindInfo) {
			const result = await GoldDetailorRiskControlSUMdata(id);
			if (result.status === 0) {
				this.setState({ sumData: result.data });
			}
		}
	};
	componentDidMount() {
		this.getUsers(1, 50);
	}
	onSearchData = async (page, limit) => {
		this.isOnSearch = true;
		let reqData = {
			start: this.startTime,
			end: this.endTime,
			funds_type: 0,
		};
		let id = this.props.recordID;
		const res = await userDetail(page, limit, id, reqData);
		if (res.data) {
			this.setState({
				data: res.data.account_change || [],
				count: res.data.count,
			});
		} else {
			message.info(JSON.stringify(res));
			this.isOnSearch = false;
		}
	};
	onSearchSumData = async () => {
		const result = await GoldDetailorRiskControlSUMdata(
			this.props.recordID,
			this.startTime,
			this.endTime,
		);
		if (result.status === 0) {
			this.setState({ sumData: result.data });
		} else {
			message.info("搜索流水总数据失败");
		}
	};

	download = async () => {
		let reqdata = {
			start: this.startTime,
			end: this.endTime,
			funds_type: 0,
		};
		let id = this.props.recordID;

		let totalPage = Math.ceil(this.state.count / 20000);
		let proArr = []

		if (totalPage > 1) {
			let _printData = []

			for (let i = 1; i <= totalPage; i++) {
				let p = new Promise((resolve, reject) => {
					userDetail(i, 20000, id, reqdata).then(res => {
						if (res.status === 0) {
							let data = res.data.account_change
							_printData = _printData.concat(data)
						} else {
							message.info(res.msg || `请求失败，失败頁數:${i}`)
						}
						resolve()
					}).catch(err => {
						console.log(err)
						reject()
					})
				})
				proArr.push(p)
			}
			await Promise.all(proArr).then(res => {
				let sortData = _printData.sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
				this.setState({
					printData: sortData || [],
				});
			})
		} else {
			const res = await userDetail(1, 20000, id, reqdata);
			if (res.data) {
				this.setState({
					printData: res.data.account_change || [],
				});
			} else {
				message.info(JSON.stringify(res));
			}
		}

		var option = {};
		let dataTable = [];
		this.state.printData &&
			this.state.printData.forEach((ele) => {
				let obj = {
					user_id: ele.id,
					产生来源: ele.pay_account_name,
					'余额(变动前)': ele.balance + ele.banker_balance,
					变动金额: ele.final_pay,
					税收: ele.final_pay > 0 ? ele.tax.toFixed(6) : "",
					'余额(变动后)': ele.final_banker_balance + ele.final_balance,
					备注: ele.pay_reason,
					创建时间: formateDate(ele.create_time),
					有效投注: ele.bet_money,
				};
				dataTable.push(obj);
			});
		let current = moment().format('YYYYMMDDHHmm')
		option.fileName = `资金明细${current}`;
		option.datas = [
			{
				sheetData: dataTable,
				sheetName: "sheet",
				sheetHeader: ["user_id", "产生来源", "余额(变动前)", "变动金额", "税收", "余额(变动后)", "备注", "创建时间", "有效投注"],
			},
		];

		var toExcel = new ExportJsonExcel(option); //new
		toExcel.saveExcel();

	};

	render() {
		let title;
		let { data, count, current, sumData } = this.state;
		
		let getItem=()=>{
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
				console.log(zfb)
				return <Descriptions bordered size="small" column={1}>
					<Descriptions.Item label="支付宝"><LinkButton size="small" disabled={!zfb && true } onClick={() => this.reset(zfb, "2")}>解绑支付宝</LinkButton></Descriptions.Item>
					<Descriptions.Item label="支付宝姓名">{zfb && zfb.account_name}</Descriptions.Item>
            		<Descriptions.Item label="支付宝账号">{zfb && zfb.account_card}</Descriptions.Item>
					<Descriptions.Item label="银行卡"><LinkButton size="small" disabled={!yhk && true } onClick={() => this.reset(yhk, "3")}>解绑银行卡</LinkButton></Descriptions.Item>
					<Descriptions.Item label="银行名称" >{yhk && yhk.bank_name}</Descriptions.Item>
					<Descriptions.Item label="银行卡号">{yhk && yhk.card_num}</Descriptions.Item>
					<Descriptions.Item label="银行开户人">{yhk && yhk.card_name}</Descriptions.Item>
					<Descriptions.Item label="USDT-TRC20"><LinkButton size="small" disabled={!trc && true } onClick={() => this.reset(trc, "5")}>解绑USDT-TRC20</LinkButton></Descriptions.Item>
					<Descriptions.Item label="USDT链类型" >{trc&&trc.protocol}</Descriptions.Item>
					<Descriptions.Item label="USDT钱包地址">{trc&&trc.wallet_addr}</Descriptions.Item>
					<Descriptions.Item label="USDT-ERC20"><LinkButton size="small" disabled={!erc && true } onClick={() => this.reset(erc, "4")}>解绑USDT-ERC20</LinkButton></Descriptions.Item>
					<Descriptions.Item label="USDT链类型" >{erc&&erc.protocol}</Descriptions.Item>
					<Descriptions.Item label="USDT钱包地址">{erc&&erc.wallet_addr}</Descriptions.Item>
				</Descriptions>
			}
			
		}
		if (!this.props.isBindInfo) {
			title = (
				<span>
					<MyDatePicker
						handleValue={(data, val) => {
							let diffDays = moment(val[1]).diff(moment(val[0]), "days");
							let start, end;
							if (diffDays > 31) {
								message.info("请选择时间范围不大于31天");
							} else if (data && data.length !== 0) {
								start = moment(data[0].valueOf()).format("YYYY-MM-DD HH:mm:ss");
								end = moment(data[1].valueOf() - 1).format("YYYY-MM-DD HH:mm:ss");
								console.log(start, end);
								this.startTime = start;
								this.endTime = end;	
							} else {
								this.startTime = "";
								this.endTime = "";
							}
						}}
					/>
					&nbsp; &nbsp;
					<LinkButton
						onClick={() => {
							this.onSearchData(1, 50);
							this.onSearchSumData();
							this.setState({ current: 1 });
						}}
						size="default"
					>
						<Icon type="search" />
					</LinkButton>
				</span>
			);
		}
		
		return (
			<Card
				title={title}
				extra={
					!this.props.isBindInfo ? (
						<LinkButton
							size="default"
							style={{ float: "right" }}
							onClick={this.download}
							icon="download"
						/>
					) : (
						""
					)
				}
			>
				{this.props.isBindInfo && (
					getItem()
				)}
				{!this.props.isBindInfo && (
					<GoldDetailorRiskControl
						goldDetailData={{ data, count, current, sumData }}
						tableOnchange={(page, pageSize) => {
							this.setState({ current: page });
							if (this.isOnSearch && this.startTime) {
								this.onSearchData(page, pageSize);
							} else {
								this.getUsers(page, pageSize);
							}
						}}
					/>
				)}
			</Card>
		);
	}
	reset = (record, type) => {
		let self = this
		if (record.type !== type) {
			message.info("没有绑定信息");
		} else {
			let id = parseInt(record.id);
			let modal = Modal
			modal.confirm({
				title: "信息",
				content: "确定要解绑吗?",
				async onOk() {
					const res = await reqCancelAccount(id);
					if (res.status == 0) {
						message.success(res.msg);
						self.getUsers(1,20)
						modal.destroyAll()
					} else {
						message.info(res.msg);
					}
				},
			});
		}
	};
}

export default GoldDetail;
