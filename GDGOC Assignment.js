const http = require('http');

const products = [
  { id: 1, name: 'Air Max 90',    manufacturer: 'Nike',   size: '42', price: 50000 },
  { id: 2, name: 'Ultraboost 22', manufacturer: 'Adidas', size: '43', price: 50000 },
  { id: 3, name: 'Classic Tee',   manufacturer: 'Hanes',  size: 'M',  price: 50000  },
  { id: 4, name: 'Club Hoodie',   manufacturer: 'Nike',   size: 'L',  price: 50000  },
  { id: 5, name: 'Samba Classic', manufacturer: 'Adidas', size: '41', price: 50000 }
];

const server = http.createServer(function (req, res) {

  res.setHeader('Content-Type', 'application/json');

  const fullUrl = req.url;
  const parts = fullUrl.split('?');
  const path = parts[0];

  let queryString = '';
  if (parts.length > 1) {
    queryString = parts[1];
  }

  if (req.method === 'GET' && path === '/api/products') {

    const manufacturer = getQueryValue(queryString, 'manufacturer');
    const size = getQueryValue(queryString, 'size');

    const result = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let keep = true;

      if (manufacturer !== null) {
        if (p.manufacturer.toLowerCase() !== manufacturer.toLowerCase()) {
          keep = false;
        }
      }

      if (size !== null) {
        if (p.size.toLowerCase() !== size.toLowerCase()) {
          keep = false;
        }
      }

      if (keep === true) {
        result.push(p);
      }
    }

    res.end(JSON.stringify(result));
    return;
  }

  if (req.method === 'GET' && path.indexOf('/api/products/') === 0) {

    const idString = path.replace('/api/products/', '');
    const id = Number(idString);

    let found = null;
    for (let j = 0; j < products.length; j++) {
      if (products[j].id === id) {
        found = products[j];
      }
    }

    if (found === null) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Product not found' }));
      return;
    }

    res.end(JSON.stringify(found));
    return;
  }

  if (req.method === 'GET' && path === '/api/categories') {
    const categories = [];
    for (let k = 0; k < products.length; k++) {
      const name = products[k].manufacturer;
      if (categories.indexOf(name) === -1) {
        categories.push(name);
      }
    }
    res.end(JSON.stringify(categories));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

function getQueryValue(queryString, key) {
  const pairs = queryString.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    if (pair[0] === key) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

server.listen(3000, function () {
  console.log('Server running on port 3000');
});