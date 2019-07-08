import {readSession} from "./auth";

const Fetch=async ()=>{
  const ig = await readSession();
  const res = await ig.media.info('2081107892372275152_8701131922')
  console.log(res)
}

Fetch();