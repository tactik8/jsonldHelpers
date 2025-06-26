# jsonldHelpers

JS library forjsonld

## Location

### Source code
https://github.com/tactik8/jsonldHelpers

### repl.it
https://replit.com/@tactik8/JSONLDHelpers


## Install

### From github
```
git clone https://github.com/tactik8/jsonldHelpers ./helpers
```

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

git clone https://github.com/tactik8/jsonldHelpers ./helpers




## How to use

```
import { jsonldHelpers as h } from 'https://tactik8.github.io/krakenJsSchema/kraken_schema/kraken_schema.js'

let record = {
	"@context": "https://schema.org/",
	"@type": "Thing",
	"@id": "thing1",
	"name": "thing1"
}


let k = h.value.get(record, '@type')


```

## Examples

```
let k = KrakenSchemas.get('Person')

let p = k.getProperty('givenName')

p.getLocalizedPropertyID('en-US')) --> 'first name'




```

## Tests

Prompt:
```
please write jest unit tests for all functions in @arrayHelpers.js. The tests records used should be jsonld records (nested) using schema.org. Please separate the tests one directory by file and one file by function. Please consider edge cases (invalid, null, wrong type, etc.).
```


## Running tests
node --experimental-vm-modules node_modules/.bin/jest

