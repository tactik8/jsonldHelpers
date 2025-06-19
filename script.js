

import { jsonLdHelpers as h } from './src/jsonldHelpers.js'


let t = h.new()

console.log(t)


const obj1 = { '@type': 'Person', '@id': '123', name: null, age: undefined };
const obj2 = { '@type': 'Person', '@id': '123' };
const result = h.diff(obj1, obj2);

console.log(JSON.stringify(result, null,4))
