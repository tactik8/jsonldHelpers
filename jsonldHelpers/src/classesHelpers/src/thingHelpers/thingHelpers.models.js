

import { services} from './thingHelpers.services.js'

export class Thing {
    constructor(record){
        this._record = record
    }


    toString(){
        return JSON.stringify(this.record, null, 4)
    }
    
    toJSON(){
        record = this.record
    }


    // -----------------------------------------------------
    //  Properties 
    // -----------------------------------------------------

    get record(){
        return this._record
    }
    
    set record(value){
        this._record = value
    }

    get record_type(){
        return services.record_type.get(this.record)
    }

    set record_type(value){
        this.record = services.record_type.set(this.record, value)
    }

    get record_id(){
        return services.record_id.get(this.record)
    }

    set record_id(value){
        this.record = services.record_id.set(this.record, value)
    }

    get ref(){
        return services.ref.get(this.record)
    }

    set ref(value){
        this.record = services.ref.set(this.record, value)
    }

    get name(){
        return ph.value.get(this.record, 'name')
    }

    set name(value){
        this.record = ph.value.set(this.record, 'name', value)
    }

    get description(){
        return ph.value.get(this.record, 'description')
    }

    set description(value){
        this.record = ph.value.set(this.record, 'description', value)
    }

    get url(){
        return ph.value.get(this.record, 'url')
    }

    set url(value){
        this.record = ph.value.set(this.record, 'url', value)
    }


    // -----------------------------------------------------
    //  Methods 
    // -----------------------------------------------------

    

    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    


    
}