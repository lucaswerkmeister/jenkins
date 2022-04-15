const OPTIONAL_BLOCK_SELECTOR = ".optionalBlock-container";

function showHideOptionalBlock(optionalBlock) {
  const checkbox = optionalBlock.querySelector("input[type='checkbox']");
  const optionalBlockHiddenContainer = optionalBlock.querySelector(".form-container");

  optionalBlockHiddenContainer.style.display = checkbox.checked ? "block" : "none";

  if (checkbox.name === 'hudson-tools-InstallSourceProperty') {
    // Hack to hide tool home when "Install automatically" is checked.
    const homeField = findPreviousFormItem(checkbox, 'home');

    console.log(homeField)

    if (homeField != null && homeField.value === '') {
      const container = homeField.closest(".jenkins-form-item");

      console.log(container)

      if (container !== null) {
        container.style.display = checkbox.checked ? 'none' : '';
      }
    }
  }
}

window.addEventListener("load", function() {
  document.querySelectorAll(OPTIONAL_BLOCK_SELECTOR)
    .forEach(optionalBlock => {
      const checkbox = optionalBlock.querySelector("input[type='checkbox']");

      checkbox.addEventListener("change", () => showHideOptionalBlock(optionalBlock));

      showHideOptionalBlock(optionalBlock);
    });
});
