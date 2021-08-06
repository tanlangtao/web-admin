import React, { Component } from "react";
import { Progress } from "antd";
import { UnControlled as CodeMirror } from "react-codemirror2";
// import { riskcontrol } from "../api";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/json-lint.js";
import "codemirror/theme/rubyblue.css";

export class MyProgress extends React.Component {
	state = {
		percent : 0,
	};
	handle;
	render() {
		return (
			<Progress
				type="circle"
				strokeColor={{
					"0%"   : "#108ee9",
					"100%" : "#87d068",
				}}
				percent={this.state.percent}
			/>
		);
	}
}
const options = {
	lineNumbers : true, //显示行号
	mode        : { name: "javascript", json: true }, //定义mode
	theme       : "rubyblue", //选中的theme
};
export class CodeEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let conf_val;
		try {
			conf_val = JSON.stringify(JSON.parse(this.props.conf_val), null, 2);
		} catch (error) {
			conf_val = this.props.conf_val;
		}
		console.log(conf_val);
		//使用默认传过来的onChange事件
		const { onChange } = this.props;
		return (
			<div className="json-editor">
				<CodeMirror
					// ref="editor-sql"
					value={conf_val}
					onChange={(editor, data, value) => {
						// console.log(value)
						// try {
						//   return onChange(JSON.stringify(JSON.parse(value)));
						// } catch(err) {
						//   message.info(`${err}`)
						//   return onChange(null)
						// }
						return onChange(value);
					}}
					options={options}
				/>
			</div>
		);
	}
}

// export const Riskcontrol = async ({ user_id }) => {
// 	const fetchData = async () => {
// 		const res = await riskcontrol(user_id);
// 		if (res.status === 0 && res.data) {
// 			// return (
// 			// 	<Descriptions
// 			// 		title={`游戏:${res.data["号码中奖减钱"].name}`}
// 			// 		bordered
// 			// 		size="small"
// 			// 		column={1}
// 			// 	>
// 			// 		<Descriptions.Item label="房间类型">
// 			// 			{data.room_type === 1 ? (
// 			// 				"体验场"
// 			// 			) : data.room_type === 2 ? (
// 			// 				"初级场"
// 			// 			) : data.room_type === 3 ? (
// 			// 				"中级场"
// 			// 			) : data.room_type === 4 ? (
// 			// 				"高级场"
// 			// 			) : (
// 			// 				data.room_type
// 			// 			)}
// 			// 		</Descriptions.Item>
// 			// 		<Descriptions.Item label="底牌">
// 			// 			{reverse_ddz(data.bottom_card)}
// 			// 		</Descriptions.Item>
// 			// 		<Descriptions.Item label="牌面">
// 			// 			{deal_player_info(data.player_info).map((ele, i) => {
// 			// 				return (
// 			// 					<div key={i}>
// 			// 						{ele.player}:{reverse_ddz(ele.info.cards)}
// 			// 					</div>
// 			// 				);
// 			// 			})}
// 			// 		</Descriptions.Item>
// 			// 		<Descriptions.Item label="剩余牌面">
// 			// 			{data.settlement.map((ele, i) => {
// 			// 				return (
// 			// 					<div key={i}>
// 			// 						{ele.PlayerId}:{reverse_ddz(ele.RemainCards)}
// 			// 					</div>
// 			// 				);
// 			// 			})}
// 			// 		</Descriptions.Item>
// 			// 		<Descriptions.Item label="结算信息">
// 			// 			{data.settlement.map((ele, i) => {
// 			// 				return (
// 			// 					<div key={i}>
// 			// 						{ele.PlayerId}:{ele.IsLandlord === 1 ? "是地主" : "不是地主"},{ele.Multiple}倍,输赢金币是{ele.WinLossGold}
// 			// 					</div>
// 			// 				);
// 			// 			})}
// 			// 		</Descriptions.Item>
// 			// 	</Descriptions>
// 			// );
// 		}
// 	};
// };
