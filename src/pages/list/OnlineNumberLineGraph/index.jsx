import React, { useState, useEffect, useRef } from "react";
import { Line } from "@ant-design/charts";
import { Card, message, Input, Table, Select, Button, Icon } from "antd";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePickerStartToday";
import { getOnlineTotalGraph, userPackageList } from "../../../api/index";
import moment from "moment";

let initstate = {
  start_time: null,
  end_time: null,
  packageID: 0,
};

const DemoLine = (props) => {
  const [data, setData] = useState([]);
  const [dataBrack, setdataBrack] = useState([]);
  const [Graph, setGraph] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [MapTest, setMapTest] = useState([]);
  const ref = useRef(initstate);
  const [packageList, setpackageList] = useState([]);
  const initStates = useRef({
    start_time: moment().startOf("day").format("X"),
    end_time: moment().endOf("day").format("X"),
    packageID: 0,
  });
  const getInitialData = async () => {
    const res = await userPackageList();
    if (res.status === 0) {
      setpackageList(res.data.list);
    }
  };
  useEffect(() => {
    getInitialData();
  }, []);
  // useEffect(() => {
  //   getOnlineNumberGraph();
  // }, []);
  useEffect(() => {
    getOnlineNumberGraph();
  }, [props.loading]);
  const getOnlineNumberGraph = async () => {
    Graph.length = 0;
    const { start_time, end_time, packageID } = ref.current;
    try {
      message.loading("正在统计中.....", 20);
      let reqData = {
        start_time: Math.floor(start_time / 1000),
        end_time: Math.floor(end_time / 1000),
      };
      let res = await getOnlineTotalGraph(reqData);
      if (res.status === 0 && res.data) {
        message.destroy();
        message.info(res.msg);
        const dataBrack = Object.entries(res.data).map(
          ([dataName, dataValue]) => {
            return {
              value: JSON.parse(dataValue.record),
              id: dataValue.create_time,
            };
          }
        );
        const MapTest = dataBrack.map((items) => {
          return Object.entries(items.value)
            .map(([dataName, dataValue]) => dataName)
            .map((item, index) => {
              return Graph.push({
                key: switchType(item),
                year: items.id.slice(5, 16),
                value: Object.entries(items.value).map(
                  ([dataName, dataValue]) => {
                    return dataValue;
                  }
                )[index],
              });
            });
        });
        setfilterData(
          packageID === 0
            ? Graph
            : Graph.filter((item) => {
                return item.key === switchType(packageID);
              })
        );
        setData(dataBrack);
      } else {
        message.destroy();
        message.info(res.msg || JSON.stringify(res));
      }
    } catch (error) {
      message.destroy();
      message.info(JSON.stringify(error.response.data));
    }
  };

  const switchType = (record) => {
    switch (record) {
      case "1":
      case 1:
        return "特斯特娱乐";
      case 2:
      case "2":
        return "德比游戏";
      case 3:
      case "3":
        return "杏吧娱乐";
      case 6:
      case "6":
        return "91游戏";
      case 8:
      case "8":
        return "新盛游戏";
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
        return "新隆游戏";
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
      default:
        return;
    }
  };
  var COLOR_PLATE_20 = [
    "#5B8FF9",
    "#5AD8A6",
    "#5D7092",
    "#F6BD16",
    "#E8684A",
    "#6DC8EC",
    "#9270CA",
    "#FF9D4D",
    "#269A99",
    "#FF99C3",
    "#0050f2",
    "#11d185",
    "#031942",
    "#f5b702",
    "#d62900",
    "#0a516e",
    "#6a2dcf",
    "#f08630",
    "#099190",
    "#fa4892",
  ];
  var config = {
    data: filterData,
    xField: "year",
    yField: "value",
    seriesField: "key",
    smooth: true,
    color: COLOR_PLATE_20,
    xAxis: {
      interval: 0,
      width: 10,
    },
    point: {
      size: 2,
      shape: "circle",
      style: function style(_ref2) {
        var year = _ref2.year;
        return { r: Number(year) % 4 ? 0 : 3 };
      },
    },
  };
  let packageNode;
  if (packageList) {
    packageNode = packageList.map((item) => {
      return (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  }
  return (
    <div>
      <Card>
        <MyDatePicker
          handleValue={(date, dateString) => {
            ref.current.start_time = date[0] ? date[0].valueOf() : null;
            ref.current.end_time = date[1] ? date[1].valueOf() : null;
          }}
        />
        &nbsp; &nbsp;
        <Select
          placeholder="请选择"
          style={{ width: 120 }}
          defaultValue={"全部"}
          onSelect={(value) => {
            ref.current.packageID = value;
          }}
        >
          <Select.Option value={0} key={0}>
            全部
          </Select.Option>
          {packageNode}
        </Select>
        &nbsp; &nbsp;
        <LinkButton
          onClick={() => {
            getOnlineNumberGraph();
          }}
          size="default"
        >
          <Icon type="search" />
        </LinkButton>
        <LinkButton
          onClick={() => props.changeLoading(!props.loading)}
          size="default"
        >
          <Icon type="reload" />
        </LinkButton>
      </Card>
      &nbsp; &nbsp;
      <Card>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default React.memo(DemoLine);
