import * as React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { usePage } from "../../hooks/usePage";
import SmallBubbleCard from "../SmallBubbleCard";
import { Row } from "../../styles";
import { fileDown } from "../../utils";

export function Presenter(props) {
  const { selected_feed, loading } = props;
  const page = usePage(1, selected_feed.list);
  return (
    <div style={{ width: "100%" }}>
      {loading ? (
        <Centered>
          <CircularProgress size={45} />
        </Centered>
      ) : (
        <Container>
          <Row>
            {Array.from({ length: page.allPage }, (v, idx) => idx + 1).map(
              v => (
                <button
                  key={v}
                  onClick={() => page.handlePage(v)}
                  style={
                    page.currentPage + 1 === v
                      ? { color: "red" }
                      : { color: "black" }
                  }
                >
                  {v}
                </button>
              )
            )}
            <button onClick={() => fileDown(selected_feed)}>
              csv 파일 다운로드
            </button>
          </Row>
          <Grid>
            {page.currentItems.map(feed => (
              <SmallBubbleCard key={feed.id} feed={feed} />
            ))}
            {/*{selected_feed.length !== 0 &&*/}
            {/*  selected_feed.list.map(feed => (*/}
            {/*    <SmallBubbleCard key={feed.id} feed={feed} />*/}
            {/*  ))}*/}
          </Grid>
        </Container>
      )}
      {!loading &&
        selected_feed.tag &&
        selected_feed.list.length === 0 &&
        "No Data"}
    </div>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0px solid;
`;

const Centered = styled.div`
  margin-top: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
