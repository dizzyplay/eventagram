import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { getHashInfo } from "../api";
import { useDispatch } from "react-redux";
import { deleteTagAction, refreshTag } from "../module/hashtags";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    margin: "10px",
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

export function HashTagList(props) {
  const data = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const dispatchDeleteTag = tagId => dispatch(deleteTagAction(tagId));
  const classes = useStyles();

  const handleRefresh = async e => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await getHashInfo(data.name);
      dispatch(refreshTag(res.data.hashTag));
      setLoading(false);
    } catch (e) {}
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatchDeleteTag(id);
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
                  variant={"h5"}
                  className={classes.split}
                >
                  #{data.name}
                </Typography>
                <div className={classes.split}>
                  <Typography variant={"caption"}>미디어 </Typography>
                  <Typography
                    variant={"h5"}
                    color={"primary"}
                    style={{ padding: "10px" }}
                  >
                    {data.mediaCount}
                  </Typography>
                  <Column>
                    <button onClick={handleRefresh}>refresh</button>
                    <button onClick={e => handleDelete(e, data.id)}>
                      delete
                    </button>
                  </Column>
                </div>
              </div>
              <Typography variant={"caption"} color={"textSecondary"}>
                {data.isProcessing ? "ok" : "not active"}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <CardContent>
                <Typography>생성날짜: {data.createdAt}</Typography>
                <Typography>마지막 갱신 날짜 : {data.updatedAt}</Typography>
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
