import React from "react";
import { Progress } from "antd";

export class MyProgress extends React.Component {
  state = {
    percent: 0
  };
  handle
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
