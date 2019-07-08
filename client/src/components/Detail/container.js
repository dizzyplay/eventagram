import * as React from "react";
import { useSelector } from "react-redux";
import { Presenter } from "./presenter";

export function Container() {
  const { selected_feed } = useSelector(state => state.selected_feed);
  console.log(selected_feed);
  return <Presenter selected_feed={selected_feed} />;
}
