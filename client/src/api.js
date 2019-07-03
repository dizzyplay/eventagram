import * as axios from "axios"

export async function getHashInfo(q){
  return await axios.get('http://localhost:8000/search_tag?q=' + q)
}