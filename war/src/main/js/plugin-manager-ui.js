import debounce from 'lodash/debounce'
import requestAnimationFrame from 'raf';

import pluginManagerAvailable from './templates/plugin-manager/available.hbs'
import pluginManager from './api/pluginManager';

const filterInput = document.getElementById('filter-box');
const refreshServerButton = document.getElementById('button-refresh-server');

refreshServerButton.addEventListener("click", function () {
  refreshServerButton.classList.add("jenkins-button--loading");
  refreshServerButton.disabled = true;
  pluginManager.refreshServer(function() {
    applyFilter(filterInput.value);
    refreshServerButton.classList.remove("jenkins-button--loading");
  });
});

function applyFilter(searchQuery) {
    // debounce reduces number of server side calls while typing
    pluginManager.availablePluginsSearch(searchQuery.toLowerCase().trim(), 50, function (plugins) {
        var pluginsTable = document.getElementById('plugins');
        var tbody = pluginsTable.querySelector('tbody');
        var admin = pluginsTable.dataset.hasadmin === 'true';
        var selectedPlugins = [];

        var filterInput = document.getElementById('filter-box');
        filterInput.parentElement.classList.remove("app-plugin-manager__search--loading");

        function clearOldResults() {
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

        // @see JENKINS-64504 - Update the sticky buttons position after each search.
        requestAnimationFrame(() => {
            layoutUpdateCallback.call()
        })
    })
}

var handleFilter = function (e) {
    applyFilter(e.target.value)
};

var debouncedFilter = debounce(handleFilter, 150);

document.addEventListener("DOMContentLoaded", function () {
    filterInput.addEventListener('input', function (e) {
        debouncedFilter(e);
        filterInput.parentElement.classList.add("app-plugin-manager__search--loading");
    });

    filterInput.focus();

    applyFilter(filterInput.value);
});
