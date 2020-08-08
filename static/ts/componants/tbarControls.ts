export class TBarControls {
  current: string;
  cells: string[];
  articleName: string | null;

  constructor(current: string) {
    this.current = current;
    this.cells = current.split('/');
    if (!this.current.endsWith('/')){
      this.articleName = this.cells.pop();
    } else this.articleName = null;
  }

  open_folder(link: string): () => void {
    return function(){
      window.dispatchEvent(new CustomEvent('open_folder',{detail:link}));
    }
  }

  getUrlControl(): HTMLElement {
    let mql = window.matchMedia('(min-width: 1100px)');
    let out = document.createElement('div');
    out.id = "folder__control";
    let root_link = document.createElement('span');
    root_link.classList.add('folder__link');
    root_link.textContent = '/';
    root_link.addEventListener('click', this.open_folder('/'));
    out.append(root_link);
    let th_link = '/';
    let fold_links = this.cells.slice(1).map((chunk) => {
      if (chunk !== '') {
        th_link = th_link.concat(`${chunk}/`);
        let fold_link = document.createElement('span');
        fold_link.classList.add('folder__link');
        fold_link.textContent = (mql.matches)? `${chunk}/`:'./';
        fold_link.addEventListener('click', this.open_folder(th_link));
        return fold_link;
      }
    }).filter((value) => value !== undefined);
    out.append(...fold_links);
    if (this.articleName) {
      let art = document.createElement('span');
      art.textContent = this.articleName;
      out.append(art);
    }
    return out;
  }
}
