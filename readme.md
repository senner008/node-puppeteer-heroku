# demo :
https://secure-forest-49288.herokuapp.com

# To deploy to heroku:
- git clone
- npm install
- heroku create APPNAMEHERE
- heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
- git push heroku master
- heroku ps:scale web=1
- heroku open
