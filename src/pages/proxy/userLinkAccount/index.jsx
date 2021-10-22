import React, { useState } from "react";
import { Card, Input, message } from "antd";
import { getUserLinkAccountsTotal } from "../../../api/index";

export default () => {
  const [data, setData] = useState([]);
  //查询代理链实时余额
  const proxySearch = async (value) => {
    let reg = new RegExp("^[0-9]*$");
    if (!value) {
      message.info("請輸入玩家ID");
      return;
    } else if (!reg.test(value)) {
      message.info("請輸入有效ID");
      return;
    }
    let reqData = {
      id: value,
    };
    const res = await getUserLinkAccountsTotal(reqData);
    if (res.code === 200) {
      message.success(res.Status);
      let sortData = JSON.stringify(res);
      setData(sortData || []);
    } else {
      message.info(res.status || JSON.stringify(res));
      setData([]);
    }
  };
  return (
    <Card
      title={
        <div>
          <Input.Search
            style={{ width: 200 }}
            placeholder="請輸入玩家ID"
            enterButton
            onSearch={(value) => {
              proxySearch(value);
            }}
          />
        </div>
      }
    >
      <div>{data || "-"}</div>
    </Card>
  );
};

// class ProxySetting extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//     };
//   }
//   onSearchData = (page, limit) => {
//     let id = this.input.input.value;
//     console.log("id", id);
//     var reg = new RegExp("^[0-9]*$");
//     if (!id || !reg.test(id)) {
//       message.info("请输入有效id");
//     } else {
//       this.fetchData(id);
//     }
//   };

//   fetchData = async (id) => {
//     try {
//       const res = await getUserLinkAccountsTotal(id);
//       if (res.code === 200) {
//         message.success("操作成功");
//         console.log(res);
//       } else {
//         message.info("操作失败");
//       }
//       this.setState({
//         data: JSON.parse(res) || [],
//       });
//       console.log(this.state.data);
//     } finally {
//     }
//   };

//   render() {
//     return (
//       <div>
//         <Card
//           title={
//             <span>
//               <Input
//                 type="text"
//                 placeholder="请输入代理ID"
//                 style={{ width: 150 }}
//                 ref={(input) => (this.input = input)}
//               />
//               &nbsp; &nbsp;
//               <LinkButton
//                 onClick={() => this.onSearchData(1, 20)}
//                 size="default"
//               >
//                 <Icon type="search" />
//               </LinkButton>
//             </span>
//           }
//           // extra={
//           //   <LinkButton onClick={() => window.location.reload()} size="default">
//           //     <Icon type="reload" />
//           //   </LinkButton>
//           // }
//         >
//           <div>{this.state.data}</div>
//         </Card>
//       </div>
//     );
//   }
// }

// export default ProxySetting;
