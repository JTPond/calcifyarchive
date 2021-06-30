Write-Host "Creating dist"
mkdir ..\dist\style\css\, ..\dist\js\
Write-Host "Copying files"
Copy-Item .\index.html ..\dist\index.html
Get-Content .\style\css\theme.css, .\style\css\stylesheet.css > ..\dist\style\css\stylesheet.css
Copy-Item .\style\assets\* ..\dist\style\
tsc