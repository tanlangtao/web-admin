import React from "react";
import { Button } from "antd";
export default function LinkButton(props) {
  return (
    <Button
      type="primary"
      size='small'
      style={{ marginRight: 10}}
      {...props}
    ></Button>
  );
}
