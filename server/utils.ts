import {User} from './entity/User'
import * as moment from "moment"
import * as momentTimezone from "moment-timezone"

export async function sessionSave(username,cookies, state) {

  const user =await User.findOne({where:{username}});
  user.cookies=cookies;
  user.state=state;
  await user.save();
  console.log(`[${getNowKoreaDate()}] 세션을 해당 사용자 이름으로 db에 저장했습니다: ${username}`);
  return {
    cookies: cookies,
    state: state
  };
}



export function getNowKoreaDate(){
  return momentTimezone().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
}