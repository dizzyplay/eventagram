import * as React from "react";
import { Button, Tooltip } from "@material-ui/core";
import FavoriteBorder from "@material-ui/icons/Favorite";
import ChatBubble from "@material-ui/icons/ChatBubble";
import styled from "styled-components";
import * as moment from "moment";
import "moment/locale/ko";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default ({ feed }) => {
  const {
    id,
    caption,
    code,
    username,
    commentCount,
    takenAt,
    likeCount
  } = feed;
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
    <Tooltip key={id} title={caption ? caption : ""}>
      <Button
        style={{ margin: "10px" }}
        variant={"outlined"}
        size={"small"}
        onClick={() => handleUrl(code)}
      >
        <Column>
          <Small>@{username}</Small>
          <Row>
            <FavoriteBorder
              className={classes.icon}
              color={"secondary"}
              style={{ fontSize: 10 }}
            />
            {likeCount}
            <ChatBubble
              className={classes.icon}
              color={"action"}
              style={{ fontSize: 11 }}
            />
            {commentCount}
          </Row>
          <Small>{moment(takenAt).calendar()}</Small>
        </Column>
      </Button>
    </Tooltip>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Small = styled.span`
  font-size: 9px;
`;
