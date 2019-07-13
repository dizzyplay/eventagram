import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Column, Row } from "../../styles";
import { makeStyles, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2)
  }
}));

export function Presenter(props) {
  const { selectedFeed, server, handleRefresh, isBackendWorking } = props;
  const classes = useStyles();

  return (
    <Paper
      elevation={0}
      square={true}
      className={classes.root}
      style={{ width: "100%" }}
    >
      <Container>
        {selectedFeed.tag && (
          <Column>
            <Row>
              <Typography variant="h5" component="h4">
                현재 태그 : #{selectedFeed.tag.name}
              </Typography>
            </Row>
            <Typography variant="caption">
              서버에 저장되어있는 게시글 수 : {selectedFeed.list.length}
            </Typography>
          </Column>
        )}
        {selectedFeed.tag &&
          !isBackendWorking.status &&
          server !== "progress" &&
          server !== "completed" && (
            <DataFetchButton fn={() => handleRefresh(selectedFeed.tag)} />
          )}
        <Column>
          {server === "progress" ||
          (server === "" && isBackendWorking.status) ? (
            <Blink>
              <Typography variant={"caption"} display={"block"} gutterBottom>
                서버에서 데이터를 수집중입니다.
              </Typography>
            </Blink>
          ) : (
            ""
          )}
          {server === "completed" && (
            <CustomColumn>
              <SlowBlink>
                <Typography variant={"caption"} display={"block"} gutterBottom>
                  처리가 완료되었습니다.
                  <br />
                  새로고침 됩니다!
                </Typography>
              </SlowBlink>
              <DataFetchButton
                fn={() => handleRefresh(selectedFeed.tag.name)}
              />
            </CustomColumn>
          )}
        </Column>
      </Container>
    </Paper>
  );
}

const DataFetchButton = props => {
  return <Button onClick={props.fn}>인스타에서 가져오기</Button>;
};
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  width: 100%;
`;

const CustomColumn = styled(Column)`
  width: 100%;
  justify-content: space-between;
`;

const blink = keyframes`
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
`;

const Blink = styled.div`
  animation: ${blink} 0.5s ease-in infinite;
  text-align: center;
`;

const SlowBlink = styled.div`
  text-align: center;
  animation: ${blink} 1s ease-in infinite;
`;
