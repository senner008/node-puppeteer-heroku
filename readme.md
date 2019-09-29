# Demo:
- https://senner-puppeteer-app.herokuapp.com/foods
- https://senner-puppeteer-app.herokuapp.com/foods/?id=Luksus%20Kapital%20Pizza


# To deploy to heroku:
- git clone
- npm install
- heroku create APPNAMEHERE
- heroku buildpacks:add heroku/nodejs
- heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
- git push heroku master
- heroku ps:scale web=1
- heroku open

# Todo:
- Add mock data environment - DONE
- add mock data test to ci pipeline
- use iron cache