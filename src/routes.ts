const express = require('express')
const PORT = process.env.PORT || 1234
import {writeHead, getList} from "./helpers"
import { cmdlineOptions} from "./processargv";


export default function setRoutes (func) {
 var server = express()
  .get('/foods', async function get(req, res) {
    writeHead(res);
    var list;
    try {
      list = await getList(func, req, cmdlineOptions("https://billundpizza.dk/menu/", "mock-index"))
    } catch (err) {
      list = err
    }
    res.end(JSON.stringify(list));
  })
  .get('/lunch', async function get(req, res) {
    writeHead(res);
    var list;
    try {
      list = await getList(func, req, cmdlineOptions("https://billundpizza.dk/frokost/", "mock-lunch"))
    } catch (err) {
      list = err
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
  server.timeout = 100000;
}
