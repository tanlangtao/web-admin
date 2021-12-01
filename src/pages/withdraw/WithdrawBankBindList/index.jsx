import React, { Component } from "react";
import {
  Card,
  Table,
  Modal,
  message,
  Icon,
  Input,
  Popconfirm,
  Select,
  Button,
  Form,
} from "antd";
import {
  getbindbanklist,
  addnewbindbank,
  delbindbank,
} from "../../../api/index";
import LinkButton from "../../../components/link-button";
import WrappedEditForm from "./edit";

class BankbindOnepayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      isEditFormShow: false,
    };
  }
  getInitialData = async () => {
    const res = await getbindbanklist();
    if (res.status === 0) {
      this.setState({
        data: res.data.sort((a, b) => b.id - a.id),
        count: res.data && res.data.count,
      });
    } else {
      message.info(res.msg);
    }
  };
  componentDidMount() {
    this.getInitialData();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    // const packageNode = this.state.data.map((item) => {
    //   return (
    //     <Select.Option value={item.id} key={item.name}>
    //       {item.name.replace(/&nbsp;/g, "-")}
    //     </Select.Option>
    //   );
    // });
    return (
      <Card
        title={
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator("bank_name", {
                  rules: [{ required: true, message: "请输入银行卡简称" }],
                })(<Input style={{ width: 120 }} placeholder="银行卡简称" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("bank_id", {
                  rules: [{ required: true, message: "请输入银行卡名称" }],
                })(<Input style={{ width: 120 }} placeholder="银行卡名称" />)}
              </Form.Item>
              <Form.Item>
                <Button
                  size="default"
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  增加
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
        extra={
          <LinkButton onClick={() => window.location.reload()} size="default">
            <Icon type="reload" />
          </LinkButton>
        }
      >
        <Table
          bordered
          rowKey={(record, index) => `${index}`}
          dataSource={this.state.data}
          columns={this.initColumns()}
          size="small"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `共${total}条`,
            defaultCurrent: 1,
            total: this.state.count,
            // onChange: (page, pageSize) => {
            //   this.getInitialData(page, pageSize);
            // },
            // onShowSizeChange: (current, size) => {
            //   this.getInitialData(current, size);
            // }
          }}
        />
        <Modal
          title="编辑"
          visible={this.state.isEditFormShow}
          onCancel={() => {
            this.setState({ isEditFormShow: false });
          }}
          footer={null}
        >
          <WrappedEditForm
            finished={() => {
              this.getInitialData();
              this.setState({ isEditFormShow: false });
            }}
            // packageNode={packageNode}
            data={this.editDataRecord}
          />
        </Modal>
      </Card>
    );
  }
  initColumns = () => [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "银行卡简称",
      dataIndex: "bank_id",
    },
    {
      title: "银行卡名称",
      dataIndex: "bank_name",
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record, index) => (
        <span>
          <Button type="primary" onClick={() => this.edit(record)} size="small">
            编辑
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.onDelete(record)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        for (const key in value) {
          if (value[key] === undefined) {
            value[key] = "";
          }
        }
        const res = await addnewbindbank(value);
        if (res.status === 0) {
          message.success("提交成功");
          this.getInitialData();
          this.props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      }
    });
  };
  onDelete = async (record) => {
    console.log("record", record);
    console.log("record", `${record.id}`);
    let reqData = {
      id: record.id,
      bank_id: record.bank_id,
      bank_name: record.bank_name,
    };
    console.log("reqData", reqData);
    let res = await delbindbank(reqData);
    if (res.status === 0) {
      message.success("删除成功");
      this.getInitialData();
    } else {
      message.info("出错了：" + res.msg);
    }
  };
  edit = async (record) => {
    this.editDataRecord = record;
    this.setState({
      isEditFormShow: true,
    });
  };
}
const BankbindOnePay = Form.create()(BankbindOnepayList);
export default BankbindOnePay;
