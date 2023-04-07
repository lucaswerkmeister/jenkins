import { notificationBar } from '@/components/notifications';
import * as Symbols from "@/util/symbols";
import { createElementFromHtml } from "@/util/dom";

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

function showRestartNotification() {
  // Don't create another notification if one already exists
  if (document.querySelector(".jenkins-notification--visible")) {
    return;
  }

  let notificationContent;

  if (getJelloAttribute('can-restart') === 'true') {
    notificationContent = createElementFromHtml(`
        <form method="post" action="safeRestart">
            <button class="jenkins-button jenkins-!-inherit-color jenkins-!-margin-top-2">
                Restart once no jobs are running
            </button>
        </form>
    `);
  }

  notificationBar.show('Changes will take effect when you restart Jenkins', {
    alertClass: "jenkins-notification jenkins-notification--warning",
    icon: Symbols.WARNING,
    persistent: true,
    content: notificationContent,
    maxWidth: "335px"
  });
}

function updateRestartNotificationVisibility() {
  // Has anything changed since its original state?
  const stateChanged = toggleSwitches.find((e) => e.checked.toString() !== e.getAttribute('original'));
  const requiresRestart = getJelloAttribute('restart-required') === 'true';

  if (stateChanged || requiresRestart) {
    showRestartNotification();
  } else {
    notificationBar.hide();
  }
}

updateRestartNotificationVisibility();

function getJelloAttribute(attribute) {
  const jello = document.querySelector("#jello");
  return jello.getAttribute("data-" + attribute);
}
