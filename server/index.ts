import { auth } from "./auth";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
import connectionOptions from "./ormconfig";
import { searchTagInfo } from "./api/searchTagInfo";
import HTS from "./tasks/hashQueue";
import { saveHashTag } from "./views/dbTask";
import { HashTag } from "./entity/HashTag";
import { Media } from "entity/Media";
import {getNowKoreaDate} from "./utils";

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
process.setMaxListeners(15);
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
createConnection(connectionOptions)
  .then(() => {
    console.log("db connected!!!");
  })
  .catch(err =>{
    console.log('db connect error!!');
    console.log(err)
  } );

app.get("/", async (req, res) => {
  const allTags = await HashTag.find({order:{id:"DESC"}});
  res.send(allTags);
});

app.get("/hash_feed", async (req, res) => {
  const q = req.query.q;
  console.log("[서버] :hash feed GET 쿼리로받은 인자 " + q);
  let result = {tag:null,feed_list: [], info: "" };
  try {
    const hashtag = await HashTag.findOneOrFail({ where: { id: q } });
    result.tag=hashtag;
    result.feed_list = await Media.find({ where: { hashtag },order:{takenAt:"DESC"} });
  } catch (e) {
    console.log("해당 해시 태그는 db에 존재하지 않습니다");
    result.info = "해당 해시 태그는 db에 존재하지 않습니다";
  }
  console.log("[서버]db에 저장되어있는 해시피드 배열길이 :" + result.feed_list.length);
  res.send( result );
});

app.get("/hash_feed_refresh", async (req, res) => {
  let result = { data: null, info: "" };
  const q = req.query.q;
  try {
    await searchTagInfo(q);
    const hashTagRes = await HashTag.findOneOrFail({ where: { name: q } });
    await Media.delete({hashtag:hashTagRes})
    hashTagRes.isProcessing = true;
    result.data = await hashTagRes.save();
    await HTS.add({ search_term: q, hash_tag_id:hashTagRes.id });
  } catch (e) {
    console.log(
      `[${getNowKoreaDate()}] 해당 해시 태그가 db에 존재하지 않거나 작업중 문제가 발생했습니다. 혹은 인증부분 확인 바람.`
    );
    result.info =
      `[${getNowKoreaDate()}] 해당 해시 태그가 db에 존재하지 않거나 작업중 문제가 발생했습니다. 혹은 인증부분 확인 바람.`;
  }
  res.send({ result });
});

app.get("/search_tag", async (req, res) => {
  const q = req.query.q;
  console.log("search hash tag: " + q);
  try{
    const result = await searchTagInfo(q);
    let hashTag = null
    if (result) {
      const hash = {
        name: result.name,
        media_count: result.media_count
      };
      hashTag = await saveHashTag(hash);
    }
    res.send({ hashTag });
  }catch (e) {
    console.log(`[${getNowKoreaDate()}] auth 설정이 필요합니다`);
    res.send({message:'Need to set auth'})
  }
});

app.post('/delete_tag',async (req,res)=>{
  const id= req.body.id;
  let result=null;
  try{
    const tag=await HashTag.findOne({where:{id}})
     result = await HashTag.remove(tag)
  }catch (e) {
  }
  res.send({result})
});

// save with file about user cookies and state
app.post("/auth", async (req, res) => {
  const user_id = req.body.id;
  const user_password = req.body.password;
  const result = await auth(user_id, user_password);
  res.send({ result });
});

http.listen(6781, () => {
  console.log("server start ...");
});

io.on("connection", async socket => {
  socket.emit("start", { connect_state: "server connect success!!" });

  socket.on("connect_success", data => {
    console.log(data);
  });
  await HTS.on("progress", (job, progress) => {
    socket.emit("progress", progress);
  });
  await HTS.on("completed", (job,result) => {
    socket.emit("completed", {job,result});
  });
});
