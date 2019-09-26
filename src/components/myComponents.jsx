import React, { Component } from "react";
import { Progress } from "antd";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/json-lint.js";
import "codemirror/theme/rubyblue.css";

export class MyProgress extends React.Component {
  state = {
    percent: 0
  };
  handle;
  render() {
    return (
      <Progress
        type="circle"
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068"
        }}
        percent={this.state.percent}
      />
    );
  }
}
const options = {
  lineNumbers: true, //显示行号
  mode: { name: "javascript", json: true }, //定义mode
  theme: "rubyblue" //选中的theme
};
export class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const conf_val = JSON.stringify([JSON.parse(this.props.conf_val)], null, 2);
    //使用默认传过来的onChange事件
    const { onChange } = this.props;
    return (
      <div className="json-editor">
        <CodeMirror
          // ref="editor-sql"
          value={conf_val}
          onChange={(editor, data, value) => {
            //返回value值给edit中的form
            return onChange(JSON.stringify(JSON.parse(value)[0]));
          }}
          options={options}
        />
      </div>
    );
  }
}
