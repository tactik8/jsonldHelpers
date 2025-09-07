
import { services } from './valueHelpers.services.js'

export class ValueHelpers {
    constructor() {
    }



    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    static clean(value){
        return services.clean(value)
    }

    static get url(){
        return services.url
    }

    static get email(){
        return services.email
    }

    
}