import * as bodyParser from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
import connectionOptions from "./ormconfig";
import * as cluster from "cluster";
import api from "./api";
import { SearchTagQueue } from "./woker/worker";
import { worker } from "cluster";
import { getNowKoreaDate } from "./utils";

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (cluster.isMaster) {
  const worker = cluster.fork();
  app.use((req, res, next) => {
    req.worker = worker;
    next();
  });
  http.listen(6781, () => {
    console.log("server start ...");
  });

  io.on("connection", async socket => {
    socket.emit("start", { connect_state: "socket connect success!!" });
    socket.on("connect_success", data => {
      console.log(data);
    });
    // 워커 메시지 이벤트 처리 (작업결과 웹소켓으로 응답)
    worker.on("message", message => {
      if (message.type === "info") {
        if (message.content === "progress") socket.emit("progress");
        else if (message.content === "completed") {
          socket.emit("completed", {
            job: message.data.job,
            result: message.data.result
          });
        }
      }
    });
  });
}

// worker middleware 추가로 인해 순서 지켜줘야함.
app.use("/", api);

//db connection
createConnection(connectionOptions)
  .then(() => {
    if (cluster.isWorker)
      console.log(
        `[${getNowKoreaDate()}] ----- worker start --- worker id : ${
          worker.id
        } - DB connected...`
      );
    else console.log(`[${getNowKoreaDate()}] Master server DB connected...`);
  })
  .catch(err => {
    console.log("db connect error!!");
    console.log(err);
  });

if (cluster.isWorker) {
  const HTQ = SearchTagQueue();
  //마스터로 부터 메시지를 받아서 워크 처리
  process.on("message", async message => {
    if (message.type === "workRequest") {
      const { search_term, hash_tag_id } = message.content;
      await HTQ.add({ search_term, hash_tag_id });
    }
  });
}
