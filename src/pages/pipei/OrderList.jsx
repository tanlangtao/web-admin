import React, { useState, useRef } from "react";
import { Card, message, Input, Table, Select, Modal, Button, Icon } from "antd";
import { reverseNumber } from "../../utils/commonFuntion";
import MyDatePicker from "../../components/MyDatePicker";
import LinkButton from "../../components/link-button";
import { getJisuOrderList, updateJisuOrderRemark, updateJisuOrderStatus, getBankCardInfo } from "../../api";
import { switchStatus, switchPackageId } from "../../utils/switchType";
import { useEffect } from "react";
const { TextArea } = Input;

const initRemark = {
  id: '', content: ''
}
const PipeiOrderList = () => {
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [inputKey, setInputKey] = useState("withdraw_user_id")
  // withdraw_user_id, withdraw_package_id, withdraw_order_id, payment_user_id
  const [inputVal, setInputVal] = useState('')
  // 备注弹窗
  const [remarkModal, setRemarkModal] = useState(initRemark)
  // 银行卡弹窗
  const [bankCardModal, setBankCardModal] = useState(null)

  const initStates = useRef({
    order_status: "",
    start_time: "",
    end_time: "",
    limit: 20,
    page: 1
  })

  //搜尋
  const orderSearch = () => {
    let { start_time, end_time, order_status, limit, page } = initStates.current
    let reqData = {
      [inputKey]: inputVal,
      start_time,
      end_time,
      order_status,
      limit,
      page
    }
    fetchData(reqData)
  }

  //向后端请求资料
  const fetchData = async (reqData) => {
    const res = await getJisuOrderList(reqData)
    //状态码，0： 成功；-1：失败
    if (res.status === 0) {
      message.success(res.msg)
      console.log(res.data)
      setData(res.data || [])
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

  //编辑订单状态
  const updateOrderStatus = async (action, id) => {
    let reqData = {
      match_id: id,
      status: action == "approve" ? 1 : 2,
    }
    const res = await updateJisuOrderStatus(reqData)
    if (res.status === 0) {
      message.success(res.msg)
      orderSearch()
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

  // 备注弹窗開關
  const handleRemark = async (id, content) => {
    setRemarkModal({ id, content })
  }

  // 编辑备注内容
  const updateOrderRemark = async () => {
    const { id, content } = remarkModal
    let reqData = {
      match_id: id,
      remark: content,
    }
    const res = await updateJisuOrderRemark(reqData)
    if (res.status === 0) {
      message.success(res.msg)
      setRemarkModal({})
      orderSearch()
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

  //查询银行卡资讯
  const showBankCard = async (user_id, package_id) => {
    let reqData = {
      user_id,
      package_id,
    }
    const res = await getBankCardInfo(reqData)
    if (res.status === 0) {
      message.success(res.msg)
      setBankCardModal(res.data)
    } else {
      message.info(res.msg || JSON.stringify(res));
    }
  }

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
      render: switchStatus,
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
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "收款卡",
      dataIndex: "",
      render: (record) => (
        <span>
          <LinkButton onClick={() => showBankCard(record.withdraw_user_id, record.withdraw_package_id)}>查看详情</LinkButton>
        </span>
      ),
    },
    {
      title: "操作",
      dataIndex: "",
      render: (record) => (
        <span>
          <LinkButton onClick={() => updateOrderStatus("approve", record.id)}>成功</LinkButton>
          <LinkButton type="danger" onClick={() => updateOrderStatus("reject", record.id)}>失败</LinkButton>
          <LinkButton type="default" onClick={() => handleRemark(record.id, record.remark)}>编辑备注</LinkButton>
        </span>
      ),
    },
  ]

  useEffect(()=>{
    orderSearch()
  },[])

  return (
    <Card
      title={
        <div>
          <Select
            placeholder="请选择"
            style={{ width: 150 }}
            defaultValue={inputKey}
            onSelect={(value) => setInputKey(value)}
          >
            <Select.Option value="withdraw_user_id">兑换玩家ID</Select.Option>
            <Select.Option value="payment_user_id">充值玩家ID</Select.Option>
            <Select.Option value="withdraw_package_id">兑换玩家品牌</Select.Option>
            <Select.Option value="payment_package_id">充值玩家品牌</Select.Option>
            <Select.Option value="withdraw_order_id">兑换订单号</Select.Option>
            <Select.Option value="payment_order_id">充值订单号</Select.Option>
          </Select>
          &nbsp; &nbsp;
          <Input
            type="text"
            placeholder="请输入关键字"
            style={{ width: 200 }}
            onChange={e => setInputVal(e.target.value)
            }
          />
          &nbsp; &nbsp;
          <MyDatePicker
            handleValue={(date, val) => {
              initStates.current.start_time = date[0] ? date[0].valueOf() / 1000 : '';
              initStates.current.end_time = date[1] ? Math.ceil(date[1].valueOf() / 1000) : '';
            }}
          />
          &nbsp; &nbsp;
          <Select
            style={{ width: 150 }}
            defaultValue=""
            onSelect={(value) => initStates.current.order_status = value}
          >
            <Select.Option value="">订单状态</Select.Option>
            <Select.Option value="0">全部</Select.Option>
            <Select.Option value="1">未支付</Select.Option>
            <Select.Option value="3">已分配</Select.Option>
            <Select.Option value="4">已撤销</Select.Option>
            <Select.Option value="5">已支付</Select.Option>
            <Select.Option value="6">已完成</Select.Option>
            <Select.Option value="7">补单初审通过</Select.Option>
            <Select.Option value="8">补单初审拒绝</Select.Option>
            <Select.Option value="9">补单复审通过</Select.Option>
            <Select.Option value="10">补单复审拒绝</Select.Option>
            <Select.Option value="11">充值失败</Select.Option>
          </Select>
          &nbsp; &nbsp;
          <LinkButton onClick={() => orderSearch()} size="default">
            <Icon type="search" />
          </LinkButton>

        </div>
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
            fetchData(page, pageSize);
          },
          onShowSizeChange: (current, size) => {
            fetchData(current, size);
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
          <TextArea rows={4} defaultValue={remarkModal.content} onChange={(e) => setRemarkModal({ ...remarkModal, content: e.target.value })}></TextArea>
          <Button type="primary" style={{ 'marginTop': '16px' }} onClick={updateOrderRemark}>
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
    </Card>
  )
}

export default PipeiOrderList