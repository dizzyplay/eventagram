import React, { useEffect } from "react";
import { HashTagList } from "./HashTagList";
import HashTagSearch from "./HashTagSearch";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addTagListAction } from "../module/hashtags";
import { getFeedAction, setServerAction } from "../module/selectedFeed";
import CircularProgress from "@material-ui/core/CircularProgress";
import Detail from "./Detail";
import DetailNav from "./DetailNav";
import socketIOClient from "socket.io-client";
import CheckedTagList from "./CheckedTagList";

function App() {
  const url = "ws://10.0.1.13:8000";
  const { hash_tag_list, pending } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchTagList = () => dispatch(addTagListAction());
  const dispatchGetFeed = id => dispatch(getFeedAction(id));
  const dispatchServer = server => dispatch(setServerAction(server));
  useEffect(() => {
    dispatchTagList();
    //eslint-disable-next-line
    const socket = socketIOClient(url);
    socket.on("completed", () => {
      console.log("completed");
      dispatchServer("completed");
      setTimeout(() => {
        dispatchServer("");
      }, 2000);
    });
    socket.on("progress", () => {
      console.log("progress");
      dispatchServer("progress");
    });
    //eslint-disable-next-line
  }, [url]);
  const getOrFetchFeed = id => {
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
                  <Link key={tag.id} onClick={() => getOrFetchFeed(tag.id)}>
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
            <CheckedTagList />
            <DetailNav />
            <Detail />
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
  top: 0;
  left: 400px;
`;

const FixedSeparatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 40px;
  left: 10px;
  width: 380px;
`;

export default App;
