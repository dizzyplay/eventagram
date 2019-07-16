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
import { Row } from "../styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as moment from "moment";
import "moment/locale/ko";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  card: {
    display: "flex",
    margin: "3px",
    padding: "0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    flex: "1 0 auto",
    padding: "0",
    width: "360px"
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
    alignItems: "center",
    marginLeft: "10px"
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
  const { checkedTagList, isBackendWorking } = useSelector(
    state => state.hashtags
  );
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
                  onChange={() => dispatchGetFeed(hashtag.id)}
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
                {hashtag.id === isBackendWorking.tag_id &&
                isBackendWorking.status ? (
                  <Row style={{ margin: "10px" }}>
                    해당태그 상태
                    <div
                      className={classes.root}
                      style={{ marginLeft: "20px" }}
                    >
                      <LinearProgress color="secondary" variant="query" />
                    </div>
                  </Row>
                ) : (
                  ""
                )}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  paddingLeft: "10px",
                  paddingBottom: "5px",
                  paddingTop: "1px"
                }}
              >
                <Typography variant={"caption"}>
                  태그생성날짜:{moment(hashtag.createdAt).calendar()}
                </Typography>
                <Typography variant={"caption"}>
                  마지막 갱신 날짜: {moment(hashtag.updatedAt).calendar()}
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
