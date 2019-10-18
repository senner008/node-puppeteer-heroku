const puppeteer = require('puppeteer');
import {extractList, Selectors} from "./puppeteer-evaluate"
import setRoutes from "./routes";
import {interceptors} from "./helpers"

var selectors = new Selectors(".menu-list__title", ".item_title", ".menu-list__item-title", ".desc__content", ".menu-list__item-price");

async function run(destination) {
  var browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    interceptors(page, ["stylesheet","font","image"]);
    await page.goto(destination);
    page.on('console', msg => console.log(msg.text()));
    var list = await extractList(page, selectors);
  } catch (err) {
    console.log(err)
    throw "parsing failed";
  } finally {
    console.log("finally")
    await browser.close();
  }
  return list;
};

setRoutes(run);