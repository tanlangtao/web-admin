import React from "react";

import { Table, Modal, message, Descriptions } from "antd";
import { find } from "lodash-es";

import { reqGameData, reqDuofuduocaiGameData } from "../api";
import { formateDate } from "../utils/dateUtils";
import {
  reverseNumber,
  reverseDecimal,
  reversePercent,
} from "../utils/commonFuntion";
import LinkButton from "./link-button";
import { gameRouter } from "../utils/public_variable";
import "../css/gamedata.css";

let new_gameRouter1 = {
  ...gameRouter,
  "5b1f3a3cb76a591e7f251729": { path: "/castcraft/api", name: "城堡争霸" },
};
export default function GoldDetailorRiskControl({
  goldDetailData,
  tableOnchange,
  tableOnShowSizeChange,
}) {
  // console.log('goldDetailData', goldDetailData);
  const { data, count, current, sumData } = goldDetailData;
  if (sumData) {
    var {
      total_payment_arrival_amount,
      total_with_draw_amount,
      all_statement_total,
      all_bet_total,
    } = sumData;
  }
  let paginationConfig = {
    defaultPageSize: 50,
    // showSizeChanger: true,
    showQuickJumper: true,
    // pageSizeOptions: ["10", "20", "30", "50"],
    showTotal: (total, range) => `共${total}条`,
    total: count,
    onChange: tableOnchange,
    // onShowSizeChange: tableOnShowSizeChange
  };
  if (current) {
    paginationConfig.current = current;
  } else {
    paginationConfig.defaultCurrent = 1;
  }
  return (
    <div>
      <div style={{ fontSize: 16, backgroundColor: "#ddd" }}>
        &nbsp;&nbsp;玩家总充值：
        {reverseNumber(total_payment_arrival_amount) || 0}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;玩家总兑换：
        {reverseNumber(total_with_draw_amount) || 0}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;充值兑换差：
        {reverseNumber(total_payment_arrival_amount - total_with_draw_amount) ||
          0}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总流水：
        {reverseNumber(all_statement_total) || 0}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有效投注：
        {reverseNumber(all_bet_total) || 0}
      </div>
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        size="small"
        pagination={paginationConfig}
        scroll={{ x: "max-content" }}
        // footer={footerData}
      />
    </div>
  );
}
//百家乐
const reverse_poker = (pokers) => {
  let str = "";
  pokers.forEach((ele) => {
    switch (ele.poker_design) {
      case 1:
        str += "红";
        break;
      case 2:
        str += "黑";
        break;
      case 3:
        str += "梅";
        break;
      case 4:
        str += "方";
        break;
      default:
        break;
    }
    switch (ele.poker_value) {
      case 1:
        str += "A";
        break;
      case 11:
        str += "J";
        break;
      case 12:
        str += "Q";
        break;
      case 13:
        str += "K";
        break;
      default:
        str += ele.poker_value;
        break;
    }
    str += "\xa0\xa0\xa0\xa0";
  });
  return str;
};
//红黑和奔驰宝马
const reverse = (pokers, isarray = true) => {
  let str = "";
  let arr = [];
  if (!isarray) {
    arr = [pokers];
  } else {
    arr = pokers;
  }
  console.log(pokers, arr);
  arr.forEach((ele) => {
    switch (Math.ceil(ele / 13)) {
      case 1:
        str += "方";
        break;
      case 2:
        str += "梅";
        break;
      case 3:
        str += "红";
        break;
      case 4:
        str += "黑";
        break;
      default:
        break;
    }
    switch (ele % 13) {
      case 1:
        str += "A";
        break;
      case 11:
        str += "J";
        break;
      case 12:
        str += "Q";
        break;
      case 0:
        str += "K";
        break;
      default:
        str += ele % 13;
        break;
    }
    str += "\xa0\xa0\xa0\xa0";
  });
  return str;
};

