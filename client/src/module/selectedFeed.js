import { fetchFeed, refreshHashFeedApi } from "../api";
import {
  ADD_FEED_LIST,
  SET_CURRENT_FEED,
  FEED_PENDING,
  SET_SERVER_STATE,
  REFRESH_HASH_FEED
} from "../actions";

const initialState = {
  feed: [],
  pending: false,
  selected_feed: { tag: null, list: [] },
  server: "",
  current_tag_id: null,
  task: null
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
    case SET_CURRENT_FEED:
      return {
        ...state,
        pending: false,
        selected_feed: payload
      };
    case FEED_PENDING:
      return {
        ...state,
        pending: true
      };
    case REFRESH_HASH_FEED:
      return {
        ...state,
        pending: false
      };
    case SET_SERVER_STATE:
      return {
        ...state,
        server: payload
      };
    default:
      return state;
  }
};

const addFeedList = feedList => ({ type: ADD_FEED_LIST, payload: feedList });
const setCurrentFeed = feed => ({ type: SET_CURRENT_FEED, payload: feed });
const setPending = () => ({ type: FEED_PENDING });
const setServer = server => ({ type: SET_SERVER_STATE, payload: server });
const refreshHashFeed = () => ({ type: REFRESH_HASH_FEED });

export const refreshHashFeedAction = name => dispatch => {
  dispatch(setPending());
  return refreshHashFeedApi(name).then(data => {
    dispatch(refreshHashFeed());
  });
};

export const getFeedAction = tagId => dispatch => {
  dispatch(setPending());
  return fetchFeed(tagId).then(data => {
    let Feed = {};
    Feed.tag = data.data.tag;
    Feed.list = data.data.feed_list;
    dispatch(addFeedList(Feed));
    console.log(Feed.tag.id);
    dispatch(setCurrentFeed(Feed));
  });
};

export const setServerAction = server => dispatch => {
  dispatch(setServer(server));
};

export default selectedFeed;
