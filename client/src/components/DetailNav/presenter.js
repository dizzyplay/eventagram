import * as React from "react";
import styled from "styled-components";
import { Row } from "../../styles";

export function Presenter(props) {
  const { selectedFeed, server, handleRefresh } = props;
  return (
    <Container>
      {selectedFeed.tag && selectedFeed.tag.name} detail nav
      {server !== "progress" && server !== "completed" && (
        <button onClick={() => handleRefresh(selectedFeed.tag.name)}>
          GET DATA
        </button>
      )}
      {server === "progress" && "서버에서 데이터를 수집중입니다."}
      {server === "completed" && (
        <Row>
          <div>서버에서 작업이 완료되었습니다.</div>
          <button onClick={() => handleRefresh(selectedFeed.tag.name)}>
            GET DATA
          </button>
        </Row>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
