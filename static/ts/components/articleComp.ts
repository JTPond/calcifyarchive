import { Article } from "./pathWizard.js";

export class ArticleComp {
  article: Article;
  constructor(article: Article) {
    this.article = article;
  }

  async getHTML(): Promise<HTMLElement> {
    return window.fetch(new Request(this.article.url)).then(
      response => response.text()).then((body) => {
        let out = document.createElement('div');
        out.classList.add('article');
        out.innerHTML = body;
        return out;
      });
  }
}
