import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, Modal, message } from "antd";
import "./login.less";
import { reqLogin, reqAuthCode, navList } from "../../api";
import storageUtils from "../../utils/storageUtils";

const Item = Form.Item; // 不能写在import之前

/*
登陆的路由组件
 */
class Login extends Component {
  getMenuList = async () => {
    const result = await navList();
    if (result.status === 0) {
      let { data } = result;
      data.forEach(element => {
        if (element.children) {
          element.children.forEach(item => {
            item.title = item.title.slice(24);
          });
        }
      });
      localStorage.setItem("menuList", JSON.stringify(data));
      // 跳转到管理界面 (不需要再回退回到登陆)
      // this.props.history.replace("/");
      setTimeout(() => this.props.history.replace("/"), 300);
    }
  };
  handleSubmit = event => {
    // 阻止事件的默认行为
    event.preventDefault();

    // 对所有表单字段进行检验
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // 请求登陆
        const { username, password, authcode } = values;
        const result = await reqLogin(username, password, authcode);

        if (result.status === 0) {
          // 登陆成功
          message.success("登陆成功");
          storageUtils.saveUser(result.data); // 保存到local中
          this.getMenuList();
        } else {
          // 登陆失败
          // 提示错误信息
          message.error(result.msg);
        }
      } else {
        console.log("检验失败!");
      }
    });

    // 得到form对象
    // const form = this.props.form
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)
  };

  handleClick = () => {
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // 请求登陆
        const { username, password } = values;
        const result = await reqAuthCode(username, password);
        console.log("请求成功", result);
        if (result.status === 0 && result.data) {
          // 登陆成功
          Modal.info({
            title: "首次登录扫码获取验证码",
            content: (
              <div>
                <img src={result.data.qrurl} alt="验证码" />
              </div>
            )
          });
        } else {
          // 登陆失败
          // 提示错误信息
          message.error(result.msg);
        }
      } else {
        console.log("检验失败!");
      }
    });

    // 得到form对象
    // const form = this.props.form
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)
  };
  /*
  对密码进行自定义验证
  */
  /*
   用户名/密码的的合法性要求
     1). 必须输入
     2). 必须大于等于4位
     3). 必须小于等于12位
     4). 必须是英文、数字或下划线组成
    */
  validatePwd = (rule, value, callback) => {
    console.log("validatePwd()", rule, value);
    if (!value) {
      callback("密码必须输入");
    } else if (value.length < 4) {
      callback("密码长度不能小于4位");
    } else if (value.length > 12) {
      callback("密码长度不能大于12位");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback("密码必须是英文、数字或下划线组成");
    } else {
      callback(); // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  };

  render() {
    // 如果用户已经登陆, 自动跳转到管理界面
    const user = storageUtils.getUser();
    if (user && user._id) {
      return <Redirect to="/" />;
    }

    // 得到具强大功能的form对象
    const form = this.props.form;
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <h1>QGame: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
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
                    message: "用户名必须输入"
                  },
                  { min: 3, message: "用户名至少3位" },
                  { max: 12, message: "用户名最多12位" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须是英文、数字或下划线组成"
                  }
                ],
                initialValue: "ice" // 初始值
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
                    validator: this.validatePwd
                  }
                ],
                initialValue: "123456"
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
            <Form.Item>
              {getFieldDecorator("authcode", {
                rules: [
                  //{ required: true, whitespace: true, message: '验证码必须输入' },
                  //{ min: 4, message: '验证码至少4位' }
                ],
                initialValue: "123456"
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
              首次登录，手机下载Google Authenticator
              安装，点击此处扫码获取验证码
            </span>
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
/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
