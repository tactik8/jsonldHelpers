

import { objectHelpers} from './src/objectHelpers.js'
import { arrayHelpers} from './src/arrayHelpers.js'
import { valueHelpers} from './src/valueHelpers.js'
import { propertyHelpers} from './src/propertyHelpers.js'
import { itemListHelpers} from './src/itemListHelpers.js'


let h = { ...objectHelpers, ...propertyHelpers}
h.array = arrayHelpers
//h.value = valueHelpers
h.itemList = itemListHelpers



export const jsonLdHelpers = h