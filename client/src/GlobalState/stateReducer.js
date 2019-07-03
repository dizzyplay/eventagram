export default (state, action) => {
  switch (action.type) {
    case "setHashList":
      console.log(state)
      return {
        ...state,
        hashList: [...action.value],
      };
    case "addHashTag":
      console.log(state)
      return {
        ...state,
        hashList:[...state.hashList,action.value]
      };
    default:
      return state;
  }
};