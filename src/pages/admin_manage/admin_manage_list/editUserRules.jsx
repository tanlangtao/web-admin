import React, { Component } from "react";
import { Form, Input, Button, message, Tree } from "antd";
import { editUserRules } from "../../../api";

const { TreeNode } = Tree;
class AddDataForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            selectedKeys: [],
            checkedKeys: this.props.isEdit ? this.props.editDataRecord.rules.split(",") : [],
            defaultCheckedKeys: [],
        };
    }
    //   componentDidMount() {
    //     if (this.props.isEdit) {
    //       if (this.props.editDataRecord.rules) {
    //         let defaultValue = this.props.editDataRecord.rules.split(",");
    //         this.setState({
    //           defaultCheckedKeys: defaultValue
    //         });
    //       }
    //     }
    //   }
    //index.js:1375 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.              in AddDataForm (created by Form(AddDataForm))
    //解决上诉错误：
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const menuList = JSON.parse(localStorage.getItem("menuList"));
        const treeData = this.getTreeNodes(menuList);
        const { getFieldDecorator } = this.props.form;
        const { editDataRecord, isEdit } = this.props;
        return (
            <Form labelCol={{ span: 4 }} onSubmit={this.handleSubmit} labelAlign="left">
                <Form.Item label="用户名">
                    {editDataRecord.name}
                </Form.Item>
                <Form.Item label="分配权限">
                    <br />
                    <Tree
                        checkable
                        checkStrictly
                        defaultCheckedKeys={isEdit ? editDataRecord.rules.split(",") : []}
                        expandedKeys={this.state.expandedKeys}
                        selectedKeys={this.state.selectedKeys}
                        onSelect={this.onSelect}
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                    >
                        {treeData}
                    </Tree>
                </Form.Item>
                <Form.Item label="描述">
                    {getFieldDecorator("desc", {
                        rules: [{ max: 400, message: "最多400字" }],
                        initialValue: isEdit ? editDataRecord.description : "",
                    })(
                        <Input.TextArea
                            placeholder="请输入文字"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        );
    }
    getTreeNodes = (menuList) => {
        return menuList.map((item) => {
            if (!item.children) {
                return <TreeNode key={item.id} title={item.title.replace(/&nbsp;/g, "")} />;
            } else {
                return (
                    <TreeNode key={item.id} title={item.title.replace(/&nbsp;/g, "")}>
                        {this.getTreeNodes(item.children)}
                    </TreeNode>
                );
            }
        });
    };
    onSelect = (selectedKeys, info) => {
        const { node } = info;
        const { expandedKeys } = this.state;
        if (node.props.isLeaf) {
            this.setState({ selectedKeys });
        } else {
            this.setState({
                expandedKeys: node.props.expanded
                    ? expandedKeys.filter((k) => k !== node.props.eventKey)
                    : expandedKeys.concat(node.props.eventKey),
            });
        }
    };
    onCheck = (checkedKeys, info) => {
        console.log(checkedKeys);
        this.setState({
            checkedKeys: checkedKeys.checked.map(Number),
        });
    };
    onExpand = (expandedKeys, info) => {
        this.setState({ expandedKeys });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (err, value) => {
            if (!err) {
                let { desc } = value;
                let rules = this.state.checkedKeys;
                rules = rules.join(",");
                let id = this.props.editDataRecord ? this.props.editDataRecord.id : "";
                const res = await editUserRules(id, rules, desc);
                if (res.status === 0) {
                    message.success("提交成功");
                    this.props.refreshPage();
                    this.props.cancel();
                    this.props.form.resetFields();
                    this.setState({
                        checkedKeys: [],
                    });
                } else {
                    message.info("出错了：" + res.msg);
                }
                
            } else {
                message.info("提交失败");
            }
        });
    };
}

const WrappedEditRulesForm = Form.create()(AddDataForm);

export default WrappedEditRulesForm;
