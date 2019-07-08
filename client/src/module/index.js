import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import hashtags from "./hashtags";
import { composeWithDevTools } from "redux-devtools-extension";
import selected_feed from "./selected_feed";

const rootReducer = combineReducers({ hashtags, selected_feed });

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;
