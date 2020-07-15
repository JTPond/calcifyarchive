# calcifyarchive

Tool for creating a single page static site for hosting articles and blog posts, built on Typescript and Python, mimicking a desktop file browser.

## Requirements

 * Python (> 3.6)
  * commonmark module
 * Typescript compiler

## How To

  1. Clone the repository
  2. In the static subdirectory, run either `build.sh` or `build.bat` depending on your system.
  3. In the root directory, run `python(3) indexer.py <path/to/dir/to/be/archived>`. Get help: `python(3) indexer.py -h`.
  4. Point a webserver at the `./dist/` directory.

## Archive format

  * Each article is an HTML, or markdown file.
  * For HTML there's no need to add a head, or the body tags.
    * You have two options:
      * `parent_dir/article_name.html`, or `parent_dir/article_name/article.html` with a companion `parent_dir/article_name/assets/` which can contain anything your article references.
        * If you use the second option, always use `href/src="./assets/blah.blah"`, the indexer will replace all of these patterns with `href/src="./archive/path/to/assets/blah.blah"`.
  * For markdown you can only use the second option and `parent_dir/article_name/article.html` will be created from `parent_dir/article_name/article.md` using commonmark. The assets directory is the same.
