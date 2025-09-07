
import { services } from './utilHelpers.services.js'

export class UtilHelpers {
    constructor() {
    }



    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    static get uuid(){
        return services.uuid
    }

    static get url(){
        return services.url
    }

    static get date(){
        return services.date
    }
}