# Demo:
- https://senner-puppeteer-app.herokuapp.com/foods
- https://senner-puppeteer-app.herokuapp.com/foods/?id=Luksus%20Kapital%20Pizza

- https://senner-puppeteer-app.herokuapp.com/lunch
- https://senner-puppeteer-app.herokuapp.com/lunch/?id=Salat%20Pizza


# To deploy to heroku:
- install node and npm
- install heroku cli
- git clone https://github.com/senner008/node-puppeteer-heroku.git
- npm install
- heroku create APPNAMEHERE
- heroku buildpacks:add heroku/nodejs
- heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
- git push heroku master
- heroku ps:scale web=1
- heroku open

# Todo:
- Add mock data environment - DONE
- add github actions CI - DONE
- use nodemon with webpack - DONE
- enable review apps for pull requests - DONE
- use iron cache

# To run remote or mock data
- npm run dev 
- npm run dev-mock
