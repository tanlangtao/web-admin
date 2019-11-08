/*
  四舍五入第六位保留四位小数
*/
export function reverseNumber(num) {
  let f = parseFloat(num);
  if (isNaN(f)) {
    return false;
  }
  return (Math.round(num * 1000000) / 1000000).toFixed(4);
}

/*
  科学技术法还原真值
*/
export function toNonExponential(num) {
  let f = parseFloat(num);
  if (isNaN(f)) {
    return false;
  }
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
}
//固定2位小数
export function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + 2) {
    s += "0";
  }
  return s;
}
