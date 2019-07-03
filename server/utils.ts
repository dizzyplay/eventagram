import * as fs from "fs";

export function sessionSave(cookies, state) {
  try {
    fs.writeFile("cookies.txt", cookies, "utf8", () => {
      console.log("cookies save with a file.");
    });
    fs.writeFile("state.txt", state, "utf8", () => {
      console.log("state save with a file.");
    });
  } catch (e) {
    console.log("file processing error!!!");
  }
  return {
    cookies: cookies,
    state: state
  };
}
