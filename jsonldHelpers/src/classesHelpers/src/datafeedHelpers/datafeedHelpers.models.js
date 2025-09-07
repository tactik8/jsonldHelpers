
import { services } from './datafeedHelpers.services.js';

export class Datafeed {
    constructor(records){
        this.records = records || []
    }




    // -----------------------------------------------------
    //  static 
    // -----------------------------------------------------


    static get dataCatalog(){
        return services.dataCatalog
    }

    static get datafeed(){
        return services.datafeed
    }

    static get datafeedItem(){
        return services.datafeedItem
    }
    

    static get test(){
        return services.test
    }

}