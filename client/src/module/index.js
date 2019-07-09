import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import hashtags from "./hashtags";
import { composeWithDevTools } from "redux-devtools-extension";
import selectedFeed from "./selectedFeed";

const rootReducer = combineReducers({ hashtags, selectedFeed });

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;
