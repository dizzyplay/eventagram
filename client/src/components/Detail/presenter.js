import * as React from "react";
import styled from "styled-components";
import { Tooltip, Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

export function Presenter(props) {
  const { selected_feed, loading } = props;

  const handleUrl = code => {
    window.open("https://www.instagram.com/p/" + code);
  };
  return (
    <Main>
      {loading ? (
        <CircularProgress size={25} />
      ) : (
        selected_feed.length !== 0 &&
        selected_feed.list.map(feed => (
          <Tooltip key={feed.id} title={feed.caption ? feed.caption : ""}>
            <Button
              style={{ margin: "10px" }}
              variant={"outlined"}
              size={"small"}
              onClick={() => handleUrl(feed.code)}
            >
              <Small>@{feed.username}</Small>
            </Button>
          </Tooltip>
        ))
      )}
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0px solid;
`;
const Small = styled.span`
  font-size: 9px;
`;
