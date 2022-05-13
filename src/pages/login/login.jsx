
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, Modal, message } from "antd";
import "./login.less";
import { reqLogin, reqAuthCode, navList, setToken, raceURL } from "../../api";

const Item = Form.Item;

/*
登陆的路由组件
 */
class Login extends Component {
  getMenuList = async () => {
    const result = await navList();
    if (result.status === 0) {
      let { data } = result;
      data.forEach((element) => {
        if (element.children) {
          element.children.forEach((item) => {
            item.title = item.title.slice(24);
          });
        }
      });
      localStorage.menuList = JSON.stringify(data);
      // 跳转到管理界面 (不需要再回退回到登陆)
      this.props.history.replace("/");
      // setTimeout(() => this.props.history.replace("/"), 300);
    } else {
      // 登陆失败
      // 提示错误信息
      message.info(result.msg);
    }
  };
  //点击登录按钮
  handleSubmit = (event) => {
    // 阻止事件的默认行为
    event.preventDefault();

    // 对所有表单字段进行检验
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // 请求登陆
        const { username, password, authcode } = values;
        const result = await reqLogin(
          username,
          password,
        );

        if (result.status === 0) {
          // 登陆成功
          message.success("登陆成功");
          localStorage.token = result.data.token;
          localStorage.name = result.data.name;
          localStorage.adminLoginData = JSON.stringify(result.data)
          // localStorage.tokenTimeStamp = new Date().getTime();
          setToken();
          this.getMenuList();
        } else {
          // 登陆失败
          // 提示错误信息
          message.info(result.msg);
        }
      }
    });
  };

  //点击获取验证码
  handleClick = () => {
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // 请求登陆
        const { username, password } = values;
        const result = await reqAuthCode(username, password);
        if (result.status === 0 && result.data) {
          // 登陆成功
          Modal.info({
            title: "首次登录扫码获取验证码",
            content: (
              <div>
                <img src={result.data.qrurl} alt="验证码" />
              </div>
            ),
          });
        } else {
          // 登陆失败
          // 提示错误信息
          message.info(result.msg);
        }
      }
    });

    // 得到form对象
    // const form = this.props.form
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
  };
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback("密码必须输入");
    } 
    // else if (value.length < 6) {
    //   callback("密码长度不能小于6位");
    // } 
    else if (value.length > 16) {
      callback("密码长度不能大于16位");
      // } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      //   callback("密码必须是英文、数字或下划线组成");
    } else {
      callback(); // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  };
  componentDidMount() {
    //发送空请求确定BASE地址
    raceURL();
  }
  render() {
    // 如果用户已经登陆, 自动跳转到管理界面
    const token = localStorage.token;
    if (token) {
      return <Redirect to="/" />;
    }
    // 得到具强大功能的form对象
    const form = this.props.form;
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <h1></h1>
        </header>
        <section className="login-content">
          <dev id='bg_bg'>
            <dev id='bg_text'>
            </dev>
          </dev>
          <h2></h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {/*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */}
              {getFieldDecorator("username", {
                // 配置对象: 属性名是特定的一些名称
                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入",
                  },
                  { min: 3, message: "用户名至少3位" },
                  { max: 12, message: "用户名最多12位" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须是英文、数字或下划线组成",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    validator: this.validatePwd,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            {/* <Form.Item>
              {getFieldDecorator("authcode", {
                rules: [
                  //{ required: true, whitespace: true, message: '验证码必须输入' },
                  //{ min: 4, message: '验证码至少4位' }
                ],
              })(
                <Input
                  prefix={
                    <Icon type="qrcode" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="验证码"
                />
              )}
            </Form.Item>
            <span style={{ marginTop: 5 }} onClick={this.handleClick}>
              首次登录，手机下载Google Authenticator 安装，
              <Button type="link" onClick={this.authCode}>
                点击此处
              </Button>
              扫码获取验证码
            </span> */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
const WrapLogin = Form.create()(Login);
export default WrapLogin;
