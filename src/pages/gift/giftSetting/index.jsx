import React, { Component } from "react";
import {  withRouter } from "react-router-dom";
import {
  Card,
  message,
  Input,
  Button,
  Form,
  Radio,
} from "antd";
import { getConfigList,  } from "../../../api/index";

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }
  getUsers = async (page, limit) => {
    const res = await getConfigList();
    if (res.status === 0) {
      this.initialData = res.data;
      this.setState({ data: JSON.parse(res.data.conf_val) });
    } else {
      message.error(res.msg);
    }
  };
  componentDidMount() {
    this.getUsers();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.state.data;
    return (
      <Card
        extra={
          <span>
            <Button
              style={{ float: "right" }}
              icon="reload"
              onClick={() => {
                window.location.reload();
              }}
            />
          </span>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="品牌">
            {getFieldDecorator("package_id", {
              initialValue: 1
            })(
              <Radio.Group>
                <Radio value={1}>博臣娱乐</Radio>
                <Radio value={0}>机器人首领</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="开关">
            {getFieldDecorator("is_close", {
              initialValue: 1
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            label="赠送区间"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("qujian", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: ""
            })(<Input style={{ width: "80%", marginRight: 5 }} />)}
            <span>-</span>
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "25%" }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][2][max_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: ""
            })(<Input style={{ width: "80%" }} />)}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
  handleSubmit = e => {
    e.preventDefault();
    // this.props.form.validateFields(async (err, value) => {
    //   let { id, name } = this.initialData;
    //   let obj = {};
    //   value.bankcard.channel.forEach((item, index) => {
    //     for (const key in item) {
    //       obj[`bankcard[channel][${index}][${key}]`] = item[key];
    //     }
    //   });

    //   obj["bankcard[is_close]"] = value.bankcard.is_close ? "on" : "off";
    //   obj["alipay[is_close]"] = value.alipay.is_close ? "on" : "off";
    //   for (const key in value.artificial) {
    //     obj[`artificial[${key}]`] = value.artificial[key];
    //   }
    //   if (!err) {
    //     const res = await saveWithDrawChannel(id, name, obj);
    //     if (res.status === 0) {
    //       message.success("提交成功:" + res.msg);
    //       console.log(res);
    //       this.getUsers();
    //     } else {
    //       message.error("出错了：" + res.msg);
    //     }
    //   } else {
    //     message.error("提交失败");
    //   }
    // });
  };
}
const WrappedChannel = Form.create()(Channel);

export default withRouter(WrappedChannel);
