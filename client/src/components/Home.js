import React, { useEffect } from "react";
import { HashTagCard } from "./HashTagCard";
import HashTagSearch from "./HashTagSearch";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addTagListAction, setBackendWorking } from "../module/hashtags";
import { getFeedAction, setServerAction } from "../module/selectedFeed";
import CircularProgress from "@material-ui/core/CircularProgress";
import Detail from "./Detail";
import DetailNav from "./DetailNav";
import CheckedTagNav from "./CheckedTagNav";
import CheckedTagList from "./CheckedTagList";
import socketIOClient from "socket.io-client";

const url = "ws://10.0.1.13:8000";
const socket = socketIOClient(url);

function App() {
  const { hash_tag_list, pending, checkedTagList } = useSelector(
    state => state.hashtags
  );
  const dispatch = useDispatch();
  const dispatchAddTagList = () => dispatch(addTagListAction());
  const dispatchGetFeed = id => dispatch(getFeedAction(id));
  const dispatchServer = server => dispatch(setServerAction(server));
  useEffect(() => {
    dispatchAddTagList();
    //eslint-disable-next-line
    socket.on("completed", data => {
      console.log("completed");
      dispatchServer("completed");
      setTimeout(() => {
        dispatchServer("");
        dispatchGetFeed(data.job.data.hash_tag_id);
        dispatch(setBackendWorking({ status: false, tag_id: null }));
      }, 2000);
    });
    socket.on("progress", () => {
      console.log("progress");
      dispatchServer("progress");
    });
    //eslint-disable-next-line
  }, []);
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
              {hash_tag_list.map(tag => (
                <Link key={tag.id} onClick={() => getOrFetchFeed(tag.id)}>
                  <HashTagCard
                    id={tag.id}
                    name={tag.name}
                    mediaCount={tag.mediaCount}
                    createdAt={tag.createdAt}
                    updatedAt={tag.updatedAt}
                    isProcessing={tag.isProcessing}
                  />
                </Link>
              ))}
            </>
          </FixedSeparatedContainer>
          <SeparatedContainer>
            <CheckedTagNav />
            {checkedTagList.length > 0 ? (
              <CheckedTagList />
            ) : (
              <>
                <DetailNav />
                <Detail />
              </>
            )}
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
