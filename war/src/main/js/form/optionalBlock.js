const OPTIONAL_BLOCK_SELECTOR = ".optionalBlock-container";

function showHideOptionalBlock(optionalBlock) {
  const checkbox = optionalBlock.querySelector("input[type='checkbox']");
  const optionalBlockHiddenContainer = optionalBlock.querySelector(".form-container");

  optionalBlockHiddenContainer.style.display = checkbox.checked ? "block" : "none";

  // if (c.name == 'hudson-tools-InstallSourceProperty') {
  //   // Hack to hide tool home when "Install automatically" is checked.
  //   var homeField = findPreviousFormItem(c, 'home');
  //   if (homeField != null && homeField.value == '') {
  //     var tr = findAncestor(homeField, 'TR') || findAncestorClass(homeField, 'tr');
  //     if (tr != null) {
  //       tr.style.display = c.checked ? 'none' : '';
  //       layoutUpdateCallback.call();
  //     }
  //   }
  // }
}

window.addEventListener("load", function() {
  document.querySelectorAll(OPTIONAL_BLOCK_SELECTOR)
    .forEach(optionalBlock => {
      const checkbox = optionalBlock.querySelector("input[type='checkbox']");

      checkbox.addEventListener("change", () => showHideOptionalBlock(optionalBlock));

      showHideOptionalBlock(optionalBlock);
    });
});
