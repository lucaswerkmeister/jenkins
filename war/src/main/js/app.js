import Dropdowns from "@/components/dropdowns";
import Notifications from "@/components/notifications";
import SearchBar from "@/components/search-bar";
import Tooltips from "@/components/tooltips";

Dropdowns.init();
Notifications.init();
SearchBar.init();
Tooltips.init();

// const url = "jenkins/job/Scalemate/job/feat%252Fpi-3125-add-stuff/buildHistory/ajax";
const url = "buildHistory/ajax";
const newbuildhistory = document.querySelector(".newbuildhistory");

fetch(url, {
  headers: {
    // n: buildHistoryContainer.headers[1],
  },
}).then((rsp) => {
  rsp.text().then((responseText) => {
    newbuildhistory.innerHTML = "<div class='buildsss'>Builds</div>" + responseText;
  })
});
