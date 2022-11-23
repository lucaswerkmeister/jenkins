import { createElementFromHtml } from "../../util/dom";

const itemDefaultOptions = {
  type: "link",
};

function item(options) {
  const itemOptions = {
    ...itemDefaultOptions,
    ...options,
  };

  const tag = itemOptions.type === "link" ? "a" : "button";

  return createElementFromHtml(`
      <${tag} class="jenkins-dropdown__item" href="${itemOptions.url}">
          ${
            itemOptions.icon
              ? `<div class="jenkins-dropdown__item__icon">${
                  itemOptions.iconXml
                    ? itemOptions.iconXml
                    : `<img src="${itemOptions.icon}" />`
                }</div>`
              : ``
          }
          ${itemOptions.label}
          ${
            itemOptions.subMenu != null
              ? `<span class="jenkins-dropdown__item__chevron"></span>`
              : ``
          }
      </${tag}>
    `);
}

function heading(label) {
  return createElementFromHtml(
    `<p class="jenkins-dropdown__heading">${label}</p>`
  );
}

function separator() {
  return createElementFromHtml(
    `<div class="jenkins-dropdown__separator"></div>`
  );
}

export default { item, heading, separator };
