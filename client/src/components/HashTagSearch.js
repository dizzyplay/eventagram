import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { getHashInfo } from "../api";

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
  const [v, setV] = useState("");
  const classes = useStyles();
  const handleChange = e => {
    setV(e.target.value);
    console.log(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      const result = await getHashInfo(v);
      console.log(result.data.hashTag);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={"여기서 해시태그 검색 "}
          onChange={handleChange}
        />
        <IconButton className={classes.iconButton} onClick={handleSubmit}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
