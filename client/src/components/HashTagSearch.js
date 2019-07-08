import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { addTagAction } from "../module/hashtags";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  margin: {
    margin: theme.spacing(1)
  },
  root: {
    padding: "2px 4px",
    margin: "0",
    height: "40px",
    display: "flex",
    alignItems: "center",
    width: 300
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
}));
export default () => {
  const [tag, setTag] = useState("");
  const { search_pending } = useSelector(state => state.hashtags);
  const dispatch = useDispatch();
  const dispatchTagInfo = tag => dispatch(addTagAction(tag));
  const classes = useStyles();
  const handleChange = e => {
    setTag(e.target.value);
  };
  const handleSubmit = () => {
    dispatchTagInfo(tag);
    setTag("");
  };
  console.log(search_pending);
  return (
    <Container>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={"여기서 해시태그 검색 "}
          onChange={handleChange}
          value={tag}
        />
        {search_pending ? (
          <CircularProgress size={25} />
        ) : (
          <IconButton className={classes.iconButton} onClick={handleSubmit}>
            <SearchIcon />
          </IconButton>
        )}
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
