import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Input,
  Select,
} from "antd";
import Mytable from "../../../components/MyTable";
import MyDatePicker from "../../../components/MyDatePicker";
import LinkButton from "../../../components/link-button/index";
import {
  bindInfo,
  reqUsers
} from "../../../api/index";
const { Option } = Select;
const init_state = {
  current: 1,
  pageSize: 20,
  count: 0,
  startTime: '',
  endTime: '',
  inputKey: "玩家ID",
  inputValue: "",
  inputStatus: "未支付",
  id: 427223993, // id先写死
  loading: false,
  data: [],
  MyDatePickerValue: null
};
export default class CreateNewService extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }
  componentDidMount() {
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;

    return <Card >
     
    </Card>
  }
}
