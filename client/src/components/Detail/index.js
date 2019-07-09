import React from "react";
import { Container } from "./container";

const Detail = props => {
  const { hashTagList } = props;
  return <Container hashTagList={hashTagList} />;
};

export default Detail;
