import { HttpClient } from './http-client';
import * as path from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

type httpResult = { data: any, statusCode: number, headers: any };

const http = new HttpClient();
const baseUrl = 'https://swapi.dev/api';
const rootPath = path.join(
  process.cwd(),
  'json'
)

const categories = {
  films: 'films',
  people: 'characters',
  planets: 'planets',
  species: 'species',
  starships: 'starships',
  vehicles: 'vehicles'
} as any;

async function getAllFollowRedirect(url: string, predicate: any = (r: any) => r?.data): Promise<any> {
  let resp;
  try {
    resp = await http.get(url) as httpResult;
  } catch(ex) {
    console.error(ex);
  }
  if (resp && (resp.statusCode >= 300 && resp.statusCode < 399)) {
    return await getAllFollowRedirect(resp.headers.location);
  }
  return Promise.resolve(predicate(resp));
}

async function recurseGetThings(url: string, collector = []): Promise<any[]> {
  const responseAsString = await getAllFollowRedirect(url);
  const response = JSON.parse(responseAsString || {});
  const collected = [ ...collector, ...response.results ];
  if (collected.length < response.count && response.next){
    return await recurseGetThings(response.next, collected as any)
  }
  return Promise.resolve(collected);
}

function fixId(value: string) {
  const needle = `${baseUrl}/`;
  if (~value.indexOf(needle)) {
    const fixedId = value.replace(needle, '');
    const fixedIdAsArray = fixedId.split('');
    if (fixedIdAsArray[fixedIdAsArray.length - 1] === '/') {
      fixedIdAsArray.pop();
      return fixedIdAsArray.join('');
    }
    return fixedId;
  }
  return value;
}

async function getImagesForAllThings(type: string, thingsInCategory: any[]): Promise<void> {
  for (let i = 0; i < thingsInCategory.length; i++) {
    const imgUri = thingsInCategory[i].url.replace(type, categories[type]);
    const imgUrl = `https://starwars-visualguide.com/assets/img/${imgUri}.jpg`;

    let imgResponse;
    try {
      imgResponse = await http.getBinary(imgUrl);
      if (imgResponse && (imgResponse.statusCode >= 200 && imgResponse.statusCode <= 299)) {
        const imgPath = `${path.join(process.cwd(), '../src/assets/img', thingsInCategory[i].url)}.jpg`;
        const dir = path.dirname(imgPath);
        if (!existsSync(dir)) {
          mkdirSync(dir);
        }
        writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'), { encoding: 'binary' });
      } else {
        console.log('DIDNT WRITE: ', type, thingsInCategory[i].url)
      }
    } catch (ex) {
      console.error(ex);
      process.exit(1);
    }

  }
  return;
}



function fixAPIs(collection: any[]) {
  for (let i = 0; i < collection.length; i++) {
    const keys = Object.keys(collection[i]);
    for (let j = 0; j < keys.length; j++) {
      const obj = collection[i];
      const prop = keys[j];
      if (Array.isArray(obj[prop])) {
        obj[prop] = obj[prop].map((str: string | any) => {
          return fixId(str); 
        })
      } else if (typeof obj[prop] === 'string') {
        obj[prop] = fixId(obj[prop]); //.replace(`${baseUrl}/`, '');
      }
    }
  }
  return collection;

}

export async function run() {
  const objectsAsString = await getAllFollowRedirect(baseUrl);
  const objects = JSON.parse(objectsAsString);
  const categories = Object.keys(objects);
  for (let i = 0; i < categories.length; i++) {

    const allThingsInCategory = fixAPIs(await recurseGetThings(objects[categories[i]]));
    await getImagesForAllThings(categories[i], allThingsInCategory);
    const thingPath = path.join(rootPath, `${categories[i]}.json`);
    writeFileSync(thingPath, JSON.stringify(allThingsInCategory, null, 4));
  }
}
