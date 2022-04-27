import React, { useState, useRef } from "react";

import { Card, message, Input, Table, Select, Button, Icon } from "antd";
import _ from "lodash-es";
import ExportJsonExcel from "js-export-excel";

import { getGameDataList } from "../../../api/";
import { formateDate } from "../../../utils/dateUtils";
import { reverseNumber } from "../../../utils/commonFuntion";
import MyDatePicker from "../../../components/MyDatePicker";
import { gameRouter } from "../../../utils/public_variable";

let new_gameRouter2 = {
  ...gameRouter,
  cbzb1: { path: "/castcraft/api", name: "城堡争霸进攻" },
  cbzb2: { path: "/castcraft/api", name: "城堡争霸防守" },
};
export default (props) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gameID, set_gameID] = useState();
  const initStates = useRef({
    game_id: "",
    id: "",
    start_time: "",
    end_time: "",
    room_id: "",
  });
  const searchData = useRef({});
  let searchButtonOnclick = () => {
    let { game_id, id, start_time, end_time, room_id } = initStates.current;
    if (!start_time || !end_time) {
      message.info("请选择时间范围");
      return;
    }
    if (!game_id) {
      message.info("请选择游戏名称");
      return;
    }
    //render函数中如果返回reactnode,会在下次table的data改变的时候来不及卸载而产生错误,所以提前重置data
    setData([]);
    setCount(0);
    searchData.current = {
      game_id,
      id,
      start_time,
      end_time,
      room_id,
    };
    setLoading(true);
    setCurrent(1);
    fetchData(1, 50);
  };
  let fetchData = async (page, limit) => {
    setLoading(true);

    let { game_id } = searchData.current;
    let reqStr;
    switch (game_id) {
      case "5b1f3a3cb76a591e7f251712": //水果机
        reqStr = `${new_gameRouter2[game_id].path}/getFundsFlow?page=${page}&limit=${limit}`;
        break;
      case "5c6a62be7ff587m117d446aa": //红包乱斗
      case "5b1f3a3cb76a451e210913": //红包乱斗2
        reqStr = `${new_gameRouter2[game_id].path}/getGameDataByTime?page=${page}&limit=${limit}`;
        break;
      case "5b1f3a3cb76a591e7f251720":
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?page=${page}&limit=${limit}&personal=1`;
        break;
      case "5c6a62be7ff09a54amb446aa": //跑得快
      case "5b1f3a3cb76a591e7f2517a6": //海王捕鱼
      case "5b1f3a3cb76a591e7f251730": //财神到
        reqStr = `${new_gameRouter2[game_id].path}/getGamePlayerData?page=${page}&limit=${limit}`;
        break;
      case "5b1f3a3cb76a591e7f251715": //扎金花
      case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
      case "5b1f3a3cb76a451e211018": //抢庄牛牛2
      case "5b1f3a3cb76a591e7f25171": //十三水
        reqStr = `${new_gameRouter2[game_id].path}/getPlayerData?page=${page}&limit=${limit}`;
        break;
      case "cbzb1": //城堡争霸进攻
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?query_type=1&page=${page}&limit=${limit}`;
        break;
      case "cbzb2": //城堡争霸防守
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?query_type=2&page=${page}&limit=${limit}`;
        break;
      default:
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?page=${page}&limit=${limit}`;
        break;
    }

    if (game_id === "5b1f3a3cb76a591e7f25176" && searchData.current.room_id) {
      reqStr += `&game_id=${searchData.current.game_id}&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&cfg_id=${searchData.current.room_id}`;
    } else if (game_id === "cbzb1") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=1`;
    } else if (game_id === "cbzb2") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=2`;
    } else {
      _.forEach(searchData.current, (value, key) => {
        if (value) {
          reqStr += `&${key}=${value}`;
        }
      });
    }
    try {
      const res = await getGameDataList(reqStr);
      if (res.code === 0) {
        message.success(res.msg || "请求成功");
        setData(res.data?.list || []);
        setCount(res.data?.total || 0);
      } else {
        setData([]);
        setCount(0);
        message.info(res.msg || JSON.stringify(res));
      }
      setLoading(false);
    } catch (err) {
      setData([]);
      setCount(0);
      setLoading(false);
    }
  };
  let initColumns = [
    {
      title: "游戏名称",
      dataIndex: "name",
      render: () => new_gameRouter2[searchData.current.game_id].name,
    },
    {
      title: "房间信息",
      dataIndex: "room_id",
      render: (text, record) => {
        let res;
        switch (searchData.current.game_id) {
          case "5b1f3a3cb76a591e7f25176": //德州扑克
            switch (record.cfg_id) {
              case "0":
                res = "体验场";
                break;
              case "1":
                res = "初级场";
                break;
              case "2":
                res = "中级场";
                break;
              case "3":
                res = "高级场";
                break;
              default:
                res = record.cfg_id;
                break;
            }
            break;
          case "5c6a62be7ff09a54amb446aa": //跑得快
            switch (record.odds) {
              case 0.01:
                res = "体验场";
                break;
              case 0.2:
                res = "初级场";
                break;
              case 1:
                res = "中级场";
                break;
              case 10:
                res = "高级场";
                break;
              default:
                res = record.odds;
                break;
            }
            break;
          case "5b1f3a3cb76a591e7f2517a6": //海王捕鱼
          case "5c6a62be7ff587m117d446aa": //红包乱斗
            res = record?.room_name;
            break;
          case "5c6a62be56209ac117d446aa": //聚宝盆捕鱼
            res = record?.room_info;
            break;
          case "cbzb2":
            res = record?.building_id;
            break;
          case "5b1f3a3cb76a591e7f251732":
            res = record?.room_name;
            break;
          default:
            res = text;
            break;
        }
        return res;
      },
    },
    {
      title: "玩家ID",
      dataIndex: "player_id",
      render: (text, record) => {
        let reactnode;
        switch (searchData.current.game_id) {
          case "5b1f3a3cb76a591e7f251711": //斗地主
            reactnode = (
              <React.Fragment>
                {(record?.settlement || []).map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.PlayerId}
                      {record?.player_info?.[ele.PlayerId]?.is_robot
                        ? "(robot)"
                        : ""}
                    </div>
                  );
                })}
              </React.Fragment>
            );
            break;
          case "5b1f3a3cb76a591e7f25170": //二人麻将
            reactnode = (
              <React.Fragment>
                {(record?.settlement?.player_settlement_info || []).map(
                  (ele, i) => {
                    return (
                      <div key={i}>
                        {ele.player_id}
                        {ele.is_robot ? "(robot)" : ""}
                      </div>
                    );
                  }
                )}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff09a54amb446aa": //跑得快
          case "5b1f3a3cb76a591e7f251715": //扎金花
          case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
          case "5b1f3a3cb76a451e211018": //抢庄牛牛2
          case "5b1f3a3cb76a591e7f25171": //十三水
          case "5b1f3a3cb76a591e7f25176": //德州扑克
            reactnode = (
              <React.Fragment>
                {(record?.player_info || []).map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.player_id}
                      {ele.is_robot ? "(robot)" : ""}
                    </div>
                  );
                })}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff587m117d446aa": //红包乱斗
            reactnode = (
              <React.Fragment>
                {(record?.ListPartner || []).map((ele, i) => {
                  return (
                    <div key={i}>
                      {ele.player_id}
                      {ele.is_robot ? "(robot)" : ""}
                    </div>
                  );
                })}
              </React.Fragment>
            );
            break;
          default:
            reactnode = text;
            break;
        }
        return reactnode;
      },
    },
    {
      title: "结算金币",
      dataIndex: "settlement_funds",
      render: (text, record) => {
        let reactnode;
        switch (searchData.current.game_id) {
          case "5b1f3a3cb76a591e7f251711": //斗地主
            reactnode = (
              <React.Fragment>
                {(record?.settlement || []).map((ele, i) => {
                  return <div key={i}>{reverseNumber(ele.WinLossGold)}</div>;
                })}
              </React.Fragment>
            );
            break;
          case "5b1f3a3cb76a591e7f25170": //二人麻将
            reactnode = (
              <React.Fragment>
                {(record?.settlement?.player_settlement_info || []).map(
                  (ele, i) => {
                    return (
                      <div key={i}>{reverseNumber(ele.win_lose_gold)}</div>
                    );
                  }
                )}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff09a54amb446aa": //跑得快
          case "5b1f3a3cb76a591e7f251715": //扎金花
          case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
          case "5b1f3a3cb76a451e211018": //抢庄牛牛2
          case "5b1f3a3cb76a591e7f25171": //十三水
          case "5b1f3a3cb76a591e7f25176": //德州扑克
            reactnode = (
              <React.Fragment>
                {(record?.player_info || []).map((ele, i) => {
                  return (
                    <div key={i}>{reverseNumber(ele.settlement_funds)}</div>
                  );
                })}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff587m117d446aa": //红包乱斗
            reactnode = (
              <React.Fragment>
                {(record?.ListPartner || []).map((ele, i) => {
                  return (
                    <div key={i}>{reverseNumber(ele.settlement_funds)}</div>
                  );
                })}
              </React.Fragment>
            );
            break;
          default:
            reactnode = <React.Fragment>{reverseNumber(text)}</React.Fragment>;
            break;
        }
        return reactnode;
      },
    },
    {
      title: "剩余金币",
      dataIndex: "spare_cash",
      render: (text, record) => {
        let reactnode;
        switch (searchData.current.game_id) {
          case "5b1f3a3cb76a591e7f251711": //斗地主
            reactnode = (
              <React.Fragment>
                {(record?.settlement || []).map((ele, i) => {
                  return <div key={i}>{reverseNumber(ele.CurrentGold)}</div>;
                })}
              </React.Fragment>
            );
            break;
          case "5b1f3a3cb76a591e7f25170": //二人麻将
            reactnode = (
              <React.Fragment>
                {(record?.settlement?.player_settlement_info || []).map(
                  (ele, i) => {
                    return <div key={i}>{reverseNumber(ele.current_gold)}</div>;
                  }
                )}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff09a54amb446aa": //跑得快
          case "5b1f3a3cb76a591e7f251715": //扎金花
          case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
          case "5b1f3a3cb76a451e211018": //抢庄牛牛2
          case "5b1f3a3cb76a591e7f25171": //十三水
          case "5b1f3a3cb76a591e7f25176": //德州扑克
            reactnode = (
              <React.Fragment>
                {(record?.player_info || []).map((ele, i) => {
                  return <div key={i}>{reverseNumber(ele.spare_cash)}</div>;
                })}
              </React.Fragment>
            );
            break;
          case "5c6a62be7ff587m117d446aa": //红包乱斗
            reactnode = (
              <React.Fragment>
                {(record?.ListPartner || []).map((ele, i) => {
                  return <div key={i}>{reverseNumber(ele.spare_cash)}</div>;
                })}
              </React.Fragment>
            );
            break;
          default:
            reactnode = <React.Fragment>{reverseNumber(text)}</React.Fragment>;
            break;
        }
        return reactnode;
      },
    },
    {
      title: "结算时间",
      dataIndex: "created_at",
      render: (text, record) => {
        let reactnode;
        switch (searchData.current.game_id) {
          case "5c6a62be7ff587m117d446aa": //红包乱斗
            reactnode = (
              <React.Fragment>
                {(record?.ListPartner || []).map((ele, i) => {
                  return <div key={i}>{formateDate(ele.created_at) || 0}</div>;
                })}
              </React.Fragment>
            );
            break;
          default:
            reactnode = formateDate(text);
            break;
        }
        return reactnode;
      },
    },
  ];
  const downloadExcel = async (page, limit) => {
    setLoading(true);
    // let searchData = reqData.current;
    // let { start_time, end_time } = searchData;
    let { game_id } = searchData.current;
    let reqStr;
    switch (game_id) {
      case "5b1f3a3cb76a591e7f251712": //水果机
        reqStr = `${new_gameRouter2[game_id].path}/getFundsFlow?page=${page}&limit=${limit}`;
        break;
      case "5c6a62be7ff587m117d446aa": //红包乱斗
      case "5b1f3a3cb76a451e210913": //红包乱斗2
        reqStr = `${new_gameRouter2[game_id].path}/getGameDataByTime?page=${page}&limit=${limit}`;
        break;
      case "5b1f3a3cb76a591e7f251720":
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?page=${page}&limit=${limit}&personal=1`;
        break;
      case "5c6a62be7ff09a54amb446aa": //跑得快
      case "5b1f3a3cb76a591e7f2517a6": //海王捕鱼
      case "5b1f3a3cb76a591e7f251730": //财神到
        reqStr = `${new_gameRouter2[game_id].path}/getGamePlayerData?page=${page}&limit=${limit}`;
        break;
      case "5b1f3a3cb76a591e7f251715": //扎金花
      case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
      case "5b1f3a3cb76a451e211018": //抢庄牛牛2
      case "5b1f3a3cb76a591e7f25171": //十三水
        reqStr = `${new_gameRouter2[game_id].path}/getPlayerData?page=${page}&limit=${limit}`;
        break;
      case "cbzb1": //城堡争霸进攻
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?query_type=1&page=${page}&limit=${limit}`;
        break;
      case "cbzb2": //城堡争霸防守
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?query_type=2&page=${page}&limit=${limit}`;
        break;
      default:
        reqStr = `${new_gameRouter2[game_id].path}/getGameData?page=${page}&limit=${limit}`;
        break;
    }
    if (game_id === "5b1f3a3cb76a591e7f25176" && searchData.current.room_id) {
      reqStr += `&game_id=${searchData.current.game_id}&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&cfg_id=${searchData.current.room_id}`;
    } else if (game_id === "cbzb1") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=1`;
    } else if (game_id === "cbzb2") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=2`;
    } else {
      _.forEach(searchData.current, (value, key) => {
        if (value) {
          reqStr += `&${key}=${value}`;
        }
      });
    }
    if (game_id === "5b1f3a3cb76a591e7f25176" && searchData.current.room_id) {
      reqStr += `&game_id=${searchData.current.game_id}&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&cfg_id=${searchData.current.room_id}`;
    } else if (game_id === "cbzb1") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=1`;
    } else if (game_id === "cbzb2") {
      reqStr += `&game_id=5b1f3a3cb76a591e7f251729&id=${searchData.current.id}&start_time=${searchData.current.start_time}&end_time=${searchData.current.end_time}&query_type=2`;
    } else {
      _.forEach(searchData.current, (value, key) => {
        if (value) {
          reqStr += `&${key}=${value}`;
        }
      });
    }
    try {
      const res = await getGameDataList(reqStr);
      if (res.code === 0) {
        message.success(res.msg || "请求成功");
        let option = {};
        let dataTable = [];
        let columns = initColumns;
        res.data.list.forEach((ele) => {
          let obj = {};
          let record = ele;
          columns.forEach((item) => {
            // obj[item.title] = ele[item.dataIndex];
            if (item.dataIndex === "name") {
              obj[item.title] =
                new_gameRouter2[searchData.current.game_id].name;
            }
            if (item.dataIndex === "room_id") {
              let res;
              switch (searchData.current.game_id) {
                case "5b1f3a3cb76a591e7f25176": //德州扑克
                  switch (record.cfg_id) {
                    case "0":
                      res = "体验场";
                      break;
                    case "1":
                      res = "初级场";
                      break;
                    case "2":
                      res = "中级场";
                      break;
                    case "3":
                      res = "高级场";
                      break;
                    default:
                      res = record.cfg_id;
                      break;
                  }
                  break;
                case "5c6a62be7ff09a54amb446aa": //跑得快
                  switch (record.odds) {
                    case 0.01:
                      res = "体验场";
                      break;
                    case 0.2:
                      res = "初级场";
                      break;
                    case 1:
                      res = "中级场";
                      break;
                    case 10:
                      res = "高级场";
                      break;
                    default:
                      res = record.odds;
                      break;
                  }
                  break;
                case "5b1f3a3cb76a591e7f2517a6": //海王捕鱼
                case "5c6a62be7ff587m117d446aa": //红包乱斗
                  res = record?.room_name;
                  break;
                case "5c6a62be56209ac117d446aa": //聚宝盆捕鱼
                  res = record?.room_info;
                  break;
                default:
                  res = ele[item.dataIndex];
                  break;
              }
              obj[item.title] = res;
            }
            if (item.dataIndex === "player_id") {
              let res;
              switch (searchData.current.game_id) {
                case "5b1f3a3cb76a591e7f251711": //斗地主
                  res = (record?.settlement || []).map((ele, i) => {
                    return `${ele.PlayerId}${record?.player_info?.[ele.PlayerId]?.is_robot
                        ? "(robot)"
                        : ""
                      }\n`;
                  });
                  break;
                case "5b1f3a3cb76a591e7f25170": //二人麻将
                  res = (record?.settlement?.player_settlement_info || []).map(
                    (ele, i) => {
                      return ` ${ele.player_id}${ele.is_robot ? "(robot)" : ""
                        }\n`;
                    }
                  );
                  break;
                case "5c6a62be7ff09a54amb446aa": //跑得快
                case "5b1f3a3cb76a591e7f251715": //扎金花
                case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
                case "5b1f3a3cb76a451e211018": //抢庄牛牛2
                case "5b1f3a3cb76a591e7f25171": //十三水
                case "5b1f3a3cb76a591e7f25176": //德州扑克
                  res = (record?.player_info || []).map((ele, i) => {
                    return `${ele.player_id}${ele.is_robot ? "(robot)" : ""}\n`;
                  });
                  break;
                case "5c6a62be7ff587m117d446aa": //红包乱斗
                  res = (record?.ListPartner || []).map((ele, i) => {
                    return `${ele.player_id}${ele.is_robot ? "(robot)" : ""}\n`;
                  });
                  break;
                default:
                  res = ele[item.dataIndex];
                  break;
              }
              if (Array.isArray(res)) {
                obj[item.title] = res.join("");
              } else {
                obj[item.title] = res;
              }
            }
            if (item.dataIndex === "settlement_funds") {
              let res;
              switch (searchData.current.game_id) {
                case "5b1f3a3cb76a591e7f251711": //斗地主
                  res = (record?.settlement || []).map((ele, i) => {
                    return `${reverseNumber(ele.WinLossGold)}\n`;
                  });
                  break;
                case "5b1f3a3cb76a591e7f25170": //二人麻将
                  res = (record?.settlement?.player_settlement_info || []).map(
                    (ele, i) => {
                      return `${reverseNumber(ele.win_lose_gold)}\n`;
                    }
                  );
                  break;
                case "5c6a62be7ff09a54amb446aa": //跑得快
                case "5b1f3a3cb76a591e7f251715": //扎金花
                case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
                case "5b1f3a3cb76a451e211018": //抢庄牛牛2
                case "5b1f3a3cb76a591e7f25171": //十三水
                case "5b1f3a3cb76a591e7f25176": //德州扑克
                  res = (record?.player_info || []).map((ele, i) => {
                    return `${reverseNumber(ele.settlement_funds)}\n`;
                  });
                  break;
                case "5c6a62be7ff587m117d446aa": //红包乱斗
                  res = (record?.ListPartner || []).map((ele, i) => {
                    return `${reverseNumber(ele.settlement_funds)}\n`;
                  });
                  break;
                default:
                  res = reverseNumber(ele[item.dataIndex]);
                  break;
              }
              if (Array.isArray(res)) {
                obj[item.title] = res.join("");
              } else {
                obj[item.title] = res;
              }
            }
            if (item.dataIndex === "spare_cash") {
              let res;
              switch (searchData.current.game_id) {
                case "5b1f3a3cb76a591e7f251711": //斗地主
                  res = (record?.settlement || []).map((ele, i) => {
                    return `${reverseNumber(ele.CurrentGold)}\n`;
                  });
                  break;
                case "5b1f3a3cb76a591e7f25170": //二人麻将
                  res = (record?.settlement?.player_settlement_info || []).map(
                    (ele, i) => {
                      return `${reverseNumber(ele.current_gold)}\n`;
                    }
                  );
                  break;
                case "5c6a62be7ff09a54amb446aa": //跑得快
                case "5b1f3a3cb76a591e7f251715": //扎金花
                case "5b1f3a3cb76a591e7f251714": //抢庄牛牛
                case "5b1f3a3cb76a451e211018": //抢庄牛牛2
                case "5b1f3a3cb76a591e7f25171": //十三水
                case "5b1f3a3cb76a591e7f25176": //德州扑克
                  res = (record?.player_info || []).map((ele, i) => {
                    return `${reverseNumber(ele.spare_cash)}\n`;
                  });
                  break;
                case "5c6a62be7ff587m117d446aa": //红包乱斗
                  res = (record?.ListPartner || []).map((ele, i) => {
                    return `${reverseNumber(ele.spare_cash)}\n`;
                  });
                  break;
                default:
                  res = reverseNumber(ele[item.dataIndex]);
                  break;
              }
              if (Array.isArray(res)) {
                obj[item.title] = res.join("");
              } else {
                obj[item.title] = res;
              }
            }
            if (item.dataIndex === "created_at") {
              let res;
              switch (searchData.current.game_id) {
                case "5c6a62be7ff587m117d446aa": //红包乱斗
                  res = (record?.ListPartner || []).map((ele, i) => {
                    return `${formateDate(ele.created_at) || 0}\n`;
                  });
                  break;
                default:
                  res = formateDate(ele[item.dataIndex]);
                  break;
              }
              if (Array.isArray(res)) {
                obj[item.title] = res.join("");
              } else {
                obj[item.title] = res;
              }
            }
          });
          dataTable.push(obj);
        });
        console.log(dataTable);
        let sheetFilter = [];
        columns.forEach((item) => {
          if (item.title && item.dataIndex) {
            sheetFilter.push(item.title);
          }
        });
        option.fileName = `游戏数据`;
        option.datas = [
          {
            sheetData: dataTable,
            sheetName: "sheet",
            sheetFilter: sheetFilter,
            sheetHeader: sheetFilter,
          },
        ];
        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
      } else {
        message.info(res.msg || JSON.stringify(res));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const handle_download = () => {
    if (data.length !== 0) {
      downloadExcel(1, count);
    } else {
      message.info("下载失败,没有资料");
    }
  };
  return (
    <Card
      title={
        <React.Fragment>
          <div>
            <span style={{ fontSize: 14, marginRight: 20 }}>游戏名称</span>
            <Select
              placeholder="筛选/必填"
              style={{ width: 200, marginRight: 100 }}
              onChange={(value) => {
                initStates.current.game_id = value;
                set_gameID(value);
              }}
            >
              {_.map(new_gameRouter2, (value, key) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value.name}
                  </Select.Option>
                );
              })}
            </Select>
            <span style={{ fontSize: 14, marginRight: 20 }}>玩家ID</span>
            <Input
              placeholder="根据游戏名称联合查询"
              style={{ width: 200 }}
              onChange={(e) => {
                console.log(e.target.value);
                initStates.current.id = e.target.value;
              }}
            />
          </div>
          <br />

          <div>
            <span style={{ fontSize: 14, marginRight: 20 }}>房间信息</span>
            {gameID !== "5b1f3a3cb76a591e7f25176" ? (
              <Input
                placeholder="根据游戏名称联合查询"
                style={{ width: 200, marginRight: 112 }}
                onChange={(e) => {
                  initStates.current.room_id = e.target.value;
                }}
              />
            ) : (
              <Select
                style={{ width: 200, marginRight: 112 }}
                onChange={(value) => {
                  initStates.current.room_id = value;
                }}
                defaultValue=""
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="0">体验场</Select.Option>
                <Select.Option value="1">初级场</Select.Option>
                <Select.Option value="2">中级场</Select.Option>
                <Select.Option value="3">高级场</Select.Option>
              </Select>
            )}
            <span style={{ fontSize: 14, marginRight: 20 }}>时间</span>
            <MyDatePicker
              format="YYYY-MM-DD HH:mm"
              handleValue={(date, dateString) => {
                if (date[0]) {
                  console.log(
                    Math.floor(date[0].valueOf() / 1000),
                    Math.floor(date[1].valueOf() / 1000)
                  );
                  initStates.current.start_time = Math.floor(
                    date[0].valueOf() / 1000
                  );
                  initStates.current.end_time = Math.floor(
                    date[1].valueOf() / 1000
                  );
                } else {
                  initStates.current.start_time = null;
                  initStates.current.end_time = null;
                }
              }}
            />
          </div>
          <br />
          <Button type="primary" onClick={() => searchButtonOnclick()}>
            <Icon type="search" />
          </Button>
        </React.Fragment>
      }
      extra={
        <>
          <Button type="primary" icon="download" onClick={handle_download}>
            导出数据
          </Button>
        </>
      }
    >
      <Table
        bordered
        size="small"
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        loading={loading}
        pagination={{
          current: current,
          defaultCurrent: 1,
          defaultPageSize: 50,
          // showSizeChanger: true,
          showQuickJumper: true,
          total: count,
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            setCurrent(page);
            fetchData(page, pageSize);
          },
          // onShowSizeChange: (current, size) => {
          //     this.setState({
          //         pageSize: size,
          //     });
          //     this.getInitialData(current, size);
          // },
        }}
      />
    </Card>
  );
};
