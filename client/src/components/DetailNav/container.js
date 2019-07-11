import * as React from "react";
import { Presenter } from "./presenter";
import { useDispatch, useSelector } from "react-redux";
import { refreshHashFeedAction } from "../../module/selectedFeed";
import { addCheckedTagList } from "../../module/hashtags";

export function Container() {
  const { selected_feed, pending, server } = useSelector(
    state => state.selectedFeed
  );
  const { checkedTagList } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchRefresh = tagName => dispatch(refreshHashFeedAction(tagName));
  const handleRefresh = tagName => {
    dispatchRefresh(tagName);
  };
  const handleCheck = tag => {
    dispatch(addCheckedTagList(tag));
  };
  return (
    <>
      {pending ? (
        "loading"
      ) : (
        <Presenter
          selectedFeed={selected_feed}
          server={server}
          handleRefresh={handleRefresh}
          handleCheck={handleCheck}
          checkedTagList={checkedTagList}
        />
      )}
    </>
  );
}
