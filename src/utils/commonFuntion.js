/*
  四舍五入第六位保留四位小数
*/
export function reverseNumber(num) {
    if (!num) return 0;
    let f = parseFloat(num);
    if (isNaN(f)) {
        return false;
    }
    if (num === 0) return 0;
    return (Math.round(num * 1000000) / 1000000).toFixed(4);
}
/*
  四舍五入第六位保留兩位小数
*/
export function reverseNumber2(num) {
    if (!num) return 0;
    let f = parseFloat(num);
    if (isNaN(f)) {
        return false;
    }
    if (num === 0) return 0;
    return (Math.round(num * 1000000) / 1000000).toFixed(2);
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

//函数节流
export function throttle(func, wait) {
    var canRun = true;
    return function (...args) {
        if (!canRun) {
            return;
        } else {
            canRun = false;
            func.apply(this, args); // 将方法放在外面, 这样即便该函数是异步的，也可以保证在下一句之前执行
            setTimeout(function () {
                canRun = true;
            }, wait);
        }
    };
}
export function reverseDecimal(num) {
    if (num === 0) return 0;
    if (!num) return;
    if (isNaN(num)) return 0;
    return Math.round(num * 10000) / 10000;
}


// 判定是否為JSON 
export function jsonTest(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
}

