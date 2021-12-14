import debounce from 'lodash/debounce'
import requestAnimationFrame from 'raf';

import pluginManagerAvailable from './templates/plugin-manager/available.hbs'
import pluginManager from './api/pluginManager';

var filterInput = document.getElementById('filter-box');
var pluginsTable = document.getElementById('plugins');
var mainSpinner = document.getElementById('spinner');
var installPluginsButton = document.getElementById('button-install-plugins');
var refreshServerButton = document.getElementById('button-refresh-server');

function applyFilter(searchQuery) {
    // debounce reduces number of server side calls while typing
    pluginManager.availablePluginsSearch(searchQuery.toLowerCase().trim(), 50, function (plugins) {
        var pluginsTable = document.getElementById('plugins');
        var tbody = pluginsTable.querySelector('tbody');
        var admin = pluginsTable.dataset.hasadmin === 'true';
        var selectedPlugins = [];

        filterInput.parentElement.classList.remove("jenkins-search--loading");

        function clearOldResults() {
            mainSpinner.style.display = "flex";
            pluginsTable.style.opacity = "0";

            if (!admin) {
                tbody.innerHTML = '';
            } else {
                var rows = tbody.querySelectorAll('tr');
                if (rows) {
                    selectedPlugins = []
                    rows.forEach(function (row) {
                        var input = row.querySelector('input');
                        if (input.checked === true) {
                            var pluginName = input.name.split('.')[1];
                            selectedPlugins.push(pluginName)
                        } else {
                            row.remove();
                        }
                    })
                }
            }
        }

        clearOldResults()
        var rows = pluginManagerAvailable({
            plugins: plugins.filter(plugin => selectedPlugins.indexOf(plugin.name) === -1),
            admin
        });

        tbody.insertAdjacentHTML('beforeend', rows);

        longhorn();

        mainSpinner.style.display = "none";
        pluginsTable.style.opacity = "1";

        addQuerySelectors();
    })
}

var handleFilter = function (e) {
    applyFilter(e.target.value)
};

var debouncedFilter = debounce(handleFilter, 150);

document.addEventListener("DOMContentLoaded", function () {
    filterInput.addEventListener('input', function (e) {
        debouncedFilter(e);
        filterInput.parentElement.classList.add("jenkins-search--loading");
    });

    applyFilter(filterInput.value);
});

installPluginsButton.addEventListener("click", function () {
  const plugins = document.querySelectorAll('input[type=checkbox]:checked');

  // Uncheck all checked plugins
  plugins.forEach(el => {
    el.checked = false;
    el.dispatchEvent(new Event('change'));
  })

  installPlugins([...plugins].map(x => x.dataset.pluginId))
});

// Takes plugin id array as param eg [git-plugin, dark-theme]
function installPlugins(plugins) {
  plugins.forEach(function(plugin) {
    // Set plugin row status to 'loading'
    switchPluginInstallStatus(plugin, "loading")
  });

  const pluginInstallIds = plugins.map(plugin => {
    const pluginRow = document.querySelector("tr[data-plugin-id='" + plugin + "']")
    return pluginRow.dataset.pluginInstallId
  })

  pluginManager.installPlugins(pluginInstallIds, function() {
    console.log("sent message x")
  });
}

refreshServerButton.addEventListener("click", function () {
  refreshServerButton.classList.add("jenkins-button--loading");
  refreshServerButton.disabled = true;
  pluginManager.refreshServer(function() {
    // No need to unset the class as we're reloading the page
    location.reload();
  });
});

// TODO
function addQuerySelectors() {
  const downloadButtons = document.querySelectorAll('button[id^=button-install-plugin-]')

  downloadButtons.forEach(button => {
    button.addEventListener('click', () => {
      installPlugins([button.dataset.pluginId])
    });
  });

  document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {

      console.log("changing")

      const checkedCheckboxesLength = document.querySelectorAll('input[type=checkbox]:checked').length
      if (checkedCheckboxesLength > 0) {
        installPluginsButton.classList.remove("jenkins-app-bar__hidden-item");
        downloadButtons.forEach((el) => {
          el.classList.add("jenkins-app-bar__hidden-item");
        })
      } else {
        installPluginsButton.classList.add("jenkins-app-bar__hidden-item");
        downloadButtons.forEach((el) => {
          el.classList.remove("jenkins-app-bar__hidden-item");
        })
      }
    });
  });
}

// TODO rename function
function longhorn() {
  console.log("Updating statuses...")

  pluginManager.installStatus(function(e) {
    e.jobs.forEach(e => {
      if (e.installStatus.toLowerCase().includes("failure")) {
        switchPluginInstallStatus(e.name, "failure")
      } else if (e.installStatus.toLowerCase().includes("success")) {
        switchPluginInstallStatus(e.name, "success")
      }
    })
  })
}

setInterval(function() {
  longhorn()
},1500);

function switchPluginInstallStatus(pluginName, status) {
  const pluginRow = document.querySelector("tr[data-plugin-id='" + pluginName + "']")

  if (pluginRow == null) {
    return;
  }

  const installButton = pluginRow.querySelector("button[id^=button-install-plugin]")
  const spinner = pluginRow.querySelector("p[id^=spinner-]")
  const successIcon = pluginRow.querySelector("svg[id^=success-]")
  const failureIcon = pluginRow.querySelector("svg[id^=failure-]")

  installButton.classList.add("longhorn-bye")
  spinner.classList.add("longhorn-bye")
  successIcon.classList.add("longhorn-bye")
  failureIcon.classList.add("longhorn-bye")

  // Disable row checkbox
  pluginRow.querySelector("input[type='checkbox']").disabled = true;

  switch (status) {
    case "loading":
      spinner.classList.remove("longhorn-bye")
      break;
    case "success":
      successIcon.classList.remove("longhorn-bye")
      break;
    case "failure":
      failureIcon.classList.remove("longhorn-bye")
      break;
  }
}
