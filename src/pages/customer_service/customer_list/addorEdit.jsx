import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  message,
  InputNumber
} from "antd";
import { packageList, saveCustomerService } from "../../../api";
class AddDataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      checkedList: this.props.isEdit
        ? this.props.editDataRecord.package_ids.split(",").map(Number)
        : []
    };
  }
  getPackageList = async () => {
    let res = await packageList();
    if (res.status === 0 && res.data) {
      let arr = [];
      res.data.list.forEach(element => {
        arr.push({ label: element.name, value: element.id });
      });
      this.setState({
        options: arr
      });
    }
  };
  componentDidMount() {
    this.getPackageList();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editDataRecord, isEdit } = this.props;
    return (
      <Form labelCol={{ span: 5 }} onSubmit={this.handleSubmit}>
        <Form.Item label="账号">
          {getFieldDecorator("user_id", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.user_id) : ''
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="昵称">
          {getFieldDecorator("nick_name", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.nick_name : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="授权品牌">
          {getFieldDecorator("package_ids", {
            rules: [{ required: true, message: "请选择品牌!" }],
            initialValue:
              isEdit && editDataRecord.package_ids.split(",").map(Number)
          })(
            <Checkbox.Group
              options={this.state.options}
              onChange={checkedList => this.checkboxOnChange(checkedList)}
              style={{ width: "60%" }}
            />
          )}
        </Form.Item>
        <Form.Item label="账号类型">
          {getFieldDecorator("user_type", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.user_type) : 1
          })(
            <Radio.Group>
              <Radio value={1}>人工充值</Radio>
              <Radio value={2}>人工兑换</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="是否显示">
          {getFieldDecorator("status", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.status) : 1
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="显示排序">
          {getFieldDecorator("sort", {
            rules: [{ required: true }],
            initialValue: isEdit && editDataRecord.sort
          })(<InputNumber style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      let id = this.props.editDataRecord
        ? this.props.editDataRecord.user_id
        : "";
      if (!err) {
        // value.package_ids.forEach(item => {
        //   let str = "group[" + item + "]";
        //   value[str] = item;
        // });
        // delete value.package_ids;
        value.package_ids = value.package_ids.join(',');
        const res = !this.props.isEdit
          ? await saveCustomerService(value, "add")
          : await saveCustomerService(value, "edit", id);
        if (res.status === 0) {
          message.success("提交成功");
          this.props.refreshPage();
          this.props.cancel();
          this.props.form.resetFields();
        } else {
          message.info("出错了：" + res.msg);
        }
      } else {
        message.info("提交失败");
      }
    });
  };
  checkboxOnChange = checkedList => {
    this.setState({
      checkedList: checkedList
    });
  };
}

const WrappedAddDataForm = Form.create()(AddDataForm);

export default WrappedAddDataForm;
