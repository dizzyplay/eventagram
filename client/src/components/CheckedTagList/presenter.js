import * as React from "react";
import styled from "styled-components";
import { Tooltip, Button, makeStyles } from "@material-ui/core";
import FavoriteBorder from "@material-ui/icons/Favorite";
import ChatBubble from "@material-ui/icons/ChatBubble";
import * as moment from "moment";
import "moment/locale/ko";

export function Presenter({ list }) {
  const useStyles = makeStyles(() => ({
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
      {list.map(feed => (
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
                  style={{ fontSize: 10 }}
                />
                {feed.likeCount}
                <ChatBubble
                  className={classes.icon}
                  color={"action"}
                  style={{ fontSize: 11 }}
                />
                {feed.commentCount}
              </Row>
              <Small>{moment(feed.takenAt).calendar()}</Small>
            </Column>
          </Button>
        </Tooltip>
      ))}
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
