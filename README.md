# JSONLD_helpers

JS library forjsonld



## Test and publish

```
npm install --save-dev jest

npm install --save-dev babel-jest @babel/core @babel/preset-env
npm install --save-dev jest-environment-jsdom

node --experimental-vm-modules node_modules/.bin/jest

npx parcel build
npm adduser
npm publish

```

please write unit tests for all functions in arrayHelpers.js. Please separate the tests one file by function. Please consider edge cases.





## How to use

```
import { jsonldHelpers as h } from 'https://tactik8.github.io/krakenJsSchema/kraken_schema/kraken_schema.js'

let k = KrakenSchemas.get(record_type)


```

## Running tests
node --experimental-vm-modules node_modules/.bin/jest

## Attributes

- k.properties: list of properties objects
- l.propertiesLight: mvp list of properties object


## Examples

```
let k = KrakenSchemas.get('Person')

let p = k.getProperty('givenName')

p.getLocalizedPropertyID('en-US')) --> 'first name'




```