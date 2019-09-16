import React from "react";
import { Modal, Table } from "antd";
import {} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import QRCode from "qrcode.react";

const EditForm = props => {
  const data = props.record;
  function checkQrcode(record) {
    Modal.success({
      title: "收款码",
      content: (<div><QRCode value={record.pay_url}></QRCode></div>),
      width: 250
    });
  }
  let initColumns = [
    {
      title: "账号类型",
      dataIndex: "type",
      render: (text, record, index) => {
        let res;
        switch (text) {
          case 1:
            res = "微信";
            break;
          case 2:
            res = "alipay";
            break;
          case 3:
            res = "银行卡";
            break;
          case 4:
            res = "花呗";
            break;
          case 5:
            res = "信用卡";
            break;
          default:
            res = "";
            break;
        }
        return <span>{res}</span>;
      }
    },
    {
      title: "账户名",
      dataIndex: "account_name"
    },
    {
      title: "账号",
      dataIndex: "account_num"
    },
    {
      title: "开户行",
      dataIndex: "bank_name"
    },
    {
      title: "收款码",
      dataIndex: "pay_url",
      render: (text, record, index) => {
        if (text && text.length > 0) {
          return (
            <LinkButton onClick={() => checkQrcode(record)}>预览</LinkButton>
          );
        }
      }
    },
    {
      title: "状态[收款码审核]",
      dataIndex: "status"
    },
    {
      title: "绑定时间",
      dataIndex: "created_at"
    },
    {
      title: "修改时间",
      dataIndex: "updated_at"
    }
  ];
  return (
    <Table
      bordered
      rowKey={(record, index) => `${index}`}
      dataSource={data}
      columns={initColumns}
      size="small"
    />
  );
};

export default EditForm;
