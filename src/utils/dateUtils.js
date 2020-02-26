import moment from "moment";
/*
包含n个日期时间处理的工具函数模块
*/
/*
  格式化日期
*/
export function formateDate(time) {
  if (!time) return "";
  let timeStamp = parseInt(time);
  if (timeStamp === 0) return "";
  return moment(timeStamp * 1000).format("YYYY-MM-DD HH:mm:ss");
  // let date = new Date(time * 1000);
  // return (
  //   date.getFullYear() +
  //   "-" +
  //   (date.getMonth() + 1) +
  //   "-" +
  //   date.getDate() +
  //   " " +
  //   date.getHours() +
  //   ":" +
  //   date.getMinutes() +
  //   ":" +
  //   date.getSeconds()
  // );
}
