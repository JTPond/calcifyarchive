import { Article, Folder, PathWizard } from "./componants/pathWizard.js";
import { FolderComp } from "./componants/folderComp.js";
import { ArticleComp } from "./componants/articleComp.js";
import { TBarControls } from "./componants/tbarControls.js";
import { HPLink } from "./componants/hplink.js";

class main {
  index: PathWizard;
  current: string;
  root: HTMLElement;

  constructor() {
    this.index = new PathWizard();
    this.current = '/';
    this.root = document.getElementById('root__page');
  }

  fillRoot(content: HTMLElement) {
    if (this.root.children.length == 1) {
      this.root.firstElementChild.replaceWith(content);
    }
    else if (this.root.children.length == 0) this.root.append(content);
    if (window.location.hash !== ''){
      if (window.location.hash.endsWith('/')) {
        window.dispatchEvent(new CustomEvent('open_folder',{detail:window.location.hash.substr(1)}));
      }
      else {
        window.dispatchEvent(new CustomEvent('open_article',{detail:window.location.hash.substr(1)}));
      }
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
  rec_head.textContent = "Recent Articles";
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
      window.dispatchEvent(new CustomEvent('toggle_browser'));
    });

    let title = document.createElement('div');
    title.classList.add('title');
    title.textContent = "Calcify/Archive";

    let controls = document.createElement('div');
    controls.classList.add('controls');
    let f_links = (new TBarControls(__main__.current)).getUrlControl();
    controls.append(f_links);
    tbar.append(browser_btn,title);
    title.after(controls);
    page.append(tbar,wpage,hcontent);


    window.addEventListener('toggle_browser',() => {
      if (wpage.classList.contains('open')) {
        wpage.classList.remove('open');
        tbar.classList.remove('open');
        wpage.innerHTML = '';
        window.location.hash = '';
        controls.firstElementChild.replaceWith((new TBarControls('/')).getUrlControl());
      } else {
        __main__.current = '/';
        let fc = new FolderComp(__main__.index.root);
        wpage.append(fc.getHTML());
        wpage.classList.add('open');
        tbar.classList.add('open');
        window.location.hash = __main__.current;
      }
    });

    window.addEventListener('folder_opened',((e: CustomEvent<any>) => {
      if (e.detail) {
        __main__.current = __main__.current + `${e.detail}/`;
        controls.firstElementChild.replaceWith((new TBarControls(__main__.current)).getUrlControl());
        window.location.hash = __main__.current;
      }
    }) as EventListener);

    window.addEventListener('article_opened',((e: CustomEvent<any>) => {
      if (e.detail) {
        __main__.current = __main__.current + `${e.detail}`;
        controls.firstElementChild.replaceWith((new TBarControls(__main__.current)).getUrlControl());
        window.location.hash = __main__.current;
      }
    }) as EventListener);

    window.addEventListener('open_folder',((e: CustomEvent<any>) => {
      if (e.detail) {
        if (wpage.classList.contains('open')) {
          wpage.innerHTML = '';
        }
        let fo: Folder = __main__.index.root.open(e.detail);
        if (fo !== undefined) {
          let fc = new FolderComp(fo);
          wpage.append(fc.getHTML());
          wpage.classList.add('open');
          tbar.classList.add('open');
          __main__.current = e.detail;
          controls.firstElementChild.replaceWith((new TBarControls(e.detail)).getUrlControl());
          window.location.hash = __main__.current;
        }
      }
    }) as EventListener);

    window.addEventListener('open_article',((e: CustomEvent<any>) => {
      if (e.detail) {
        if (wpage.classList.contains('open')) {
          wpage.innerHTML = '';
        }
        let ao: Article = __main__.index.root.get(e.detail);
        if (ao !== undefined) {
          let ac = new ArticleComp(ao);
          ac.getHTML().then((element) => {
            wpage.append(element);
            wpage.classList.add('open');
            tbar.classList.add('open');
            __main__.current = e.detail;
            controls.firstElementChild.replaceWith((new TBarControls(e.detail)).getUrlControl());
            window.location.hash = __main__.current;
          });
        }
      }
    }) as EventListener);

    __main__.fillRoot(page);
  });
});
