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
    cap.textContent = title;
    fig.append(icon,cap);
    fig.addEventListener('click', async () => {
      let sfc = new ArticleComp(art);
      let pg = document.getElementById('work__page');
      pg.innerHTML = '';
      pg.append(await sfc.getHTML());
      window.dispatchEvent(new CustomEvent('article_opened',{detail:title}));
    });
    return fig;
  }

  getFolderIcon(title: string, fold: Folder): HTMLElement {
    let fig = document.createElement('figure');
    fig.classList.add("icon");
    let icon: HTMLImageElement = document.createElement('img');
    icon.src = "./style/assets/folder.svg";
    let cap = document.createElement('figcaption');
    cap.textContent = title;
    fig.append(icon,cap);
    fig.addEventListener('click', () => {
      let sfc = new FolderComp(fold);
      let pg = document.getElementById('work__page');
      pg.innerHTML = '';
      pg.append(sfc.getHTML());
      window.dispatchEvent(new CustomEvent('folder_opened',{detail:title}));
    });
    return fig;
  }

  getHTML(): HTMLElement {
    let out = document.createElement('div');
    out.classList.add("folder");
    this.folder.folders.forEach((fold,key) => {
      let icon = this.getFolderIcon(key,fold);
      out.append(icon);
    });
    this.folder.articles.forEach((art,key) => {
      out.append(this.getArticleIcon(key,art));
    });
    return out;
  }
}
