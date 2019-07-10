import * as React from "react";
import styled from "styled-components";
import { Tooltip, Button, makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import FavoriteBorder from "@material-ui/icons/Favorite";
import ChatBubble from "@material-ui/icons/ChatBubble";

export function Presenter(props) {
  const { selected_feed, loading } = props;
  const useStyles = makeStyles(theme => ({
    root: {},
    icon: {
      margin: "3px"
    }
  }));
  const classes = useStyles();
  const handleUrl = code => {
    window.open("https://www.instagram.com/p/" + code + "/");
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
              <Column>
                <Small>@{feed.username}</Small>
                <Row>
                  <FavoriteBorder
                    className={classes.icon}
                    color={"secondary"}
                    style={{ fontSize: 13 }}
                  />
                  {feed.likeCount}
                  <ChatBubble
                    className={classes.icon}
                    color={"action"}
                    style={{ fontSize: 14 }}
                  />
                  {feed.commentCount}
                </Row>
              </Column>
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
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
