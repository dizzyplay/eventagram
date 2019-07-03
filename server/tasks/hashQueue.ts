import { HashTag } from "../entity/HashTag";

const Bull = require("bull");
import { searchHashFeed } from "../api/searchHashFeed";
import { saveMedia } from "../views/view";

const tagSearchQueue = new Bull("get-hash-tag-result");

tagSearchQueue.process(async (job, done) => {
  console.log(job.data.search_term);
  const search_term = job.data.search_term;
  try {
    const res: any = await searchHashFeed(search_term);
    done(null, { data: res, search_term });
  } catch (e) {
    console.log(e);
  }
});

tagSearchQueue.on("completed", async (job, result) => {
  const hashTag = await HashTag.findOneOrFail({
    where: { name: result.search_term }
  });
  console.log(hashTag);
  result.data.map(async v => {
    await saveMedia(hashTag.name, v);
  });
  hashTag.isProcessing = false;
  await hashTag.save();
  console.log(`job id : ${job.id} is complete`);
  console.log(`search term is ${result.search_term}`);
  console.log("job complete and result length is " + result.data.length);
});

export default tagSearchQueue;
