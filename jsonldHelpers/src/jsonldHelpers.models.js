

import { ActionHelpers } from './actionHelpers/actionHelpers.models.js'
import { DatafeedHelpers } from './datafeedHelpers/datafeedHelpers.models.js'

import { ItemListHelpers} from './itemListHelpers/itemListHelpers.models.js'

import { ObjectHelpers} from './objectHelpers/objectHelpers.models.js'
import { PropertyHelpers} from './propertyHelpers/propertyHelpers.models.js'
import { ObservationHelpers } from './observationHelpers/observationHelpers.models.js'
import { UtilHelpers } from './utilHelpers/utilHelpers.models.js'


export class JsonldHelpers {
    constructor() {
    
    }



    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    static get record_type(){
        return PropertyHelpers.type
    }

    static get record_id(){
        return PropertyHelpers.id
    }

    static get ref(){
        return PropertyHelpers.ref
    }

    static get list()
    
}