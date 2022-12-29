function createElementFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

const CHECK_SYMBOL = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Checkmark</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96"/></svg>`;

Behaviour.specify(
  "[data-type='build-button']",
  "build-button-column",
  0,
  (button) => {
    button.addEventListener("click", async () => {
      button.style.pointerEvents = "none";

      if (!button.classList.contains("longhorn")) {
        button.classList.add("longhorn");
        button.children[0].classList.add("longhorn-active");
        button.append(createElementFromHtml(`<span class="jenkins-spinner"></span>`))
        button.append(createElementFromHtml(CHECK_SYMBOL))
      }

      const url = button.dataset.url;
      new Ajax.Request(url);

      const children = Array.from(button.children);
      const timer = ms => new Promise(res => setTimeout(res, ms));

      for (let i = 0; i < children.length; i++){
        if (i === 0) {
          await timer(100);
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

