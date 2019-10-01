const express = require('express')
const PORT = process.env.PORT || 5000
import {writeHead, getList} from "./helpers"

export default function setRoutes (func) {
 var server = express()
  .get('/foods', async function get(req, res) {
    writeHead(res);
    var list;
    try {
      list = await getList(func, req)
    } catch (err) {
      list = err
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
  server.timeout = 100000;
}
