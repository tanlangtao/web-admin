import React, { Component } from "react";
import {
  Form, Icon, Input, Radio, Select, Checkbox, Button, message, InputNumber
} from "antd";
import { addUser, editUser } from "../../../api";
const roleArr = [
  {id :1,name :"超管"},
  {id :2,name :"操盘"},
  {id :3,name :"支付"},
  {id :4,name :"推广"}
]
class AddDataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBan: 1,
      checkedList: [],
      indeterminate: true,
      checkAll: false
    };
  }
  checkboxOnChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length &&
        checkedList.length < this.props.packageList.length,
      checkAll: checkedList.length === this.props.packageList.length
    });
  };
  onCheckAllChange = e => {
    let list = this.props.packageList.map(item => {
      return item.value;
    });
    this.setState(
      {
        checkedList: e.target.checked ? list : [],
        indeterminate: false,
        checkAll: e.target.checked
      },
      () => {
        this.props.form.setFieldsValue({
          packageList: this.state.checkedList
        });
      }
    );
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const res = !this.props.isEdit
          ? await addUser(value)
          : await editUser(value, this.props.editDataRecord.id);
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
  componentDidMount() {
    if (this.props.isEdit && this.props.editDataRecord.group) {
      let defaultValue = this.props.editDataRecord.group.split(",");
      this.props.form.setFieldsValue({
        packageList: defaultValue.map(Number)
      });
    }
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { editDataRecord, isEdit } = this.props;
    console.log("this.props.optionList", this.props.optionList);

    // const Option = this.props.optionList.map(item => (
    //   <Select.Option value={item.id} key={item.id}>
    //     {item.name}
    //   </Select.Option>
    // ));
    // 先不动态获取，写死
    const Option = roleArr.map(item => (
      <Select.Option value={item.id} key={item.id}>
        {item.name}
      </Select.Option>
    ))
    return (
      <Form
        labelCol={{ span: 4 }}
        onSubmit={this.handleSubmit}
        labelAlign="left"
      >
        <Form.Item label="登录名">
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                whitespace: true,
                message: "登录名必须输入"
              },
              { min: 3, message: "用户名至少3位" },
              { max: 10, message: "用户名最多10位" }
            ],
            initialValue: isEdit ? editDataRecord.name : ""
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              style={{ width: "60%" }}
              placeholder="将会成为您唯一的登入名"
              readOnly={isEdit ? true : false}
            />
          )}
        </Form.Item>
        <Form.Item label="用户状态">
          {getFieldDecorator("userStatus", {
            initialValue: isEdit ? editDataRecord.status : 1
          })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="用户组">
          {getFieldDecorator("userGroup", {
            rules: [{ required: true, message: "请选择用户组!" }],
            initialValue: isEdit && editDataRecord.group_id
          })(
            <Select style={{ width: " 40%" }} placeholder="选择用户组">
              {Option}
            </Select>
          )}
          <div><b>注意 : 只接受最高管理者与空白权限</b></div>
        </Form.Item>
        <Form.Item label="授权品牌">
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
          {getFieldDecorator("packageList", {
            rules: [{ required: true, message: "请选择授权品牌!" }]
          })(
            <Checkbox.Group
              options={this.props.packageList}
              // value={this.state.checkedList}
              onChange={checkedList => this.checkboxOnChange(checkedList)}
              style={{ width: "60%" }}
            />
          )}
        </Form.Item>
        <Form.Item label="密码" style={isEdit ? { display: "none" } : {}}>
          {getFieldDecorator("password", {
            rules: [
              {
                required: isEdit ? false : true,
                whitespace: true,
                message: "密码不能为空"
              },
              { min: 6, message: "密码至少6位" },
              { max: 16, message: "密码最多16位" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "密码必须是英文、数字或下划线组成"
              }
            ]
          })(
            <Input
              type="password"
              style={{ width: "60%",fontSize:"7px" }}
              placeholder="6到16个字符，密码强度规则为数字+英文大小写"
            />
          )}
        </Form.Item>
        <Form.Item label="确认密码" style={isEdit ? { display: "none" } : {}}>
          {getFieldDecorator("confirmPssword", {
            rules: [
              {
                required: isEdit ? false : true,
                whitespace: true
              },
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback(); //如果还没填写，则不进行一致性验证
                  }
                  if (value === getFieldValue("password")) {
                    callback();
                  } else {
                    callback("两次密码不一致");
                  }
                }
              }
            ]
          })(
            <Input
              type="password"
              style={{ width: "60%",fontSize:"7px" }}
              placeholder="6到16个字符，密码强度规则为数字+英文大小写"
            />
          )}
        </Form.Item>
        <Form.Item
          label="密码(选填)"
          style={!isEdit ? { display: "none" } : {}}
        >
          {getFieldDecorator(
            "editPassword",
          )(
            <Input
              type="password"
              style={{ width: "80%",fontSize:"1px" }}
              placeholder="6到16个字符，密码强度规则为数字+英文大小写，重置密码时使用"
            />
          )}
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
}
const WrappedAddDataForm = Form.create()(AddDataForm);

export default WrappedAddDataForm;
