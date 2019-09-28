# demo :
https://senner-puppeteer-app.herokuapp.com/foods/?id=specialiteter

# To deploy to heroku:
- git clone
- npm install
- heroku create APPNAMEHERE
- heroku buildpacks:add heroku/nodejs
- heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
- git push heroku master
- heroku ps:scale web=1
- heroku open