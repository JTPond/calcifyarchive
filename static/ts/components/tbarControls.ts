export class TBarControls {
  current: string;
  articleName: string | null;

  constructor(current: string) {
    this.current = current;
    if (!this.current.endsWith('/')){
      this.articleName = current.split('/').pop();
    } else this.articleName = null;
  }

  open_folder(link: string): () => void {
    return function(){
      window.location.hash = link;
    }
  }

  getUrlControl(): HTMLElement {
    let vw = window.innerWidth;
    let vh = 2.75*window.innerHeight/100.0;
    let counter = 1;
    let curr = this.current;
    let curr_cells = curr.split('/');
    while (vw < (curr.length * vh) && counter < curr_cells.length-1 ){
      curr_cells[counter] = (counter == curr_cells.length-2)? '.':'..';
      curr = curr_cells.join('/');
      curr_cells = curr.split('/');
      counter += 1;
    }
    let out = document.createElement('div');
    out.id = "folder__control";
    let root_link = document.createElement('span');
    root_link.classList.add('folder__link');
    root_link.textContent = '/';
    root_link.addEventListener('click', this.open_folder('/'));
    out.append(root_link);
    let th_link = '/';
    let cells = curr.split('/');
    let fCells = this.current.split('/').slice(1,cells.length-1);
    let fold_links = cells.slice(1,cells.length-1).map((chunk,i) => {
      if (chunk !== '') {
        th_link = th_link.concat(`${fCells[i]}/`);
        let fold_link = document.createElement('span');
        fold_link.classList.add('folder__link');
        fold_link.textContent = `${chunk}/`;
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
