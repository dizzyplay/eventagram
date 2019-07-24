import * as React from "react";
import { LineChart, Line, XAxis, Tooltip, YAxis, LabelList } from "recharts";
import { getQuantityFeedByDate } from "../utils";
import styled from "styled-components";
import { useState } from "react";
import { Typography } from "@material-ui/core";

export function FeedChart(props) {
  const [max, setMax] = useState(5);
  let data = getQuantityFeedByDate(props.feedList, max);
  if (data.length === 0) return null;
  const handleChange = e => {
    setMax(e.target.value);
    data = getQuantityFeedByDate(props.feedList, max);
    console.log(max);
  };
  return (
    <>
      <div style={{ margin: 5 }}>
        <select onChange={handleChange} value={max}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={30}>30</option>
        </select>{" "}
        <Typography variant={"caption"}>
          간격 게시글 변화량(새로운 게시글이 없는날은 제외)
        </Typography>
      </div>
      <LineChart
        width={650}
        height={200}
        data={data.reverse()}
        margin={{ top: 15, right: 10, bottom: 0, left: 0 }}
      >
        <Line type={"monotone"} dataKey={"amount"} stroke={"#8884d8"}>
          <LabelList
            dataKey={"amount"}
            position={"top"}
            content={RenderCustomLabel}
          />
        </Line>
        <XAxis
          dataKey={"date"}
          tickLine={false}
          axisLine={true}
          tick={CustomXAxisTick}
        />
        <YAxis
          padding={{ left: 0 }}
          hide={false}
          width={30}
          tickLine={false}
          type={"number"}
          allowDecimals={false}
          tick={CustomYAxisTick}
        />
        <Tooltip content={CustomToolTip} />
      </LineChart>
    </>
  );
}

const CustomXAxisTick = props => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={10}
        y={0}
        dy={10}
        textAnchor={"end"}
        fontWeight={600}
        fontSize={10}
        style={{ fontFamily: "sans-serif" }}
      >
        {payload.value}
      </text>
    </g>
  );
};
const CustomYAxisTick = props => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-5}
        y={-10}
        dy={10}
        textAnchor={"start"}
        fontWeight={600}
        fontSize={10}
        style={{ fontFamily: "sans-serif" }}
      >
        {payload.value === 0 ? "" : payload.value}
      </text>
    </g>
  );
};
const ToolTipBox = styled.div`
  background-color: white;
  width: 70px;
  display: block;
  font-size: 10px;
  padding: 10px;
  font-weight: 600;
  letter-spacing: -0.6px;
  line-height: 1.6;
  text-align: center;
  font-family: sans-serif;
  border: 1px solid #e4e4e4;
`;
const CustomToolTip = props => {
  const { active } = props;
  if (active) {
    const { payload, label } = props;
    return (
      <ToolTipBox>
        {label}
        <br />
        {payload[0].value}개
      </ToolTipBox>
    );
  } else return null;
};

const RenderCustomLabel = props => {
  const { x, y, value } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={-10}
        textAnchor={"middle"}
        fontWeight={600}
        fontSize={10}
        style={{ fontFamily: "sans-serif" }}
      >
        {value > 1 ? value : ""}
      </text>
    </g>
  );
};
