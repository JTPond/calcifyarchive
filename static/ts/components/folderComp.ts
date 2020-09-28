import { ArticleComp } from "./articleComp.js";
import { Article, Folder } from "./pathWizard.js";

export class FolderComp {
  folder: Folder;
  constructor(folder: Folder) {
    this.folder = folder;
  }

  getArticleIcon(title: string, art: Article): HTMLElement {
    let fig = document.createElement('figure');
    fig.classList.add("icon");
    let icon: HTMLImageElement = document.createElement('img');
    icon.src = "./style/assets/article.svg";
    let cap = document.createElement('figcaption');
    cap.textContent = title.replace(/(?<!\\)_/g,' ').replace(/\_/g,'_');
    fig.append(icon,cap);
    fig.addEventListener('click', () => {
      window.location.hash = window.location.hash + title;
    });
    return fig;
  }

  getFolderIcon(title: string, fold: Folder): HTMLElement {
    let fig = document.createElement('figure');
    fig.classList.add("icon");
    let icon: HTMLImageElement = document.createElement('img');
    icon.src = "./style/assets/folder.svg";
    let cap = document.createElement('figcaption');
    cap.textContent = title.replace(/(?<!\\)_/g,' ').replace(/\_/g,'_');
    fig.append(icon,cap);
    fig.addEventListener('click', () => {
      window.location.hash = window.location.hash + title + '/';
    });
    return fig;
  }

  getHTML(): HTMLElement {
    let out = document.createElement('div');
    out.classList.add("folder");
    this.folder.f_order.forEach(key => {
      let icon = this.getFolderIcon(key,this.folder.folders.get(key));
      out.append(icon);
    });
    this.folder.a_order.forEach(key => {
      out.append(this.getArticleIcon(key,this.folder.articles.get(key)));
    });
    return out;
  }
}
