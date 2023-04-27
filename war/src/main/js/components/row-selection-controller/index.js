const rowSelectionControllers = document.querySelectorAll(
  ".jenkins-table__checkbox"
);

rowSelectionControllers.forEach((headerCheckbox) => {
  const table = headerCheckbox.closest(".jenkins-table");
  const tableCheckboxes = table.querySelectorAll("input[type='checkbox']");
  const moreOptionsButton = table.querySelector(
    ".jenkins-table__checkbox-options"
  );
  const template = table.querySelector("thead template");
  const moreOptionsAllButton = template.content.querySelector("[data-select='all']");
  const moreOptionsNoneButton = template.content.querySelector("[data-select='none']");

  console.log(moreOptionsAllButton)

  if (tableCheckboxes.length === 0) {
    headerCheckbox.disabled = true;
    if (moreOptionsButton) {
      moreOptionsButton.disabled = true;
    }
  }

  const allCheckboxesSelected = () => {
    const selectedCheckboxes = Array.from(tableCheckboxes).filter(
      (e) => e.checked
    );
    return tableCheckboxes.length === selectedCheckboxes.length;
  };

  const anyCheckboxesSelected = () => {
    const selectedCheckboxes = Array.from(tableCheckboxes).filter(
      (e) => e.checked
    );
    return selectedCheckboxes.length > 0;
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
