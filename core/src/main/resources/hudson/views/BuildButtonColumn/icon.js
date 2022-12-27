Behaviour.specify(
  "[data-type='build-button']",
  "build-button-column",
  0,
  (button) => {
    button.addEventListener("click", async () => {
      button.style.pointerEvents = "none";

      const url = button.dataset.url;
      new Ajax.Request(url);

      const children = Array.from(button.children);
      const timer = ms => new Promise(res => setTimeout(res, ms));

      for (let i = 0; i < children.length; i++){
        if (i === 0) {
          continue;
        }

        children[i - 1].classList.remove("longhorn-active");
        children[i].classList.add("longhorn-active");

        await timer(3000);
      }

      button.style.pointerEvents = "all";
      children[children.length - 1].classList.remove("longhorn-active");
      children[0].classList.add("longhorn-active");
    });
  }
);

