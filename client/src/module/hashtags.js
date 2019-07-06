import { fetchMainData } from "../api";

const initialState = {
  pending: false,
  data: []
};

const hashtags = (state = initialState, { type, payload }) => {
  switch (type) {
    case "GET_DATA":
      return {
        ...state,
        data: payload,
        pending: false
      };
    case "PENDING":
      return {
        ...state,
        pending: true
      };
    default:
      return state;
  }
};

export const getDataAction = () => dispatch => {
  dispatch({ type: "PENDING" });
  return fetchMainData().then(data => {
    dispatch({ type: "GET_DATA", payload: data.data });
  });
};

export default hashtags;
