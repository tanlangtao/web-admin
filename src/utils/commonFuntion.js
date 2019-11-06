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
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}
