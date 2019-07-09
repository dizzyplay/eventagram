import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Presenter } from "./presenter";
import { getFeedAction } from "../../module/selectedFeed";
import { useEffect } from "react";

export function Container() {
  const { selected_feed, pending } = useSelector(state => state.selectedFeed);
  const { hash_tag_list } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchFeed = id => dispatch(getFeedAction(id));
  useEffect(() => {
    if (hash_tag_list.length > 0) dispatchFeed(hash_tag_list[0].id);
    //eslint-disable-next-line
  }, []);
  return <Presenter loading={pending} selected_feed={selected_feed} />;
}
