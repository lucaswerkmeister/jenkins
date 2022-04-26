import debounce from "lodash/debounce";

import pluginManager from "@/api/pluginManager";
import pluginManagerAvailable from "@/templates/plugin-manager/available.hbs";

const searchBar = document.querySelector("#filter-box");

function applyFilter(searchQuery) {
  // debounce reduces number of server side calls while typing
  pluginManager.availablePluginsSearch(searchQuery.toLowerCase().trim(), 50, function (plugins) {
    const pluginsTable = document.getElementById('plugins');
    const tbody = pluginsTable.querySelector('tbody');
    const admin = pluginsTable.dataset.hasadmin === 'true';
    let selectedPlugins = [];

    const filterInput = document.getElementById('filter-box');
    filterInput.parentElement.classList.remove("app-plugin-manager__search--loading");

    function clearOldResults() {
      if (!admin) {
        tbody.innerHTML = '';
      } else {
        const rows = tbody.querySelectorAll('tr');
        if (rows) {
          selectedPlugins = []
          rows.forEach(function (row) {
            const input = row.querySelector('input');
            if (input.checked === true) {
              const pluginName = input.name.split('.')[1];
              selectedPlugins.push(pluginName)
            } else {
              row.remove();
            }
          })
        }
      }
    }

    clearOldResults()
    const rows = pluginManagerAvailable({
      plugins: plugins.filter(plugin => selectedPlugins.indexOf(plugin.name) === -1),
      admin
    });

    tbody.insertAdjacentHTML('beforeend', rows);
  })
}

const handleFilter = function (e) {
  applyFilter(e.target.value)
};

const debouncedFilter = debounce(handleFilter, 150);

document.addEventListener("DOMContentLoaded", function () {
  searchBar.addEventListener('input', function (e) {
    debouncedFilter(e);
    searchBar.parentElement.classList.add("app-plugin-manager__search--loading");
  });

  searchBar.focus();

  applyFilter(searchBar.value);
});
