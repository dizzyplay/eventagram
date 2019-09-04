import { HashTag } from "../../entity/HashTag";
import { Media } from "../../entity/Media";
import { instagramLogin } from "../../auth";
import { searchTagInfo } from "../utils/searchTagInfo";
import { saveHashTag } from "../../dbTask";
import { getNowKoreaDate } from "../../utils";

export async function root(req, res) {
  const allTags = await HashTag.find({ order: { id: "DESC" } });
  res.send(allTags);
}

export async function hashFeed(req, res) {
  // q는 태그 id
  const q = req.query.q;
  console.log(`[${getNowKoreaDate()}] Request hash tag name " + ${q}`);
  let result = { tag: null, feed_list: [], info: "" };
  try {
    const hashtag = await HashTag.findOneOrFail({ where: { id: q } });
    result.tag = hashtag;
    result.feed_list = await Media.find({
      where: { hashtag },
      order: { takenAt: "DESC" }
    });
  } catch (e) {
    console.log("해당 해시 태그는 db에 존재하지 않습니다");
    result.info = "해당 해시 태그는 db에 존재하지 않습니다";
  }
  res.send(result);
}

export async function hashFeedRefresh(req, res) {
  let result = { data: null, info: "" };
  const q = req.query.q;
  try {
    await searchTagInfo(q);
    const hashTagRes = await HashTag.findOneOrFail({ where: { name: q } });
    await Media.delete({ hashtag: hashTagRes });
    hashTagRes.isProcessing = true;
    result.data = await hashTagRes.save();

    //워커에게 메시지를 보낸다
    req.worker.send({
      type: "workRequest",
      content: { search_term: q, hash_tag_id: hashTagRes.id }
    });
  } catch (e) {
    console.log(
      `[${getNowKoreaDate()}] 해시 태그가 db에 존재하지 않거나 작업중 문제가 발생. 혹은 인증부분 확인 바람.`
    );
    result.info = `not exist tag in db...(or check auth)`;
  }
  res.send({ result });
}

export async function authControl(req, res) {
  const user_id = req.body.id;
  const user_password = req.body.password;
  const result = await instagramLogin(user_id, user_password);
  res.send({ result });
}

export async function deleteTag(req, res) {
  const id = req.body.id;
  let result = null;
  try {
    const tag = await HashTag.findOne({ where: { id } });
    result = await HashTag.remove(tag);
  } catch (e) {}
  res.send({ result });
}

export async function searchTag(req, res) {
  const q = req.query.q;
  console.log("search hash tag: " + q);
  try {
    const result = await searchTagInfo(q);
    let hashTag = null;
    if (result) {
      const hash = {
        name: result.name,
        media_count: result.media_count
      };
      hashTag = await saveHashTag(hash);
    }
    res.send({ hashTag });
  } catch (e) {
    console.log(`[${getNowKoreaDate()}] auth 설정이 필요합니다`);
    res.send({ message: "Need to set auth" });
  }
}
