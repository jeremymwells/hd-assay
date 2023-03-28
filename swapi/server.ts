const express = require("express");
const app = express();
const port = 3000;

const types = {
  films: 'films/',
  people: 'people/',
  planets: 'planets/',
  species: 'species/',
  starships: 'starships/',
  vehicles: 'vehicles/'
}

const fileFor = (type: string) => {
  return `./json/${type}.json`
}

const matchesQuery = (collection: any[], query: any = {}) => {
  delete query._;
  return collection.filter((item) => {
    const keys = Object.keys(query);
    if (!keys.length) {
      return true;
    }
    for (let i = 0; i < keys.length; i++) {
      if (
        item[keys[i]] === query[keys[i]] ||
        item[keys[i]].toString() === query[keys[i]].toString()
      ){
        return true;
      }
    }
    return false;
  })
}


app.get("/", function (req: any, res: any) {
  let categories = Object.keys(types).map((k: string) => ({ name: k, url: (types as any)[k]}));
  res.send(JSON.stringify(categories, null, 4));
});

app.get("/:thing/", function (req: any, res: any) {
  const things = require(fileFor(req.params.thing));
  const result = matchesQuery(things, req.query);
  res.send(JSON.stringify(result, null, 4));
});

app.get("/:thing/:thingId", function (req: any, res: any) {
  const thing = require(fileFor(req.params.thing)).filter((x: any) => `/${x.url.toLowerCase()}` === req.path)[0] || {};
  res.send(JSON.stringify(thing, null, 4));
});

app.listen(port, function () {
  console.log(`SWAPI backend running on port ${port}!`);
});