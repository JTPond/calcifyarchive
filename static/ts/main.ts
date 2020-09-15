import { Article, Folder, PathWizard } from "./componants/pathWizard.js";
import { FolderComp } from "./componants/folderComp.js";
import { ArticleComp } from "./componants/articleComp.js";
import { TBarControls } from "./componants/tbarControls.js";
import { HPLink } from "./componants/hplink.js";

class main {
  index: PathWizard;
  root: HTMLElement;

  constructor() {
    this.index = new PathWizard();
    this.root = document.getElementById('root__page');
  }

  fillRoot(content: HTMLElement) {
    if (this.root.children.length == 1) {
      this.root.firstElementChild.replaceWith(content);
    }
    else if (this.root.children.length == 0) this.root.append(content);
    if (window.location.hash !== ''){
      window.dispatchEvent(new CustomEvent('hashchange'));
    }
  }
}

window.addEventListener('DOMContentLoaded',() => {
  let __main__ = new main();
  let page = document.createElement('div');
  page.id = 'content__page';
  let hcontent = document.createElement('div');
  hcontent.id = 'home__content';
  let pinned = document.createElement('div');
  pinned.id = 'pinned';
  let recent = document.createElement('div');
  recent.id = 'recent';
  let pin_list = document.createElement('ul');
  pin_list.classList.add('homepage__list');
  let pin_head = document.createElement('h3');
  pin_head.classList.add('homepage__head');
  pin_head.textContent = "Pinned Articles";
  let rec_list = document.createElement('ul');
  rec_list.classList.add('homepage__list');
  let rec_head = document.createElement('h3');
  rec_head.textContent = "Recently Updated";
  rec_head.classList.add('homepage__head');
  __main__.index.load('./index.json').then(() => {
    __main__.index.pinned.forEach(([path, art]) => {
      let pin = new HPLink(path);
      pin_list.append(pin.getHTML());
    });
    __main__.index.recent.forEach(([path, art]) => {
      let rec = new HPLink(path);
      rec_list.append(rec.getHTML());
    });
    if (__main__.index.pinned.length > 0){
      hcontent.append(pinned);
      pinned.after(recent);
      pinned.append(pin_head,pin_list);
      recent.append(rec_head,rec_list);
    } else {
      hcontent.append(recent);
      recent.append(rec_head,rec_list);
    }
    let tbar = document.createElement('div');
    tbar.id = 'title__bar';
    let wpage = document.createElement('div');
    wpage.id = 'work__page';
    let browser_btn: HTMLImageElement = document.createElement('img');
    browser_btn.src = "./style/assets/browser.svg";
    browser_btn.id = 'browser__btn';
    browser_btn.addEventListener('click',() => {
      switch (window.location.hash) {
        case '':
          window.location.hash = '/'
          break;
        default:
          window.location.hash = ''
          break;
      }
    });

    let title = document.createElement('div');
    title.classList.add('title');
    title.textContent = "Calcify/Archive";
    document.title = "Calcify/Archive";
    let controls = document.createElement('div');
    controls.classList.add('controls');
    let f_links = (new TBarControls('/')).getUrlControl();
    controls.append(f_links);
    tbar.append(browser_btn,title);
    title.after(controls);
    page.append(tbar,wpage,hcontent);


    window.addEventListener('hashchange',() => {
      let nHash = window.location.hash.slice(1);
      if (nHash == '') {
        wpage.classList.remove('open');
        tbar.classList.remove('open');
        wpage.innerHTML = '';
        controls.firstElementChild.replaceWith((new TBarControls('/')).getUrlControl());
      }
      else {
        if (nHash.endsWith('/')) {
          let fo: Folder = __main__.index.root.open(nHash);
          if (fo !== undefined) {
            wpage.innerHTML = '';
            let fc = new FolderComp(fo);
            wpage.append(fc.getHTML());
          }
        }
        else {
          let ao: Article = __main__.index.root.get(nHash);
          if (ao !== undefined) {
            let ac = new ArticleComp(ao);
            ac.getHTML().then((element) => {
              wpage.innerHTML = '';
              wpage.append(element);
            });
          }
        }
        controls.firstElementChild.replaceWith((new TBarControls(nHash)).getUrlControl());
        wpage.classList.add('open');
        tbar.classList.add('open');
      }
    });
    window.addEventListener('resize',() => {
      let nHash = window.location.hash.slice(1);
      controls.firstElementChild.replaceWith((new TBarControls(nHash)).getUrlControl());
    });
    __main__.fillRoot(page);
  });
});
