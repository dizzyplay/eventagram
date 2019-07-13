import {readSession} from "./auth";
import {createConnection} from "typeorm";
import connectionOptions from "./ormconfig";
createConnection(connectionOptions)
  .then(() => {
    console.log("db connected!!!");
    const Fetch=async ()=>{
      const ig = await readSession();
      const ts = ig.feed.tag('오그래놀라과일')
      console.log(await ts.request())
    }

    Fetch();
  })
  .catch(err => console.log(err));

