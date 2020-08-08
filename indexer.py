import sys
import shutil
import json
import argparse
from datetime import datetime
from pathlib import Path
from commonmark import commonmark

def make_index(archive_dir,index = {}):
    if not 'self' in index:
        index['self'] = {"parent":None,
                         "f_order":[],
                         "a_order":[]}
    stops = []
    for path in archive_dir.glob("**/*"):
        path = path.relative_to(archive_dir)
        index_buff = index
        parent = archive_dir
        for i, part in enumerate(path.parts):
            p_path = parent/part
            if not p_path in stops:
                if not p_path.stem in index_buff:
                    if p_path.is_dir():
                        art_check = sorted(p_path.glob("article.*"))
                        if len(art_check) > 0:
                            a_dir = p_path/"assets"
                            if art_check[0].suffix == ".md":
                                o_html = p_path/"article.html"
                                with o_html.open('w+',encoding='utf-8') as hf:
                                    hf.write(commonmark(art_check[0].read_text(encoding='utf-8')).replace("=\"./assets","=\"./"+str("archive"/a_dir.relative_to(archive_dir))))
                                art_check[0] = o_html
                            elif art_check[0].suffix == ".html":
                                html_buff = art_check[0].read_text()
                                with art_check[0].open('w+',encoding='utf-8') as hf:
                                    hf.write(html_buff.replace("=\"./assets","=\"./"+str("archive"/a_dir.relative_to(archive_dir))))
                            index_buff[p_path.stem] = {"pinned":False,
                                                       "mtime":datetime.fromtimestamp(art_check[0].stat().st_mtime).strftime("%Y-%m-%dT%X"),
                                                       "url":"./"+str("archive"/art_check[0].relative_to(archive_dir))}
                            stops.append(p_path)
                        else:
                            index_buff[p_path.stem] = {"self":{"parent":str(parent.relative_to(archive_dir)),
                                                       "f_order":[],
                                                       "a_order":[]}}
                    elif p_path.is_file():
                        index_buff[p_path.stem] = {"pinned":False,
                                                   "mtime":datetime.fromtimestamp(p_path.stat().st_mtime).strftime("%Y-%m-%dT%X"),
                                                   "url":"./"+str("archive"/p_path.relative_to(archive_dir))}
                else:
                    if p_path.is_dir():
                        art_check = sorted(p_path.glob("article.*"))
                        if len(art_check) == 1:
                            index_buff[p_path.stem]["mtime"] = datetime.fromtimestamp(art_check[0].stat().st_mtime).strftime("%Y-%m-%dT%X")
                            stops.append(p_path)
                        elif len(art_check) == 2:
                            o_html = p_path/"article.html"
                            a_dir = p_path/"assets"
                            with o_html.open('w+',encoding='utf-8') as hf:
                                hf.write(commonmark((p_path/"article.md").read_text(encoding='utf-8')).replace("=\"./assets","=\"./"+str("archive"/a_dir.relative_to(archive_dir))))
                            index_buff[p_path.stem]["mtime"] = datetime.fromtimestamp((p_path/"article.md").stat().st_mtime).strftime("%Y-%m-%dT%X")
                            stops.append(p_path)
                    elif p_path.is_file():
                        index_buff[p_path.stem]["mtime"] = datetime.fromtimestamp(p_path.stat().st_mtime).strftime("%Y-%m-%dT%X")
                if i < len(path.parts) -1:
                    index_buff = index_buff[p_path.stem]
                    parent = p_path
            else:
                break
    return index

def fill_folder_data(index):
    for key in index:
        if key != 'self':
            if not 'url' in index[key]:
                if not key in index['self']['f_order']:
                    index['self']['f_order'].append(key)
                index[key] = fill_folder_data(index[key])
            else:
                if not key in index['self']['a_order']:
                    index['self']['a_order'].append(key)
    return index


def copy_archive(archive_dir):
    out_dir = Path.cwd()/"dist"/"archive";
    if not out_dir == archive_dir:
        shutil.copytree(archive_dir,out_dir,dirs_exist_ok=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Archive Indexer")
    parser.add_argument("archive_dir", nargs='?', type=str, help="Directory to index", default="./archive")
    parser.add_argument("index_file", nargs='?', type=str, help="Path to index file", default="./dist/index.json")
    args = parser.parse_args()

    archive_dir = Path(args.archive_dir)
    index_file = Path(args.index_file)

    if not archive_dir.exists() or not archive_dir.is_dir():
        raise RuntimeError("Archive Directory Error")

    index = {}
    if index_file.exists():
        with index_file.open() as iF:
            index = json.load(iF)

    index = make_index(archive_dir,index)
    fill_folder_data(index)
    copy_archive(archive_dir)

    with index_file.open('w+') as iF:
        iF.write(json.dumps(index,indent=2))
