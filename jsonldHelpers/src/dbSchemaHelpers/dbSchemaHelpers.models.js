
import { services} from './dbSchemaHelpers.services.js'

export class DbSchema{
    constructor(){
        
    }

    // -----------------------------------------------------
    //  Static 
    // -----------------------------------------------------


    static toRecord(observations){
        return services.toRecord(observations)
    }

    static toObservations(records){
        return services.toObservation(records)
    }

    
    
}