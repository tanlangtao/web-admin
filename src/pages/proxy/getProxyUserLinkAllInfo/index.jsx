import React, { useRef, useState } from "react";
import { Table, message, Card, Input } from "antd";
import MyDatePicker from "../../../components/MyDatePicker";
import { getProxyUserLinkAllInfo } from "../../../api";
import {
  reverseNumber,
  reverseNumberforExcelDownLoad,
} from "../../../utils/commonFuntion";
import moment from "moment";
import LinkButton from "../../../components/link-button";
import ExportJsonExcel from "js-export-excel";

export default () => {
  const [table_data, set_table_data] = useState([]);
  const initstates = useRef({
    first_date: "",
    last_date: "",
    value: "",
  });
  const initColumns = [
    {
      title: "日期",
      width: 200,
      dataIndex: "date",
    },
    {
      title: "玩家ID",
      width: 100,
      dataIndex: "id",
    },
    {
      title: "电话号码",
      dataIndex: "phone_number",
      render: (text, record) => {
        if (record.phone_number) {
          return record.phone_number;
        } else return "-";
      },
    },
    {
      title: "上級ID",
      dataIndex: "proxy_user_id",
    },
    {
      title: "充值金额",
      dataIndex: "top_up_total",
      render: (text, record) => {
        return reverseNumber(record.pay_info?.top_up_total);
      },
    },
    {
      title: "兑换金额",
      dataIndex: "withdraw_total",
      render: (text, record) => {
        return reverseNumber(record.pay_info?.withdraw_total);
      },
    },
    {
      title: "棋牌总输",
      dataIndex: "lose_total1",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 1)
          .map((item) => {
            return item.lose_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "棋牌总赢",
      dataIndex: "win_total1",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 1)
          .map((item) => {
            return item.win_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "棋牌总投注",
      dataIndex: "bet_total1",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 1)
          .map((item) => {
            return item.bet_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "彩票总输",
      dataIndex: "lose_total2",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 2)
          .map((item) => {
            return item.lose_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "彩票总赢",
      dataIndex: "win_total2",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 2)
          .map((item) => {
            return item.win_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "彩票总投注",
      dataIndex: "bet_total2",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 2)
          .map((item) => {
            return item.bet_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "体育总输",
      dataIndex: "lose_total3",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 3)
          .map((item) => {
            return item.lose_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "体育总赢",
      dataIndex: "win_total3",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 3)
          .map((item) => {
            return item.win_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "体育总投注",
      dataIndex: "bet_total3",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 3)
          .map((item) => {
            return item.bet_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "视讯总输",
      dataIndex: "lose_total4",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 4)
          .map((item) => {
            return item.lose_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "视讯总赢",

      dataIndex: "win_total4",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 4)
          .map((item) => {
            return item.win_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "视讯总投注",

      dataIndex: "bet_total4",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 4)
          .map((item) => {
            return item.bet_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "电子总输",
      dataIndex: "lose_total5",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 5)
          .map((item) => {
            return item.lose_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "电子总贏",
      dataIndex: "win_total5",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 5)
          .map((item) => {
            return item.win_total;
          });
        return reverseNumber(ans);
      },
    },
    {
      title: "电子总投注",
      dataIndex: "bet_total5",
      render: (text, record) => {
        let ans = record.bet_info
          ?.filter((item) => item.game_tag === 5)
          .map((item) => {
            return item.bet_total;
          });
        return reverseNumber(ans);
      },
    },
  ];

  const download = async () => {
    let { first_date, last_date, value } = initstates.current;
    if (!value || !first_date || !last_date) {
      message.info("请选择时间范围并输入玩家ID與活动ID");
      return;
    }
    message.loading("正在统计中.....", 20);
    const res = await getProxyUserLinkAllInfo({
      id: value,
      first_date,
      last_date,
    });
    if (res.code === 200 && res.msg) {
      message.destroy();
      message.info(res.status);
      set_table_data(res.msg);
    } else {
      message.destroy();
      message.info(res.status || JSON.stringify(res));
    }

    var option = {};
    let dataTable = [];
    table_data &&
      table_data.forEach((ele) => {
        let obj = {
          日期: ele.date,
          玩家ID: ele.id,
          电话号码: ele.phone_number,
          上級ID: ele.proxy_user_id,
          充值金額: ele.pay_info
            ? reverseNumber(ele.pay_info?.top_up_total)
            : "",
          兑换金额: reverseNumber(ele.pay_info?.withdraw_total),
          棋牌总输: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 1)
              .map((item) => {
                return item.lose_total;
              })
          ),
          棋牌总赢: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 1)
              .map((item) => {
                return item.win_total;
              })
          ),
          棋牌总投注: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 1)
              .map((item) => {
                return item.bet_total;
              })
          ),
          彩票总输: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 2)
              .map((item) => {
                return item.lose_total;
              })
          ),
          彩票总赢: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 2)
              .map((item) => {
                return item.win_total;
              })
          ),
          彩票总投注: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 2)
              .map((item) => {
                return item.bet_total;
              })
          ),
          体育总输: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 3)
              .map((item) => {
                return item.lose_total;
              })
          ),
          体育总赢: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 3)
              .map((item) => {
                return item.win_total;
              })
          ),
          体育总投注: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 3)
              .map((item) => {
                return item.bet_total;
              })
          ),
          视讯总输: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 4)
              .map((item) => {
                return item.lose_total;
              })
          ),
          视讯总赢: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 4)
              .map((item) => {
                return item.win_total;
              })
          ),
          视讯总投注: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 4)
              .map((item) => {
                return item.bet_total;
              })
          ),
          电子总输: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 5)
              .map((item) => {
                return item.lose_total;
              })
          ),
          电子总贏: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 5)
              .map((item) => {
                return item.win_total;
              })
          ),
          电子总投注: reverseNumberforExcelDownLoad(
            ele.bet_info
              ?.filter((item) => item.game_tag === 5)
              .map((item) => {
                return item.bet_total;
              })
          ),
        };
        dataTable.push(obj);
      });
    console.log("dataTable", dataTable);
    let current = moment().format("YYYYMMDDHHmm");
    option.fileName = `获取代理链玩家明细${current}`;
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetHeader: [
          "日期",
          "玩家ID",
          "电话号码",
          "上級ID",
          "充值金额",
          "兑换金额",
          "棋牌总输",
          "棋牌总赢",
          "棋牌总投注",
          "彩票总输",
          "彩票总赢",
          "彩票总投注",
          "体育总输",
          "体育总赢",
          "体育总投注",
          "视讯总输",
          "视讯总赢",
          "视讯总投注",
          "电子总输",
          "电子总贏",
          "电子总投注",
        ],
      },
    ];

    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };

  const onSearchButtonHandled = async () => {
    let { value, first_date, last_date } = initstates.current;
    if (!value || !first_date || !last_date) {
      message.info("请选择时间范围并输入玩家ID與活动ID");
      return;
    }
    message.loading("正在统计中.....", 20);
    const res = await getProxyUserLinkAllInfo({
      id: value,
      first_date,
      last_date,
    });
    if (res.code === 200 && res.msg) {
      message.destroy();
      message.info(res.status);
      set_table_data(res.msg);
    } else {
      message.destroy();
      message.info(res.status || JSON.stringify(res));
    }
  };
  return (
    <Card
      title={
        <div>
          <MyDatePicker
            handleValue={(date, val) => {
              let diffDays = moment(val[1]).diff(moment(val[0]), "days");
              if (diffDays > 31) {
                message.info("请选择时间范围不超过31天");
              } else if (date && date.length !== 0) {
                initstates.current.first_date = date[0]
                  ? moment(date[0].valueOf()).format("YYYY-MM-DD")
                  : null;
                initstates.current.last_date = date[1]
                  ? moment(date[1].valueOf()).format("YYYY-MM-DD")
                  : null;
              } else {
                initstates.current.start_time = "";
                initstates.current.last_date = "";
              }
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Input.Search
            style={{ width: 200 }}
            placeholder="请输入玩家id"
            enterButton
            onChange={(e) => (initstates.current.value = e.target.value)}
            onSearch={() => onSearchButtonHandled()}
          />
        </div>
      }
      extra={
        <span>
          <LinkButton
            size="default"
            style={{ float: "right" }}
            onClick={download}
            icon="download"
          />
        </span>
      }
    >
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={table_data}
        columns={initColumns}
        size="small"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};
