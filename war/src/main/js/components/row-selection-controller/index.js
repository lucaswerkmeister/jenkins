const rowSelectionControllers = document.querySelectorAll(
  ".jenkins-table__checkbox"
);

rowSelectionControllers.forEach((headerCheckbox) => {
  const table = headerCheckbox.closest(".jenkins-table");
  const tableCheckboxes = table.querySelectorAll("input[type='checkbox']");
  const moreOptionsButton = table.querySelector(
    ".jenkins-table__checkbox-options"
  );
  const moreOptionsAllButton = table.querySelector("[data-select='all']");
  const moreOptionsNoneButton = table.querySelector("[data-select='none']");

  if (tableCheckboxes.length === 0) {
    headerCheckbox.disabled = true;
    if (moreOptionsButton) {
      moreOptionsButton.disabled = true;
    }
  }

  const allCheckboxesSelected = () => {
    return (
      tableCheckboxes.length ===
      [...tableCheckboxes].filter((e) => e.checked).length
    );
  };

  const anyCheckboxesSelected = () => {
    return [...tableCheckboxes].filter((e) => e.checked).length > 0;
  };

  tableCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateIcon();
    });
  });

  headerCheckbox.addEventListener("click", () => {
    const newValue = !allCheckboxesSelected();
    tableCheckboxes.forEach((e) => (e.checked = newValue));
    updateIcon();
  });

  if (moreOptionsAllButton !== null) {
    moreOptionsAllButton.addEventListener("click", () => {
      tableCheckboxes.forEach((e) => (e.checked = true));
      updateIcon();
    });
  }

  if (moreOptionsNoneButton !== null) {
    moreOptionsNoneButton.addEventListener("click", () => {
      tableCheckboxes.forEach((e) => (e.checked = false));
      updateIcon();
    });
  }

  function updateIcon() {
    headerCheckbox.classList.remove("jenkins-table__checkbox--all");
    headerCheckbox.classList.remove("jenkins-table__checkbox--indeterminate");

    if (allCheckboxesSelected()) {
      headerCheckbox.classList.add("jenkins-table__checkbox--all");
      return;
    }

    if (anyCheckboxesSelected()) {
      headerCheckbox.classList.add("jenkins-table__checkbox--indeterminate");
    }
  }

  window.updateTableHeaderCheckbox = updateIcon;
});
