export function interceptors (page, interceptors : string[]) {
    page.on('request', (req) => {
        if (interceptors.includes(req.resourceType())) {
          req.abort();
        }
        else {
          req.continue();
        }
    });
  }

function decode(s) {
 return decodeURIComponent(s.toUpperCase().trim());
}

export function writeHead (res) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8"
  });
}

export async function getList (func, req) {
  var list = await func()
  if (req.query.id) {
    list = list.filter(f => decode(f.title) == decode(req.query.id));
    if (list.length === 0) throw "invalid query parameter";
  }
  return list;
} 
