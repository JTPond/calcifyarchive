Write-Host "Creating dist"
mkdir ..\dist\style\css\,..\dist\js\
Write-Host "Copying files"
cp .\index.html ..\dist\index.html
type .\style\css\theme.css,.\style\css\stylesheet.css > ..\dist\style\css\stylesheet.css
cp .\style\assets\* ..\dist\style\
tsc