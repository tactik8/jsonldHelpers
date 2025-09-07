import { services } from './stateManagerHelpers.services.js'

export class StateManager {
    constructor(){
        this._db = {}
        this._listeners = {}
    }


    get(ref_or_record_types, record_ids){
        return services.get(this._db, ref_or_record_types, record_ids)
    }

    search(filter){
        return services.search(this._db, filter)
    }

    post(record, metadata){
        this._db = services.post(this._db, record, metadata)
    }


    addListener(record_type, record_id, callback){
        this._db = services.eventListener.add(this._db, record_type, record_id, callback)
    }

    removeListener(record_type, record_id, callback){
        this._db = services.eventListener.remove(this._db, record_type, record_id, callback)
    }

    
}