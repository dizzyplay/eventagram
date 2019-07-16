import { fetchFeed, refreshHashFeedApi } from "../api";
import {
  ADD_FEED_LIST,
  SET_CURRENT_FEED,
  FEED_PENDING,
  SET_SERVER_STATE,
  CHANGE_TAG_LOADING_STATUS,
  DELETE_CURRENT_FEED
} from "../actions";
import { addCheckedTagList } from "./hashtags";

const initialState = {
  cachedFeed: [],
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
        cachedFeed: [
          ...state.cachedFeed.filter(
            feed => feed.tag.name !== payload.tag.name
          ),
          payload
        ]
      };
    case DELETE_CURRENT_FEED:
      return applyDeleteCurrentFeed(state, payload);
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
    case CHANGE_TAG_LOADING_STATUS:
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
const setCurrentFeed = feed => ({
  type: SET_CURRENT_FEED,
  payload: feed
});
const setPending = () => ({ type: FEED_PENDING });
const setServer = server => ({ type: SET_SERVER_STATE, payload: server });
const changeTagLoadingStatus = () => ({ type: CHANGE_TAG_LOADING_STATUS });
export const deleteCurrentFeed = () => ({ type: DELETE_CURRENT_FEED });

const applyDeleteCurrentFeed = (state, payload) => {
  return {
    ...state,
    selected_feed: { tag: null, list: [] }
  };
};

export const changeTagLoadingStatusAction = name => dispatch => {
  dispatch(setPending());
  return refreshHashFeedApi(name).then(data => {
    dispatch(changeTagLoadingStatus());
  });
};

export const getFeedAction = ({ tagId, force }) => (dispatch, getState) => {
  dispatch(setPending());
  const cachedFeed = getState().selectedFeed.cachedFeed.filter(
    feed => feed.tag.id === tagId
  )[0];
  if (cachedFeed && !force) {
    dispatch(setCurrentFeed(cachedFeed));
  } else {
    return fetchFeed(tagId).then(data => {
      let Feed = {};
      Feed.tag = data.data.tag;
      Feed.list = data.data.feed_list;
      dispatch(addFeedList(Feed));
      dispatch(setCurrentFeed(Feed));
    });
  }
};

export const getFeedAndAddTagAction = tagId => dispatch => {
  dispatch(setPending());
  return fetchFeed(tagId).then(data => {
    let Feed = {};
    Feed.tag = data.data.tag;
    Feed.list = data.data.feed_list;
    dispatch(addFeedList(Feed));
    dispatch(setCurrentFeed(Feed));
    dispatch(addCheckedTagList(Feed.tag));
  });
};

export const setServerAction = server => dispatch => {
  dispatch(setServer(server));
};

export default selectedFeed;
