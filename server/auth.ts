import {User} from "./entity/User";

const ipa = require("instagram-private-api");
import { sessionSave } from "./utils";

export async function auth(id, password) {
  const ig = new ipa.IgApiClient();
  const user =await new User();
  user.username=id;
  await user.save();
  ig.state.generateDevice(id);
  ig.request.end$.subscribe(async () => {
    const cookies = await ig.state.serializeCookieJar();
    const state = {
      deviceString: ig.state.deviceString,
      deviceId: ig.state.deviceId,
      uuid: ig.state.uuid,
      phoneId: ig.state.phoneId,
      adid: ig.state.adid,
      build: ig.state.build
    };
    await sessionSave(id,JSON.stringify(cookies), JSON.stringify(state));
  });
  try {
    return await ig.account.login(id, password);
  } catch (e) {
    return {};
  }
}

export async function readSession() {
  const ig = new ipa.IgApiClient();
  const user = await User.findOne({where:{username:'testmanvovo'}})
  let cookies = user.cookies;
  let state: any = user.state;

  state = JSON.parse(state);
  await ig.state.deserializeCookieJar(cookies);
  ig.state.deviceString = state.deviceString;
  ig.state.deviceId = state.deviceId;
  ig.state.uuid = state.uuid;
  ig.state.phoneId = state.phoneId;
  ig.state.adid = state.adid;
  ig.state.build = state.build;

  ig.request.end$.subscribe(async () => {
    // Here you have JSON object with cookies.
    // You could stringify it and save to any persistent storage
    const cookies = await ig.state.serializeCookieJar();
    const state = {
      deviceString: ig.state.deviceString,
      deviceId: ig.state.deviceId,
      uuid: ig.state.uuid,
      phoneId: ig.state.phoneId,
      adid: ig.state.adid,
      build: ig.state.build
    };
    await sessionSave(user.username,JSON.stringify(cookies), JSON.stringify(state));
  });
  return ig;
}
