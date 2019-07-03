import { readSession } from "../auth";

export async function searchTagInfo(q: string) {
  const ig = await readSession();
  const result = await ig.tag.search(q);
  if (result.results.length > 0)
    return result.results.filter(data => data.name === q)[0];
  else return false;
}
