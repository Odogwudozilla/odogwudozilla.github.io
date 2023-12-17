# SCSS files
This website contains a modified version of Bootstrap 5. To keep the code maintainable, we compile it from SCSS files.

All the overridden variables of Bootstrap are contained in variables.scss. The other files are imported afterwards, which
are needed for the website itself.

Make sure that you compile every time you make changes to the files! I think a GitHub Action would have been a bit
overkill. If more processing gets added in the future, change the setup to build the website automatically!

## Compile using Sass
After changing any files, run the following command:
```
npm run scss
```
This will override the docs/css/styles.css file.

## Not compressed
I have chosen not to compress the CSS file. This is easier for local development. It only saved 50kb.

# Gimp
All the files used to create the background are located in the gimp directory.

# Sources
The following links are the source of idea's of this website:
* https://bootstrapmade.com/demo/MyResume/
* https://startbootstrap.com/theme/resume
* https://ricoapon.nl/
