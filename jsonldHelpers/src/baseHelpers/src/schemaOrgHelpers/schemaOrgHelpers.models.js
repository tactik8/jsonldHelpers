

import { services} from './schemaOrgHelpers.services.js'

export class SchemaOrgHelpers {
    constructor() {
        
    }



    // -----------------------------------------------------
    //  static 
    // -----------------------------------------------------

    static get record_id(){
        return services.record_id
    }


    static get flatten(){
        return services.flatten
    }

    static get parentChild(){
        return services.parentChild
    }
    
    static isUtilityClass(record){
        return services.isUtilityClass(record)
    }
    
}


