import { fetchFeed } from "../api";
import { ADD_FEED_LIST } from "../actions";

const initialState = {
  feed: [],
  pending: false,
  selected_feed: { list: [] }
};

const selectedFeed = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_FEED_LIST:
      return {
        ...state,
        pending: false,
        feed: [
          ...state.feed.filter(feed => feed.tag.name !== payload.tag.name),
          payload
        ]
      };
    case "SET_CURRENT_FEED":
      return {
        ...state,
        pending: false,
        selected_feed: payload
      };
    case "FEED_PENDING":
      return {
        ...state,
        pending: true
      };
    default:
      return state;
  }
};

const addFeedList = feedList => ({ type: ADD_FEED_LIST, payload: feedList });
const setCurrentFeed = feed => ({ type: "SET_CURRENT_FEED", payload: feed });
const setPending = () => ({ type: "FEED_PENDING" });

export const getFeedAction = tagId => dispatch => {
  dispatch(setPending());
  return fetchFeed(tagId).then(data => {
    let Feed = {};
    Feed.tag = data.data.tag;
    Feed.list = data.data.feed_list;
    dispatch(addFeedList(Feed));
    dispatch(setCurrentFeed(Feed));
  });
};

export default selectedFeed;
