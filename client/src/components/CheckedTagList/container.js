import * as React from "react";
import { Presenter } from "./presenter";
import { useSelector } from "react-redux";

export function Container() {
  const { checkedTagList } = useSelector(state => state.hashtags);
  return <Presenter tagList={checkedTagList} />;
}
