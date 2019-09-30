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
      client.get('hello', async function(err, val, flags) {
        if (val) list = val;
        else {
            list = await func();
            client.set('hello', list, {expires:6000000});
        }
        }); 
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
