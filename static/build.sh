echo "Creating dist";
mkdir -p ../dist/style/css ../dist/js;
echo "Copying files";
cp ./index.html ../dist/index.html;
cat ./style/css/theme.css ./style/css/stylesheet.css > ../dist/style/css/stylesheet.css;
cp -R ./style/assets ../dist/style/.;
echo "Building Typescript";
tsc;
