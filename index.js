const express = require('express')
const PORT = process.env.PORT || 5000
const puppeteer = require('puppeteer');

async function parselist(page, type) {
  return await page.evaluate((data) => {

    function findtypelist(foodtype) {
      var titles = document.querySelectorAll(".menu-list__title");

      return Array.from(titles)
        .filter(title => {
          function titlelike(title) {
            return decodeURIComponent(title.replace(" ", "").toUpperCase().trim());
          }
          return titlelike(title.innerHTML).includes(titlelike(foodtype))

        })[0].nextElementSibling.nextElementSibling;
    }
    var typelist = Array.from(findtypelist(data.type).getElementsByTagName("li"));

    return typelist
      .map(item => {
        return {
          title: item.querySelector(".item_title").innerHTML,
          description: item.querySelector(".desc__content").innerHTML,
          price: item.querySelector(".menu-list__item-price").innerHTML
        }
      });
  }, {
    type
  })
};

async function run(type) {
  var browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.goto('https://billundpizza.dk/menu/');
    var list = await parselist(page, type);;
  } catch(err) {
    if (browser) await browser.close();
      throw "parsing failed";
  }
  // should I close the browser???
  await browser.close();
  return list;
};

express()
  .get('/foods', async function get(req, res) {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    try {
      var list = await run(req.query.id)
    } catch (err) {
      res.end(JSON.stringify({err: err}))
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))