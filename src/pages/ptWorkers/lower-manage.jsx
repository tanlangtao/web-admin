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
import {  check,checkPass } from "../../utils/commonFuntion";
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
  reqGetProxyUserNumber
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
  isShowTeamPerson:false,
  teamPersonData:[],
  teamPersonCount:0,
  teamLoading:false,
  minTreatment:1,
  maxTreatment:100
};
export default class LowerManage extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
    this.handleInputThrottled = throttle(this.onChangeGold, 3000);
  }
  teamColumns = ()=>[
    {
      title: "??????ID",
      dataIndex: "id",
      key: "id",
      align: 'center',
    },
    {
      title: "???????????????",
      dataIndex: "count",
      key: "count",
      align: 'center',
    },
  ]
  initColumns = () => [
    {
      title: "??????ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      align: 'center',
      width: 100,
    },
    {
      title: "????????????",
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
      //     }, // ?????????
      //     onDoubleClick: (event) => {},
      //     onContextMenu: (event) => {},
      //     onMouseEnter: (event) => {
      //       event.target.style.cursor = "pointer";
      //     }, // ???????????????
      //     onMouseLeave: (event) => {},
      //   };
      // },
    },
    {
      title: "?????????ID",
      dataIndex: "proxy_nick",
      key: "proxy_nick",
      align: 'center',
      // width: 150,
    },
    {
      title: "??????IP",
      dataIndex: "regin_ip",
      key: "regin_ip",
      align: 'center',
      // width: 150,
    },
    {
      title: "????????????",
      dataIndex: "regin_time",
      render: formateDate,
      key: "regin_time",
      align: 'center',
      sorter: (a, b) => a.regin_time - b.regin_time,
      // width: 200,
    },
    {
      title: "??????",
      dataIndex: "",
      align: 'center',
      // width: 200,
      render: (record) => (
        <span>
          <LinkButton onClick={() => this.showModel(record,1)}>
            ???????????????
          </LinkButton>
          <LinkButton onClick={() => this.showModel(record,2)}>
            ????????????
          </LinkButton>
          <LinkButton onClick={() => this.showModel(record,3)}>
            ????????????
          </LinkButton>
          <LinkButton onClick={() => this.showModel(record,4)}>
            ????????????
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
        /*add by jil 2020.08.05 ?????????????????????????????????????????????????????????*/
      } else {
        message.info("????????????????????????" || JSON.stringify(result));
      }
    } finally {
      this.setState({ loading: false });
      console.log(this.state.data);
    }
    /*2020.08.05??????Javier???marked?????????????????????????????????admin-web Fail to compile*/
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
      message.info(result.msg || "??????????????????");
    }
  };
  changeNickName = () => {
    let form = this.refs.getFormValue; //??????refs??????????????????????????????form??????
    form.validateFields(async (err, value) => {
      if (!err) {
        this.setState({ isNickShow: false });
        if (value.name !== this.game_nick) {
          const result = await setGameUserNickName(this.id, value.name);
          if (result.status === 0) {
            message.success("????????????!");
            // ??????????????????, ?????????????????????????????????
            let index = this.rowIndex;
            // ????????????????????????
            this.state.data[index][`game_nick`] = value.name;
            // ?????????????????????????????????, ?????? setState?????? arr
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
    //?????????????????????user-nick????????????????????????input????????????value.name
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
        title: "????????????",
        // content: `??????${record.id}??????????????? : ${reverseNumber(result.data.game_gold)}`
        content: `??????${record.id}??????????????? : ${result.data.game_gold.toFixed(
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
      message.success("???????????????");
    } else {
      message.success("????????????:" + res.msg);
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
      message.success("???????????????");
      this.setState({ resetpwd: "", isResetPwdShow: false });
    } else {
      message.success("????????????:" + res.msg);
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
      title: "???????????????",
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
          message.success(res.msg || "????????????");
          this.onSearchData(1, 20);
        } else {
          message.info(res.msg || "????????????");
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
      message.success("???????????????");
      this.setState({ resetSavePwd: "", isResetSavePwdShow: false });
    } else {
      message.success("????????????:" + res.msg);
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
      message.success(res.msg || "????????????");
    } else {
      message.info(res.msg || "????????????");
    }
  };
  GetProxyUserNumber = async (record, status) => {
    this.setState({teamLoading:true})
    let data={
      "account_name":this.props.admin_user_id,
      "ids":`[${this.recordID}]`
    }
    const res = await reqGetProxyUserNumber(data);
    let data2 = [{id:`${this.recordID}`,"count":0}]
    if (res.code === 200) {
      this.setState({
        teamPersonData:res.msg? res.msg : data2 ,
        teamPersonCount:res.msg ? res.msg.length:1,
      })
    } else {
      message.info(res.msg || "??????");
    }
    this.setState({
      teamLoading:false
    })
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
          isShowSetTreatmentModel: true,
          setTreatment:0,
          minTreatment:1,
          maxTreatment:1
        })
        this.reqGetDividendRule(this.recordID)
        break;
      }
      case 3:{
        this.setState({
          isShowEditTreatMentModel: true,
          canSetTreatment:false,
          setTreatment:0,
          minTreatment:1,
          maxTreatment:1
        })
        this.reqGetDividendRule(this.recordID)
        break;
      }
      case 4:{
        this.setState({
          isShowTeamPerson: true,
        })
        this.GetProxyUserNumber()
        break;
      }
    }
  }
  
  handSetAgent =  async () => {
    if (this.state.setAgentAccount == "" ||this.state.setAgentpassword == "") {
        return message.info("?????????????????????????????????!");
    }else if (!check(this.state.setAgentAccount) || !check(this.state.setAgentpassword)){
      return message.info("???????????????????????????????????????!");
    }else if (this.state.setAgentAccount.length < 4 || this.state.setAgentAccount.length > 12) {
      return message.info("?????????????????????4-12?????????!");
    }else if(!checkPass(this.state.setAgentAccount)){
      return message.info("???????????????????????????????????????!");
    }else if(!checkPass(this.state.setAgentpassword)){
      return message.info("???????????????????????????????????????!");
    }
    this.setState({
      isShowSetAgentModel:false
    })
    const res = await reqCreditAdduser(
        this.state.setAgentAccount,
        this.state.setAgentpassword,
        String(this.recordID),
        String(this.recordPid),
        4, //?????????roleid ?????????4
    );
    if (res.status == 0) {
        message.success("???????????????");
    } else {
        message.info("????????????:" + res.msg);
    }
    this.setState({ setAgentAccount: "", setAgentpassword: ""});
  }
  reqGetDividendRule = async (user_id)=>{
    const res = await reqGetDividendRule(
      this.props.admin_user_id,
      String(user_id),
      4, //type
      0, //game_tag
    );
    if (res.code == 200) {
      this.reqGetDividendRule2(this.props.admin_user_id)
      if(res.msg ){
        this.setState({
          //??????????????????????????????
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
        message.info("????????????:" + res.msg);
    }
  }
  reqGetDividendRule2 = async (user_id)=>{
    const res = await reqGetDividendRule(
      this.props.admin_user_id,
      String(user_id),
      4, //type
      0, //game_tag
    );
    if (res.code == 200) {
      let min = 1
      if(this.state.setTreatment > this.state.minTreatment){
        min = this.state.setTreatment + 1
      } 
      if(this.state.setTreatment >= 57 ){
        min = 57
      }
      if(res.msg ){
        this.setState({
          maxTreatment:res.msg[0].percent > 57 ? 57 :res.msg[0].percent-1,
          minTreatment:min
        })
      }else{
        this.setState({
          maxTreatment:57,
          minTreatment:min
        })
      }
    } else {
        message.info("????????????:" + res.msg);
    }
  }
  handSetTreatment = async ()=>{
    let newNum = Number(Number(this.state.setTreatment).toFixed(0))
    if(newNum < this.state.minTreatment || newNum > this.state.maxTreatment){
      return message.info("???????????????");
    }
    const res = await reqCreateDividendRule(
      4, //type
      0, //game_tag
      3, //demand_type
      2,//demand_tag,
      0, //amount
      newNum, //??????????????? ??????????????????
      this.props.admin_user_id,
      this.recordID,//child_id
    );
    if (res.code == 200) {
        message.success("???????????????");
        this.setState({
          setTreatment:res.msg ? res.msg.percent:0,
          isShowSetTreatmentModel:false
        })
    } else {
        message.info("????????????:" + res.msg);
    }
  }
  handEditTreatment = async ()=>{
    let newNum = Number(Number(this.state.editTreatment).toFixed(0))
    if(newNum ==  this.state.setTreatment){
      return message.info("???????????????????????????");
    }else if(newNum < this.state.minTreatment || newNum > this.state.maxTreatment){
      return message.info("???????????????");
    }
    const res = await reqSetDividendRule(
      this.props.admin_user_id,
      this.state.rule_id,
      0,
      newNum, //??????????????? ??????????????????
    );
    if (res.code == 200) {
        message.success("???????????????");
        this.setState({
          setTreatment:res.msg ? res.msg.percent:0,
          editTreatment:0,
          isShowEditTreatMentModel:false
        })
    } else {
        message.info("????????????:" + res.msg);
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
          <Option value="id">??????ID</Option>
          <Option value="game_nick">????????????</Option>
          <Option value="phone_number">?????????</Option>
          <Option value="role_name">??????</Option>
          <Option value="regin_ip">??????IP</Option>
          <Option value="login_ip">??????IP</Option>
        </Select>
        &nbsp; &nbsp;
        <Input
          type="text"
          placeholder="????????????????????????"
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
    const SetTreatmentTitle = (
      <span>
        <span>????????????</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style ={{color:"red"}}>*???????????????????????????????????????1%</span>
      </span>
    )
    const EditTreatmentTitle = (
      <span>
        <span>????????????</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style ={{color:"red"}}>*???????????????????????????????????????????????????????????????1%</span>
      </span>
    )
    return (
      <Card title={title} >
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
            title="???????????????"
            visible={this.state.isShowSetAgentModel}
            onOk={this.handSetAgent}
            onCancel={() => {
              this.setState({ isShowSetAgentModel: false ,setAgentAccount: "", setAgentpassword: ""});
            }}
          >
            <p>??????ID??? {this.recordID}</p>
            <p>??????????????? <Input
              placeholder="????????????????????????"
              value={this.state.setAgentAccount}
              onChange={(e) => this.setState({ setAgentAccount: e.target.value })}
            /></p>
            <p>??????????????? <Input
              placeholder="????????????????????????"
              value={this.state.setAgentpassword}
              onChange={(e) => this.setState({ setAgentpassword: e.target.value })}
            /></p>
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
         {this.state.isShowSetTreatmentModel && (
          <Modal
            title={SetTreatmentTitle}//????????????
            visible={this.state.isShowSetTreatmentModel}
            onCancel={() => {
              this.setState({ isShowSetTreatmentModel: false });
            }}
            onOk={this.handSetTreatment}
          >
            <div>??????ID : {this.recordID}</div>
            &nbsp; &nbsp;
            <div><span>???????????? :</span> <span>????????????</span></div>
            &nbsp; &nbsp;
            <div>?????? : <InputNumber
              disabled ={this.state.canSetTreatment}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.setTreatment}
              onBlur={(e) => (this.setState({ setTreatment: e.target.value }))}
            />
              %
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>???????????????{this.state.minTreatment}%-
                {this.state.maxTreatment}%</span>
            </div>
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
          {this.state.isShowEditTreatMentModel && (
          <Modal
            title={EditTreatmentTitle} //????????????
            visible={this.state.isShowEditTreatMentModel}
            onCancel={() => {
              this.setState({ isShowEditTreatMentModel: false });
            }}
            onOk={this.handEditTreatment}
          >
            <div>??????ID : {this.recordID}</div>
            &nbsp; &nbsp;
            <div><span>???????????? :</span> <span>????????????</span></div>
            &nbsp; &nbsp;
            <div>???????????? : <InputNumber
              disabled ={true}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.setTreatment}
            />%</div>
            <div>???????????? : <InputNumber
              disabled ={this.state.rule_id?false:true}
              placeholder=""
              size="small" 
              min={0} 
              max={100}
              value={this.state.editTreatment}
              onBlur={(e) => (this.setState({ editTreatment: e.target.value }))}
            />%
             &nbsp;&nbsp;&nbsp;&nbsp;
            <span>???????????????{this.state.minTreatment}%-{this.state.maxTreatment}%</span>
            </div>
            &nbsp; &nbsp;
            <div style={{ height: "10px" }}></div>
          </Modal>
        )}
        {this.state.isShowUserListRouter && (
          <Modal
            title={`??????????????? ${this.recordID}`}
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
        {this.state.isShowTeamPerson && (
          <Modal
            title={`???????????? ${this.recordID}`}
            visible={this.state.isShowTeamPerson}
            onCancel={() => {
              this.setState({ isShowTeamPerson: false });
            }}
            footer={null}
          >
            <Mytable
              tableData={{
                data:this.state.teamPersonData,
                count:this.state.teamPersonCount,
                columns: this.teamColumns(),
                x: "max-content",
                loading:this.state.teamLoading
              }}
              pagination={false}
              paginationOnchange={(page, limit) => {
              }}
              setPagination={(current, pageSize) => {
                
              }}
            />
          </Modal>
        )}
      </Card>
    );
  }
}
