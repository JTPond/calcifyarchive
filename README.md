# CalcifyArchive

Tool for creating a single page static site for hosting articles and blog posts, built on Typescript and Python, mimicking a desktop file browser.

# Example

[jtpond.github.io](https://jtpond.github.io)

## Requirements

 * Python (> 3.6)
  * commonmark module
 * Typescript compiler

## How To

  1. Clone the repository
  2. In the static subdirectory, run either `build.sh` or `build.bat` depending on your system.
  3. In the root directory, run `python(3) indexer.py <path/to/dir/to/be/archived>`. Get help: `python(3) indexer.py -h`.
  4. Modify `./dist/index.json` for your settings:
    1. Set any pinned articles `pinned` field to `true`.
    2. Update the `f_order` and `a_order` field of any folders that have specific orders for how they should appear in the client.
  5. Deploy:
    1. Point a webserver at the `./dist/` directory, or
    2. Commit `./dist/` to GitHub pages, or
    3. Sync `./dist/` to another static CDS like S3+CloudFront

## Archive format

  * Each article is an HTML, or markdown file.
  * For HTML there's no need to add a head, or the body tags.
    * You have two options:
      * `parent_dir/article_name.html`, or `parent_dir/article_name/article.html` with a companion `parent_dir/article_name/assets/` which can contain anything your article references.
        * If you use the second option, always use `src="./assets/blah.blah"`, the indexer will replace all of these patterns with `src="./archive/path/to/assets/blah.blah"`.
  * For markdown you can only use the second option and `parent_dir/article_name/article.html` will be created from `parent_dir/article_name/article.md` using commonmark. The assets directory is the same.

## Re-indexing

Re-running the indexer will update any articles' html form and their modified time and update `dist/`.

If you've moved dist somewhere other than the cwd, you'll need to specify the location of the current index by running: `python(3) indexer.py <path/to/dir/to/be/archived> <path/to/dist/index.json>`

## Other Content

For content other than basic md/html content you can create an `article_name/article.html` where the article is:
```html
  <object height="100%" width="100%" type="content/type" data="./assets/other.content">
    Not Supported
  </object>
```
and the indexer will update the data field and the object will load naturally in the client. This works well with Jupyter Notebooks exported as html. 
