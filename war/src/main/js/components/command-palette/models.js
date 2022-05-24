import * as Symbols from "./symbols";

class Result {
  constructor(icon, label, description, category) {
    this.icon = icon;
    this.label = label;
    this.description = description;
    this.category = category;
    console.log(this.icon)
  }
  render() {
    return `<button class="jenkins-command-palette__results__item">
        <div class="jenkins-command-palette__results__item__icon">${this.icon}"}</div>
        ${this.label}
        ${this.description ? `<span class="jenkins-command-palette__results__item__description">${this.description}</span>` : ``}
        ${Symbols.CHEVRON_RIGHT}
    </button>`
  }
}

export class LinkResult extends Result {
  constructor(icon, label, description, category, url, isExternal) {
    super(icon, label, description, category);
    this.url = url;
    this.isExternal = isExternal;
  }
  render() {
    return `<a class="jenkins-command-palette__results__item" href="${this.url}">
        <div class="jenkins-command-palette__results__item__icon">${this.icon ? `${this.icon.svg ? this.icon.svg : `<img src="${this.icon.url}" alt="" />`}` : ``}</div>
        ${this.label}
        ${this.description ? `<span class="jenkins-command-palette__results__item__description">${this.description}</span>` : ``}
        ${this.isExternal ? Symbols.EXTERNAL_LINK : Symbols.CHEVRON_RIGHT}
    </a>`
  }
}
