import React, { useEffect } from "react";
import { HashTagList } from "./HashTagList";
import HashTagSearch from "./HashTagSearch";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addTagListAction } from "../module/hashtags";
import { getFeedAction } from "../module/selectedFeed";
import CircularProgress from "@material-ui/core/CircularProgress";
import Detail from "./Detail";

function App() {
  const { hash_tag_list, pending } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchTagList = () => dispatch(addTagListAction());
  const dispatchGetFeed = id => dispatch(getFeedAction(id));
  useEffect(() => {
    dispatchTagList();
    //eslint-disable-next-line
  }, []);
  const fetchFeed = id => {
    dispatchGetFeed(id);
  };
  return (
    <>
      {pending ? (
        <CircularProgress size={100} />
      ) : (
        <AppContainer>
          <FixedSeparatedContainer>
            <>
              <HashTagSearch />
              <div>
                {hash_tag_list.map(tag => (
                  <Link key={tag.id} onClick={() => fetchFeed(tag.id)}>
                    {tag.id}
                    <HashTagList
                      id={tag.id}
                      name={tag.name}
                      mediaCount={tag.mediaCount}
                      createdAt={tag.createdAt}
                      updatedAt={tag.updatedAt}
                      isProsessing={tag.isProcessing}
                    />
                  </Link>
                ))}
              </div>
            </>
          </FixedSeparatedContainer>
          <SeparatedContainer>
            <Detail hashTagList={hash_tag_list} />
          </SeparatedContainer>
        </AppContainer>
      )}
    </>
  );
}

const AppContainer = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  position: relative;
`;

const Link = styled.div`
  cursor: pointer;
`;

const SeparatedContainer = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 400px;
`;

const FixedSeparatedContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 10px;
  width: 380px;
`;

export default App;
