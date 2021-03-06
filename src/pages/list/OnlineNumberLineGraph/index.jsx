import React, { useState, useEffect, useRef } from "react";
import { Line } from "@ant-design/charts";
import { Card, message, Select, Icon } from "antd";
import LinkButton from "../../../components/link-button";
import MyDatePicker from "../../../components/MyDatePickerStartToday";
import { getOnlineTotalGraph, userPackageList } from "../../../api/index";
import { switchPackageId } from "../../../utils/switchType";

let initstate = {
  start_time: null,
  end_time: null,
  packageID: 0,
};

const DemoLine = (props) => {
  const [data, setData] = useState([]);
  const [Graph, setGraph] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const ref = useRef(initstate);
  const [packageList, setpackageList] = useState([]);
  const getInitialData = async () => {
    const res = await userPackageList();
    if (res.status === 0) {
      setpackageList(res.data.list);
    }
  };
  useEffect(() => {
    getInitialData();
  }, []);

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
    return switchPackageId(record);
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
