import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, message, Input, Button, Form, Radio } from "antd";
import { getConfigList, setGiftConfig } from "../../../api/index";

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getUsers = async () => {
    let reqData = {
      conf_key: "give_info",
      get_val: 1
    };
    const res = await getConfigList(reqData);
    if (res.status === 0) {
      this.resData = res.data;
    } else {
      message.error(res.msg);
    }
  };
  componentDidMount() {
    this.getUsers();
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
                <Radio value={0}>开启</Radio>
                <Radio value={1}>关闭</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            label="赠送区间"
            style={{ display: "inline-block", width: "25%" }}
            labelCol={{ span: 9, offset: 7 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("min_amount", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                },
                {
                  validator: (rule, value, callback) => {
                    if (value < 0) {
                      callback("金额不能为负"); //如果还没填写，则不进行验证
                    }
                    if (!value) {
                      callback();
                    }
                    callback();
                  }
                }
              ]
            })(<Input style={{ width: "80%", marginRight: 5 }} />)}
            <span>-</span>
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "25%" }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator("max_amount", {
              rules: [
                {
                  required: true,
                  message: "该项不能为空"
                },
                {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback(); //如果还没填写，则不进行一致性验证
                    }
                    if (value < getFieldValue("min_amount")) {
                      callback("最大面值小于最小面值");
                    }
                    if (value < 0) {
                      callback("金额不能为负");
                    }
                    callback();
                  }
                }
              ]
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
    this.props.form.validateFields(async (err, value) => {
      console.log(value);
      if (!err) {
        console.log(this.resData);
        const { id, name, conf_val, conf_key } = this.resData;
        let new_conf_val = JSON.parse(conf_val);
        let reqData = {
          id,
          name,
          ...value,
          action: "edit",
          conf_key
        };
        reqData.give_info = new_conf_val;
        const res = await setGiftConfig(reqData);
        if (res.status === 0) {
          message.success("提交成功:" + res.msg);
          console.log(res);
          this.getUsers();
        } else {
          message.error("出错了：" + res.msg);
        }
      } else {
        message.error("提交失败");
      }
    });
  };
}
const WrappedChannel = Form.create()(Channel);

export default withRouter(WrappedChannel);
