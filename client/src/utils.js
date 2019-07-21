import XLSX from "xlsx";
import * as moment from "moment";
import "moment/locale/ko";

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

export const fileDown = feed => {
  const data = convertData(feed.list);
  let fileName = `${moment(feed.tag.updatedAt).format(
    "YYYY_MMMM_Do_h:mm a"
  )}_#${feed.tag.name}`;
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const csvBlob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });
  const a = document.createElement("a");
  document.body.appendChild(a);
  const url = URL.createObjectURL(csvBlob);
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};

const convertData = list => {
  // 원본 객체를 손상시키지 않기위해 넣은 코드 이게 없으면 원본객체가 원본객체가 바뀐다.
  const copy = JSON.stringify(list);
  const data = JSON.parse(copy);

  const new_data = data.map(f =>
    Object.assign(f, {
      takenAt: moment(f.takenAt).format("YYYY-MM-DD-HH:mm"),
      code: "https://www.instagram.com/p/" + f.code + "/"
    })
  );
  new_data.map(f => delete f.mediaId);
  return new_data;
};
