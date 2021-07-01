echo Creating dist
mkdir ..\dist\style\css\ ..\dist\style\assets\ ..\dist\js\
echo Copying files
copy /y .\index.html ..\dist\index.html
copy /y .\style\css\theme.css+.\style\css\stylesheet.css  ..\dist\style\css\stylesheet.css
copy /y .\style\assets\* ..\dist\style\assets\.
echo Building Typescript
tsc
