const rq = require("request-promise");
const cheerio = require("cheerio");
const link_list = [
  "https://www.instagram.com/p/BzIpTdGAxHE/",
  "https://www.instagram.com/p/BzIV-nznSMJ/",
  "https://www.instagram.com/p/BzIJpPFn-XN/",
  "https://www.instagram.com/p/BzHt0pQAlpv/",
  "https://www.instagram.com/p/BzHZA-QHiGS/",
  "https://www.instagram.com/p/BzHJiKIHf2u/"
];

const options = {
  uri: link_list[3]
};

(async () => {
  const res = await get_user(link_list);
  console.log(res);
})();

async function get_user(url_arr) {
  const list = [];
  let i = 0;
  for (const link of url_arr) {
    const res = await rq.get({ uri: link });
    const $ = cheerio.load(res);
    try {
      const t = $("script[type='application/ld+json']")[0].children[0].data;
      const json = JSON.parse(t);
      i++;
      console.log(json.author.alternateName + " - " + link + " -" + i);
      list.push(json.author.alternateName + " - " + link + " -" + i);
    } catch (e) {
      // console.log("no script data user")
      // console.log(link)
      const lr = $("link[rel='canonical']")[0].attribs["href"];
      console.log(lr);
      i++;
      console.log(
        "@" + lr.split("/")[3] + " - No script user" + " - " + link + " -" + i
      );
      list.push(
        "@" + lr.split("/")[3] + " - No script user" + " - " + link + " -" + i
      );
    }
  }
  return list;
}
