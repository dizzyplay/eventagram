import React, { useEffect } from "react";
import { HashTag } from "./components/HashTag";
import HashTagSearch from "./components/HashTagSearch";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getDataAction } from "./module/hashtags";

function App() {
  const { data, pending } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const getData = () => dispatch(getDataAction());
  useEffect(() => {
    getData();
  }, []);
  return (
    <AppContainer>
      <HashTagSearch />
      <HashTagContainer>
        {pending
          ? "loading"
          : data.map((v, idx) => (
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
`;

const AppContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

export default App;
