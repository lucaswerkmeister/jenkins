import debounce from 'lodash/debounce'

import pluginManagerAvailable from './templates/plugin-manager/available.hbs'
import pluginManager from './api/pluginManager';


pluginManager.categories(function (categories) {
  const multiplier = 360 / categories.length;
  const newCats = categories.sort().map((e, i) => ({name: e, color: `hsl(${i * multiplier}, 60%, 55%)`}))
  console.log(newCats)

  const categoriesDiv = document.getElementById("categories");
  categories.clear();
  newCats.forEach(cat => {
    categoriesDiv.insertAdjacentHTML('beforeend',
      `<a class="jenkins-table__link jenkins-table__badge" style="font-weight: 500; font-size: 0.75rem; color: ${cat.color} !important;">${cat.name}</a>`)
  })

  categoriesDiv.querySelectorAll("a").forEach(e => e.addEventListener("click", () => {
    var filterInput = document.getElementById('filter-box');
    filterInput.value = e.textContent
  }))

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
    })
}

var handleFilter = function (e) {
    applyFilter(e.target.value)
};

var debouncedFilter = debounce(handleFilter, 150);

document.addEventListener("DOMContentLoaded", function () {
    var filterInput = document.getElementById('filter-box');
    filterInput.addEventListener('input', function (e) {
        debouncedFilter(e);
        filterInput.parentElement.classList.add("app-plugin-manager__search--loading");
    });

    filterInput.focus();

    applyFilter(filterInput.value);

    setTimeout(function () {
        layoutUpdateCallback.call();
    }, 350)
});
