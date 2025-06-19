

import { jsonLdHelpers as h } from './src/jsonldHelpers.js'


let t = h.new()

console.log(t)
const existingRecords = [
    { '@type': 'Person', '@id': '123', name: 'John' },
    { '@type': 'Person', '@id': '456', name: 'Jane' }
];
const duplicateRecord = { '@type': 'Person', '@id': '123', name: 'John Updated' };
const result = h.array.add(duplicateRecord, existingRecords);




console.log(JSON.stringify(result, null,4))
