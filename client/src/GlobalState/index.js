import React, {useContext, useReducer} from "react"
import stateReducer from "./stateReducer";

const GlobalState = {
  hashList:[],
}
const GlobalContext = React.createContext(GlobalState);

const GlobalStateProvider = ({children})=>(
  <GlobalContext.Provider value={useReducer(stateReducer, GlobalState)}>
    {children}
  </GlobalContext.Provider>
)

export const useGlobalState = ()=>useContext(GlobalContext)

export default GlobalStateProvider;