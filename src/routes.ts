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

    try {
      var memcachier : string = "local";
      var list;
      if (process.env.PORT) {
        list = await client.get('hello');
        memcachier = "retrieved from cache";
      } else {
        list = await func();
      }
      if ((!Array.isArray(list)) && process.env.PORT) {
          list = await func();
          var expire = 100000;
          await client.set('hello', list, {expires:expire});
          memcachier = "setting cache to expire in " + expire;
      }
      if (req.query.id) {
        list = list[0].foods.filter(f => decode(f.title) == decode(req.query.id));
        if (list.length === 0) throw "invalid query parameter";
      }
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Memcachier" : memcachier
      });
   
    } catch (err) {
      res.end(JSON.stringify({ err: err }))
    }
    res.end(JSON.stringify(list));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

}
