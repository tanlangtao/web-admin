import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Select,
} from "antd";
import Mytable from "../../components/MyTable";
import MyDatePickers from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button/index";
import moment from "moment";
import { formateDate } from "../../utils/dateUtils";
import {
  reqUsers,
  getProxyUserInductionsSortByGameTag

} from "../../api/index";

const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  loading: false,
  data: [],
  inputValue: "",
  MyDatePickerValue: null,
};
export default class TeamdataQuery extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  initColumns = () => [
    {
      title: "游戏类型",
      dataIndex: "game_tag",
      render: (text, record) => {
        switch (text) {
          case 1:
            return "棋牌类型"
          case 2:
            return "彩票类型"
          case 3:
            return "体育类型"
          case 4:
            return "视讯类型"
          case 5:
            return "电子类型"
          default:
            return
        }
      },

      align: 'center',
    },
    {
      title: "玩家总赢",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.win_total * 100) / 100);
      },

    },
    {
      title: "玩家总输",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.lose_total * 100) / 100);
      },
    },
    {
      title: "有效投注",
      dataIndex: "",
      key: "",
      align: 'center',
      render: (text, record) => {
        return (Math.round(record.bet_total * 100) / 100);
      },
    },
    // {
    //   title: "有效投注记录条数",
    //   dataIndex: "bet_times",
    //   key: "bet_times",
    //   align: 'center',
    //   // width: 100,
    // },

    // {
    //   title: "统计类型",
    //         dataIndex: "base_dividend_type",
    //         render: (text, record) => {
    //             switch (text) {
    //                 case 1:
    //                     return "输赢流水"
    //                 case 2:
    //                     return "有效投注"
    //                 default:
    //                     return
    //             }
    //         },
    //   align: 'center',
    // },
    // {
    //   title: "折扣比例",
    //   dataIndex: "base_dividend_discount",
    //   render: (text, record) => {
    //       if (text) {
    //           return text + "%"
    //       }
    //   },
    //   align: 'center',
    // },
  ];
  getUsers = async () => {
    this.setState({ loading: true });
    // account_name   传 当前登录账号对应的 ID


    // ids   这个是一个数组， 但是传的值就是  对应查询玩家的ID

    // start_time               // 开始时间， 时间戳

    // end_time     // 结束时间， 时间戳

    // game_tags   这个是游戏类型数组， 固定 传 1，2，3，4，5

    // 操作人员点击   团队业绩查询，  ， 弹出二级界面

    // 显示这个 玩家  团队业绩数据（ 进来点击时默认查询当日数据显示）

    // 然后查询区间 只能查 时间区间为  15天的数据
    // console.log('this.props====',this.props);
    let reqData = {
      start_time: this.state.startTime,
      end_time: this.state.endTime,
      account_name: `${this.props.admin_id}`,
      ids: `[${this.props.user_id.user_id}]`,
      game_tags: `[1,2,3,4,5]`
    }


    const result = await getProxyUserInductionsSortByGameTag(
      reqData
    );
    if (result.status === "SUCCESS") {
      let a = this.props.user_id.user_id
      console.log('result.msg[0]==', result.msg[a]);
      this.setState({
        data: result.msg[a],
        // count: result.data && result.data.total,
        loading: false,
      });
    } else {
      message.info("未检索到数据");
    }
  };
  componentDidMount() {
    //默认查询15天数据
    let start = moment().startOf("day").subtract(0, 'days').valueOf(); //15天前
    let end = moment().startOf("day").subtract(-1, "day").subtract(1, "seconds").valueOf();

    this.setState({
      startTime: start / 1000,//.format("YYYY-MM-DD HH:mm:ss"),
      endTime: end / 1000//.format("YYYY-MM-DD HH:mm:ss"),

    }, () => {
      this.getUsers()
    })
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    const title = (
      <span>
        <MyDatePickers
          // handleValue={(data, val) => {
          //   let diffDays = moment(val[1]).diff(moment(val[0]), "days");
          //   let start, end;
          //   if (diffDays > 31) {
          //     message.info("请选择时间范围不大于31天");
          //   } else if (data && data.length !== 0) {
          //     start = moment(data[0].valueOf()).format("YYYY-MM-DD HH:mm:ss");
          //     end = moment(data[1].valueOf() - 1).format("YYYY-MM-DD HH:mm:ss");
          //     console.log(start, end);
          //     this.startTime = start;
          //     this.endTime = end;	
          //   } else {
          //     this.startTime = "";
          //     this.endTime = "";
          //   }
          // }}
          handleValue={(data, dateString) => {
            let diffDays = moment(dateString[1]).diff(moment(dateString[0]), "days");
            if (diffDays > 31) {
              message.info("请选择时间范围不大于31天");
            } else if (data && data.length !== 0) {
              this.setState({
                startTime: moment(dateString[0]).valueOf() / 1000,
                endTime: moment(dateString[1]).valueOf() / 1000,
                MyDatePickerValue: data,
              });
            } else {
              this.startTime = "";
              this.endTime = "";
            }

          }}
          value={this.state.MyDatePickerValue}
        />
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => {

            this.getUsers(1);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
        <li style={{ color: 'red', display: 'inline' }}>*仅限查询31天内数据*</li>
      </span>
    );
    //<Card title={title}>
    return <Card title={title}>
      <Mytable
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
        paginationOnchange={(page, limit) => {
          this.getUsers(page, limit);
        }}
        setPagination={(current, pageSize) => {
          if (pageSize) {
            this.setState({ current, pageSize });
          } else {
            this.setState({ current });
          }
        }}
      />
    </Card>
  }
}
