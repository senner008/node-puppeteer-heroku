const express = require('express')
const PORT = process.env.PORT || 5000
var memjs = require('memjs');
var client = memjs.Client.create();


function decode(s) {
    return decodeURIComponent(s.toUpperCase().trim());
  }
  
export default function setRoutes (func) {
 express()
  .get('/foods', async function get(req, res) {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    try {
      var list;
      if (process.env.PORT) {
        list = await client.get('hello');
        list[1] = "retrieved from cache";
      } else {
        list = await func();
      }
      if (!list.value && process.env.PORT) {
          list = await func();
          var expire = 100000;
          await client.set('hello', list, {expires:expire});
          list[1] = "setting cache to expire in " + expire;
      }
      if (req.query.id) {
        list = list[0].foods.filter(f => decode(f.title) == decode(req.query.id));
        if (list.length === 0) throw "invalid query parameter";
      }
   
    } catch (err) {
      res.end(JSON.stringify({ err: err }))
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

}
