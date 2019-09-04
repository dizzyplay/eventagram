import { HashTag } from "../entity/HashTag";
import { Media } from "../entity/Media";

interface Imedia {
  media_id: string;
  username: string;
  taken_at: string;
  like_count: number;
  comment_count: number;
  code: string;
  caption: string;
}

export async function saveHashTag(hashtag) {
  try {
    const p = await HashTag.findOneOrFail({ where: { name: hashtag.name } });
    p.mediaCount = hashtag.media_count;
    p.updatedAt = new Date();
    return p.save();
  } catch (e) {
    const p = new HashTag();
    p.name = hashtag.name;
    p.isProcessing = hashtag.isProcessing;
    p.mediaCount = hashtag.media_count;
    return p.save();
  }
}
export async function upsertMedia(hashtag: string, media: Imedia) {
  const h = await HashTag.findOneOrFail({ where: { name: hashtag } });
  try {
    const media_obj = await Media.findOneOrFail({
      where: { mediaId: media.media_id,hashtag:h }
    });
    media_obj.username = media.username;
    media_obj.mediaId = media.media_id;
    media_obj.takenAt = new Date(Number(media.taken_at) * 1000);
    media_obj.likeCount = media.like_count;
    media_obj.commentCount = media.comment_count;
    media_obj.code = media.code;
    media_obj.caption = media.caption;
    media_obj.hashtag = h;
    await media_obj.save();
  } catch (e) {
    const media_obj = new Media();
    media_obj.username = media.username;
    media_obj.mediaId = media.media_id;
    media_obj.takenAt = new Date(Number(media.taken_at) * 1000);
    media_obj.likeCount = media.like_count;
    media_obj.commentCount = media.comment_count;
    media_obj.code = media.code;
    media_obj.caption = media.caption;
    media_obj.hashtag = h;
    await media_obj.save();
  }
}

export async function saveMedia(hashtag:string,media:Imedia){
  try{
    const hashtag_obj = await HashTag.findOneOrFail({where:{name:hashtag}});
    const media_obj = new Media();
    media_obj.username = media.username;
    media_obj.mediaId = media.media_id;
    media_obj.takenAt = new Date(Number(media.taken_at) * 1000);
    media_obj.likeCount = media.like_count;
    media_obj.commentCount = media.comment_count;
    media_obj.code = media.code;
    media_obj.caption = media.caption;
    media_obj.hashtag = hashtag_obj;
    await media_obj.save();
  }catch (e) {
    console.log(e)
    console.log('Save 작업중 에러 발생!!!')
  }
}
