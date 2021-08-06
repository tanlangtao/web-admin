import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Card,
  message,
  Input,
  Button,
  Form,
  Switch,
  Radio,
  Divider
} from "antd";
import { getConfigList, saveWithDrawChannel } from "../../../api/index";

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  getUsers = async () => {
    let reqData = {
      conf_key: "withdraw_channel_info",
      get_val: 1
    };
    const res = await getConfigList(reqData);
    if (res.status === 0) {
      this.initialData = res.data && res.data.list;
      if (res.data.list && res.data.list.conf_val) {
        this.setState({ data: JSON.parse(res.data.list.conf_val) });
      }
    } else {
      message.info(res.msg);
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
          <Form.Item label="提款支付宝">
            {getFieldDecorator("alipay[is_close]", {
              initialValue:
                data.length !== 0 && data.alipay.is_close === 1 ? true : false,
              valuePropName: "checked"
            })(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)}
          </Form.Item>
          <Divider></Divider>
          <Form.Item label="提款银行卡">
            {getFieldDecorator("bankcard[is_close]", {
              initialValue:
                data.length !== 0 && data.bankcard.is_close === 1
                  ? true
                  : false,
              valuePropName: "checked"
            })(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)}
          </Form.Item>
          <Form.Item label="古都银行卡状态">
            {getFieldDecorator("bankcard[channel][2][is_close]", {
              initialValue:
                data.length !== 0 && parseInt(data.bankcard.channel[0].is_close)
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="显示名称">
            {getFieldDecorator("bankcard[channel][2][channel_name]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
                data.length === 0 ? "" : data.bankcard.channel[0].channel_name
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>
          <Form.Item
            label="提款限额"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][2][min_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[0].min_amount
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
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[0].max_amount
            })(<Input style={{ width: "80%" }} />)}
          </Form.Item>
          <Form.Item label="渠道排序">
            {getFieldDecorator("bankcard[channel][2][sort]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:data.length === 0 ? "" : data.bankcard.channel[0].sort
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>
          <Form.Item label="第三方代付状态">
            {getFieldDecorator("bankcard[channel][3][is_close]", {
              initialValue:
                data.length !== 0 && parseInt(data.bankcard.channel[1].is_close)
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="显示名称">
            {getFieldDecorator("bankcard[channel][3][channel_name]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[1].channel_name
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>
          <Form.Item
            label="提款限额"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][3][min_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[1].min_amount
            })(<Input style={{ width: "80%", marginRight: 5 }} />)}
            <span>-</span>
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "25%" }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][3][max_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[1].max_amount
            })(<Input style={{ width: "80%" }} />)}
          </Form.Item>
          <Form.Item label="渠道排序">
            {getFieldDecorator("bankcard[channel][3][sort]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: data.length === 0 ? "" : data.bankcard.channel[1].sort
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>
          <Form.Item label="onepay状态">
            {getFieldDecorator("bankcard[channel][7][is_close]", {
              initialValue:
                data.length !== 0 && parseInt(data.bankcard.channel[2].is_close)
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="显示名称">
            {getFieldDecorator("bankcard[channel][7][channel_name]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[2].channel_name
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>
          <Form.Item
            label="提款限额"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][7][min_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[2].min_amount
            })(<Input style={{ width: "80%", marginRight: 5 }} />)}
            <span>-</span>
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "25%" }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("bankcard[channel][7][max_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue:
              data.length === 0 ? "" : data.bankcard.channel[2].max_amount
            })(<Input style={{ width: "80%" }} />)}
          </Form.Item>
          <Form.Item label="渠道排序">
            {getFieldDecorator("bankcard[channel][7][sort]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: data.length === 0 ? "" : data.bankcard.channel[2].sort
            })(<Input style={{ width: "30%" }} />)}
          </Form.Item>

          <Divider></Divider>
          <Form.Item label="人工兑换">
            {getFieldDecorator("artificial[is_close]", {
              initialValue:
                data.length !== 0 && data.artificial.is_close === 1
                  ? true
                  : false,
              valuePropName: "checked"
            })(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)}
          </Form.Item>
          <Form.Item
            label="提款限额"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("artificial[min_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: data.length === 0 ? "" : data.artificial.min_amount
            })(<Input style={{ width: "80%", marginRight: 5 }} />)}
            <span>-</span>
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "25%" }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("artificial[max_amount]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: data.length === 0 ? "" : data.artificial.max_amount
            })(<Input style={{ width: "80%" }} />)}
          </Form.Item>
          <Form.Item label="费率">
            {getFieldDecorator("artificial[rate]", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                }
              ],
              initialValue: data.length === 0 ? "" : data.artificial.rate
            })(<Input style={{ width: "30%" }} />)}
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
    this.props.form.validateFields(async (err, value) => {
      let { id, name } = this.initialData;
      let obj = {};
      value.bankcard.channel.forEach((item, index) => {
        for (const key in item) {
          obj[`bankcard[channel][${index}][${key}]`] = item[key];
        }
      });

      obj["bankcard[is_close]"] = value.bankcard.is_close ? "on" : "off";
      obj["alipay[is_close]"] = value.alipay.is_close ? "on" : "off";
      if (value.artificial.is_close === true) {
        value.artificial.is_close = "on";
      } else {
        value.artificial.is_close = "off";
      }
      for (const key in value.artificial) {
        obj[`artificial[${key}]`] = value.artificial[key];
      }
      obj["artificial[name]"] = this.state.data.artificial.name;
      obj[
        "artificial[withdraw_type]"
      ] = this.state.data.artificial.withdraw_type;
      if (!err) {
        const res = await saveWithDrawChannel(id, name, obj);
        if (res.status === 0) {
          message.success("提交成功:" + res.msg);
          console.log(res);
          this.getUsers();
        } else {
          message.info("出错了：" + res.msg);
        }
      } else {
        message.info("提交失败");
      }
    });
  };
}
const WrappedChannel = Form.create()(Channel);

export default withRouter(WrappedChannel);
