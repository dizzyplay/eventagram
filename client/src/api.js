import * as axios from "axios";

const base_url = "http" + process.env.REACT_APP_API_ENDPOINT;

export async function getHashInfo(q) {
  return await axios.get(base_url + "/search_tag?q=" + q);
}

export function fetchMainData() {
  return axios.get(base_url);
}

export function fetchFeed(tagId) {
  return axios.get(base_url + "/hash_feed?q=" + tagId);
}

export function fetchTagInfo(tag_q) {
  return axios.get(base_url + "/search_tag?q=" + tag_q);
}

export function deleteTagFetch(tag_q) {
  return axios.post(base_url + "/delete_tag", { id: tag_q });
}

export function refreshHashFeedApi(tag_name) {
  return axios.get(base_url + "/hash_feed_refresh?q=" + tag_name);
}
