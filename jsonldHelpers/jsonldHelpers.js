

import { objectHelpers} from './src/objectHelpers.js'
import { arrayHelpers} from './src/arrayHelpers.js'
import { valueHelpers} from './src/valueHelpers.js'
import { propertyHelpers} from './src/propertyHelpers.js'
import { itemListHelpers} from './src/itemListHelpers.js'
import { actionHelpers} from './src/actionHelpers.js'

import { Datafeed} from './src/datafeed/datafeed.models.js'

let h = { ...objectHelpers, ...propertyHelpers}
h = { ...h, ...arrayHelpers}
//h.value = valueHelpers
h.itemList = itemListHelpers
h.action = actionHelpers

h.datafeed = Datafeed

export const jsonldHelpers = h