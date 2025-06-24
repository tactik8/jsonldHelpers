

import { jsonLdHelpers as h } from './jsonldHelpers/src/jsonldHelpers.js'



let record = {
        "@context": "https://schema.org/",
        "@type": "Thing",
        "@id": "thing1",
        "name": "thing1",
    "other": {
            "@context": "https://schema.org/",
            "@type": "Thing",
            "@id": "thing2",
            "name": "thing2"
        }


    }

let result = h.flatten(record)





console.log(JSON.stringify(result, null,4))
