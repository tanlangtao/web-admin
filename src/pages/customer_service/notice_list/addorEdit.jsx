import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  DatePicker,
  message
} from "antd";
import { packageList, addNotice, updateNotice } from "../../../api";
import moment from "moment";
class AddDataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      checkedList: this.props.isEdit
        ? this.props.editDataRecord.package_ids
        : []
    };
  }
  getPackageList = async () => {
    let res = await packageList();
    if (res.status === 0) {
      let arr = [];
      res.data.forEach(element => {
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
  //index.js:1375 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.              in AddDataForm (created by Form(AddDataForm))
  //解决上诉错误：
  // componentWillUnmount() {
  //   this.setState = (state, callback) => {
  //     return;
  //   };
  // }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editDataRecord, isEdit } = this.props;
    return (
      <Form labelCol={{ span: 5 }} onSubmit={this.handleSubmit}>
        <Form.Item label="开关">
          {getFieldDecorator("is_open", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.is_open) : 1
          })(
            <Radio.Group>
              <Radio value={1}>开启</Radio>
              <Radio value={0}>关闭</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="标题">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "该项不能为空"
              }
            ],
            initialValue: isEdit ? editDataRecord.title : ""
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="品牌">
          {getFieldDecorator("packageList", {
            rules: [{ required: true, message: "请选择品牌!" }],
            initialValue: isEdit && editDataRecord.package_ids
          })(
            <Checkbox.Group
              options={this.state.options}
              // defaultValue={editDataRecord.package_ids}
              onChange={checkedList => this.checkboxOnChange(checkedList)}
            />
          )}
        </Form.Item>
        <Form.Item label="公告类型">
          {getFieldDecorator("type", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.type) : 1
          })(
            <Radio.Group>
              <Radio value={1}>活动</Radio>
              <Radio value={2}>公告</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="是否跑马灯">
          {getFieldDecorator("is_slider", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit ? parseInt(editDataRecord.type) : 1
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="排序">
          {getFieldDecorator("sort", {
            rules: [{ required: true }],
            initialValue: isEdit && editDataRecord.sort
          })(<Input style={{ width: "60%" }} />)}
        </Form.Item>
        <Form.Item label="内容">
          {getFieldDecorator("words", {
            rules: [{ required: true }],
            initialValue: isEdit ? editDataRecord.words : ""
          })(
            <Input.TextArea
              autosize={{ minRows: 2, maxRows: 6 }}
              style={{ width: "60%" }}
            />
          )}
        </Form.Item>
        <Form.Item label="开始日期">
          {getFieldDecorator("start_time", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit && moment(editDataRecord.start_time * 1000)
          })(<DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} />)}
        </Form.Item>
        <Form.Item label="截止日期">
          {getFieldDecorator("end_time", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: isEdit && moment(editDataRecord.end_time * 1000)
          })(<DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} />)}
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
      console.log(value);
      let id = this.props.editDataRecord
        ? this.props.editDataRecord._id.$oid
        : "";
      if (!err) {
        value.packageList.forEach(item => {
          let str = "group[" + item + "]";
          value[str] = item;
        });
        value.start_time = value.start_time.format("YYYY-MM-DD HH:mm:ss");
        value.end_time = value.end_time.format("YYYY-MM-DD HH:mm:ss");
        delete value.packageList;
        const res = !this.props.isEdit
          ? await addNotice(value)
          : await updateNotice(value, id);
        if (res.status === 0) {
          message.success("提交成功");
          this.props.refreshPage();
          this.props.cancel();
          this.props.form.resetFields();
        } else {
          message.error("出错了：" + res.msg);
        }
      } else {
        message.error("提交失败");
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
