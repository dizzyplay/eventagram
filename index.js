const request = require("request-promise");
const base_uri = "https://graph.facebook.com/v3.2/";
const access_token =
  "EAAGJnboLoGoBAKi37cItZAwNUIXWhZA20AmmfXEcWQWZCjCxZCNrjPDbscI2UpWfvjWQVbHGSuCnSK2tlcgEtJV3cKJtqIJjYAwl1nJZCI0Vqt7lYfAC1zJdEsOZCK6O3A9Guw91QeCFJp7IZBGkdF9QHV4QKfbkVFOSGTOpF2h17CUbCXhfjaB0xyKo4ZBCQ2I2bCuRXcuavw4gWCkP6h157lUYS2odfB1NaeaQYMdyfwZDZD";

(async () => {
  try {
    const user_id = await get_user_id(access_token);
    console.log(user_id);
    const business_id = await get_business_id(user_id, access_token);
    console.log("business id: " + business_id);
    const hashtag_id = await search_hashtag_and_get_id(
      business_id,
      access_token,
      "오그래놀라"
    );
    const res = await get_recently_hashtag_media(
      hashtag_id,
      business_id,
      access_token
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
})();

// 해시태그로 검색해서 해시태그 아이디 가져오기
async function search_hashtag_and_get_id(business_id, access_token, q) {
  const uri = base_uri + "ig_hashtag_search";
  const search_q = q;
  const options = {
    uri,
    qs: {
      q: search_q,
      user_id: business_id,
      access_token
    }
  };
  const res = await request.get(options);
  return JSON.parse(res).data[0].id;
}

// 사용자 아이디
async function get_user_id(access_token) {
  const uri = base_uri + "me/accounts";
  const options = {
    uri,
    qs: {
      access_token
    }
  };
  const res = await request.get(options);
  const json = JSON.parse(res);
  const user = json.data[0];
  console.log("id: " + user.id, " username: " + user.name);
  return user.id;
}

// 사용자 비즈니스 아이디(연결된) api 요청은 비즈니스 아이디로 해야함
async function get_business_id(user_id, access_token) {
  const uri = base_uri + user_id;
  const options = {
    uri,
    qs: {
      fields: "instagram_business_account",
      access_token
    }
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
  fields_str
) {
  if (!fields_str) {
    fields_str = "id,like_count,media_url,permalink";
  }
  const uri = base_uri + hashtag_id + "/recent_media";
  const options = {
    uri,
    qs: {
      user_id,
      access_token,
      fields: fields_str
    }
  };

  const res = await request.get(options);
  const json = JSON.parse(res);
  console.log(json);
}
