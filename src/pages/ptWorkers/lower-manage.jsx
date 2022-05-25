import React, { Component } from "react";
import {
  Card,
  Modal,
  message,
  Icon,
  Select,
  Input,
  InputNumber,
  Popconfirm,
  Button,
} from "antd";

import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import {
  reqLowerUsers,
  setGameUserNickName,
  changeGold,
  reqLoadGold,
  saveUserBlack,
  createTask,
  updateSavePassword,
  setCustomer,
  downloadUserList,
  setgameuserstatus,
  setGameUserPhone,
  getipdetail,
  getteldetail,
  changeProxyUserProxyPid,
  reqCreditAdduser,
  reqGetDividendRule,
  reqCreateDividendRule,
  reqSetDividendRule,
} from "../../api/index";
import MyDatePicker from "../../components/MyDatePicker";
import Mytable from "../../components/MyTable";
import { throttle } from "../../utils/commonFuntion";
import UserListRouter from "../user/userList_router";

const { Option } = Select;

const init_state = {
  current: 1,
  pageSize: 20,
  data: [],
  count: 0,
  isNickShow: false,
  isGoldShow: false,
  isGoldDetailShow: false,
  isBindInfoShow: false,
  isResetPwdShow: false,
  isResetSavePwdShow: false,
  isShowUserGameData: false,
  isShowProxySetting: false,
  resetpwd: "",
  resetSavePwd: "",
  game_nick: "",
  startTime: "",
  endTime: "",
  MyDatePickerValue: null,
  inputKey: "id",
  inputValue: "",
  loading: true,
  change_phone_number_password: "",
  new_phone_number: "",
  changeGoldButtonLoading: false,
  packages: "",
  new_proxy_user_id: "",
  isShowUserListRouter: false,
  setAgentAccount:"",
  setAgentpassword:"",
  isShowSetTreatmentModel:false,
  isShowEditTreatMentModel:false,
  setTreatment:0,
  canSetTreatment:false,
  editTreatment:0,
  rule_id:"",
};
export default class LowerManage extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
    this.handleInputThrottled = throttle(this.onChangeGold, 3000);
  }

  initColumns = () => [
    {
      title: "玩家ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: 'center',
      width: 100,
    },
    {
      title: "玩家昵称",
      dataIndex: "game_nick",
      key: "game_nick",
      align: 'center',
      width: 100,
      // onCell: (record, rowIndex) => {
      //   return {
      //     onClick: (event) => {
      //       this.game_nick = record.game_nick;
      //       this.id = record.id;
      //       this.rowIndex = rowIndex;
      //       this.setState({
      //         isNickShow: true,
      //       });
      //     }, // 点击行
      //     onDoubleClick: (event) => {},
      //     onContextMenu: (event) => {},
      //     onMouseEnter: (event) => {
      //       event.target.style.cursor = "pointer";
      //     }, // 鼠标移入行
      //     onMouseLeave: (event) => {},
      //   };
      // },
    },
    {
      title: "推广员ID",
      dataIndex: "proxy_nick",
      key: "proxy_nick",
      align: 'center',
      // width: 150,
    },
    {
      title: "注册IP",
      dataIndex: "regin_ip",
      key: "regin_ip",
      align: 'center',
      // width: 150,
    },
    {
      title: "注册时间",
      dataIndex: "regin_time",
      render: formateDate,
      key: "regin_time",
      align: 'center',
      sorter: (a, b) => a.regin_time - b.regin_time,
      // width: 200,
    },
    {
      title: "操作",
      dataIndex: "",
      align: 'center',
      // width: 200,
      render: (record) => (
        <span>
          <LinkButton onClick={() => this.showModel(record,1)}>
            设置推广员
          </LinkButton>
          <LinkButton onClick={() => this.showModel(record,2)}>
            设置待遇
          </LinkButton>
          <LinkButton onClick={() => this.showModel(record,3)}>
            修改待遇
          </LinkButton>
        </span>
      ),
    },
  ];
  check_ip_detail = async (record, i, type) => {
    this.setState({ loading: true });
    console.log(record, i, type);
    let newdata = this.state.data;
    let ip = record[type];
    const res = await getipdetail(ip);
    // if (res.status === "success") {
    if (res.success === true) {
      newdata.forEach((element) => {
        if (record.id === element.id) {
          // element[`${type}_area`] = `${res.country}.${res.regionName}`;
          element[`${type}_area`] = `${res.country}.${res.region}`;
          this.setState({ data: newdata, loading: false });
        }
      });
    } else {
      message.info(res.message);
      this.setState({ loading: false });
    }
  };
  check_tel_detail = async (record, index) => {
    this.setState({ loading: true });
    let newdata = this.state.data;
    try {
      const result = await reqLoadGold(record.id);
      if (result.status === 0 && result.data.phone_number) {
        const res = await getteldetail(result.data.phone_number);
        // let newres = res.replace("__GetZoneResult_ = ", "");
        // console.log(newres);
        // let str = res
        //     ?.split("carrier")?.[1]
        //     .replace(":", "")
        //     .replace(/'/g, "")
        //     .replace("}", "");
        //newdata[index][`phone_number_detail`] = str || "";
        //this.setState({ data: newdata, loading: false });
        /*add by jil 2020.08.05*/
        if (res.status === 0) {
          newdata.forEach((element) => {
            if (record.id === element.id) {
              element[`phone_number_detail`] = `${res.msg}`;
              this.setState({ data: newdata, loading: false });
            }
          });
        } else {
          message.info(res.msg);
          this.setState({ loading: false });
        }
        /*add by jil 2020.08.05 用户列表界面增加电话号码归属地查询功能*/
      } else {
        message.info("获取电话号码失败" || JSON.stringify(result));
      }
    } finally {
      this.setState({ loading: false });
      console.log(this.state.data);
    }
    /*2020.08.05原先Javier是marked，打開來測試看看，結果admin-web Fail to compile*/
    // if (res.status === "success") {
    //     newdata[i][`${type}_area`] = `${res.country}.${res.regionName}`;
    //     this.setState({ data: newdata, loading: false });
    // } else {
    //     message.info(res.message);
    //     this.setState({ loading: false });
    // }
  };
  getUsers = async (page, limit) => {
    this.setState({ loading: true });
    const result = await reqLowerUsers(
      page,
      limit,
      this.state.startTime,
      this.state.endTime,
      this.props.admin_user_id,
      this.state.inputKey,
      this.state.inputValue,
    );
    if (result.status === 0) {
      const { game_user, proxy_user } = result.data;
      game_user.forEach((element) => {
        proxy_user.forEach((item) => {
          if (element.id === item.id) {
            element.proxy_nick = item.proxy_pid;
            // element.proxy_user_type = item.proxy_user_type;
          }
        });
      });
      this.setState({
        data: game_user,
        count: result.data && result.data.count,
        loading: false,
        packages: result.data && result.data.packages,
      });
    } else {
      message.info(result.msg || "未检索到数据");
    }
  };
  changeNickName = () => {
    let form = this.refs.getFormValue; //通过refs属性可以获得对话框内form对象
    form.validateFields(async (err, value) => {
      if (!err) {
        this.setState({ isNickShow: false });
        if (value.name !== this.game_nick) {
          const result = await setGameUserNickName(this.id, value.name);
          if (result.status === 0) {
            message.success("修改成功!");
            // 首先拿到索引, 也可以从参数中传递过来
            let index = this.rowIndex;
            // 然后根据索引修改
            this.state.data[index][`game_nick`] = value.name;
            // 这个时候并不会更新视图, 需要 setState更新 arr
            this.setState({
              data: this.state.data,
            });
          }
        }
      }
      form.resetFields();
    });
  };
  onChangeGold = () => {
    this.setState({ changeGoldButtonLoading: true });
    //这里直接复用了user-nick的模态框，所以取input的值时用value.name
    let form = this.refs.getFormValue;
    let goldRecord = this.goldRecord;
    form.validateFields(async (err, value) => {
      if (!err) {
        const res = await changeGold(goldRecord, value);
        if (res.status === 0) {
          message.success(JSON.stringify(res.msg));
          // this.setState({ isGoldShow: false });
        } else {
          message.info(JSON.stringify(res.msg));
        }
        setTimeout(() => {
          this.setState({ changeGoldButtonLoading: false, isGoldShow: false });
        }, 2000);
      } else {
        this.setState({ changeGoldButtonLoading: false });
      }
    });
  };
  getLoadGold = async (record) => {
    const id = record.id;
    const result = await reqLoadGold(id);
    if (result.status === 0) {
      Modal.success({
        title: "实时余额",
        // content: `用户${record.id}实时余额是 : ${reverseNumber(result.data.game_gold)}`
        content: `用户${record.id}实时余额是 : ${result.data.game_gold.toFixed(
          6
        )}`,
      });
    } else {
      message.info(result.msg || JSON.stringify(result));
    }
  };
  getGoldDetail = async (record, isBindInfo) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.isBindInfo = isBindInfo;
    this.recordID = record.id;
    this.setState({ isGoldDetailShow: true });
  };
  saveUserBlack = async (record, isAdd) => {
    let action = isAdd ? "add" : "remove";
    const res = await saveUserBlack(record.id, action);
    if (res.status === 0) {
      message.success("操作成功！");
    } else {
      message.success("操作失败:" + res.msg);
    }
  };
  resetPwd = (record) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isResetPwdShow: true });
    this.resetPwdId = record.id;
  };
  handleResetpwd = async () => {
    const res = await createTask(this.resetPwdId, this.state.resetpwd);
    if (res.status === 0) {
      message.success("操作成功！");
      this.setState({ resetpwd: "", isResetPwdShow: false });
    } else {
      message.success("操作失败:" + res.msg);
    }
  };
  resetSavePwd = (record) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isResetSavePwdShow: true });
    this.resetSavePwdId = record.id;
  };
  getProxySetting = (record) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isShowProxySetting: true });
    this.recordID = record.id;
  };
  changePid = (record) => {
    Modal.confirm({
      title: "代理链转移",
      content: (
        <Input
          onBlur={(e) => this.setState({ new_proxy_user_id: e.target.value })}
        />
      ),
      onOk: async () => {
        const res = await changeProxyUserProxyPid({
          id: record.id,
          proxy_user_id: this.state.new_proxy_user_id,
        });
        if (res.status === 0) {
          message.success(res.msg || "操作成功");
          this.onSearchData(1, 20);
        } else {
          message.info(res.msg || "操作失败");
        }
      },
    });
  };
  getUserGameData = (record) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isShowUserGameData: true });
    this.recordID = record.id;
  };
  handleSaveResetpwd = async () => {
    const res = await updateSavePassword(this.resetSavePwdId);
    // this.state.resetSavePwd
    if (res.status === 0) {
      message.success("操作成功！");
      this.setState({ resetSavePwd: "", isResetSavePwdShow: false });
    } else {
      message.success("操作失败:" + res.msg);
    }
  };
  getUserListRouter = (record) => {
    if (this.moreModal) {
      this.moreModal.destroy();
    }
    this.setState({ isShowUserListRouter: true });
    this.recordID = record.id;
    this.recordPid = record.package_id;
  };
  setuserstatus = async (record, status) => {
    let id = record.id;
    const res = await setgameuserstatus(id, status);
    if (res.code === 200) {
      message.success(res.status);
    } else {
      message.info(res.status);
    }
  };
  setCustomerAccount = async (record, status) => {
    let id = record.id;
    const res = await setCustomer(id, status);
    if (res.status === 0) {
      message.success(res.msg || "操作成功");
    } else {
      message.info(res.msg || "操作失败");
    }
  };
  download = () => {
    let reqdata = {
      start_time: this.state.startTime,
      end_time: this.state.endTime,
      inputKey: this.state.inputKey,
      inputValue: this.state.inputValue,
      packages: this.state.packages,
    };
    downloadUserList(reqdata);
  };
  showModel = (record,id) => {
    this.recordID = record.id
    this.recordPid = record.package_id
    switch(id){
      case 1:
        this.setState({
          isShowSetAgentModel: true
        })
        break;
      case 2:{
        this.setState({
          isShowSetTreatmentModel: true
        })
        this.reqGetDividendRule()
        break;
      }
      case 3:{
        this.setState({
          isShowEditTreatMentModel: true,
          canSetTreatment:false,
        })
        this.reqGetDividendRule()
        break;
      }
    }
  }
  
  handSetAgent =  async () => {
    if (this.state.setAgentAccount == "" ||this.state.setAgentpassword == "") {
        return message.info("推广员账号密码不能为空!");
    }
    const res = await reqCreditAdduser(
        this.state.setAgentAccount,
        this.state.setAgentpassword,
        String(this.recordID),
        String(this.recordPid),
        4, //推广员roleid 默认为4
    );
    if (res.status == 0) {
        message.success("操作成功！");
        this.setState({ setAgentAccount: "", setAgentpassword: "",isShowSetAgentModel:false });
    } else {
        message.info("操作失败:" + res.msg);
    }
  }
  reqGetDividendRule = async ()=>{
    const res = await reqGetDividendRule(
      this.props.admin_user_id,
      String(this.recordID),
      4, //type
      0, //game_tag
    );
    if (res.code == 200) {
      if(res.msg ){
        this.setState({
          //如果有值，则不能设置
          setTreatment:res.msg[0].percent,
          rule_id:res.msg[0]._id,
          canSetTreatment:true,
        })
      }else{
        this.setState({
          canSetTreatment:false,
          setTreatment:0,
          rule_id:""
        })
      }
      
    } else {
        message.info("操作失败:" + res.msg);
    }
  }
  handSetTreatment = async ()=>{
    let newNum = Number(Number(this.state.setTreatment).toFixed(0))
    if(newNum < 0){
      return message.info("只能设置为正整数");
    }
    const res = await reqCreateDividendRule(
      4, //type
      0, //game_tag
      3, //demand_type
      2,//demand_tag,
      0, //amount
      newNum, //分红比例， 只能传正整数
      this.props.admin_user_id,
      this.recordID,//child_id
    );
    if (res.code == 200) {
        message.success("操作成功！");
        this.setState({
          setTreatment:res.msg ? res.msg.percent:0,
          isShowSetTreatmentModel:false
        })
    } else {
        message.info("操作失败:" + res.msg);
    }
  }
  handEditTreatment = async ()=>{
    let newNum = Number(Number(this.state.editTreatment).toFixed(0))
    if(newNum < 0){
      return message.info("只能设置为正整数");
    }
    const res = await reqSetDividendRule(
      this.props.admin_user_id,
      this.state.rule_id,
      0,
      newNum, //分红比例， 只能传正整数
    );
    if (res.code == 200) {
        message.success("操作成功！");
        this.setState({
          setTreatment:res.msg ? res.msg.percent:0,
          editTreatment:0,
          isShowEditTreatMentModel:false
        })
    } else {
        message.info("操作失败:" + res.msg);
    }
  }
  componentDidMount() {
    this.getUsers(1, 20);
  }
  render() {
    const { data, count, current, pageSize, loading } = this.state;
    const title = (
      <span>
        <MyDatePicker
          handleValue={(data, dateString) => {
            this.setState({
              startTime: dateString[0],
              endTime: dateString[1],
              MyDatePickerValue: data,
            });
          }}
          value={this.state.MyDatePickerValue}
        />
        &nbsp; &nbsp;
        <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          value={this.state.inputKey}
          onChange={(val) => {
            this.setState({ inputKey: val });
          }}
        >
          <Option value="id">玩家ID</Option>
          <Option value="game_nick">玩家昵称</Option>
          <Option value="phone_number">手机号</Option>
          <Option value="role_name">账号</Option>
          <Option value="regin_ip">注册IP</Option>
          <Option value="login_ip">登陆IP</Option>
        </Select>
        &nbsp; &nbsp;
        <Input
          type="text"
          placeholder="请输入关键字搜索"
          style={{ width: 150 }}
          onChange={(e) => {
            this.setState({ inputValue: e.target.value });
          }}
          value={this.state.inputValue}
        />
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => {
            this.setState({ current: 1 });
            this.getUsers(1, this.state.pageSize);
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
      </span>
    );
    const extra = (
      <span>
        <LinkButton
          style={{ float: "right" }}
          onClick={() => {
            this.setState(init_state, () => {
              this.getUsers(1, 20);
            });
          }}
          icon="reload"
          size="default"
        />
        <br />
        <br />
        {/* <LinkButton
          size="default"
          style={{ float: "right" }}
          onClick={this.download}
          icon="download"
        /> */}
      </span>
    );
    console.log("user-data", data)
    return (
      <Card title={title} extra={extra}>
        <Mytable
          tableData={{
            data,
            count,
            columns: this.initColumns(),
            x: "max-content",
            // y: "65vh",
            current,
            pageSize,
            loading,
          }}
          paginationOnchange={(page, limit) => {
            this.getUsers(page, limit);
          }}
          setPagination={(current, pageSize) => {
            if (pageSize) {
              this.setState({ current, pageSize });
            } else {
              this.setState({ current });
            }
          }}
        />
        {this.state.isShowSetAgentModel && (
          <Modal
            title="设置推广员"
            visible={this.state.isShowSetAgentModel}
            onOk={this.handSetAgent}
            onCancel={() => {
              this.setState({ isShowSetAgentModel: false });
            }}
          >
            <p>玩家ID： {this.recordID}</p>
            <p>推广员账号 <Input
              placeholder="请输入推广员账号"
              value={this.state.setAgentAccount}
              onChange={(e) => this.setState({ setAgentAccount: e.target.value })}
            /></p>
            <p>推广员密码 <Input
              placeholder="请输入推广员密码"
              value={this.state.setAgentpassword}
              onChange={(e) => this.setState({ setAgentpassword: e.target.value })}
            /></p>
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
         {this.state.isShowSetTreatmentModel && (
          <Modal
            title="设置待遇"
            visible={this.state.isShowSetTreatmentModel}
            onCancel={() => {
              this.setState({ isShowSetTreatmentModel: false });
            }}
            onOk={this.handSetTreatment}
          >
            <div>玩家ID : {this.recordID}</div>
            &nbsp; &nbsp;
            <div><span>分红类型 :</span> <span>亏损分红</span></div>
            &nbsp; &nbsp;
            <div>待遇 : <InputNumber
              disabled ={this.state.canSetTreatment}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.setTreatment}
              onBlur={(e) => (this.setState({ setTreatment: e.target.value }))}
            />%</div>
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
          {this.state.isShowEditTreatMentModel && (
          <Modal
            title="修改待遇"
            visible={this.state.isShowEditTreatMentModel}
            onCancel={() => {
              this.setState({ isShowEditTreatMentModel: false });
            }}
            onOk={this.handEditTreatment}
          >
            <div>玩家ID : {this.recordID}</div>
            &nbsp; &nbsp;
            <div><span>分红类型 :</span> <span>亏损分红</span></div>
            &nbsp; &nbsp;
            <div>当前待遇 : <InputNumber
              disabled ={true}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.setTreatment}
            />%</div>
            <div>调整待遇 : <InputNumber
              disabled ={this.state.rule_id?false:true}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.editTreatment}
              onBlur={(e) => (this.setState({ editTreatment: e.target.value }))}
            />%</div>
            &nbsp; &nbsp;
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
        {this.state.isShowUserListRouter && (
          <Modal
            title={`用户列表： ${this.recordID}`}
            visible={this.state.isShowUserListRouter}
            onOk={() => {
              this.setState({ isShowUserListRouter: false })
            }}
            onCancel={() => {
              this.setState({ isShowUserListRouter: false })
            }}
            footer={null}
            width="85%"
            maskClosable={false}
            style={{ top: 10 }}
          >
            <UserListRouter
              recordID={this.recordID}
              recordPid={this.recordPid}
            />
          </Modal>
        )}
      </Card>
    );
  }
}
