export class Article {
	url: string;
	pinned: boolean;
	mtime: Date;

	constructor (url: string, pinned: boolean, mtime: string) {
		this.url = url;
		this.pinned = pinned;
		this.mtime = new Date(mtime);
	}

	public static fromJSON(obj: Object): Article | null {
		if (!obj['url']) {
			return null;
		}
		return new Article(obj['url'],obj['pinned'],obj['mtime']);
	}
}

export class Folder {
	folders: Map<string,Folder>;
	articles: Map<string,Article>;

	constructor (folders: Map<string,Folder> = new Map<string,Folder>(), articles: Map<string,Article> = new Map<string,Article>()) {
		this.folders = folders;
		this.articles = articles;
	}

	static fromJSON(obj: Object): any {
		let folders: Map<string,Folder> = new Map();
		let articles: Map<string,Article> = new Map();
		let pinned: any[] = [];
		let recent: any[] = [];
		for (let key of Object.keys(obj)) {
			let value = obj[key];
		    let temp_art: Article|null = Article.fromJSON(value);
				if (temp_art) {
					articles.set(key,temp_art);
					recent.push([`/${key}`,temp_art])
					if (temp_art.pinned) {
						pinned.push([`/${key}`,temp_art])
					}
				} else {
					let [nf, npin, nrec] = Folder.fromJSON(value);
					folders.set(key,nf);
					npin.forEach(([nkey, nvalue]) => {
						nkey = `/${key}${nkey}`;
						pinned.push([nkey,nvalue]);
					});
					nrec.forEach(([nkey, nvalue]) => {
						nkey = `/${key}${nkey}`;
						recent.push([nkey,nvalue]);
					});
				}
		}
		return [new Folder(folders,articles), pinned, recent];
	}

	get(path: string): Article | undefined {
		let cells = path.split("/").filter((str) => str !== "");
		if (cells.length === 1) {
			if (this.articles.has(cells[0])){
				return this.articles.get(cells[0]);
			} else return undefined;
		} else {
			if (this.folders.has(cells[0])) {
				return this.folders.get(cells[0]).get(cells.slice(1).join("/"));
			} else if (cells[0] === ".") {
				return this.get(cells.slice(1).join("/"));
			} else return undefined;
		}
	}

	create(path: string, folder: Folder): void {
		let cells = path.split("/");
		if (cells[cells.length -1] === "") {
			if (cells.length === 2) {
				if (!this.folders.has(cells[0])){
					this.folders.set(cells[0],folder);
				} else {
					console.error(`Folder, ${path}, already exists.`);
				}
			}
			else {
				if (this.folders.has(cells[0])) {
					this.folders.get(cells[0]).create(cells.slice(1).join("/"),folder);
				} else if (cells[0] === ".") {
					this.create(cells.slice(1).join("/"),folder);
				} else {
					console.error(`No such folder: ${path}`);
				}
			}
		} else {
			console.error(`Path, ${path}, does not match Folder`);
		}
	}

	save(path: string, Article: Article, overwrite: boolean = false): void {
		let cells = path.split("/");
		if (cells[cells.length -1] !== "") {
			if (cells.length === 1) {
				if (!this.articles.has(cells[0])) {
					this.articles.set(cells[0],Article);
				} else if (overwrite) {
					this.articles.set(cells[0],Article);
				} else {
					console.error(`Article, ${path}, already exists. Set overwrite to true to continue.`);
				}
			}
			else {
				if (this.folders.has(cells[0])) {
					this.folders.get(cells[0]).save(cells.slice(1).join("/"),Article,overwrite);
				} else if (cells[0] === ".") {
					this.save(cells.slice(1).join("/"),Article,overwrite);
				} else {
					console.error(`No such folder: ${path}`);
				}
			}
		} else {
			console.error(`Path, ${path}, does not match Article`);
		}
	}

	has(path: string): boolean {
		let cells = path.split("/");
		let ffolder = cells[cells.length-1] === "" || cells[cells.length-1] === ".";
		if (cells.length === 1) {
			if (ffolder) {
				return true;
			} else {
				return this.articles.has(cells[0])
			}
		} else {
			if (this.folders.has(cells[0])) {
				return this.folders.get(cells[0]).has(cells.slice(1).join("/"));
			} else if (cells[0] === "" || cells[0] === ".") {
				return this.has(cells.slice(1).join("/"));
			} else return false;
		}
	}

	open(path: string): Folder | undefined {
		if (path === "" || path === "." || path === "./") return this;
		let cells = path.split("/");
		if (cells[0] === "" || cells[0] === ".") {
			cells = cells.slice(1);
		}
		if (cells[cells.length-1] !== "" && cells[cells.length-1] !== ".") return undefined;
		if (cells.length === 1) {
			return this;
		} else {
			if (this.folders.has(cells[0])) {
				return this.folders.get(cells[0]).open(cells.slice(1).join("/"));
			} else return undefined;
		}
	}
}


export class PathWizard {
	root: Folder;
	pinned: any[];
	recent: any[];

	constructor(root: Folder = new Folder()) {
		this.root = root;
		this.pinned = [];
		this.recent = [];
	}

	async load(url: string): Promise<any> {
		return window.fetch(new Request(url)).then(
			response => response.json()).then(
				json => {
					let [root, pinned, recent] = Folder.fromJSON(json);
					this.root = root;
					this.pinned = pinned;
					this.recent = recent.sort((a,b) => b[1].mtime.getTime() - a[1].mtime.getTime()).slice(0,8);
				});
	}

}
