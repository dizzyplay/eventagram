export function getOverlap(arr) {
  let new_list = arr[0];
  for (let i = 1; i < arr.length; i++) {
    new_list = new_list.filter(v =>
      isObjEqual(v, arr[i].filter(vv => vv.mediaId === v.mediaId)[0])
    );
  }
  return new_list;
}

function isObjEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const propName = Object.getOwnPropertyNames(a);
  for (let i = 0; i < propName.length; i++) {
    if (a[propName[i] !== b[propName[i]]]) return false;
  }
  return true;
}
