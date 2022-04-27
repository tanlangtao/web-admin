import React, { useState } from "react";
import { Card, message, Input, Table, Modal, Button, Popconfirm } from "antd";
import { getLiveBlackList, deleteLiveBlackList } from "../../../api"
import LinkButton from "../../../components/link-button";
import WrappedAddDataFrom from './addForm';

const LiveBlackList = () => {
  const [data, setData] = useState([])
  const [isAdd, setIsAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputVal, setInputVal] = useState('')

  //搜尋按鈕
  const blackListSearch = async (value) => {
    setLoading(true)
    let reqData = {}
    if (value) reqData = { user_id: value }
    const res = await getLiveBlackList(reqData)
    //状态码，0： 成功；-1：失败
    if (res.code === 0) {
      setData(res.data || [])
    } else {
      message.info(res.status || JSON.stringify(res))
    }
    setLoading(false);
  }

  const deleteUser = async (value) => {
    const res = await deleteLiveBlackList({ user_id: value })
    if (res.code === 0) {
      blackListSearch()
      setInputVal('')
      message.info(res.status || JSON.stringify(res))
    } else {
      message.info(res.status || JSON.stringify(res))
    }
  }

  //Table欄位
  let initColumns = [
    {
      title: "玩家ID",
      dataIndex: "",
      render: (record) => (
        record
      ),
    },
    {
      title: "操作",
      dataIndex: "",
      render: (record) => (
        <span>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => deleteUser(record)}
            okText="删除"
            cancelText="取消"
          >
            <LinkButton type="primary" size="small">
              删除
            </LinkButton>
          </Popconfirm>
        </span>
      ),
    },
  ]

  return (
    <Card
      title={
        <div>
          <Input.Search
            style={{ width: 200 }}
            placeholder="请输入玩家id"
            enterButton
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onSearch={(value) => blackListSearch(value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => setIsAdd(true)}>
            添加
          </Button>
        </div>
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
          defaultPageSize: 50,
          showTotal: (total, range) => `共${total}条`,
          defaultCurrent: 1,
          total: data?.length || 0,
        }}
      />
      {isAdd && (
        <Modal
          title="添加"
          visible={isAdd}
          onCancel={() => setIsAdd(false)}
          footer={null}
        >
          <WrappedAddDataFrom
            cancel={() => setIsAdd(true)}
            finished={() => {
              setIsAdd(false)
              setInputVal('')
              blackListSearch()
            }}
          />
        </Modal>
      )
      }
    </Card >

  )
}

export default LiveBlackList


