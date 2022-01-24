import React, { useState, useEffect, useRef } from "react";
import { Card, Table, message, Icon, Select, Input } from "antd";
import { userPackageList, sendMoneyHistory } from "../../../api/index";
import _, { isArray } from "lodash-es";
import LinkButton from "../../../components/link-button/index";
import { reverseNumber } from "../../../utils/commonFuntion";
import { switchPackageId } from "../../../utils/switchType";
import { formateDate } from "../../../utils/dateUtils";
import ExportJsonExcel from "js-export-excel";
import moment from "moment";
const WithDrawComplimentAwayList = () => {
  const initStates = useRef({
    user_id: "",
    package_id: "",
    receive_user_id: "",
    page_set: 20,
    page: 1,
  });
  const [count, setCount] = useState(0);
  const [nodedata, setNode] = useState();
  const [complimentData, setComplimentData] = useState([]);
  const getInitialData = async () => {
    const res = await userPackageList();
    if (res.status === 0) {
      setNode(res.data.list);
    }
  };
  useEffect(() => {
    getInitialData();
  }, []);
  let packageNode;
  if (nodedata) {
    packageNode = nodedata.map((item) => {
      return (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  }
  const initColumns = () => [
    {
      title: "赠送流水号",
      dataIndex: "id",
      fixed: "left",
      width: 100,
    },
    {
      title: "所属品牌",
      dataIndex: "PackageId",
      render: (record) => {
        return switchPackageId(record);
      },
    },
    {
      title: "赠送玩家ID",
      dataIndex: "UserId",
      render: (text) => text || 0,
    },
    {
      title: "被赠送玩家ID",
      dataIndex: "ReceiveUserId",
      render: (text) => text || 0,
    },
    {
      title: "赠送金额",
      dataIndex: "Amount",
      render: reverseNumber,
    },
    {
      title: "交易时间",
      dataIndex: "created_at",
      render: (text, record, index) => {
        if (text === "0" || !text) {
          return "";
        } else return formateDate(text);
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) => {
        switch (text) {
          case 4:
            return "成功";
          default:
            return "";
        }
      },
    },
  ];
  const fetchData = async () => {
    let { user_id, package_id, receive_user_id, page, page_set } =
      initStates.current;
    const res = await sendMoneyHistory({
      user_id,
      package_id,
      receive_user_id,
      page,
      page_set,
    });
    if (res.status === 0 && res.data) {
      message.success(res.msg || "请求成功");
      setCount(res.data.count);
      setComplimentData(res.data.list);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };
  //
  const handle_download = async () => {
    let { user_id, package_id, receive_user_id, page, page_set } =
      initStates.current;
    const res = await sendMoneyHistory({
      user_id,
      package_id,
      receive_user_id,
      page: 1,
      page_set: count,
    });
    if (res.status === 0) {
      message.success(res.msg);
      download(res.data.list);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };

  const download = (downloadData) => {
    let option = {};
    let dataTable = [];
    if (downloadData.length > 0) {
      downloadData.forEach((ele) => {
        let obj = {
          赠送流水号: ele.id,
          所属品牌: switchPackageId(ele.PackageId),
          赠送玩家ID: ele.UserId,
          被赠送玩家ID: ele.ReceiveUserId,
          赠送金额: ele.Amount,
          交易时间: formateDate(ele.created_at),
          状态: ele.status === 4 ? "成功" : "",
        };
        dataTable.push(obj);
      });
    }

    let current = moment().format("YYYYMMDDHHmm");
    option.fileName = `赠送详情${current}`;
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetHeader: [
          "赠送流水号",
          "所属品牌",
          "赠送玩家ID",
          "被赠送玩家ID",
          "赠送金额",
          "交易时间",
          "状态",
        ],
      },
    ];

    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };
  //
  return (
    <Card
      title={
        <div>
          <div>
            <Select
              placeholder="所属品牌"
              style={{ width: 120 }}
              defaultValue={0}
              onSelect={(value) => {
                initStates.current.package_id = value;
              }}
            >
              <Select.Option value={0} key={0}>
                全部
              </Select.Option>
              {packageNode}
            </Select>
            &nbsp; &nbsp;
            <Input
              type="number"
              placeholder="赠送玩家ID"
              style={{ width: 200 }}
              onChange={(e) => {
                initStates.current.user_id = e.target.value;
              }}
            />
            &nbsp; &nbsp;
            <Input
              type="number"
              placeholder="被赠送玩家ID"
              style={{ width: 200 }}
              onChange={(e) => {
                initStates.current.receive_user_id = e.target.value;
              }}
            />
            &nbsp; &nbsp;
            <LinkButton onClick={fetchData} size="default">
              <Icon type="search" />
            </LinkButton>
            &nbsp; &nbsp;
          </div>
        </div>
      }
      extra={
        <span>
          <LinkButton
            style={{ float: "right" }}
            onClick={() => {
              window.location.reload();
            }}
            icon="reload"
            size="default"
          />
          <br />
          <br />
          <LinkButton
            size="default"
            style={{ float: "right" }}
            onClick={handle_download}
            icon="download"
          />
        </span>
      }
    >
      <Table
        bordered
        size="small"
        rowKey={(record, index) => `${index}`}
        dataSource={complimentData}
        columns={initColumns()}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          total: count,
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            initStates.current.page = page;
            fetchData();
          },
          onShowSizeChange: (current, size) => {
            initStates.current.page = current;
            initStates.current.page_set = size;
            fetchData();
          },
        }}
      />
    </Card>
  );
};

export default WithDrawComplimentAwayList;
