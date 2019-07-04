import { auth } from "./auth";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
import connectionOptions from "./ormconfig";
import { searchTagInfo } from "./api/searchTagInfo";
import HTS from "./tasks/hashQueue";
import { saveHashTag } from "./views/view";
import { HashTag } from "./entity/HashTag";
import { Media } from "entity/Media";
import { log } from "util";

const express = require("express");
const server = express();

server.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
// 이거 없으면 에러남
createConnection(connectionOptions)
  .then(() => {
    console.log("db connected!!!");
  })
  .catch(err => console.log(err));

server.get("/test", async (req, res) => {
  res.send();
});

server.get("/", async (req, res) => {
  console.log("ok");
  const allTags = await HashTag.find();
  res.send(allTags);
});

server.get("/hash_feed", async (req, res) => {
  console.log("hash_feed");
  const q = req.query.q;
  const hashtag = await HashTag.findOneOrFail({ where: { name: q } });
  const result = await Media.find({ where: { hashtag: hashtag.id } });
  console.log(result);
  res.send({ result });
});

server.get("/hash_feed_refresh", async (req, res) => {
  console.log("hash feed search");
  const q = req.query.q;
  console.log(q);
  const hashTagRes = await HashTag.findOneOrFail({ where: { name: q } });
  hashTagRes.isProcessing = true;
  const save = await hashTagRes.save();
  console.log(hashTagRes);
  await HTS.add({ search_term: q });
  res.send({ result: save });
});

server.get("/search_tag", async (req, res) => {
  const q = req.query.q;
  console.log("search hash tag: " + q);
  const result = await searchTagInfo(q);
  let hashTag = {};
  if (result) {
    const hash = {
      name: result.name,
      media_count: result.media_count
    };
    hashTag = await saveHashTag(hash);
  }
  res.send({ hashTag });
});

// save with file about user cookies and state
server.post("/auth", async (req, res) => {
  const user_id = req.body.id;
  const user_password = req.body.password;
  const result = await auth(user_id, user_password);
  res.send({ result });
});

server.listen(8000, () => {
  console.log("server start ...");
});
