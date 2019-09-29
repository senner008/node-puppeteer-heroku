const express = require('express')
const PORT = process.env.PORT || 5000
const puppeteer = require('puppeteer');
const cmdInput = process.argv[2];
const mockfile = process.argv[3];

console.log("--help to show help")
var destination;
if (cmdInput && cmdInput.trim().toUpperCase() == "--HELP") {
  console.log("To mock a file use --mock [html filename]")
  console.log("example with mock-index.html : node index --mock mock-index")
  return;
}
else if (cmdInput && cmdInput.trim().toUpperCase() === "--MOCK") {
  if (!mockfile) {
    throw "missing mock file destination. use --help"
  }
   destination = 'file://' + __dirname + '/' + mockfile.trim() + '.html';
} else {
   destination = "https://billundpizza.dk/menu/"
}

async function parselist(page) {
  return await page.evaluate((data) => {

    var titles = document.querySelectorAll(".menu-list__title");
    var obj = {foods: []};
    Array.from(titles).forEach(title => {
      var lis = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
        .map(li => {
          var findtitle = li.querySelector(".item_title") || li.querySelector(".menu-list__item-title");
          return {
            "title": findtitle.innerHTML,
            "description": li.querySelector(".desc__content").innerHTML,
            "price": li.querySelector(".menu-list__item-price").innerHTML
          }
        });
      obj.foods.push({title : title.innerHTML, content : lis});
    });
    return [obj];
  })
};

async function run() {
  var browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      }
      else {
          req.continue();
      }
    });
    // var contentHtml = fs.readFileSync('file://C:/_gits2/node-puppeteer-heroku/index.html', 'utf8');
    // await page.setContent(contentHtml);  

   await page.goto(destination);

    var list = await parselist(page);;

  } catch (err) {
    if (browser) await browser.close();
    throw "parsing failed";
  }
  // should I close the browser???
  await browser.close();
  return list;
};

function decode (s) {
  return decodeURIComponent(s.toUpperCase().trim());
}


express()
  .get('/foods', async function get(req, res) {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    try {
      var list = await run()
      if (req.query.id) {
        list = list[0].foods.filter(f => decode(f.title) == decode(req.query.id));
        if (list.length === 0) throw "invalid query parameter";
      }
    } catch (err) {
      res.end(JSON.stringify({err: err}))
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))