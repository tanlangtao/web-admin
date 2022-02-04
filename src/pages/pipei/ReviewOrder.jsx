import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Icon, Button, message } from "antd";
import { reverseNumber } from "../../utils/commonFuntion";
import { getJisuOrderList, updateJisuOrderReview } from "../../api";


const ReviewOrder = ({ onClose }) => {
  const [orderId, setOrderId] = useState('')
  const [data, setData] = useState([])

  const fetchOrderData = async () => {
    const res = await getJisuOrderList({ id: orderId })
    if (res.status === 0) {
      message.success(res.msg)
      setData(res.data.list || [])
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

  const orderReview = async (record, action) => {
    let reqData = {
      review_type: 1,
      review_status: action,
      match_id: record.id,
    }
    const res = await updateJisuOrderReview(reqData)
    if (res.status === 0) {
      message.success(res.msg)
      onClose()
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

  const initColumns = [
    {
      title: "订单流水号",
      dataIndex: "id"
    },
    {
      title: "兑换订单号",
      dataIndex: "withdraw_order_id"
    },
    {
      title: "兑换玩家ID",
      dataIndex: "withdraw_user_id"
    },
    {
      title: "兑换金额",
      dataIndex: "amount",
      render: reverseNumber,
    },
    {
      title: "充值订单号",
      dataIndex: "payment_order_id",
    },
    {
      title: "充值玩家ID",
      dataIndex: "payment_user_id",
    },
    {
      title: "操作",
      dataIndex: "status",
      render: (text, record, index) => (
        (
          record.status == 1 ||
          record.status == 2
        ) &&
        <span>
          <Button
            size="small"
            type='primary'
            onClick={() => orderReview(record, 1)}
          >
            成功
          </Button>
          &nbsp; &nbsp;
          <Button
            size="small"
            type='danger'
            onClick={() => orderReview(record, 0)}
          >
            失败
          </Button>
        </span>
      )
    }
  ];
  return (
    <div>
      <Input
        type="text"
        placeholder="订单流水号"
        style={{ width: 300 }}
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
      />
      &nbsp; &nbsp;
      <Button onClick={fetchOrderData}>
        <Icon type="search" />
      </Button>
      <br></br>
      <br></br>
      <Table
        bordered
        rowKey={(record, index) => `${index}`}
        dataSource={data}
        columns={initColumns}
        size="small"
      />
    </div>
  )
}

export default ReviewOrder