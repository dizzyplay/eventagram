import { readSession } from "../auth";

export async function searchHashFeed(q?) {
  if (!q) q = "오그래놀라야채";
  const ig = await readSession();
  const ts = ig.feed.tag(q);
  const arr = [];
  const d = {};
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
            caption:
              data.caption && data.caption.text ? data.caption.text : null
          });
        });
        console.log("length : " + feed.length);
        if (arr.length > 100) {
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
