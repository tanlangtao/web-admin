import React, { useState, useRef, useEffect } from "react";
import { Card, message, Input, Table, Select, Modal, Button, Icon } from "antd";
import { reverseNumber } from "../../utils/commonFuntion";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button";
import ReviewOrder from "./ReviewOrder";
import {
  getJisuOrderList,
  updateJisuOrderRemark,
  updateJisuOrderReview,
  updateJisuOrderStatus,
  getBankCardInfo,
  packageList as getPackageList,
} from "../../api";
import {
  switchStatus,
  switchWithdrawStatus,
  switchPackageId,
  switchPipeiStatus,
} from "../../utils/switchType";
import { toDecimal } from "../../utils/commonFuntion";
import ExportJsonExcel from "js-export-excel";
import moment from "moment";

const { TextArea } = Input;

const initRemark = {
  id: "",
  content: "",
};

const PipeiOrderList = () => {
  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [count, setCount] = useState(0);
  const [packageList, setPackageList] = useState();

  // 关键字查询
  // withdraw_user_id, withdraw_order_id, payment_user_id, payment_user_id
  const [inputKey, setInputKey] = useState("withdraw_user_id");
  const [inputVal, setInputVal] = useState("");

  // 初审弹窗
  const [reviewOrderModal, setReviewOrderModal] = useState(false);
  // 复审弹窗
  const [editOrderModal, setEditOrderModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    amount: 0,
    statue: 1,
  });
  // 备注弹窗
  const [remarkModal, setRemarkModal] = useState(initRemark);
  // 银行卡弹窗
  const [bankCardModal, setBankCardModal] = useState(null);

  const initStates = useRef({
    status: "",
    start_time: "",
    end_time: "",
    withdraw_package_id: "",
    payment_package_id: "",
    limit: 20,
    page: 1,
  });

  // 捞取品牌资讯
  const fetchPackageList = async () => {
    let res = await getPackageList([]);
    if (res.status === 0 && res.data) {
      let arr = [];
      res.data.list.forEach((element) => {
        arr.push({ label: element.name, value: element.id });
      });
      setPackageList(arr);
    }
  };

  //搜尋
  const orderSearch = () => {
    let {
      start_time,
      end_time,
      withdraw_package_id,
      payment_package_id,
      status,
      limit,
      page,
    } = initStates.current;
    let reqData = {
      [inputKey]: inputVal,
      start_time,
      end_time,
      withdraw_package_id,
      payment_package_id,
      status,
      limit,
      page,
    };
    fetchData(reqData);
  };

  //向后端请求资料
  const fetchData = async (reqData) => {
    const res = await getJisuOrderList(reqData);
    //状态码，0： 成功；-1：失败
    if (res.status === 0) {
      message.success(res.msg);
      setData(res.data.list || []);
      setCount(res.data.count);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };

  useEffect(() => {
    fetchPackageList();
    orderSearch();
  }, []);

  // 打开编辑弹窗
  const handleEdit = (record) => {
    let data = {
      id: record.id,
      amount: record.amount,
      reviewStatus: record.review_status,
    };
    setEditOrderModal(true);
    setEditData(data);
  };

  //编辑订单状态
  const updateOrderStatus = async (action, id) => {
    let reqReviewData = {
      match_id: id,
      review_type: 2,
      review_status: action,
    };
    let reqUpdateData = {
      match_id: id,
      status: action,
    };
    // 第一階段先進行複審
    const res1 = await updateJisuOrderReview(reqReviewData);
    if (res1.status === 0) {
      message.success(res1.msg);
      // 複審通過，才確認修改訂單狀態
      const res2 = await updateJisuOrderStatus(reqUpdateData);
      if (res2.status === 0) {
        message.success(res2.msg);
        setEditOrderModal(false);
        orderSearch();
      } else {
        message.info(res2.msg || JSON.stringify(res2));
      }
    } else {
      message.info(res1.msg || JSON.stringify(res1));
    }
  };

  // 备注弹窗開關
  const handleRemark = (id, content) => {
    setRemarkModal({ id, content });
  };

  // 编辑备注内容
  const updateOrderRemark = async () => {
    const { id, content } = remarkModal;
    let reqData = {
      match_id: id,
      remark: content,
    };
    const res = await updateJisuOrderRemark(reqData);
    if (res.status === 0) {
      message.success(res.msg);
      setRemarkModal({});
      orderSearch();
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };

  //查询银行卡资讯
  const showBankCard = async (user_id, package_id) => {
    let reqData = {
      user_id,
      package_id,
    };
    const res = await getBankCardInfo(reqData);
    if (res.status === 0) {
      message.success(res.msg);
      setBankCardModal(res.data);
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  };

  const handle_download = async () => {
    let {
      start_time,
      end_time,
      withdraw_package_id,
      payment_package_id,
      status,
    } = initStates.current;
    let reqData = {
      [inputKey]: inputVal,
      start_time,
      end_time,
      withdraw_package_id,
      payment_package_id,
      status,
      limit: count,
      page: 1,
    };

    const res = await getJisuOrderList(reqData);
    if (res.status === 0) {
      message.success(res.msg);
      download(res.data.list);
    } else {
      setPrintData([]);
      message.info(res.msg || JSON.stringify(res));
    }
  };

  const download = (downloadData) => {
    console.log("download");
    let option = {};
    let dataTable = [];
    if (downloadData.length > 0) {
      downloadData.forEach((ele) => {
        let obj = {
          订单流水号: ele.id,
          兑换订单号: ele.withdraw_order_id,
          兑换订单创建时间: ele.withdraw_created_at,
          兑换订单金额: toDecimal(ele.amount),
          兑换玩家ID: ele.withdraw_user_id,
          兑换玩家品牌: switchPackageId(ele.withdraw_package_id),
          兑换订单状态: switchWithdrawStatus(ele.withdraw_status),
          充值订单号: ele.payment_order_id,
          充值订单创建时间: ele.payment_created_at,
          充值订单金额: toDecimal(ele.amount),
          充值玩家ID: ele.payment_user_id,
          充值玩家品牌: switchPackageId(ele.payment_package_id),
          充值订单状态: switchStatus(ele.payment_status),
          交易订单状态: switchPipeiStatus(ele.status),
          备注: ele.remark,
        };
        dataTable.push(obj);
      });
    }

    let current = moment().format("YYYYMMDDHHmm");
    option.fileName = `匹配订单${current}`;
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetHeader: [
          "订单流水号",
          "兑换订单号",
          "兑换订单创建时间",
          "兑换订单金额",
          "兑换玩家ID",
          "兑换玩家品牌",
          "兑换订单状态",
          "充值订单号",
          "充值订单创建时间",
          "充值订单金额",
          "充值玩家ID",
          "充值玩家品牌",
          "充值订单状态",
          "交易订单状态",
          "备注",
        ],
      },
    ];

    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };

  const initColumns = [
    {
      title: "订单流水号",
      dataIndex: "id",
    },
    {
      title: "兑换订单号",
      dataIndex: "withdraw_order_id",
    },
    {
      title: "兑换订单创建时间",
      dataIndex: "withdraw_created_at",
    },
    {
      title: "兑换订单金额",
      dataIndex: "amount",
      render: reverseNumber,
    },
    {
      title: "兑换玩家ID",
      dataIndex: "withdraw_user_id",
    },
    {
      title: "兑换玩家品牌",
      dataIndex: "withdraw_package_id",
      render: switchPackageId,
    },
    {
      title: "兑换订单状态",
      dataIndex: "withdraw_status",
      render: switchWithdrawStatus,
    },
    {
      title: "充值订单号",
      dataIndex: "payment_order_id",
    },
    {
      title: "充值订单创建时间",
      dataIndex: "payment_created_at",
    },
    {
      title: "充值订单金额",
      dataIndex: "",
      render: (record) => reverseNumber(record.amount),
    },
    {
      title: "充值玩家ID",
      dataIndex: "payment_user_id",
    },
    {
      title: "充值玩家品牌",
      dataIndex: "payment_package_id",
      render: switchPackageId,
    },
    {
      title: "充值订单状态",
      dataIndex: "payment_status",
      render: switchStatus,
    },
    {
      title: "交易订单状态",
      dataIndex: "status",
      render: switchPipeiStatus,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "收款卡",
      dataIndex: "",
      render: (record) => (
        <span>
          <LinkButton
            onClick={() =>
              showBankCard(record.withdraw_user_id, record.withdraw_package_id)
            }
          >
            查看详情
          </LinkButton>
        </span>
      ),
    },
    {
      title: "操作",
      dataIndex: "",
      render: (record) => (
        <span>
          {record.status == 5 && (
            <LinkButton type="default" onClick={() => handleEdit(record)}>
              编辑
            </LinkButton>
          )}
          <LinkButton
            type="default"
            onClick={() => handleRemark(record.id, record.remark)}
          >
            编辑备注
          </LinkButton>
        </span>
      ),
    },
  ];

  return (
    <Card
      title={
        <div>
          <div>
            <Select
              placeholder="请选择"
              style={{ width: 150 }}
              defaultValue={inputKey}
              onSelect={(value) => setInputKey(value)}
            >
              <Select.Option value="withdraw_user_id">兑换玩家ID</Select.Option>
              <Select.Option value="payment_user_id">充值玩家ID</Select.Option>
              <Select.Option value="withdraw_order_id">
                兑换订单号
              </Select.Option>
              <Select.Option value="payment_order_id">充值订单号</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <Input
              type="text"
              placeholder="请输入关键字"
              style={{ width: 200 }}
              onChange={(e) => setInputVal(e.target.value)}
            />
            &nbsp; &nbsp;
            <MyDatePicker
              handleValue={(date, val) => {
                initStates.current.start_time = date[0]
                  ? date[0].valueOf() / 1000
                  : "";
                initStates.current.end_time = date[1]
                  ? Math.ceil(date[1].valueOf() / 1000)
                  : "";
              }}
            />
            &nbsp; &nbsp;
            <Select
              style={{ width: 150 }}
              defaultValue=""
              onSelect={(value) => (initStates.current.status = value)}
            >
              <Select.Option value="">交易订单状态</Select.Option>
              <Select.Option value="1">已匹配</Select.Option>
              <Select.Option value="2">已过期</Select.Option>
              <Select.Option value="3">已失败</Select.Option>
              <Select.Option value="4">已成功</Select.Option>
              <Select.Option value="5">审核中</Select.Option>
            </Select>
            &nbsp; &nbsp;
            <Select
              style={{ width: 150 }}
              defaultValue=""
              onSelect={(value) =>
                (initStates.current.withdraw_package_id = value)
              }
            >
              <Select.Option value="">兑换玩家品牌</Select.Option>
              {packageList &&
                packageList.map((ele) => {
                  return (
                    <Select.Option key={ele.value} value={`${ele.value}`}>
                      {ele.label}
                    </Select.Option>
                  );
                })}
            </Select>
            &nbsp; &nbsp;
            <Select
              style={{ width: 150 }}
              defaultValue=""
              onSelect={(value) =>
                (initStates.current.payment_package_id = value)
              }
            >
              <Select.Option value="">充值玩家品牌</Select.Option>
              {packageList &&
                packageList.map((ele) => {
                  return (
                    <Select.Option key={ele.value} value={`${ele.value}`}>
                      {ele.label}
                    </Select.Option>
                  );
                })}
            </Select>
            &nbsp; &nbsp;
            <LinkButton onClick={() => orderSearch()} size="default">
              <Icon type="search" />
            </LinkButton>
          </div>
          <div style={{ marginTop: 10 }}>
            <LinkButton
              onClick={() => setReviewOrderModal(true)}
              size="default"
            >
              <Icon type="search" />
              匹配订单状态修改
            </LinkButton>
          </div>
        </div>
      }
      extra={
        <span>
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
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        size="small"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `共${total}条`,
          defaultCurrent: 1,
          total: count,
          onChange: (page, pageSize) => {
            initStates.current.page = page;
            orderSearch();
          },
          onShowSizeChange: (current, size) => {
            initStates.current.page = current;
            initStates.current.limit = size;
            orderSearch();
          },
        }}
        scroll={{ x: "max-content" }}
      />
      {remarkModal && remarkModal.id && (
        <Modal
          title="编辑备注"
          visible={Boolean(remarkModal.id)}
          onCancel={() => setRemarkModal(initRemark)}
          footer={null}
          width="50%"
        >
          <TextArea
            rows={4}
            defaultValue={remarkModal.content}
            onChange={(e) =>
              setRemarkModal({ ...remarkModal, content: e.target.value })
            }
          ></TextArea>
          <Button
            type="primary"
            style={{ marginTop: "16px" }}
            onClick={updateOrderRemark}
          >
            提交
          </Button>
        </Modal>
      )}
      {bankCardModal && (
        <Modal
          title="银行卡信息"
          visible={Boolean(bankCardModal)}
          onCancel={() => setBankCardModal(null)}
          footer={null}
          width="50%"
        >
          <p>银行名称：{bankCardModal.bank_name}</p>
          <p>银行卡姓名：{bankCardModal.card_name}</p>
          <p>银行卡号：{bankCardModal.card_num}</p>
        </Modal>
      )}
      <Modal
        title="匹配订单状态修改"
        visible={reviewOrderModal}
        onCancel={() => setReviewOrderModal(false)}
        footer={null}
        width="70%"
      >
        <ReviewOrder
          onClose={() => {
            setReviewOrderModal(false);
            orderSearch();
          }}
        />
      </Modal>
      <Modal
        title="编辑"
        visible={editOrderModal}
        onCancel={() => setEditOrderModal(false)}
        footer={null}
        width="50%"
      >
        <div>
          <div>订单流水号：{editData.id}</div>
          <br />
          <div>订单金额：{editData.amount}</div>
          <br />
          <div>状态：{editData.reviewStatus == 1 ? "成功" : "失败"}</div>
          <br />
          <div>
            状态修改确认：
            <Button
              type="primary"
              onClick={() => updateOrderStatus(1, editData.id)}
            >
              通过
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              type="danger"
              onClick={() => updateOrderStatus(0, editData.id)}
            >
              拒绝
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default PipeiOrderList;
