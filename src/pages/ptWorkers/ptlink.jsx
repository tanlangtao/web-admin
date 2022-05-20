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
    showQrCodeModel = (img,url) => {
        this.qrImg = img
        this.qrUrl = url
        this.setState({
            isShowQrCodeModel :true
        })
    }
    componentDidMount() {
    }
    render() {
        const { data } = this.state

        let getItem = () => {
            if (data) {
                console.log(data)
                return data.map((e, index) => {
                    return <div key={index}>
                        <p style={{ width: "60%", display: "flex", justifyContent: "space-around" }}>
                            <span>{e.name}</span>
                            <span>{`${e.url}?u=${this.props.admin_user_id}&p=${this.props.package_id}`}</span>
                            <LinkButton
                                onClick={()=>this.showQrCodeModel(e.img,`${e.url}?u=${this.props.admin_user_id}&p=${this.props.package_id}`)}
                            >获取二维码</LinkButton>
                            {/* <LinkButton
                                data-clipboard-text={`${e.url}?u=${this.props.admin_user_id}&p=${this.props.package_id}`}
                                onClick={()=>this.handleCopy()}
                            >点击复制</LinkButton> */}
                            <button
                                data-clipboard-text={`${e.url}?u=${this.props.admin_user_id}&p=${this.props.package_id}`}
                                className="copy-btn"
                                type="button"
                            >点击复制</button>
                        </p>
                    </div>
                })
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
