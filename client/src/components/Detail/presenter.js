import * as React from "react";
import styled from "styled-components";

export function Presenter(props) {
  const { selected_feed } = props;

  const handleUrl = code => {
    window.open("https://www.instagram.com/p/" + code);
  };
  return (
    <Main>
      {selected_feed.length !== 0 &&
        selected_feed.list.map(feed => (
          <div key={feed.id}>
            <div>
              @{feed.username}
              <br />
              {feed.caption}
              <br />
              <button onClick={() => handleUrl(feed.code)}>
                open - https://www.instagram.com/p/{feed.code}
              </button>
            </div>
          </div>
        ))}
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  border: 3px solid;
`;
