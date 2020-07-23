export class HPLink {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  getHTML(): HTMLElement {
    let out = document.createElement('li');
    out.classList.add("homepage__link");
    let cells = this.path.split('/');
    out.innerHTML = `/${cells.slice(cells.length-2).join('/<wbr>')}`; //.replace(/(?<!\\)_/g,' ').replace(/\_/g,'_')}`;
    out.addEventListener('click', () => window.dispatchEvent(new CustomEvent('open_article',{detail:this.path})));
    return out;
  }
}
