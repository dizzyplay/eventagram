import * as React from "react";
import styled from "styled-components";
import SmallBubbleCard from "../SmallBubbleCard";
import { fileDown } from "../../utils";

export function Presenter({ list, tags }) {
  const combineTagName = tags.map(t => t.name).join("#");
  const data = { list, tag: { name: combineTagName } };
  return (
    <Container>
      <Centered>
        <button onClick={() => fileDown(data)}>csv로 다운로드</button>
      </Centered>
      <Grid>
        {list.map(feed => (
          <SmallBubbleCard key={feed.id} feed={feed} />
        ))}
      </Grid>
    </Container>
  );
}

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0 solid;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Centered = styled.div`
  margin-top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
