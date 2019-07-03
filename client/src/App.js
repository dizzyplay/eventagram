import React, {useEffect, useState} from 'react';
import {HashTag} from "./components/HashTag";
import HashTagSearch from "./components/HashTagSearch"
import axios from "axios"
import styled from "styled-components"
import {useGlobalState} from "./GlobalState";

function App() {
  const [{hashList},dispatch] = useGlobalState();
  const url = 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url)
      dispatch({type:'setHashList',value:result.data});
    };
    fetchData();
  }, [])
  return (
      <AppContainer>
        <HashTagSearch/>
        <HashTagContainer>
          {hashList.map(
            (v, idx) => (
              <HashTag
                key={idx}
                name={v.name}
                mediaCount={v.mediaCount}
                createdAt={v.createdAt}
                updatedAt={v.updatedAt}
                isProsessing={v.isProcessing}
              />
            ))}
        </HashTagContainer>
      </AppContainer>
  );
}

const HashTagContainer = styled.div`
  margin: 30px;
`

const AppContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`

export default App;

