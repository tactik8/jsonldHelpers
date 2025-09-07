
import { services } from './observationStats.services.js'

export class ObservationStats {
    constructor(observations){
        this.observations = observations
    }


    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------


    static get(observations){
        return services.get(observations)
    }
    
}