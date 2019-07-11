import * as React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Label from "@material-ui/icons/Label";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(2, 2),
    margin: theme.spacing(1)
  },
  btn: {
    margin: "5px"
  }
}));
export function Presenter(props) {
  const { tagList } = props;
  const classes = useStyles();
  return (
    <Paper
      square={true}
      elevation={1}
      className={classes.root}
      style={{ width: "100%" }}
    >
      <Label />
      {tagList.map(tag => (
        <Button
          className={classes.btn}
          variant={"outlined"}
          size={"small"}
          key={tag.id}
        >
          {tag.name}
        </Button>
      ))}
    </Paper>
  );
}
