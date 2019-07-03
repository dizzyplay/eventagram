import { HashTag } from "../entity/HashTag";
import { Media } from "../entity/Media";

export async function saveHashTag(hash) {
  try {
    const p = await HashTag.findOneOrFail({ where: { name: hash.name } });
    p.mediaCount = hash.media_count;
    p.updatedAt = new Date();
    return p.save();
  } catch (e) {
    const p = new HashTag();
    p.name = hash.name;
    p.isProcessing = hash.isProcessing;
    p.mediaCount = hash.media_count;
    return p.save();
  }
}
interface Imedia {
  media_id: string;
  username: string;
  taken_at: string;
  like_count: number;
  comment_count: number;
  caption: string;
}
export async function saveMedia(hashtag: string, media: Imedia) {
  const h = await HashTag.findOneOrFail({ where: { name: hashtag } });
  try {
    const media_qs = await Media.findOneOrFail({
      where: { mediaId: media.media_id }
    });
    media_qs.username = media.username;
    media_qs.mediaId = media.media_id;
    media_qs.takenAt = new Date(Number(media.taken_at) * 1000);
    media_qs.likeCount = media.like_count;
    media_qs.commentCount = media.comment_count;
    media_qs.caption = media.caption;
    media_qs.hashtag = h;
    await media_qs.save();
  } catch (e) {
    const media_qs = new Media();
    media_qs.username = media.username;
    media_qs.mediaId = media.media_id;
    media_qs.takenAt = new Date(Number(media.taken_at) * 1000);
    media_qs.likeCount = media.like_count;
    media_qs.commentCount = media.comment_count;
    media_qs.caption = media.caption;
    media_qs.hashtag = h;
    await media_qs.save();
  }
}
