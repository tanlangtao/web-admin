import React, { Component } from "react";
import "./home.less";
// import ElasticText from "../../components/elasticText";
// import { Icon} from "antd";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: ""
    };
    this.i = 0;
    this.timer = 0;
    this.str = "您好，欢迎您使用后台管理系统";
  }
  typing = () => {
    if (this.i <= this.str.length) {
      this.setState(
        {
          res: this.str.slice(0, this.i++) + "__"
        },
        () => {
          this.timer = setTimeout(() => this.typing(), 200);
        }
      );
    } else {
      this.setState({
        res: this.str
      });
      clearTimeout(this.timer);
    }
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
    this.typing();
  }
  render() {
    return <span style={{ fontSize: "20px" }}>{this.state.res}</span>;
    // <ElasticText></ElasticText>
  }
}
