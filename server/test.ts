import {readSession} from "./auth";
import {createConnection} from "typeorm";
import connectionOptions from "./ormconfig";
createConnection(connectionOptions)
  .then(() => {
    console.log("db connected!!!");
    const Fetch=async ()=>{
      const ig = await readSession();
      const ts = ig.feed.tag('키친인큐베이터');
      const result = await ts.request()
      result.items.map(f=>console.log(`https://www.instagram.com/p/${f.code}/ \n ${f.user.username}`))
    }

    Fetch();
  })
  .catch(err => console.log(err));

