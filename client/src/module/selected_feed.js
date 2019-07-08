import { fetchFeed } from "../api";

const initialState = {
  feed: [],
  selected_feed: { list: [] }
};

const selected_feed = (state = initialState, { type, payload }) => {
  switch (type) {
    case "ADD_FEED_LIST":
      console.log(payload);
      return {
        ...state,
        feed: [
          ...state.feed.filter(feed => feed.tag.name !== payload.tag.name),
          payload
        ]
      };
    case "SET_CURRENT_FEED":
      return {
        ...state,
        selected_feed: payload
      };
    default:
      return state;
  }
};

const addFeed = feedList => ({ type: "ADD_FEED_LIST", payload: feedList });
const setCurrentFeed = feed => ({ type: "SET_CURRENT_FEED", payload: feed });

export const getFeedAction = tagId => dispatch => {
  return fetchFeed(tagId).then(data => {
    let Feed = {};
    Feed.tag = data.data.tag;
    Feed.list = data.data.feed_list;
    dispatch(addFeed(Feed));
    dispatch(setCurrentFeed(Feed));
  });
};

export default selected_feed;
