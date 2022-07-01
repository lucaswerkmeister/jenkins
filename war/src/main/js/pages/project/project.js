const greenButton = document.querySelector("#green");
const orangeButton = document.querySelector("#orange");
const redButton = document.querySelector("#red");

const faviconData = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx="70" cy="70" r="30" fill="REPLACE_ME" stroke="white" stroke-width="10" />
</svg>`;
const data = `data:image/svg+xml;utf8,${faviconData}`;

greenButton.addEventListener("click", () => {
  setFavicons("#1ea64b");
})
orangeButton.addEventListener("click", () => {
  setFavicons("#fe820a");
})
redButton.addEventListener("click", () => {
  setFavicons("#e6001f");
})

function setFavicons(fillColor){
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = data.replace("REPLACE_ME", fillColor);
  link.href = link.href.replaceAll("#", "%23")
  document.getElementsByTagName('head')[0].appendChild(link);
}
