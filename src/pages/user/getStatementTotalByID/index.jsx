import React, { useState, useEffect, useRef } from "react";
import { Card, message, Input, Table, Button, Select, Icon } from "antd";
import { getStatementTotalByID, queryAccount } from "../../../api/";
import { formateDate, formatDateYMD } from "../../../utils/dateUtils";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button/index";
import { getStatementGameID } from "../../../../src/utils/public_variable";
import {
  reverseNumber,
  reversePercent,
  reverseNumberforExcelDownLoad,
} from "../../../utils/commonFuntion";
const { Option } = Select;

export default () => {
  const initstates = useRef({
    start_date: "",
    end_date: "",
    account_name: "",
    game_id: "",
  });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [tableStatus, settableStatus] = useState({ page: 1, limit: 10 });
  // const [criteria, setcriteria] = useState();
  // const [packageList, setpackageList] = useState();

  const onButtonClick = async () => {
    let { start_date, end_date, account_name } = initstates.current;
    if (!start_date || !end_date) {
      message.info("请选择时间");
      return;
    }
    if (!account_name) {
      message.info("请输入玩家ID");
      return;
    }
    const res = await getStatementTotalByID(initstates.current);
    if (res.code === 200) {
      message.info(res.status || "请求成功");
      setData([res.msg] || []);
    } else {
      message.info(res.msg || "请求失败");
    }
  };

  const packageNode = getStatementGameID.map((item) => {
    return (
      <Option value={item.id} key={item.id}>
        {item.name}
      </Option>
    );
  });
  const initColumns = [
    {
      title: "玩家总赢（税前）",
      dataIndex: "win_total",
      render: reverseNumber,
    },
    {
      title: " 玩家总输 ",
      dataIndex: "lose_total",
      render: reverseNumber,
    },
    {
      title: "玩家输赢流水",
      dataIndex: "bet_total_data",
      render: (text, record) => {
        return reverseNumber(record.win_total + Math.abs(record.lose_total));
      },
    },
    {
      title: "玩家有效投注",
      dataIndex: "bet_total",
      render: reverseNumber,
    },
    {
      title: "税收金额",
      dataIndex: "win_income_total",
      render: (text, record) => {
        return reverseNumber(record.win_total - record.win_income_total);
      },
    },
    {
      title: "玩家输赢差（税后）",
      dataIndex: "lose_income_total",
      render: (text, record) => {
        return reverseNumber(
          Math.abs(record.lose_income_total) - record.win_income_total
        );
      },
    },
    {
      title: "盈亏比（税后）",
      dataIndex: "total_income_total",
      render: (text, record) => {
        return reversePercent(
          reverseNumberforExcelDownLoad(
            (Math.abs(record.lose_income_total) - record.win_income_total) /
              (Math.abs(record.lose_income_total) + record.win_income_total)
          )
        );
      },
    },
  ];
  const title = (
    <span>
      <MyDatePicker
        handleValue={(data, dateString) => {
          initstates.current = {
            ...initstates.current,
            start_date: formatDateYMD(dateString[0]),
            end_date: formatDateYMD(dateString[1]),
          };
        }}
      />
      &nbsp; &nbsp;
      <Select
        style={{ width: 200 }}
        placeholder="游戏ID"
        onChange={(val, name) => {
          console.log("val", val);
          initstates.current.game_id = val;
        }}
      >
        {packageNode}
      </Select>
      &nbsp; &nbsp;
      <Input
        type="text"
        placeholder="玩家ID"
        style={{ width: 150 }}
        onChange={(e) => {
          initstates.current = {
            ...initstates.current,
            account_name: e.target.value,
          };
        }}
      />
      &nbsp; &nbsp;
      <LinkButton onClick={onButtonClick} size="default">
        <Icon type="search" />
      </LinkButton>
      <span style={{ color: "#dc143c", fontSize: 14 }}>
        &nbsp;**日期查询区间只支持31天
      </span>
    </span>
  );

  return (
    <Card title={title}>
      <Table
        bordered
        size="small"
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        pagination={{
          current: tableStatus.page,
          pageSize: tableStatus.limit,
          total: count,
          showTotal: (total, range) => `共${total}条`,
        }}
      />
    </Card>
  );
};
