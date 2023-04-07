import { notificationBar } from '@/components/notifications';

// Enable/disables plugins
const toggleSwitches = [...document.querySelectorAll(".jenkins-table .jenkins-toggle-switch input")];
toggleSwitches.forEach(toggleSwitch => {
  toggleSwitch.addEventListener("change", () => togglePluginState(toggleSwitch));
});

function togglePluginState(toggleSwitch) {
  const url = toggleSwitch.getAttribute('url') + "/make" + (toggleSwitch.checked ? "Enabled" : "Disabled");

  fetch(url, {
    method: "post",
    headers: crumb.wrap({}),
  }).then((response) => {
    if (!response.ok) {
      notificationBar.show(response.responseText, notificationBar.ERROR);
    }
  });

  updateRestartNotificationVisibility();
}

function updateRestartNotificationVisibility() {
  // Has anything changed since its original state?
  const stateChanged = toggleSwitches.find((e) => e.checked.toString() !== e.getAttribute('original'));
  const requiresRestart = getJellyVariable('restart-required') === 'true';

  document.querySelector("#needRestart").style.display = (stateChanged || requiresRestart) ? 'block' : 'none';
}

updateRestartNotificationVisibility();

function getJellyVariable(attribute) {
  const jello = document.querySelector("#jelly-variables");
  return jello.getAttribute("data-" + attribute);
}
