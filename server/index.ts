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
const io = require("socket.io")(7979);

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

server.get("/", async (req, res) => {
  console.log("ok");
  const allTags = await HashTag.find();
  res.send(allTags);
});

server.get("/hash_feed", async (req, res) => {
  console.log("hash_feed");
  const q = req.query.q;
  let result = { data: [], status: "", info: "" };
  try {
    const hashtag = await HashTag.findOneOrFail({ where: { name: q } });
    result.data = await Media.find({ where: { hashtag: hashtag.id } });
    result.status = "ok";
  } catch (e) {
    console.log("해당 해시 태그는 db에 존재하지 않습니다");
    result.info = "해당 해시 태그는 db에 존재하지 않습니다";
    result.status = "404";
  }
  console.log(result.data.length);
  res.send({ result });
});

server.get("/hash_feed_refresh", async (req, res) => {
  console.log("hash feed refresh");
  let result = { data: null, status: "", info: "" };
  const q = req.query.q;
  try {
    const hashTagRes = await HashTag.findOneOrFail({ where: { name: q } });
    hashTagRes.isProcessing = true;
    result.data = await hashTagRes.save();
    result.status = "ok";
    await HTS.add({ search_term: q });
  } catch (e) {
    console.log("해당 해시 태그는 db에 존재하지 않습니다");
    result.info = "해당 해시 태그는 db에 존재하지 않습니다";
    result.status = "404";
  }
  res.send({ result });
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

io.on("connection", async socket => {
  socket.emit("start", { connect_state: "server connect success!!" });

  socket.on("connect_success", data => {
    console.log(data);
  });
  await HTS.on("progress", (job, progress) => {
    console.log("진행중입니다 ");
    socket.emit("progress", progress);
  });
  await HTS.on("completed", () => {
    socket.emit("completed", 100);
  });
});
