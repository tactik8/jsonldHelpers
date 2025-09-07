
import { services } from './propertyHelpers.services.js'

export class PropertyHelpers {
    constructor(){
        
    }


    // -----------------------------------------------------
    //  Static 
    // -----------------------------------------------------


    /**
     * Gets the properties of an object
     * @param {Object} obj - The object to get the properties of
     * @returns {Array} - The properties of the object
     */
    static get keys(){
        return services.keys
    }

    /**
     * Gets the type of a record
     * @param {Object} record - The record to get the type of
     * @returns {String} - The type of the record
     * @example getRecordType({@type: "Person", name: "John Doe"}) // "Person"
     */
    static get type(){
        return services.type
    }

    static get types(){
        return services.types
    }

    static get record_type(){
        return services.record_type
    }

    static get record_types(){
        return services.record_types
    }

    static get id(){
        return services.id
    }

    static get ids(){
        return services.ids
    }

    static get record_id(){
        return services.record_id
    }

    static get record_ids(){
        return services.record_ids
    }

    static get value(){
        return services.value
    }

    static get values(){
        return services.values
    }

    
   
    
   
    
}




