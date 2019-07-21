import { deleteTagFetch, fetchMainData, fetchTagInfo } from "../api";
import {
  ADD_TAG_LIST,
  ADD_TAG,
  HASH_LIST_PENDING,
  SEARCH_PENDING,
  REFRESH_TAG,
  DELETE_TAG,
  TOGGLE_TAG_CHECKED_LIST,
  SET_BACKEND_WORK,
  OK
} from "../actions";

const initialState = {
  search_pending: false,
  hash_tag_list: [],
  pending: false,
  checkedTagList: [],
  isBackendWorking: { status: false, tag_id: null }
};

const hashtags = (state = initialState, { type, payload }) => {
  switch (type) {
    case TOGGLE_TAG_CHECKED_LIST:
      return applyToggleCheckedTagList(state, payload);
    case ADD_TAG_LIST:
      return {
        ...state,
        hash_tag_list: payload,
        pending: false
      };
    case ADD_TAG:
      return {
        ...state,
        search_pending: false,
        pending: false,
        hash_tag_list: [
          payload,
          ...state.hash_tag_list.filter(tag => payload.id !== tag.id)
        ]
      };
    case HASH_LIST_PENDING:
      return {
        ...state,
        pending: true
      };
    case SEARCH_PENDING:
      return {
        ...state,
        search_pending: true
      };
    case REFRESH_TAG:
      return {
        ...state,
        hash_tag_list: [
          ...state.hash_tag_list.filter(tag => tag.id !== payload.id),
          payload
        ].sort((a, b) => b.id - a.id)
      };
    case DELETE_TAG:
      return {
        ...state,
        hash_tag_list: state.hash_tag_list.filter(tag => tag.id !== payload),
        checkedTagList: [
          ...state.checkedTagList.filter(tag => tag.id !== payload)
        ]
      };
    case SET_BACKEND_WORK:
      return {
        ...state,
        isBackendWorking: payload
      };
    case OK:
      return {
        ...state,
        pending: false,
        search_pending: false
      };
    default:
      return state;
  }
};

const addTag = tag => ({ type: ADD_TAG, payload: tag });
const addTagList = tagList => ({
  type: ADD_TAG_LIST,
  payload: tagList
});
const deleteTag = tagId => ({ type: DELETE_TAG, payload: tagId });
const setSearchPending = () => ({ type: SEARCH_PENDING });
const setOk = () => ({ type: OK });
export const setBackendWorking = flag => ({
  type: SET_BACKEND_WORK,
  payload: flag
});
export const refreshTag = tag => ({ type: REFRESH_TAG, payload: tag });
export const addCheckedTagList = tag => ({
  type: TOGGLE_TAG_CHECKED_LIST,
  payload: tag
});

const applyToggleCheckedTagList = (state, payload) => {
  let temp = null;
  if (state.checkedTagList.filter(tag => tag.id === payload.id).length !== 0) {
    temp = [...state.checkedTagList.filter(tag => tag.id !== payload.id)];
  } else {
    temp = [...state.checkedTagList, payload];
  }
  return {
    ...state,
    checkedTagList: temp
  };
};

//actions
export const deleteTagAction = tagId => dispatch => {
  return deleteTagFetch(tagId).then(() => {
    dispatch(deleteTag(tagId));
  });
};

export const addTagAction = tagQ => dispatch => {
  dispatch(setSearchPending());
  return fetchTagInfo(tagQ).then(data => {
    const { hashTag } = data.data;
    if (hashTag) dispatch(addTag(hashTag));
    else {
      dispatch(setOk());
      alert("없는태그입니다.");
    }
  });
};

export const addTagListAction = () => dispatch => {
  dispatch({ type: HASH_LIST_PENDING });
  return fetchMainData().then(data => {
    dispatch(addTagList(data.data));
    if (data.data.filter(tag => tag.isProcessing === true).length !== 0)
      dispatch(
        setBackendWorking({
          status: true,
          tag_id: data.data.filter(tag => tag.isProcessing === true)[0].id
        })
      );
  });
};

export default hashtags;
