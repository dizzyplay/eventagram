import { readSession } from "../../auth";
import { getNowKoreaDate } from "../../utils";

export async function refreshHashFeed(q, job?) {
  const ig = await readSession();
  const requestLimit = 300; // 최대 요청 피드 개수
  const ts = ig.feed.tag(q);
  const arr = [];
  return new Promise(resolve => {
    const sub = ts.items$.subscribe(
      feed => {
        feed.map(data => {
          arr.push({
            media_id: data.id,
            username: data.user.username,
            taken_at: data.taken_at,
            like_count: data.like_count,
            comment_count: data.comment_count,
            code: data.code,
            caption:
              data.caption && data.caption.text ? data.caption.text : null
          });
        });
        console.log(
          `[${getNowKoreaDate()}] [리프레시 처리중] 해시태그피드 배열길이 : ${
            feed.length
          }`
        );
        if (arr.length > requestLimit) {
          sub.unsubscribe();
          resolve(arr);
        }
      },
      error => console.log(error),
      () => {
        console.log(`[${getNowKoreaDate()}] search hash feed Complete!`);
        resolve(arr);
      }
    );
  });
}
