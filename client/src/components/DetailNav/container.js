import * as React from "react";
import { Presenter } from "./presenter";
import { useDispatch, useSelector } from "react-redux";
import { refreshHashFeedAction } from "../../module/selectedFeed";

export function Container() {
  const { selected_feed, pending, server } = useSelector(
    state => state.selectedFeed
  );
  const dispatch = useDispatch();
  const dispatchRefresh = tagName => dispatch(refreshHashFeedAction(tagName));
  const handleRefresh = tagName => {
    dispatchRefresh(tagName);
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
        />
      )}
    </>
  );
}
