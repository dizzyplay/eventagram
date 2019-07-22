import { HashTag } from "../entity/HashTag";
import { refreshHashFeed } from "../api/refreshHashFeed";
import {saveMedia} from "../views/dbTask";

const Bull = require("bull");

const tagSearchQueue = new Bull("get-hash-tag-result",{
  redis:{
    host:'redis',
    port:6379
  }
});

tagSearchQueue.process(async (job, done) => {
  const search_term = job.data.search_term;
  try {
    const res: any = await refreshHashFeed(search_term, job);
    done(null, { data: res, search_term });
  } catch (e) {
    console.log(e);
  }
});

tagSearchQueue.on("completed", async (job, result) => {
  const hashTag = await HashTag.findOneOrFail({
    where: { name: result.search_term }
  });
  result.data.map(async v => {
    await saveMedia(hashTag.name,v)
    // await saveMedia(hashTag.name, v);
  });
  hashTag.isProcessing = false;
  await hashTag.save();
  console.log("작업완료");
  console.log(`job id : ${job.id} is complete`);
  console.log(`search term is ${result.search_term}`);
  console.log("job complete and result length is " + result.data.length);
});

export default tagSearchQueue;
