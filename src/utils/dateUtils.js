import moment from "moment";
/*
日期时间处理的工具函数模块
*/
export function formateDate(timeStamp) {
	if (!timeStamp) return "";
	let time = parseInt(timeStamp);
	if (time === 0) return "";
	return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss");
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


export  function formatDateYMD(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}