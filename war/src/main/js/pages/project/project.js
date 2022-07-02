import setFaviconStatus from "../../util/favicon";

const greenButton = document.querySelector("#green");
const orangeButton = document.querySelector("#orange");
const redButton = document.querySelector("#red");

greenButton.addEventListener("click", () => {
  setFaviconStatus("#1ea64b");
})
orangeButton.addEventListener("click", () => {
  setFaviconStatus("#fe820a");
})
redButton.addEventListener("click", () => {
  setFaviconStatus("#e6001f");
})
