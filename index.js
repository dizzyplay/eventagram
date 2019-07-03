const request = require('request-promise');
const InstaCrawl = require('./get_user_list.js');

const base_uri = 'https://graph.facebook.com/v3.2/';
const access_token =
  "EAAGJnboLoGoBAMGrZCO4E8cZChb8ZCnqV3RW3XnXHgrrBy1X6DikVyjZAnP8AQHINNg9AwhfRWVP4qjSF5jSgLFgqoewXflTLgrGEdXFqakevV5MmJZC3DvIO5AetSu7MxfbelH2Y9lVJ1t1o5OC9qBVlSjWZCn115cLa2lu55aslOPqWSNZB3CcsDhD1X4ayjPV4iteRJgM9O2fuQOxy6WKfeOkiEYE0VI5mIe9I6BPwZDZD";

const hashtag_search_query = '수원';

(async () => {
  try {
    const user_id = await get_user_id(access_token);
    const business_id = await get_business_id(user_id, access_token);
    console.log('business id: ' + business_id);
    const hashtag_id = await search_hashtag_and_get_id(
      business_id,
      access_token,
      hashtag_search_query,
    );
    console.log('해쉬태그 ID : ' + hashtag_id);
    const hashtag_media = await get_all_hashtag_media(
      hashtag_id,
      business_id,
      access_token,
    );
    console.log(hashtag_media);
    const user_permalink_arr = hashtag_media.map(v => v.permalink);
    console.log(`hashtag search result by "${hashtag_search_query}"`);
    console.log(user_permalink_arr);
    console.log('링크 개수 :' + user_permalink_arr.length);

    const result = await InstaCrawl.get_user(user_permalink_arr);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
})();

async function get_all_hashtag_media(
  hashtag_id,
  business_id,
  access_token,
  page_num,
) {
  let list = [];
  const hashtag_media = await get_recently_hashtag_media(
    hashtag_id,
    business_id,
    access_token,
  );
  list = list.concat(hashtag_media.data);
  let data;
  let next_page;
  try {
    next_page = hashtag_media.paging.next;
  } catch {
    next_page = 0;
  }
  while (next_page) {
    res = await request.get({uri: next_page});
    res = JSON.parse(res);
    list = list.concat(res.data);
    try {
      if (res.paging.next) next_page = res.pagine.next;
    } catch {
      console.log('no page');
      next_page = 0;
    }
  }
  return list;
}

// 해시태그로 검색해서 해시태그 아이디 가져오기
async function search_hashtag_and_get_id(business_id, access_token, q) {
  const uri = base_uri + 'ig_hashtag_search';
  const search_q = q;
  const options = {
    uri,
    qs: {
      q: search_q,
      user_id: business_id,
      access_token,
    },
  };
  const res = await request.get(options);
  return JSON.parse(res).data[0].id;
}

// 사용자 아이디
async function get_user_id(access_token) {
  const uri = base_uri + 'me/accounts';
  const options = {
    uri,
    qs: {
      access_token,
    },
  };
  const res = await request.get(options);
  const json = JSON.parse(res);
  const user = json.data[0];
  console.log('id: ' + user.id, ' username: ' + user.name);
  return user.id;
}

// 사용자 비즈니스 아이디(연결된) api 요청은 비즈니스 아이디로 해야함
async function get_business_id(user_id, access_token) {
  const uri = base_uri + user_id;
  const options = {
    uri,
    qs: {
      fields: 'instagram_business_account',
      access_token,
    },
  };
  const res = await request.get(options);
  const json = JSON.parse(res);
  return json.instagram_business_account.id;
}

// caption
// comments_count
// id
// like_count
// media_type
// media_url
// permalink
async function get_recently_hashtag_media(
  hashtag_id,
  user_id,
  access_token,
  fields_str,
) {
  if (!fields_str) {
    fields_str = 'id,like_count,media_url,permalink,caption';
  }
  const uri = base_uri + hashtag_id + '/recent_media';
  const options = {
    uri,
    qs: {
      user_id,
      access_token,
      fields: fields_str,
    },
  };

  const res = await request.get(options);
  return JSON.parse(res);
}
