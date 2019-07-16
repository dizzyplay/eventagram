import * as React from "react";
import { Presenter } from "./presenter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getOverlap } from "../../utils";

export function Container() {
  const { cachedFeed } = useSelector(state => state.selectedFeed);
  const { checkedTagList } = useSelector(state => state.hashtags);
  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    const filteredFeed = checkedTagList.map(
      tag => cachedFeed.filter(feed => feed.tag.id === tag.id)[0]
    );
    const list = filteredFeed.map(v => v && v.list);
    setFilteredList(getOverlap(list));
  }, [cachedFeed, checkedTagList]);
  return <Presenter list={filteredList} tags={checkedTagList} />;
}
