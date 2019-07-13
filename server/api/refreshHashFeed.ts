import { readSession } from "../auth";

export async function refreshHashFeed(q, job?) {
  const ig = await readSession();
  const ts = ig.feed.tag(q);
  const arr = [];
  job.progress(50);
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
            code:data.code,
            caption:
              data.caption && data.caption.text ? data.caption.text : null
          });
        });
        console.log("[리프레시 처리중] 해시태그피드 배열길이 : " + feed.length);
        if (arr.length > 500) {
          sub.unsubscribe();
          resolve(arr);
        }
      },
      error => console.log(error),
      () => {
        console.log("search hash feed Complete!");
        resolve(arr);
      }
    );
  });
}
