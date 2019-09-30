const puppeteer = require('puppeteer');
import extractList from "./puppeteer-evaluate"
import { cmdlineOptions} from "./processargv";
import setRoutes from "./routes";

async function run() {
  var browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
        req.abort();
      }
      else {
        req.continue();
      }
    });

    await page.goto(destination);

    var list = await extractList(page);;

  } catch (err) {
    if (browser) await browser.close();
    throw "parsing failed";
  }
  // should I close the browser???
  await browser.close();
  return list;
};

const destination = cmdlineOptions();

setRoutes(run);