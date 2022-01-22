import React, { useState, useEffect, useRef } from "react";
import { Card, Table, message, Icon, Select, Input } from "antd";
import { userPackageList, sendMoneyHistory } from "../../../api/index";
import _, { isArray } from "lodash-es";
import LinkButton from "../../../components/link-button/index";
import { reverseNumber } from "../../../utils/commonFuntion";
import { switchPackageId } from "../../../utils/switchType";
import { formateDate } from "../../../utils/dateUtils";

const WithDrawComplimentAwayList = () => {
  const initStates = useRef({
    user_id: "",
    package_id: "",
    receive_user_id: "",
  });
  const [current, setCurrent] = useState(1);
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
  const onSearchData = () => {
    setCurrent(1);
    fetchData(1, 50);
  };
  const fetchData = async (page, page_set) => {
    let { user_id, package_id, receive_user_id } = initStates.current;

    const res = await sendMoneyHistory({
      user_id,
      package_id,
      receive_user_id,
      page,
      page_set,
    });
    if (res.status === 0 && res.data) {
      message.success(res.msg || "请求成功");
      setComplimentData(res.data.list);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };
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
            <LinkButton onClick={onSearchData} size="default">
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
        </span>
      }
    >
      <Table
        bordered
        size="small"
        rowKey={(record, index) => `${index}`}
        dataSource={complimentData}
        columns={initColumns()}
        // loading={loading}
        pagination={{
          current: current,
          defaultCurrent: 1,
          defaultPageSize: 50,
          showSizeChanger: true,
          showQuickJumper: true,
          total: complimentData.count,
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

export default WithDrawComplimentAwayList;
