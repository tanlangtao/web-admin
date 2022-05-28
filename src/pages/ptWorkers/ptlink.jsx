import React, { Component } from "react";
import QRCode  from 'qrcode.react';
import Clipboard from 'clipboard';
import {
    Card,
    Modal,
    message,
} from "antd";
import LinkButton from "../../components/link-button/index";
import "./ptlink.less";
import {
    reqDomainlistbyPid
} from "../../api/index";
const init_state = {
    isShowQrCodeModel:false,
    data: [
        {
            name: "推广链接1",
            url: "www.lymrmfyp.com",
            img:"img1",
        },
        {
            name: "推广链接2",
            url: "www.ywtcgyp.com",
            img:"img2",
        },
        // {
        //     name: "推广链接3",
        //     url: "www.lymrmfyp.com",
        //     img:"img3",
        // },
        // {
        //     name: "推广链接4",
        //     url: "www.ywtcgyp.com",
        //     img:"img4",
        // },
        // {
        //     name: "推广链接5",
        //     url: "www.lymrmfyp.com",
        //     img:"img2",
        // },
        // {
        //     name: "推广链接6",
        //     url: "www.ywtcgyp.com",
        //     img:"img1",
        // }
    ]
};
const copy = new Clipboard('.copy-btn');
copy.on('success', e => {
    message.success(`复制成功！ ${e.text}`)
 });
copy.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
export default class PtLink extends Component {
    constructor(props) {
        super(props);
        this.state = init_state;
    }
    handlejump = () => {
        window.open('https://www.sina.lt/')
    }
    showQrCodeModel = (url) => {
        this.qrUrl = url
        this.setState({
            isShowQrCodeModel :true
        })
    }
    getReqDomainlist = async (page, limit) => {
        this.setState({
            loading: true
        })
        const result = await reqDomainlistbyPid(
            this.props.package_id,
            this.envtype,//环境编号 1:DEV 2:PRE 3:OL
            1, //domaintype 1:入口域名 2:后台域名
            page
            , limit
        )
        if (result.status === 0) {
            let data = result.data.lists
            let newArr = []
            data.forEach((item,index)=>{
                let domain_listArr  = item.domain_list.split(",")
                domain_listArr.forEach(e=>{
                    let newItem = {
                        domain_type:item.domain_type,
                        domain_list:`${e}`,
                        env_type:item.env_type,
                        package_id:item.package_id,
                    }
                    newArr.push(newItem)
                })
            })
            this.setState({
                data: newArr,
                count:result.data.total,
                loading: false,
            });
        } else {
            message.error(`失败！${result.msg}`)
        }
    }
    componentDidMount() {
        this.envtype = 0
        if(localStorage.BASE == "https://admin.lymrmfyp.com/creditadmin"){
            this.envtype = 2
        }else{
            this.envtype = 3
        }
        this.getReqDomainlist(1,20)
    }
    render() {
        const { data } = this.state

        let getItem = () => {
            if (data) {
                console.log(data)
                return (
                    <div>
                        <LinkButton
                            style={{ float: "right" }}
                            onClick={() => {
                                this.getReqDomainlist(1, 20);
                            }}
                            icon="reload"
                            size="default"
                        />
                        {
                            data.map((e, index) => {
                                return <div key={index}>
                                    
                                    <p style={{display:"flex"}}>
                                        <span style={{width:"100px",height:"40px"}} >{`推广链接${index+1}`}</span>
                                        <span>{`${e.domain_list}?m=${e.env_type}&p=${e.package_id}&u=${this.props.admin_user_id}`}</span>
                                        &nbsp;&nbsp;
                                        <LinkButton
                                            onClick={()=>this.showQrCodeModel(`${e.domain_list}?m=${e.env_type}&p=${e.package_id}&u=${this.props.admin_user_id}`)}
                                        >获取二维码</LinkButton>
                                        &nbsp;&nbsp;
                                        <LinkButton
                                            data-clipboard-text={`${e.domain_list}?m=${e.env_type}&p=${e.package_id}&u=${this.props.admin_user_id}`}
                                            className="copy-btn"
                                            type="button"
                                            style={{lineHeight:"22px"}}
                                        >点击复制</LinkButton>
                                    </p>
                                </div>
                            })
                        }
                    </div>
                )
                
            }
        }
        let getCodeDev = (className)=>{
            return <div className={className}>
                <div className="codeDev">
                    <QRCode 
                        value={this.qrUrl}
                        size={140}
                        fgColor="#000000" 
                    ></QRCode>
                </div>
                <div className="inviteCode">{this.props.admin_user_id}</div>
            </div>
        }
        return <Card >
            {
                getItem()
            }
            {this.state.isShowQrCodeModel && (
                <Modal
                    visible={this.state.isShowQrCodeModel}
                    onCancel={() => {
                        this.setState({ isShowQrCodeModel: false });
                    }}
                    footer={null}
                    width ="1100px"
                    style={{ top: 10 }}
                >
                    <div className="qrDiv">
                        {getCodeDev("img1")}
                        {getCodeDev("img2")}
                        {getCodeDev("img3")}
                        {getCodeDev("img4")}
                    </div>
                </Modal>
            )}
             <div id='jumplink'>
                <li id='jumplink1' >
                    短链接生成地址
                </li>
                <a id='jumplink2' onClick={this.handlejump}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 点击我跳转短链接生成页面
                </a>
            </div>
        </Card>
    }
}
