

import { jsonLdHelpers as h } from './src/jsonldHelpers.js'


let t = h.new()

console.log(t)
const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };

console.log(h.value)

const result = h.value.add(obj, 'tags', ['red', 'green', 'blue'], true);



//expect(result.tags).toEqual(['green', 'red', 'blue']);

console.log(JSON.stringify(result, null,4))
