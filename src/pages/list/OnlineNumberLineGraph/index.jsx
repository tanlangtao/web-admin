import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/charts";
import { message } from "antd";

import { getOnlineTotalGraph } from "../../../api/index";
const DemoLine = () => {
  const [data, setData] = useState([]);
  const [dataBrack, setdataBrack] = useState([]);
  const [Graph, setGraph] = useState([]);
  const [MapTest, setMapTest] = useState([]);
  const getOnlineNumberGraph = async () => {
    try {
      message.loading("正在统计中.....", 20);
      let res = await getOnlineTotalGraph();
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
          console.log("items123", items);
          return Object.entries(items.value)
            .map(([dataName, dataValue]) => dataName)
            .map((item, index) => {
              console.log(
                "dataValue123",
                Object.entries(items.value).map(([dataName, dataValue]) => {
                  return dataValue;
                })[index]
              );
              return Graph.push({
                key: switchType(item),
                year: items.id.slice(11, 16),
                value: Object.entries(items.value).map(
                  ([dataName, dataValue]) => {
                    return dataValue;
                  }
                )[index],
              });
            });
        });
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

  useEffect(() => {
    getOnlineNumberGraph();
  }, []);

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

  var config = {
    data: Graph,
    xField: "year",
    yField: "value",
    legend: false,
    seriesField: "key",
    stepType: "line",
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
  };
  return <Line {...config} />;
};

export default DemoLine;
