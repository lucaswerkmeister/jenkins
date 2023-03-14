// Converts a page's section headings into clickable tabs, see 'About Jenkins' page for example
const tabPanes = document.querySelectorAll(".jenkins-tab-pane");
const content = document.querySelector("#main-panel");

// Hide tab panes
tabPanes.forEach((tabPane) => {
  tabPane.style.display = "none";
});

// Show the first
tabPanes[0].style.display = "block";

const tabBar = document.createElement("div");
tabBar.className = "jenkins-tabs";
const tabHighlight = document.createElement("div");
tabHighlight.className = "jenkins-tabs__highlight";
tabBar.append(tabHighlight);

// Add tabs for each tab pane
tabPanes.forEach((tabPane, index) => {
  const tabPaneTitle = tabPane.querySelector(".jenkins-tab-pane__title");
  tabPaneTitle.style.display = "none";

  const tab = document.createElement("button");
  tab.className = "jenkins-tabs__tab";
  tab.innerText = tabPaneTitle.textContent;

  if (index === 0) {
    tab.classList.add("jenkins-tabs__tab--selected");
  }

  tab.addEventListener("click", function () {
    document.querySelectorAll(".jenkins-tabs__tab").forEach((tab) => {
      tab.classList.remove("jenkins-tabs__tab--selected");
    });
    tab.classList.add("jenkins-tabs__tab--selected");

    tabPanes.forEach((tabPane) => {
      tabPane.style.display = "none";
    });
    tabPanes[index].style.display = "block";

    tabHighlight.style.top = "2px";
    tabHighlight.style.bottom = "2px";
    tabHighlight.style.width = tab.offsetWidth + "px";
    tabHighlight.style.left = tab.offsetLeft + "px";

    setTimeout(() => {
      tabHighlight.style.top = "0";
      tabHighlight.style.bottom = "0";
    }, 200);
  });

  tabBar.append(tab);

  console.log(tab.offsetWidth)

});

content.insertBefore(tabBar, tabPanes[0]);

tabBar.querySelector(".jenkins-tabs__tab").click();
