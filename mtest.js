const list = [2,3,4]


function s(list){
  return new Promise(res=>{
    setTimeout(()=>{
    },2000)
    list=list.map(v=>v*v)
    res(list)
  })
}

Promise.all([s([1,2,3]).then(console.log),s([2,3,4]).then(console.log)])
