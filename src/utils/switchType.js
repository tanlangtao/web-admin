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
    case "31":
    case "32":
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
      word = "UC";
      break;
    case "30":
      word = "pipeipay";
      break;
    default:
      word = text;
      break;
  }
  return word;
}

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
    case "27":
      word = "匹配充值";
      break;
    case "28":
      word = "极速充值2";
      break;
    case "29":
      word = "极速充值Iframe";
      break;

    default:
      word = "";
      break;
  }
  return word;
}

/*
充值订单状态判别
*/
export function switchStatus(text) {
  let word;
  switch (text) {
    case "1":
    case 1:
      word = "未支付";
      break;
    case "2":
    case 2:
      word = "已过期";
      break;
    case "3":
    case 3:
      word = "已分配";
      break;
    case "4":
    case 4:
      word = "已撤销";
      break;
    case "5":
    case 5:
      word = "已支付";
      break;
    case "6":
    case 6:
      word = "已完成";
      break;
    case "7":
    case 7:
      word = "补单初审通过";
      break;
    case "8":
    case 8:
      word = "初审拒绝";
      break;
    case "9":
    case 9:
      word = "补单复审通过";
      break;
    case "10":
    case 10:
      word = "复审拒绝";
      break;
    case "11":
    case 11:
      word = "充值失败";
      break;
    case "12":
    case 12:
      word = "客服拒绝";
      break;
    default:
      word = "";
      break;
  }
  return word;
}
/*
兑换订单状态判别
*/
export function switchWithdrawStatus(text) {
  let word;
  switch (text) {
    case "1":
    case 1:
      word = "待审核";
      break;
    case "2":
    case 2:
      word = "处理中";
      break;
    case "3":
    case 3:
      word = "已提交";
      break;
    case "4":
    case 4:
      word = "已成功";
      break;
    case "5":
    case 5:
      word = "已失败";
      break;
    case "6":
    case 6:
      word = "复审拒绝";
      break;
    case "7":
    case 7:
      word = "已匹配";
      break;
    default:
      word = "";
      break;
  }
  return word;
}
/*
匹配订单状态判别
*/
export function switchPipeiStatus(text) {
  let word;
  switch (text) {
    case "1":
    case 1:
      word = "已匹配";
      break;
    case "2":
    case 2:
      word = "已过期";
      break;
    case "3":
    case 3:
      word = "已失败";
      break;
    case "4":
    case 4:
      word = "已成功";
      break;
    case "5":
    case 5:
      word = "审核中";
      break;
    default:
      word = "";
      break;
  }
  return word;
}

/*
渠道组
*/
export function switchPackageId(record) {
  switch (record) {
    case "1":
    case 1:
      return "特斯特娱乐";
    case 2:
    case "2":
      return "金城娱乐";
    case 3:
    case "3":
      return "杏吧娱乐";
    case 6:
    case "6":
      return "91游戏";
    case 8:
    case "8":
      return "大喜发";
    case 9:
    case "9":
      return "新贵游戏";
    case 10:
    case "10":
      return "富鑫II游戏";
    case 11:
    case "11":
      return "新豪游戏";
    case 12:
    case "12":
      return "乐派游戏";
    case 13:
    case "13":
      return "皇室游戏";
    case 15:
    case "15":
      return "聚鼎娱乐";
    case 16:
    case "16":
      return "92游戏";
    case 18:
    case "18":
      return "华兴娱乐";
    case 19:
    case "19":
      return "玖富娱乐";
    case 20:
    case "20":
      return "万盛娱乐";
    case 21:
    case "21":
      return "天启游戏";
    case 22:
    case "22":
      return "嘉兴娱乐";
    case 23:
    case "23":
      return "特兔游戏";
    case 25:
    case "25":
      return "乐天游戏";
    case 26:
    case "26":
      return "51游戏";
    case 28:
    case "28":
      return "杏耀娱乐";
    default:
      return;
  }
}
