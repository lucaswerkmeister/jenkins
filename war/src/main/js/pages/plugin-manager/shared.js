import pluginManager from "@/api/pluginManager";

const refreshServerButton = document.getElementById("button-refresh-server");

/**
 * Register the click event for the refresh server button, performs a callback upon refresh
 * completion to reload the current page's content
 * @param {function(): *} callback A function to reload the current page's content
 */
export function registerRefreshServerButton(callback) {
  refreshServerButton.addEventListener("click", function () {
    refreshServerButton.classList.toggle("jenkins-button--loading");
    refreshServerButton.disabled = true;
    pluginManager.refreshServer(function() {
      refreshServerButton.classList.remove("jenkins-button--loading");
      callback();
    });
  });
}
