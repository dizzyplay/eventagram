import React, { useEffect } from "react";
import { HashTagList } from "./HashTagList";
import HashTagSearch from "./HashTagSearch";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addTagListAction } from "../module/hashtags";
import { getFeedAction } from "../module/selected_feed";
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
    console.log(id);
    dispatchGetFeed(id);
  };
  return (
    <AppContainer>
      <FixedSeparatedContainer>
        {pending ? (
          <CircularProgress size={100} />
        ) : (
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
        )}
      </FixedSeparatedContainer>
      <SeparatedContainer>
        <Detail />
      </SeparatedContainer>
    </AppContainer>
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
  width: 700px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30px;
  right: 0;
`;

const FixedSeparatedContainer = styled.div`
  position: fixed;
  top: 30px;
  left: 10px;
`;

export default App;
