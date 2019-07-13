import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { getHashInfo } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { deleteTagAction, refreshTag } from "../module/hashtags";
import {
  deleteCurrentFeed,
  getFeedAndAddTagAction
} from "../module/selectedFeed";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    margin: "3px",
    padding: "0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    flex: "1 0 auto"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    padding: "0",
    margin: "0"
  },
  split: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  centered: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  }
}));

export function HashTagCard(props) {
  const hashtag = props;
  const [loading, setLoading] = useState(false);
  const { selected_feed } = useSelector(state => state.selectedFeed);
  const { checkedTagList } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchDeleteTag = tagId => dispatch(deleteTagAction(tagId));
  const dispatchDeleteCurrentFeed = () => dispatch(deleteCurrentFeed());
  const dispatchGetFeed = tagId => dispatch(getFeedAndAddTagAction(tagId));
  const classes = useStyles();

  const handleRefresh = async e => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await getHashInfo(hashtag.name);
      dispatch(refreshTag(res.data.hashTag));
      setLoading(false);
    } catch (e) {}
  };
  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatchDeleteTag(id);
    if (selected_feed.tag.id === id) {
      dispatchDeleteCurrentFeed();
    }
  };
  const handleCheck = () => {
    dispatchGetFeed(hashtag.id);
  };
  return (
    <>
      {loading ? (
        <Card className={classes.card}>
          <CardContent className={classes.centered}>
            <CircularProgress size={40} />
          </CardContent>
        </Card>
      ) : (
        <Card className={classes.card}>
          <div className={classes.detail}>
            <CardContent className={classes.content}>
              <div className={classes.split}>
                <Typography
                  component={"h5"}
                  variant={"h6"}
                  className={classes.split}
                >
                  #{hashtag.name}
                </Typography>
                <Checkbox
                  checked={
                    checkedTagList.filter(tag => tag.id === hashtag.id)
                      .length !== 0
                  }
                  onChange={handleCheck}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
                <div className={classes.split}>
                  <Typography variant={"caption"}>미디어 </Typography>
                  <Typography
                    variant={"h5"}
                    color={"primary"}
                    style={{ padding: "10px" }}
                  >
                    {hashtag.mediaCount}
                  </Typography>
                  <Column>
                    <button onClick={handleRefresh}>refresh</button>
                    <button onClick={e => handleDelete(e, hashtag.id)}>
                      delete
                    </button>
                  </Column>
                </div>
              </div>
              <Typography variant={"caption"} color={"textSecondary"}>
                {hashtag.isProcessing ? "ok" : "not active"}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <CardContent style={{ display: "flex", flexDirection: "column" }}>
                <Typography variant={"caption"}>
                  생성날짜: {hashtag.createdAt}
                </Typography>
                <Typography variant={"caption"}>
                  마지막 갱신 날짜 : {hashtag.updatedAt}
                </Typography>
              </CardContent>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