async function check_game_data(record) {
  let { pay_account_id, id, round_id } = record;
  let str;
  let modal_width = "50%";
  for (const key in new_gameRouter1) {
    if (key === pay_account_id) {
      str = new_gameRouter1[key].path;
    }
  }
  if (!str) {
    message.info("暂无游戏数据");
    return;
  }
  let newstr, res;
  if (pay_account_id === "5b1f3a3cb76a591e7f251731") {
    newstr = `/duofuduocai/api/getGamePlayerData?game_id=${record.pay_account_id}&round_id=${round_id}`;
    res = await reqDuofuduocaiGameData(newstr);
  } else {
    newstr = `${str}/getGameData?game_id=${record.pay_account_id}&id=${id}&round_id=${round_id}`;
    res = await reqGameData(newstr);
  }
  if (res.code === 0) {
    let reactnode, data;
    if (res.data && res.data.list) {
      data = res.data.list[0];
    }
    try {
      switch (pay_account_id) {
        case "5b1f3a3cb76a591e7f251732": //梭哈
        case "5b1f3a3cb76a451e210914": //梭哈2
          reactnode = (
            <>
              <Descriptions
                title="梭哈游戏数据"
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="房间类型">
                  {data.round_id}
                </Descriptions.Item>
                <Descriptions.Item label="税率">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="底注">{data.antes}</Descriptions.Item>
                <Descriptions.Item label="底池1">
                  {reverseNumber(data?.betinfo?.[0])}
                </Descriptions.Item>
                <Descriptions.Item label="底池2">
                  {reverseNumber(data?.betinfo?.[1])}
                </Descriptions.Item>
                <Descriptions.Item label="底池3">
                  {reverseNumber(data?.betinfo?.[2])}
                </Descriptions.Item>
                <Descriptions.Item label="底池4">
                  {reverseNumber(data?.betinfo?.[3])}
                </Descriptions.Item>
                <Descriptions.Item label="底池5">
                  {reverseNumber(data?.betinfo?.[4])}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.settlement || []}
                columns={[
                  {
                    title: "玩家ID",
                    dataIndex: "user_id",
                  },
                  {
                    title: "是否为机器人",
                    dataIndex: "is_robot",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "座位",
                    dataIndex: "seat_num",
                  },
                  {
                    title: "牌面",
                    dataIndex: "cards",
                    render: (text) => {
                      return text.map((ele) => {
                        let res = "";
                        if (ele) {
                          switch (parseInt(ele.toString().slice(0, 1))) {
                            case 1:
                              res = "方块";
                              break;
                            case 2:
                              res = "梅花";
                              break;
                            case 3:
                              res = "红心";
                              break;
                            case 4:
                              res = "黑桃";
                              break;
                            default:
                              break;
                          }
                          let num = parseInt(ele.toString().slice(3));
                          switch (num) {
                            case 11:
                              res += "J";
                              break;
                            case 12:
                              res += "Q";
                              break;
                            case 13:
                              res += "K";
                              break;
                            case 14:
                              res += "A";
                              break;
                            default:
                              res += num;
                              break;
                          }
                        }
                        return res + ",";
                      });
                    },
                  },
                  {
                    title: "牌型",
                    dataIndex: "card_type",
                    render: (text) => {
                      let res = "";
                      switch (parseInt(text)) {
                        case 0:
                          res = "未知";
                          break;
                        case 1:
                          res = "高牌";
                          break;
                        case 2:
                          res = "一对";
                          break;
                        case 3:
                          res = "两对";
                          break;
                        case 4:
                          res = "三条";
                          break;

                        case 5:
                          res = "顺子";
                          break;

                        case 6:
                          res = "同花";
                          break;

                        case 7:
                          res = "葫芦";
                          break;

                        case 8:
                          res = "四条(金刚)";
                          break;

                        case 9:
                          res = "同花顺";
                          break;

                        case 10:
                          res = "皇家同花顺";
                          break;
                        default:
                          break;
                      }
                      return res;
                    },
                  },
                  {
                    title: "最后一轮叫牌结果",
                    dataIndex: "action_type",
                    render: (text) => {
                      let res = "";
                      switch (parseInt(text)) {
                        case 0:
                          res = "未知";
                          break;
                        case 1:
                          res = "跟注";
                          break;
                        case 2:
                          res = "加注";
                          break;
                        case 3:
                          res = "梭哈";
                          break;
                        case 4:
                          res = "让牌";
                          break;
                        case 5:
                          res = "弃牌";
                          break;
                        default:
                          break;
                      }
                      return res;
                    },
                  },
                  {
                    title: "本局下注",
                    dataIndex: "bet_money",
                    render: reverseNumber,
                  },
                  {
                    title: "结算金币",
                    dataIndex: "settlement_funds",
                    render: reverseNumber,
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251721":
        case "5b1f3a3cb76a451e210926":
          // 房间ID: room_id;
          // 开奖信息:card 庄:village_card 闲:idle_card
          //下注信息:betinfo 庄: VillageGold闲：IdleGold和：PeaceGold 庄对：VillageDoubleGold 闲对：IdleDoubleGold
          // 结算类型: DownBetType
          // 房间ID：fgt01，开奖信息（庄：黑4,梅K，闲：梅A，方J，方A）,下注信息（庄：10，闲：10，和：10，庄对：10，闲对：10，结算类型：非免佣）
          let village_card = reverse_poker(data.card.village_card);
          let idle_card = reverse_poker(data.card.idle_card);
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="开奖信息" span={3}>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="庄" span={3}>
                    {village_card || ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="闲" span={3}>
                    {idle_card || ""}
                  </Descriptions.Item>
                </Descriptions>
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="庄">
                    {data.betinfo.VillageGold}
                  </Descriptions.Item>
                  <Descriptions.Item label="闲">
                    {data.betinfo.IdleGold}
                  </Descriptions.Item>
                  <Descriptions.Item label="和">
                    {data.betinfo.PeaceGold}
                  </Descriptions.Item>
                  <Descriptions.Item label="庄对">
                    {data.betinfo.VillageDoubleGold}
                  </Descriptions.Item>
                  <Descriptions.Item label="闲对">
                    {data.betinfo.IdleDoubleGold}
                  </Descriptions.Item>
                  <Descriptions.Item label="结算类型">
                    {data.betinfo.DownBetType === 1 ? "免佣" : "非免佣"}
                  </Descriptions.Item>
                </Descriptions>
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5c6a62be56209ac117d446aa": //聚宝盆
          reactnode = (
            <Descriptions bordered size="small">
              <Descriptions.Item label="房间等级" span={3}>
                {res.data.room_info}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f2517a6":
          reactnode = (
            <Descriptions
              title={`房间ID:${data.round_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="房间等级" span={3}>
                {data.roomLevel === 1
                  ? "体验房"
                  : data.roomLevel === 2
                  ? "初级场"
                  : data.roomLevel === 3
                  ? "中级场"
                  : data.roomLevel === 4
                  ? "高级场"
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251719":
        case "5b1f3a3cb76a451e210919":
          //红黑大战:
          //房间ID: room_id开奖信息:card_result红方：readcard黑方：blackcard下注信息：down_bet_info红方：reddownbet黑方：blackdownbet幸运一击：luckdownbet
          //房间ID：1， 开奖信息（红：梅2，梅5，红A，黑：梅A，方Q，红8），下注信息（红：50，黑0，幸运一击：0）
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="开奖信息" span={3}>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="红方" span={3}>
                    {reverse(data.card.ReadCard)}
                  </Descriptions.Item>
                  <Descriptions.Item label="黑方" span={3}>
                    {reverse(data.card.BlackCard)}
                  </Descriptions.Item>
                </Descriptions>
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="红池">
                    {data.bet_info.RedDownBet}
                  </Descriptions.Item>
                  <Descriptions.Item label="黑池">
                    {data.bet_info.BlackDownBet}
                  </Descriptions.Item>
                  <Descriptions.Item label="幸运池">
                    {data.bet_info.LuckDownBet}
                  </Descriptions.Item>
                </Descriptions>
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251716":
        case "5b1f3a3cb76a451e210918":
          // 1:  "Benz-40X",2: "BMW-30X",3: "Audi-20X",4: "VW-10X",5: "Benz-5X",6: "BMW-5X",7: "Audi-5X",8: "VW-5X",
          const reverse_bcbm = (num) => {
            let result;
            switch (num) {
              case 1:
                result = "Benz-40X";
                break;
              case 2:
                result = "BMW-30X";
                break;
              case 3:
                result = "Audi-20X";
                break;
              case 4:
                result = "VW-10X";
                break;
              case 5:
                result = "Benz-5X";
                break;
              case 6:
                result = "BMW-5X";
                break;
              case 7:
                result = "Audi-5X";
                break;
              case 8:
                result = "VW-5X";
                break;
              default:
                break;
            }
            return result;
          };
          //奔驰宝马:
          // 房间ID：room_id  开奖信息：card_result   下注信息：down_bet_info
          // 1：Benz-40X
          // 2：BMW-30X
          // 3：Audi-20X
          // 4：VW-10X
          // 5：Benz-5X
          // 6：BMW-5X
          // 7：Audi-5X
          // 8：VW-5X
          // 房间ID：1， 开奖信息（Audi-5X），下注信息（Benz-40X：0，BMW-30X：0，Audi-20X：0，VW-10X：0，Benz-5X：10，BMW-5X：10，Audi-5X：10，VW-5X：10）
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="开奖信息" span={3}>
                {reverse_bcbm(data.card)}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <div>"Benz-40X"：{data.bet_info[1]}</div>
                <div>"BMW-30X"：{data.bet_info[2]}</div>
                <div>"Audi-20X"：{data.bet_info[3]}</div>
                <div>"VW-10X"：{data.bet_info[4]}</div>
                <div>"Benz-5X"：{data.bet_info[5]}</div>
                <div>"BMW-5X"：{data.bet_info[6]}</div>
                <div>"Audi-5X"：{data.bet_info[7]}</div>
                <div>"VW-5X"：{data.bet_info[8]}</div>
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251718":
        // 百人牛牛:
        case "5b1f3a3cb76a451e210916":
          // 百人牛牛2:
          //10-7新的百人牛牛数据结构,接口文档来自wendy
          // 百人牛牛
          const reverse_brnn = (pokers) => {
            let str = "";
            pokers.forEach((ele) => {
              switch (Math.floor(ele / 13)) {
                case 0:
                  str += "方";
                  break;
                case 1:
                  str += "梅";
                  break;
                case 2:
                  str += "红";
                  break;
                case 3:
                  str += "黑";
                  break;
                default:
                  break;
              }
              switch (ele % 13) {
                case 1:
                  str += "A";
                  break;
                case 11:
                  str += "J";
                  break;
                case 12:
                  str += "Q";
                  break;
                case 0:
                  str += "K";
                  break;
                default:
                  str += ele % 13;
                  break;
              }
              str += "\xa0\xa0\xa0\xa0";
            });
            return str;
          };
          const reverse_niuniu = (num) => {
            let res = "";
            if (num === 0) {
              res = "無牛";
            } else if (num < 10 && num > 0) {
              res = `牛${num}`;
            } else if (num === 10) {
              res = "牛牛";
            }
            return res;
          };
          reactnode = (
            <>
              <Descriptions
                title={`房间ID : ${data.room_id}   房间名称 : ${data.room_name}`}
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="税收">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="是否坐庄">
                  {data.is_banker ? "是" : "否"}
                </Descriptions.Item>
                <Descriptions.Item label="当局盈亏">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="玩家余额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
                <Descriptions.Item label="本局下注锁定金额">
                  {reverseDecimal(data.lock_gold)}
                </Descriptions.Item>
              </Descriptions>
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data?.settlement || []}
                columns={[
                  {
                    title: "下注区域",
                    dataIndex: "area",
                  },
                  {
                    title: "下注区总金额",
                    dataIndex: "val",
                  },
                  {
                    title: "当局投注盈亏",
                    dataIndex: "settlement",
                    render: reverseDecimal,
                  },
                ]}
                size="small"
                pagination={false}
              />
              <br />
              <Descriptions
                bordered
                size="small"
                column={1}
                title={"開獎區域/開獎結果"}
              >
                <Descriptions.Item label="庄家">
                  <div>{reverse_brnn(data.card.banker.cardlist)}</div>
                  <div>
                    組成牌型 : {reverse_niuniu(data.card.banker.cardtype)}
                  </div>
                  <div>牌型賠率 : {data.card.banker.odds}</div>
                  <div>區域總下注 : {data.card.banker.betnum}</div>
                </Descriptions.Item>
                <Descriptions.Item label="黑桃">
                  <div>{reverse_brnn(data.card.one.cardlist)}</div>
                  <div>組成牌型 : {reverse_niuniu(data.card.one.cardtype)}</div>
                  <div>牌型賠率 : {data.card.one.odds}</div>
                  <div>區域總下注 : {data.card.one.betnum}</div>
                </Descriptions.Item>
                <Descriptions.Item label="红桃">
                  <div>{reverse_brnn(data.card.two.cardlist)}</div>
                  <div>組成牌型 : {reverse_niuniu(data.card.two.cardtype)}</div>
                  <div>牌型賠率 : {data.card.two.odds}</div>
                  <div>區域總下注 : {data.card.two.betnum}</div>
                </Descriptions.Item>
                <Descriptions.Item label="梅花">
                  <div>{reverse_brnn(data.card.three.cardlist)}</div>
                  <div>
                    組成牌型 : {reverse_niuniu(data.card.three.cardtype)}
                  </div>
                  <div>牌型賠率 : {data.card.three.odds}</div>
                  <div>區域總下注 : {data.card.three.betnum}</div>
                </Descriptions.Item>
                <Descriptions.Item label="方块">
                  <div>{reverse_brnn(data.card.four.cardlist)}</div>
                  <div>
                    組成牌型 : {reverse_niuniu(data.card.four.cardtype)}
                  </div>
                  <div>牌型賠率 : {data.card.four.odds}</div>
                  <div>區域總下注 : {data.card.four.betnum}</div>
                </Descriptions.Item>
              </Descriptions>
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.betinfo || []}
                columns={[
                  {
                    title: "下注区域",
                    dataIndex: "area",
                  },
                  {
                    title: "下注区总金额",
                    dataIndex: "val",
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251717":
        case "5b1f3a3cb76a451e210910":
          // 龙虎斗:
          // 房间ID: room_id
          // 开奖信息：card
          // 龙：dragon
          // 虎：tiger
          // 下注信息：bet_info
          // 龙：龙（取type对应的值）
          // 虎：虎（取type对应的值）
          // val：下注金币
          // 房间ID：02，开奖信息（龙：黑桃J；虎：黑桃K）,下注信息（龙：20；虎：10）
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="开奖信息" span={3}>
                龙：{data.card.dragon}&nbsp;&nbsp;虎：{data.card.tiger}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                {data.betinfo &&
                  data.betinfo.map((ele) => {
                    return `${ele.type}:${ele.val}\xa0\xa0`;
                  })}
                {/* {data.bet_info[0].type}:{data.bet_info[0].val}
								&nbsp;&nbsp;
								{data.bet_info[1].type}:{data.bet_info[1].val} */}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251713":
        case "5b1f3a3cb76a451e210927":
          // 轮盘:
          // 房间ID: room_id
          // 开奖信息：prize
          // 下注信息：bet_info
          // 直接注：直接注（取type对应的值）
          // 分注：分注（取type对应的值）
          // 街注：街注（取type对应的值）
          // 角注：角注
          // 线注：线注
          // 列：列
          // 打：打
          // 单双：单双
          // 大小：大小
          // 红黑：红黑
          // val：下注金币

          // 房间ID：02，开奖信息（24）,下注信息（单双-1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35：1；大小：19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36：1，直接注-34：1）
          // 押注类型可能值”：直接注", "分注", "街注", "角注", "线注", "列", "打", "单双", "大小", "红黑"
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
            >
              <Descriptions.Item label="开奖信息" span={3}>
                {data.prize}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <Descriptions bordered column={1} size="small">
                  {data.betinfo.map((ele) => {
                    return (
                      <Descriptions.Item label={ele.type} span={3}>
                        {ele.nums.join(",")}:{ele.val}
                      </Descriptions.Item>
                    );
                  })}
                </Descriptions>
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251712":
          //水果机
          //开奖信息：Codes 0：苹果1：芒果2：橙子3：葡萄4：西瓜5：樱桃6：铃铛 7:  777 8：BAR 9:  WILD 10：SCATTER  11:  BONUS   12:  JACKPOT
          // 下注信息：BetMoney
          // 房间ID：1， 开奖信息（777，西瓜，WILD，橙子，BAR，铃铛，BAR，橙子，苹果，橙子，樱桃，葡萄，芒果，铃铛，铃铛），下注信息（360.00）
          const reverse_sgj = (arr) => {
            console.log(arr);
            let str = "";
            arr.forEach((ele) => {
              switch (parseInt(ele)) {
                case 0:
                  str += "苹果";
                  break;
                case 1:
                  str += "芒果";
                  break;
                case 2:
                  str += "橙子";
                  break;
                case 3:
                  str += "葡萄";
                  break;
                case 4:
                  str += "西瓜";
                  break;
                case 5:
                  str += "樱桃";
                  break;
                case 6:
                  str += "铃铛";
                  break;
                case 7:
                  str += "777";
                  break;
                case 8:
                  str += "BAR";
                  break;
                case 9:
                  str += "WILD";
                  break;
                case 10:
                  str += "SCATTER";
                  break;
                case 11:
                  str += "BONUS";
                  break;
                case 12:
                  str += "JACKPOT";
                  break;

                default:
                  break;
              }
              str += " , ";
            });
            console.log(str);
            return str;
          };
          reactnode = (
            <Descriptions bordered size="small">
              <Descriptions.Item label="开奖信息" span={3}>
                {reverse_sgj(data.Codes.split(","))}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                {data.BetMoney}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76alkje7f25170":
          // 红包扫雷：
          //雷号: Bomb  开奖信息：list  发包者ID：SenderID  发包者金额：PacketMoney  下注信息：ListPartner玩家ID：UserID盈亏金额：Income
          // 开奖信息（929571822：1），雷: 0;   下注信息（792884399：0.1235；792884399：-1.5000；792884399：0.1995；792884399：0.2375；792884399：0.0665；792884399：0.0285；792884399：0.0095）
          reactnode = (
            <Descriptions bordered size="small">
              <Descriptions.Item
                label={`开奖信息(${data.SenderID}:${data.PacketMoney})`}
                span={3}
              >
                雷号:{data.Bomb}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <div>玩家ID:盈亏金额</div>
                {data.ListPartner.map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.UserID}:{ele.Income}
                    </div>
                  );
                })}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5c6a62be7ff587m117d446aa":
        case "5b1f3a3cb76a451e210913":
          //红包乱斗：
          // 房间ID：RoomID
          // 雷号: Bomb
          // 开奖信息：list
          // 发包者ID：SenderID
          // 发包者金额：PacketMoney
          // 下注信息：ListPartner
          // 玩家ID：UserID
          // 盈亏金额：Income
          // 开奖信息（16787235：30），雷:2 ;  下注信息（24263352：1.1495；888339276：0.2945；23989256：7.1630；16954774：1.2160 ；16971284：2.8025；19559986：4.2560；19851617：3.2965；22887422：1.8905；22647707：0.5985；15951888：5.8330）
          reactnode = (
            <Descriptions title={`房间ID:${data.RoomID}`} bordered size="small">
              <Descriptions.Item
                label={`开奖信息(${data.SenderID}:${data.PacketMoney})`}
                span={3}
              >
                雷号:{data.Bomb}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息" span={3}>
                <div>玩家ID:盈亏金额</div>
                {data.ListPartner.map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.UserID}:{ele.Income}
                    </div>
                  );
                })}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251720":
        case "5b1f3a3cb76a451e210911":
          // 二八杠:
          // 庄家信息：Dealer（庄家，如果有人坐庄，是玩家ID.如果无人庄座，标明“System”）
          // 开奖信息:card
          // 庄:Zhuang
          // 顺:Shun
          // 天:Tian
          // 地:Di
          // 下注信息:Bets
          // 庄家：系统，开奖信息（庄：1筒，4筒；  顺：3筒 ，8筒；  天：白板，9筒；  地：3筒，2筒）,下注信息（顺：0；天：74；地：60）
          const sum_bets = (arr) => {
            let sum = 0;
            arr.forEach((ele) => {
              sum += ele.Bet;
            });
            return sum;
          };
          if (data.Dealer === `${id}`) {
            reactnode = (
              <Descriptions bordered size="small">
                <Descriptions.Item label="庄家" span={3}>
                  {data.Dealer}
                </Descriptions.Item>
                <Descriptions.Item label="开奖信息" span={3}>
                  <div>
                    庄：
                    {data.Zhuang.Card1 === 0
                      ? "白板"
                      : data.Zhuang.Card1 + "筒"}
                    ,
                    {data.Zhuang.Card2 === 0
                      ? "白板"
                      : data.Zhuang.Card2 + "筒"}
                  </div>
                  <div>
                    顺：
                    {data.Shun.Cards.Card1 === 0
                      ? "白板"
                      : data.Shun.Cards.Card1 + "筒"}
                    ,
                    {data.Shun.Cards.Card2 === 0
                      ? "白板"
                      : data.Shun.Cards.Card2 + "筒"}
                  </div>
                  <div>
                    天：
                    {data.Tian.Cards.Card1 === 0
                      ? "白板"
                      : data.Tian.Cards.Card1 + "筒"}
                    ,
                    {data.Tian.Cards.Card2 === 0
                      ? "白板"
                      : data.Tian.Cards.Card2 + "筒"}
                  </div>
                  <div>
                    地：
                    {data.Di.Cards.Card1 === 0
                      ? "白板"
                      : data.Di.Cards.Card1 + "筒"}
                    ,
                    {data.Di.Cards.Card2 === 0
                      ? "白板"
                      : data.Di.Cards.Card2 + "筒"}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="下注信息" span={3}>
                  <div>顺:{sum_bets(data.Shun.Bets)}</div>
                  <div>天:{sum_bets(data.Tian.Bets)}</div>
                  <div>地:{sum_bets(data.Di.Bets)}</div>
                </Descriptions.Item>
              </Descriptions>
            );
          } else {
            reactnode = (
              <Descriptions bordered size="small">
                <Descriptions.Item label="庄家" span={3}>
                  {data.Dealer}
                </Descriptions.Item>
                <Descriptions.Item label="开奖信息" span={3}>
                  <div>
                    庄：
                    {data.Zhuang.Card1 === 0
                      ? "白板"
                      : data.Zhuang.Card1 + "筒"}
                    ,
                    {data.Zhuang.Card2 === 0
                      ? "白板"
                      : data.Zhuang.Card2 + "筒"}
                  </div>
                  <div>
                    顺：
                    {data.Shun.Cards.Card1 === 0
                      ? "白板"
                      : data.Shun.Cards.Card1 + "筒"}
                    ,
                    {data.Shun.Cards.Card2 === 0
                      ? "白板"
                      : data.Shun.Cards.Card2 + "筒"}
                  </div>
                  <div>
                    天：
                    {data.Tian.Cards.Card1 === 0
                      ? "白板"
                      : data.Tian.Cards.Card1 + "筒"}
                    ,
                    {data.Tian.Cards.Card2 === 0
                      ? "白板"
                      : data.Tian.Cards.Card2 + "筒"}
                  </div>
                  <div>
                    地：
                    {data.Di.Cards.Card1 === 0
                      ? "白板"
                      : data.Di.Cards.Card1 + "筒"}
                    ,
                    {data.Di.Cards.Card2 === 0
                      ? "白板"
                      : data.Di.Cards.Card2 + "筒"}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="下注信息" span={3}>
                  <div>
                    顺:{find(data.Shun.Bets, { PlayerID: `${id}` })?.Bet}
                  </div>
                  <div>
                    天:{find(data.Tian.Bets, { PlayerID: `${id}` })?.Bet}
                  </div>
                  <div>地:{find(data.Di.Bets, { PlayerID: `${id}` })?.Bet}</div>
                </Descriptions.Item>
              </Descriptions>
            );
          }
          break;
        case "5b1f3a3cb76a591e7f251711":
        case "5b1f3a3cb76a451e210917":
          // 斗地主
          // 房间ID：room_id
          // 房间类型：room_type （ 1=体验场， 2=初级场，3=中级场，4=高级场）
          // 底牌：bottom_card（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 玩家ID-1（player_id）: 17张牌面（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 玩家ID-2（player_id）: 17张牌面（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 玩家ID-3（player_id）: 17张牌面（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 剩余牌面：settlement
          // 玩家ID-1（PlayerId）: 剩余牌面（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 玩家ID-2（PlayerId）: 剩余牌面（"value":8,  卡牌值  从1-13 分别为 3-2   1=3  13=2  14=小鬼 15=大鬼；"suit":4  卡牌花色 1-4 黑桃 红桃 梅花 方片  大小王为0 无花色）
          // 结算信息：
          // 玩家ID1，是否为地主（"IsLandlord":  -1  不是  1  是），当前倍数（Multiple），输赢金币(WinLossGold)
          // 玩家ID2，是否为地主（"IsLandlord":  -1  不是  1  是），当前倍数（Multiple），输赢金币(WinLossGold)
          // 玩家ID3，是否为地主（"IsLandlord":  -1  不是  1  是），当前倍数（Multiple），输赢金币(WinLossGold)

          // "IsLandlord":  -1  不是  1  是
          // "Multiple":192,   当前倍数
          // "WinLossGold":"1.82", 输赢金币

          // 房间ID：d09b09ed-eef9-4218-af84-ee67bea63122
          // 房间类型：初级场
          // 底牌：黑桃J，方块K, 红桃3
          // 481260793：黑桃2，红桃5，梅花2，梅花10，方块Q，小鬼，黑桃Q，梅花J，方块5，红桃4，红桃Q，红桃10，红桃2，红桃7，黑桃7，红桃8，方块8，
          // 550531695：大鬼，红桃K，梅花K，方块K，梅花Q，黑桃J， 红桃J，方块J，黑桃10，方块10，红桃9，方块9，黑桃6，红桃6，梅花6，方块6，梅花4，黑桃3，红桃3，黑桃A
          // 673745146：方块4，梅花5，黑桃K，方块2，黑桃9，梅花A，黑桃5，梅花3，梅花9，方块3，红桃A，黑桃4，方块A，梅花8，黑桃8，梅花7，方块7
          // 剩余牌面：
          // 481260793：黑桃2，红桃5，梅花2，梅花J，方块5，红桃2，红桃8，方块8
          // 673745146：梅花A，红桃A，方块A，方块2，梅花3，方块3，黑桃4，方块4，梅花5，黑桃5，梅花7，方块7，黑桃9，梅花9，黑桃K
          // 结算信息：
          // 481260793：不是地主，6倍，-3.00
          // 550531695：地主，12倍，5.70
          // 673745146：不是地主，6倍，-3.00
          const reverse_ddz = (pokers) => {
            let str_arr = [];
            pokers.forEach((ele) => {
              switch (ele.suit) {
                case 1:
                  str_arr.push("方");
                  break;
                case 2:
                  str_arr.push("红");
                  break;
                case 3:
                  str_arr.push("黑");
                  break;
                case 4:
                  str_arr.push("梅");
                  break;
                default:
                  break;
              }
              switch (ele.value) {
                case 9:
                  str_arr.push("J");
                  break;
                case 10:
                  str_arr.push("Q");
                  break;
                case 11:
                  str_arr.push("K");
                  break;
                case 12:
                  str_arr.push("A");
                  break;
                case 13:
                  str_arr.push("2");
                  break;
                case 14:
                  str_arr.push("小鬼");
                  break;
                case 15:
                  str_arr.push("大鬼");
                  break;
                default:
                  str_arr.push(ele.value + 2);
                  break;
              }
              str_arr.push(" , ");
            });
            console.log(str_arr.join(""));
            return str_arr.join("");
          };
          const deal_player_info = (obj) => {
            let arr = [];
            for (const key in obj) {
              arr.push({ player: key, info: obj[key] });
            }
            console.log(arr);
            return arr;
          };
          reactnode = (
            <Descriptions
              title={`房间ID:${data.room_id}`}
              bordered
              size="small"
              column={1}
            >
              <Descriptions.Item label="房间类型">
                {data.room_type === 1
                  ? "体验场"
                  : data.room_type === 2
                  ? "初级场"
                  : data.room_type === 3
                  ? "中级场"
                  : data.room_type === 4
                  ? "高级场"
                  : data.room_type}
              </Descriptions.Item>
              <Descriptions.Item label="底牌">
                {reverse_ddz(data.bottom_card)}
              </Descriptions.Item>
              <Descriptions.Item label="牌面">
                {deal_player_info(data.player_info).map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.player}:{reverse_ddz(ele.info.cards)}
                    </div>
                  );
                })}
              </Descriptions.Item>
              <Descriptions.Item label="剩余牌面">
                {data.settlement.map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.PlayerId}:{reverse_ddz(ele.RemainCards)}
                    </div>
                  );
                })}
              </Descriptions.Item>
              <Descriptions.Item label="结算信息">
                {data.settlement.map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.PlayerId}:
                      {ele.IsLandlord === 1 ? "是地主" : "不是地主"},
                      {ele.Multiple}倍,输赢金币是{ele.WinLossGold}
                    </div>
                  );
                })}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251715":
        case "5b1f3a3cb76a451e210912":
          //炸金花
          let columns = [
            {
              title: "玩家id",
              dataIndex: "id",
            },
            {
              title: "座位",
              dataIndex: "chair",
            },

            {
              title: "牌面",
              dataIndex: "cards",
            },
            {
              title: "结算",
              dataIndex: "change",
              render: (text) => text.toFixed(6),
            },
          ];
          reactnode = (
            <Table
              title={(currentpage) =>
                `房间类型：${data.level}\xa0\xa0\xa0\xa0|\xa0\xa0\xa0\xa0底分：${data.basepoint}`
              }
              bordered
              rowKey={(record, index) => `${index}`}
              dataSource={data.roundinfo}
              columns={columns}
              size="small"
              pagination={false}
            />
          );
          break;
        case "5b1f3a3cb76a591e7f251714":
        case "5b1f3a3cb76a451e211018":
          //抢庄牛牛
          //抢庄牛牛2
          let columns2 = [
            {
              title: "玩家id",
              dataIndex: "id",
            },
            {
              title: "座位",
              dataIndex: "chair",
            },
            {
              title: "抢庄倍数",
              dataIndex: "robmultiple",
            },
            {
              title: "下注倍数",
              dataIndex: "selmultiple",
            },

            {
              title: "牌面",
              dataIndex: "cards",
            },
            {
              title: "结算",
              dataIndex: "change",
              render: (text) => text.toFixed(6),
            },
          ];
          reactnode = (
            <div>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="房间类型">
                  {data.level}
                </Descriptions.Item>
                <Descriptions.Item label="底分">
                  {data.basepoint}
                </Descriptions.Item>
                <Descriptions.Item label="庄家座位号">
                  {data.banker}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.roundinfo}
                columns={columns2}
                size="small"
                pagination={false}
              />
            </div>
          );
          break;
        case "5b1f3a3cb76a591e7f25171":
        case "5b1f3a3cb76a451e210922":
          //十三水
          let columns3 = [
            {
              title: "玩家id",
              dataIndex: "id",
            },
            {
              title: "座位",
              dataIndex: "chair",
            },
            {
              title: "赢的水数",
              dataIndex: "multiple",
            },
            {
              title: "牌型",
              dataIndex: "type",
              render: (text, record) => text.join(" , "),
            },
            {
              title: "牌面",
              dataIndex: "cards",
            },
            {
              title: "结算",
              dataIndex: "change",
              render: (text) => text.toFixed(6),
            },
          ];
          reactnode = (
            <div>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="房间类型">
                  {data.level}
                </Descriptions.Item>
                <Descriptions.Item label="底分">
                  {data.basepoint}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.roundinfo}
                columns={columns3}
                size="small"
                pagination={false}
              />
            </div>
          );
          break;
        case "5b1f3a3cb76a591e7f251722":
          //21点
          modal_width = "80%";
          const reverse_21dian = (pokers) => {
            if (!pokers) return;
            let str_arr = [];
            pokers.forEach((ele) => {
              switch (ele.CardType) {
                case 1:
                  str_arr.push("梅");
                  break;
                case 2:
                  str_arr.push("红");
                  break;
                case 3:
                  str_arr.push("黑");
                  break;
                case 0:
                  str_arr.push("方");
                  break;
                default:
                  str_arr.push("方");
                  break;
              }
              switch (ele.CardValue) {
                case 11:
                  str_arr.push("J");
                  break;
                case 12:
                  str_arr.push("Q");
                  break;
                case 13:
                  str_arr.push("K");
                  break;
                case 1:
                  str_arr.push("A");
                  break;
                default:
                  str_arr.push(ele.CardValue);
                  break;
              }
              str_arr.push(" , ");
            });
            return str_arr.join("");
          };
          let columns4 = [
            {
              title: "玩家id",
              dataIndex: "player_id",
            },
            {
              title: "房间名称",
              dataIndex: "room_name",
            },
            {
              title: "庄家牌",
              dataIndex: "settlement.HandPoker",
              render: reverse_21dian,
            },
            {
              title: "庄家点数",
              dataIndex: "settlement.Points",
            },
            {
              title: "输赢",
              dataIndex: "settlement_funds",
              render: reverseDecimal,
            },
            {
              title: "牌1",
              dataIndex: "card",
              render: reverse_21dian,
            },
            {
              title: "牌2",
              dataIndex: "card2",
              render: reverse_21dian,
            },
            {
              title: "保险",
              dataIndex: "betinfo[0].Area",
              render: (text) => {
                if (text === 1) return "正常投注";
                if (text === 0) return "购买保险";
                return;
              },
            },
            {
              title: "Side",
              dataIndex: "betinfo",
              render: (text) => {
                return JSON.stringify(text);
              },
            },
          ];

          reactnode = (
            <div>
              <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={res.data.list}
                columns={columns4}
                size="small"
                pagination={false}
              />
            </div>
          );
          break;
        case "5b1f3a3cb76a591e7f25170":
          // 二人麻将
          modal_width = "80%";
          const reverse_errmj = (arr) => {
            if (!arr) return "";
            let newarr = arr.map((ele) => {
              let str;
              if (ele > 0 && ele < 10) {
                str = `${ele}万`;
              } else {
                switch (ele) {
                  case 31:
                    str = "东";
                    break;
                  case 32:
                    str = "南";
                    break;
                  case 33:
                    str = "西";
                    break;
                  case 34:
                    str = "北";
                    break;
                  case 35:
                    str = "中";
                    break;
                  case 36:
                    str = "发";
                    break;
                  case 37:
                    str = "白";
                    break;
                  case 41:
                    str = "春";
                    break;
                  case 42:
                    str = "夏";
                    break;
                  case 43:
                    str = "秋";
                    break;
                  case 44:
                    str = "冬";
                    break;
                  case 45:
                    str = "梅";
                    break;
                  case 46:
                    str = "兰";
                    break;
                  case 47:
                    str = "竹";
                    break;
                  case 48:
                    str = "菊";
                    break;
                  default:
                    break;
                }
              }
              return str;
            });
            return newarr.join(",");
          };
          reactnode = (
            <div className="ermj">
              <Descriptions
                title={`房间ID:${data.room_id}`}
                bordered
                size="small"
              >
                <Descriptions.Item label="房间类型" span={3}>
                  {data.room_name}
                </Descriptions.Item>
                <Descriptions.Item label="结算信息">
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="是否流局">
                      {data.settlement.is_flow ? "是" : "否"}
                    </Descriptions.Item>
                    <Descriptions.Item label="玩家的结算时的牌信息" span={2}>
                      {reverse_errmj(data.settlement.table_remain_mahjongs)}
                    </Descriptions.Item>
                    <Descriptions.Item label="结算金额">
                      {reverseDecimal(data.settlement.settlement_gold)}
                    </Descriptions.Item>
                    <Descriptions.Item label="筛子点数">
                      {data?.bet_info?.dice.join(" , ")}
                    </Descriptions.Item>
                    <Descriptions.Item label="底分">
                      {data?.bottom_point}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="赢家番数信息"
                      span={3}
                      style={{ whiteSpace: "noWrap" }}
                    >
                      <Table
                        title={() =>
                          `总番数${
                            data.settlement?.fang_info?.fang_total || ""
                          }`
                        }
                        bordered
                        rowKey={(record, index) => `${index}`}
                        dataSource={
                          data.settlement?.fang_info?.fang_details || []
                        }
                        columns={[
                          {
                            title: "fang_code",
                            dataIndex: "fang_code",
                          },
                          {
                            title: "番数",
                            dataIndex: "fang_num",
                          },
                          {
                            title: "番数名",
                            dataIndex: "fang_name",
                          },
                        ]}
                        size="small"
                        pagination={false}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Descriptions.Item>
              </Descriptions>

              <Table
                title={() => "玩家初始信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.card || []}
                columns={[
                  {
                    title: "玩家id",
                    dataIndex: "player_id",
                  },
                  {
                    title: "是否机器人",
                    dataIndex: "is_robot",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "是否庄家",
                    dataIndex: "is_zhuang",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "风向",
                    dataIndex: "direction",
                    render: (text, record) => {
                      let res;
                      switch (text) {
                        case "east":
                          res = "东";
                          break;
                        case "south":
                          res = "南";
                          break;
                        case "west":
                          res = "西";
                          break;
                        case "north":
                          res = "北";
                          break;
                        default:
                          break;
                      }
                      return res;
                    },
                  },

                  {
                    title: "原始手牌",
                    dataIndex: "mahjongs",
                    render: (text) => reverse_errmj(text),
                  },
                  {
                    title: "原始金币信息",
                    dataIndex: "game_gold",
                    render: reverseDecimal,
                  },
                ]}
                size="small"
                pagination={false}
              />
              <Table
                title={() => "玩家信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data?.settlement?.player_settlement_info || []}
                columns={[
                  {
                    title: "玩家id",
                    dataIndex: "player_id",
                  },
                  {
                    title: "是否机器人",
                    dataIndex: "is_robot",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "是否庄家",
                    dataIndex: "is_zhuang",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "风向",
                    dataIndex: "direction",
                    render: (text, record) => {
                      let res;
                      switch (text) {
                        case "east":
                          res = "东";
                          break;
                        case "south":
                          res = "南";
                          break;
                        case "west":
                          res = "西";
                          break;
                        case "north":
                          res = "北";
                          break;
                        default:
                          break;
                      }
                      return res;
                    },
                  },

                  {
                    title: "原始手牌",
                    dataIndex: "hand_mahjongs",
                    render: (text) => reverse_errmj(text),
                  },
                  {
                    title: "原始金币信息",
                    dataIndex: "game_gold",
                    render: reverseDecimal,
                  },
                ]}
                size="small"
                pagination={false}
              />
            </div>
          );
          break;
        case "5c6a62be7ff09a54amb446aa":
          // 跑得快
          const reverse_paodekuai = (arr) => {
            if (!arr) return "";
            let newarr = arr.map((ele) => {
              let str = "";
              //"cardsuit": 1,  //花色 0.方片  1.红桃  2.黑桃  3.梅花
              //"cardname": "3", //牌值
              switch (ele.CardSuit) {
                case 1:
                  str += "方";
                  break;
                case 2:
                  str += "红";
                  break;
                case 3:
                  str += "黑";
                  break;
                case 4:
                  str += "梅";
                  break;
                default:
                  break;
              }
              str += ele.CardName;
              return str;
            });
            return newarr.join(",");
          };
          reactnode = (
            <>
              <Descriptions
                title={`房间ID:${data.RoomID}`}
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="税率">
                  {data.TaxRate}
                </Descriptions.Item>
                <Descriptions.Item label="底分">{data.Odds}</Descriptions.Item>
              </Descriptions>
              <Table
                title={() => `开牌结果`}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.CardResult || []}
                columns={[
                  {
                    title: "玩家id",
                    dataIndex: "ID",
                  },
                  {
                    title: "是否机器人",
                    dataIndex: "Isrobot",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "输赢金额",
                    dataIndex: "Winlose",
                    render: reverseDecimal,
                  },
                  {
                    title: "炸弹",
                    dataIndex: "Bomp",
                  },
                  {
                    title: "是否包赔",
                    dataIndex: "Allpay",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "打完后剩余牌",
                    dataIndex: "Cardlist",
                    render: reverse_paodekuai,
                  },
                  {
                    title: "底分",
                    dataIndex: "Odds",
                  },
                ]}
                size="small"
                pagination={false}
              />
              <Table
                title={() => "起始发牌牌型"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.Playerinfo || []}
                columns={[
                  {
                    title: "玩家id",
                    dataIndex: "id",
                  },
                  {
                    title: "是否机器人",
                    dataIndex: "is_roabat",
                    render: (text) => (text ? "是" : "否"),
                  },

                  {
                    title: "账户金额",
                    dataIndex: "spare_case",
                    render: reverseDecimal,
                  },
                  {
                    title: "牌型",
                    dataIndex: "card_list",
                    render: reverse_paodekuai,
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251724":
        case "5b1f3a3cb76a451e210921":
          // 骰宝
          let index_shaibao = {
            1: "单骰1",
            2: "单骰2",
            3: "单骰3",
            4: "单骰4",
            5: "单骰5",
            6: "单骰6",
            7: "和4",
            8: "和5",
            9: "和6",
            10: "和7",
            11: "和8",
            12: "和9",
            13: "和10",
            14: "和11",
            15: "和12",
            16: "和13",
            17: "和14",
            18: "和15",
            19: "和16",
            20: "和17",
            21: "小",
            22: "大",
            23: "双骰1",
            24: "双骰2",
            25: "双骰3",
            26: "双骰4",
            27: "双骰5",
            28: "双骰6",
            29: "围骰1",
            30: "围骰2",
            31: "围骰3",
            32: "围骰4",
            33: "围骰5",
            34: "围骰6",
            35: "全围",
          };
          reactnode = (
            <>
              <Descriptions
                title={`房间ID:${data.room_id}`}
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="当局开奖">
                  {data.prize}
                </Descriptions.Item>
                <Descriptions.Item label="税收">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="玩家当局盈亏">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="玩家余额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
                <Descriptions.Item label="本局下注">
                  {reverseDecimal(data.lock_gold)}
                </Descriptions.Item>
                <Descriptions.Item label="当局投注资讯">
                  {(data.betinfo || []).map((ele, i) => {
                    return (
                      <div key={i}>{`区域${index_shaibao[ele.BetIndex]} : ${
                        ele.Total_gold
                      }`}</div>
                    );
                  })}
                </Descriptions.Item>
              </Descriptions>
            </>
          );
          break;

        case "5b1f3a3cb76a591e7f25176":
        case "5b1f3a3cb76a451e210920":
          // 德州扑克
          // {
          //     "code":0,
          //     "msg":"",
          //     "data":{
          //         "total":1,
          //         "list":[
          //             {
          //                 "time":1603269304,
          //                 "time_fmt":"2020-10-21 16:35:04",
          //                 "round_id":"1603269304-392717",    //round_id
          //                 "room_id":"392717",                //房间 id
          //                 "cfg_id":"1",                               //房间类型 (0-体验场， 1-初级场， 2-中级场，3-高级场)
          //                 "small_blind":"769491502",   //小盲注id
          //                 "big_blind":"683856030",       //大盲注id
          //                 "small_money":1,                    //小盲注金额
          //                 "big_money":2,                        //大盲注金额
          //                 "public_card":[      //公牌数据 (1-13(A-K)方片, 14-26(A-K) 梅花, 27-39(A-K)红心, 40-52(A-K)黑桃)
          //                     40,
          //                     34,
          //                     33,
          //                     31,
          //                     8
          //                 ],
          //                 "player_info":[       //各个玩家开奖信息
          //                     {
          //                         "player_id":"369472212",     //玩家id
          //                         "chair":0,                                 //玩家座位
          //                         "hand_card":[                         //玩家手牌(对应上面牌型数据)
          //                             14,
          //                             50
          //                         ],
          //                         "down_bet":2,                        //玩家本局下注
          //                         "settlement_funds":-2,         //玩家本局结算金币
          //                         "spare_cash":1577,               //玩家本局剩余金额
          //                         "is_robot":true                       //玩家是否机器人
          //                     }
          //                 ],
          //                 "pot_money":38,                            //注池金额
          //                 "tax_rate":0.05,                              //税率
          //                 "created_at":1603269304,           //下注时间
          //                 "start_time":1603269205,            //开始时间
          //                 "end_time":1603269304              //结束时间
          //             }
          //         ]
          //     }
          // }
          let reverse_dzpk_pokers = (arr) => {
            // (1-13(A-K)方片, 14-26(A-K) 梅花, 27-39(A-K)红心, 40-52(A-K)黑桃)
            if (!arr) return;
            let newarr = [];
            arr.forEach((ele) => {
              let str = "";
              switch (Math.ceil(ele / 13)) {
                case 1:
                  str += "方";
                  break;
                case 2:
                  str += "梅";
                  break;
                case 3:
                  str += "红";
                  break;
                case 4:
                  str += "黑";
                  break;
                default:
                  break;
              }
              switch (ele % 13) {
                case 1:
                  str += "A";
                  break;
                case 11:
                  str += "J";
                  break;
                case 12:
                  str += "Q";
                  break;
                case 0:
                  str += "K";
                  break;
                default:
                  str += ele % 13;
                  break;
              }
              newarr.push(str);
            });
            return newarr.join(" , ");
          };
          let reverse_dzpk_roomtype = (num) => {
            // 房间类型(0-体验场， 1-初级场， 2-中级场，3-高级场)
            if (!num) return;
            let res;
            switch (parseInt(num)) {
              case 0:
                res = "体验场";
                break;
              case 1:
                res = "初级场";
                break;
              case 2:
                res = "中级场";
                break;
              case 3:
                res = "高级场";
                break;
              default:
                break;
            }
            return res;
          };
          reactnode = (
            <>
              <Descriptions
                title={`房间ID:${data.room_id}`}
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="房间类型">
                  {reverse_dzpk_roomtype(data.cfg_id)}
                </Descriptions.Item>
                <Descriptions.Item label="小盲注id">
                  {data.small_blind}
                </Descriptions.Item>
                <Descriptions.Item label="大盲注id">
                  {data.big_blind}
                </Descriptions.Item>
                <Descriptions.Item label="小盲注金额">
                  {reverseDecimal(data.small_money)}
                </Descriptions.Item>
                <Descriptions.Item label="大盲注金额">
                  {reverseDecimal(data.big_money)}
                </Descriptions.Item>
                <Descriptions.Item label="房间注池金额">
                  {reverseDecimal(data.pot_money)}
                </Descriptions.Item>
                <Descriptions.Item label="税率">
                  {reverseDecimal(data.tax_rate)}
                </Descriptions.Item>
                <Descriptions.Item label="公牌数据">
                  {reverse_dzpk_pokers(data.public_card)}
                </Descriptions.Item>
              </Descriptions>
              <Table
                title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.player_info || []}
                columns={[
                  {
                    title: "玩家id",
                    dataIndex: "player_id",
                  },
                  {
                    title: "玩家座位",
                    dataIndex: "chair",
                  },
                  {
                    title: "本局下注",
                    dataIndex: "down_bet",
                    render: reverseDecimal,
                  },
                  {
                    title: "结算金币",
                    dataIndex: "settlement_funds",
                    render: reverseDecimal,
                  },
                  {
                    title: "剩余金额",
                    dataIndex: "spare_cash",
                    render: reverseDecimal,
                  },
                  {
                    title: "是否机器人",
                    dataIndex: "is_robot",
                    render: (text) => (text ? "是" : "否"),
                  },
                  {
                    title: "玩家手牌",
                    dataIndex: "hand_card",
                    render: (text) => reverse_dzpk_pokers(text),
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;

        case "5b1f3a3cb76a591e7f251725":
        //狮子王国
        case "5b1f3a3cb76a451e210915":
          //狮子王国2
          // let obj = {
          //     code: 0,
          //     data: {
          //         total: 1,
          //         list: [
          //             {
          //                 created_at: 1598335995, // 完结时间
          //                 time_fmt: "2020-08-25 14:13:15", // 完结时间(格式化)
          //                 player_id: "212293593", // 玩家ID
          //                 round_id: "012018", // 回合ID
          //                 room_id: "01", // 房间名称
          //                 tax_rate: 0.05, // 税收
          //                 settlement: [
          //                     //  (1)非當局庄家:该玩家当局投注盈虧 (2)當局庄家: 当局所有玩家投注庄家盈虧(未扣稅收)
          //                     {
          //                         area: 4, //下注区域编号
          //                         type: "Rabbit", //下注区域名稱
          //                         val: 5, // 下注区总金额
          //                         settlement: -5, // 当局投注盈虧(未扣稅收)
          //                     },
          //                     {
          //                         area: 12,
          //                         type: "SilverShark",
          //                         val: 3,
          //                         settlement: 69,
          //                     },
          //                 ],
          //                 card: [
          //                     //當局開獎, 超過一筆為打槍開獎, 打槍中獎类型不賠, 故不顯示
          //                     {
          //                         award_area_name: "SilverShark", //開獎区域名稱
          //                         award_area: 12, //開獎区域编号
          //                         award_area_index: 18, //開獎区域位置编号
          //                         award_area_odds: 24, //開獎区域賠率, 若為通吃/通賠賠率為0
          //                         award_type_name: "AreaTypeShark", //中獎类型名稱:飞禽/走兽/鲨魚/通吃/通赔
          //                         award_type: 3, //中獎类型编号:飞禽/走兽/鲨魚/通吃/通赔
          //                         award_type_odds: 0, //中獎类型賠率
          //                     },
          //                     {
          //                         award_area: 10,
          //                         award_area_index: 15,
          //                         award_area_name: "Lion",
          //                         award_area_odds: 12,
          //                     },
          //                     {
          //                         award_area: 3,
          //                         award_area_index: 2,
          //                         award_area_name: "Swallow",
          //                         award_area_odds: 6,
          //                     },
          //                 ],
          //                 betinfo: [
          //                     // (1)非當局庄家:该玩家当局投注资讯 (2)當局庄家:当局所有玩家投注资讯
          //                     {
          //                         area: 4, //下注区域编号
          //                         type: "Rabbit", //下注区域名稱
          //                         val: 5, // 下注区总金额
          //                     },
          //                     {
          //                         area: 12,
          //                         type: "SilverShark",
          //                         val: 3,
          //                     },
          //                 ],
          //                 is_banker: false, //玩家是否為當局庄家
          //                 room_name: "", // 房间名称
          //                 settlement_funds: 60.55, //玩家當局盈虧
          //                 spare_cash: 19516.35, // 玩家餘額(已與當局盈虧相加減)
          //                 lock_gold: 0, // 本局下注鎖定金額
          //             },
          //         ],
          //     },
          //     msg: "ok",
          // };
          reactnode = (
            <>
              <Descriptions
                title={`房间ID:${data.room_id}`}
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="税收">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="是否坐庄">
                  {data.is_banker ? "是" : "否"}
                </Descriptions.Item>
                <Descriptions.Item label="当局盈亏">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="玩家余额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
                <Descriptions.Item label="本局下注锁定金���">
                  {reverseDecimal(data.lock_gold)}
                </Descriptions.Item>
              </Descriptions>
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.settlement || []}
                columns={[
                  {
                    title: "下注区域编号",
                    dataIndex: "area",
                  },
                  {
                    title: "下注区域名称",
                    dataIndex: "type",
                    // render: (text, record) => {
                    //     let res;
                    //     switch (record.area) {
                    //         case 1:
                    //             res = "飞禽";
                    //             break;
                    //         case 2:
                    //             res = "走兽";
                    //             break;
                    //         case 3:
                    //             res = "飞禽";
                    //             break;
                    //         case 4:
                    //             res = "飞禽";
                    //             break;
                    //         case 5:
                    //             res = "飞禽";
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    //     return res;
                    // },
                  },
                  {
                    title: "下注区总金额",
                    dataIndex: "val",
                  },
                  {
                    title: "当局投注盈亏",
                    dataIndex: "settlement",
                  },
                ]}
                size="small"
                pagination={false}
              />
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.card || []}
                columns={[
                  {
                    title: "开奖区域名称",
                    dataIndex: "award_area_name",
                  },
                  {
                    title: "开奖区域编号",
                    dataIndex: "award_area",
                  },
                  {
                    title: "开奖区域位置编号",
                    dataIndex: "award_area_index",
                  },
                  {
                    title: "开奖区域赔率",
                    dataIndex: "award_area_odds",
                  },

                  {
                    title: "中獎类型名稱",
                    dataIndex: "award_type_name",
                  },
                  {
                    title: "中獎类型编号",
                    dataIndex: "award_type",
                  },
                  {
                    title: "中獎类型賠率",
                    dataIndex: "award_type_odds",
                  },
                ]}
                size="small"
                pagination={false}
              />
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data.betinfo || []}
                columns={[
                  {
                    title: "下注区域编号",
                    dataIndex: "area",
                  },
                  {
                    title: "下注区域名稱",
                    dataIndex: "type",
                  },
                  {
                    title: "下注区总金额",
                    dataIndex: "val",
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251730": //财神到
          reactnode = (
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="开奖信息">
                {(res.data?.codes || []).map((ele, i) => {
                  return <div key={i}>{JSON.stringify(ele)}</div>;
                })}
              </Descriptions.Item>
              <Descriptions.Item label="下注信息">
                {reverseDecimal(res.data.bet)}
              </Descriptions.Item>
              <Descriptions.Item label="中奖倍率">
                {reverseDecimal(res.data.odd)}
              </Descriptions.Item>
            </Descriptions>
          );
          break;
        case "5b1f3a3cb76a591e7f251729": //城堡争霸
          // "player_id": "353317756",          玩家ID
          // "round_id": "353317756_2020-12-03_16-11-36_1",    round_id
          // "data": [
          // {
          // "opponent": "421192831",        //对手（城堡占有者或者攻击者）
          // "bet": 1,            //下注量
          // "score": 3            //得分
          // },
          // {
          // "opponent": "421192831",
          // "bet": 100,
          // "score": 500
          // },
          // {
          // "opponent": "421192831",
          // "bet": 10,
          // "score": 10
          // }
          reactnode = (
            <>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label=" 玩家ID">
                  {res.data.player_id}
                </Descriptions.Item>
              </Descriptions>
              <Table
                // title={() => "开奖信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={res.data?.data || []}
                columns={[
                  {
                    title: "对手(城堡占有者或者攻击者)",
                    dataIndex: "opponent",
                  },
                  {
                    title: "下注量",
                    dataIndex: "bet",
                  },
                  {
                    title: "得分",
                    dataIndex: "score",
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251731": //多福多财
          reactnode = (
            <>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="当局下注金额">
                  {reverseDecimal(res.data.bet)}
                </Descriptions.Item>
                <Descriptions.Item label="当局赢得金额">
                  {reverseDecimal(res.data.winamount)}
                </Descriptions.Item>
                <Descriptions.Item label="当局赢得倍率">
                  {reverseDecimal(res.data.odd)}
                </Descriptions.Item>
              </Descriptions>
              <br />
              {(res.data?.code || []).map((ele, i) => {
                return <div key={i}>{JSON.stringify(ele, null, 2)}</div>;
              })}
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251733":
          reactnode = (
            <>
              <Descriptions
                title={`房间ID:${data.room_id}`}
                bordered
                size="small"
                column={2}
              >
                <Descriptions.Item label="开奖号码">
                  {data.lucky_num}
                </Descriptions.Item>
                <Descriptions.Item label="彩源名称">
                  {data.room_name === "01"
                    ? "河内分分彩"
                    : data.room_name === "02"
                    ? "奇趣分分彩"
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label="开奖期数">
                  {data.issue_id}
                </Descriptions.Item>
                <Descriptions.Item label="结算金币">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="剩余金额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
              </Descriptions>
              <br />
              <Table
                title={() => "投注信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data?.betinfo || []}
                columns={[
                  {
                    title: "投注",
                    dataIndex: "type",
                  },
                  {
                    title: "下注金额",
                    dataIndex: "val",
                  },
                  {
                    title: "开奖球",
                    dataIndex: "position",
                  },
                ]}
                size="small"
                pagination={false}
              />
              <br />
              <Table
                title={() => "结算信息"}
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={data?.settlement || []}
                columns={[
                  {
                    title: "投注",
                    dataIndex: "type",
                  },
                  {
                    title: "下注金额",
                    dataIndex: "val",
                  },
                  {
                    title: "开奖球",
                    dataIndex: "position",
                  },
                  {
                    title: "金额",
                    dataIndex: "settlement",
                    render: reverseDecimal,
                  },
                ]}
                size="small"
                pagination={false}
              />
            </>
          );
          break;
        case "5b1f3a3cb76a591e7f251734":
          reactnode = (
            <>
              <Descriptions
                title={`玩家ID:${data.player_id}`}
                bordered
                size="small"
                column={2}
              >
                <Descriptions.Item label="开奖号码">
                  {data.lottery}
                </Descriptions.Item>
                <Descriptions.Item label="税率">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="彩源名称">
                  {data.room_id === "1"
                    ? "河内分分彩"
                    : data.room_id === "2"
                    ? "奇趣分分彩"
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label="结算号码">
                  {data.card.resultNum}
                </Descriptions.Item>
                <Descriptions.Item label="中奖区域">
                  {data.card.bigSmall === 1
                    ? "小"
                    : data.card.bigSmall === 2
                    ? "大"
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label="玩家下注">
                  注池 大:{data.bet_info.BigDownBet}
                  <br />
                  注池 小:{data.bet_info.SmallDownBet}
                  <br />
                  注池 豹子:{data.bet_info.LeopardDownBet}
                </Descriptions.Item>
                <Descriptions.Item label="玩家本局结算金币">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="玩家本局剩余金额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
                <Descriptions.Item label="开奖奖期">
                  {data.periods_num}
                </Descriptions.Item>
              </Descriptions>
            </>
          );
          break;
        case "5b1f3a3cb76a451e7f0622": //发财推币机
          reactnode = (
            <div>
              <Table
                bordered
                rowKey={(record, index) => `${index}`}
                dataSource={res.data.list}
                columns={[
                  {
                    title: "起始时间",
                    dataIndex: "start_time",
                    render: formateDate,
                  },
                  {
                    title: "结束时间",
                    dataIndex: "end_time",
                    render: formateDate,
                  },
                  {
                    title: "用户id",
                    dataIndex: "player_id",
                  },
                  {
                    title: "round_id",
                    dataIndex: "round_id",
                  },
                  {
                    title: "房间id",
                    dataIndex: "room_id",
                  },
                  {
                    title: "税率",
                    dataIndex: "tax_rate",
                    render: reversePercent,
                  },
                  {
                    title: "下注金额",
                    dataIndex: "bet_info",
                  },
                  {
                    title: "倍率",
                    dataIndex: "game_reward",
                    render: (text, record) => {
                      return record["game_reward"]
                        ? record["game_reward"].Rate
                        : 1;
                    },
                  },
                  {
                    title: "结算金额",
                    dataIndex: "settlement_funds",
                  },

                  {
                    title: "玩家余额",
                    dataIndex: "spare_cash",
                    render: reverseNumber,
                  },
                ]}
                size="small"
                pagination={false}
              />
            </div>
          );
          break;
        case "5b1f3a3cb76a451e210820": //上庄分分彩
          reactnode = (
            <>
              <Descriptions
                title={`玩家ID:${data.player_id}`}
                bordered
                size="small"
                column={2}
              >
                <Descriptions.Item label="开奖号码">
                  {data.lottery}
                </Descriptions.Item>
                <Descriptions.Item label="税率">
                  {data.tax_rate}
                </Descriptions.Item>
                <Descriptions.Item label="彩源名称">
                  {data.room_id === "1" ? "奇趣分分" : ""}
                </Descriptions.Item>
                <Descriptions.Item label="结算号码">
                  {data.card.result.luckyNum}
                </Descriptions.Item>
                <Descriptions.Item label="中奖区域">
                  {!data.isBanker &&
                    (data.card.result.cardType[0] === 1 &&
                    data.card.result.cardType[1] === 3
                      ? "小单"
                      : data.card.result.cardType[0] === 1 &&
                        data.card.result.cardType[1] === 4
                      ? "小双"
                      : data.card.result.cardType[0] === 2 &&
                        data.card.result.cardType[1] === 3
                      ? "大单"
                      : data.card.result.cardType[0] === 2 &&
                        data.card.result.cardType[1] === 4
                      ? "大双"
                      : "豹子")}
                  {data.isBanker &&
                    (data.card.result.cardType[0] === 1 &&
                    data.card.result.cardType[1] === 3
                      ? "庄小单"
                      : data.card.result.cardType[0] === 1 &&
                        data.card.result.cardType[1] === 4
                      ? "庄小双"
                      : data.card.result.cardType[0] === 2 &&
                        data.card.result.cardType[1] === 3
                      ? "庄大单"
                      : data.card.result.cardType[0] === 2 &&
                        data.card.result.cardType[1] === 4
                      ? "庄大双"
                      : "庄豹子")}
                </Descriptions.Item>
                <Descriptions.Item label="玩家下注">
                  注池 大:{data.bet_info.BigDownBet}
                  <br />
                  注池 小:{data.bet_info.SmallDownBet}
                  <br />
                  注池 单:{data.bet_info.SingleDownBet}
                  <br />
                  注池 双:{data.bet_info.DoubleDownBet}
                  <br />
                  注池 豹子:{data.bet_info.LeopardDownBet}
                </Descriptions.Item>
                <Descriptions.Item label="玩家本局结算金币">
                  {reverseDecimal(data.settlement_funds)}
                </Descriptions.Item>
                <Descriptions.Item label="玩家本局剩余金额">
                  {reverseDecimal(data.spare_cash)}
                </Descriptions.Item>
                <Descriptions.Item label="开奖奖期">
                  {data.periods_num}
                </Descriptions.Item>
              </Descriptions>
            </>
          );
          break;
        default:
          reactnode = <div>{JSON.stringify(res.data)}</div>;
          break;
      }
    } catch (error) {
      console.log(error);
    }
    Modal.info({
      title: "游戏数据",
      okText: "关闭",
      content: reactnode,
      width: modal_width,
      // className:"gamedataModal"
    });
  } else {
    message.info(res.msg || JSON.stringify(res));
  }
}
const initColumns = [
  {
    title: "user_id",
    dataIndex: "id",
  },
  {
    title: "产生来源",
    dataIndex: "pay_account_name",
  },
  {
    title: "余额(变动前)",
    dataIndex: "total_balance",
    render: (text, record) => {
      if (record) {
        return <div>{(record.balance + record.banker_balance).toFixed(6)}</div>;
      } else {
        return <div />;
      }
    },
  },
  {
    title: "变动金额",
    dataIndex: "final_pay",
    render: (text, record) => {
      return <span>{text.toFixed(6)}</span>;
    },
  },
  {
    title: "税收",
    dataIndex: "tax",
    render: (text, record) => {
      return <span>{record.final_pay > 0 ? text.toFixed(6) : ""}</span>;
    },
  },
  {
    title: "余额(变动后)",
    dataIndex: "total_final_balance",
    render: (text, record) => {
      if (record) {
        return (
          <div>
            {(record.final_banker_balance + record.final_balance).toFixed(6)}
          </div>
        );
      } else {
        return <div />;
      }
    },
  },
  {
    title: "备注",
    dataIndex: "pay_reason",
    width: "15%",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    render: formateDate,
  },
  {
    title: "游戏数据",
    dataIndex: "",
    render: (text, record) => (
      <LinkButton onClick={() => check_game_data(record)}>游戏数据</LinkButton>
    ),
  },
  {
    title: "有效投注",
    dataIndex: "bet_money",
    render: (text, record) => {
      return <span>{text && text.toFixed(6)}</span>;
    },
  },
];
