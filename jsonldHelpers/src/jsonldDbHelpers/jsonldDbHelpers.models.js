
import { services } from './jsonldDbHelpers.services.js';

export class JsonldDb{
    constructor(){
        this._db = {}
    }


    post(obj){
        this._db = services.post(obj, this._db)
    }

    get(ref){
        return services.get(ref, this._db)
    }

    search(filter){
        return services.search(filter, this._db)
    }
    
    delete(ref){
        this._db = services.delete(ref, this._db)
    }
    
}