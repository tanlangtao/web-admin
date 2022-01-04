/*
  支付渠道判别
*/
export function switchChannelType(text, record) {
    let word;
    switch (text) {
        case "0":
            word = record;
            break;
        case "12":
        case "29":
            word = "onePay";
            break;
        case "11":
            word = "古都";
            break;
        case "10":
        case "13":
        case "14":
        case "15":
        case "16":
        case "18":
        case "19":
        case "20":
        case "21":
        case "22":
        case "27":
        case "28":
            word = "聚鑫";
            break;
        case "5":
        case "17":
        case "23":
        case "24":
        case "25":
        case "26":
            word = "UC"
            break
        default:
            word = text;
            break;
    }
    return word;
};

/*
  支付类型判别(for order list 后端key type)
*/
export function switchType(text) {
    let word;
    switch (text) {
        case "1":
            word = "alipay";
            break;
        case "2":
            word = "银行卡转账";
            break;
        case "3":
            word = "人工代充";
            break;
        case "4":
            word = "人工代提";
            break;
        case "5":
            word = "被赠送";
            break;
        case "6":
            word = "微信支付";
            break;
        case "7":
            word = "银联支付";
            break;
        case "8":
            word = "网银支付";
            break;
        case "9":
            word = "快捷支付";
            break;
        case "18":
            word = "imalipay";
            break;
        case "19":
            word = "imwechat";
            break;
        case "20":
            word = "imbank";
            break;
        case "21":
            word = "imunionpay";
            break;
        case "22":
            word = "支付宝转卡";
            break;
        case "23":
            word = "usdt erc20";
            break;
        case "24":
            word = "usdt trc20";
            break;
        case "26":
            word = "极速充值";
            break;
        default:
            word = "";
            break;
    }
    return word;
};

/*
订单状态判别
*/
export function switchStatus(text) {
    let word;
    switch (text) {
        case "1":
            word = "未支付";
            break;
        case "2":
            word = "已过期";
            break;
        case "3":
            word = "已分配";
            break;
        case "4":
            word = "已撤销";
            break;
        case "5":
            word = "已支付";
            break;
        case "6":
            word = "已完成";
            break;
        case "7":
            word = "补单初审通过";
            break;
        case "8":
            word = "初审拒绝";
            break;
        case "9":
            word = "补单复审通过";
            break;
        case "10":
            word = "复审拒绝";
            break;
        case "11":
            word = "充值失败";
            break;
        case "12":
            word = "客服拒绝";
            break;
        default:
            word = "";
            break;
    }
    return word;
};