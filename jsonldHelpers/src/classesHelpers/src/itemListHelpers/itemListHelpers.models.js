
import { services } from './itemListHelpers.services.js'

import { BaseHelpers as h } from '../../baseHelpers/baseHelpers.models.js'

export class ItemList {
    constructor(record) {

        this._record = {}

        
        this.record = record
        this.record_type = 'ItemList'
        this.record_id = this.record_id || ''
    
    }

    get itemListElement(){
        return services.itemListElement.get(this.record)
    }

    set itemListElement(value){
        this.record.itemListElement = value
    }

    get(index){
        return services.itemListElement.get(this.record, index)
    }

    filter(params){
        return services.itemListElement.filter(this.record, params)
    }
    
    insert(item, index){
        this.record = services.itemListElement.insert(this.record, index, item)
    }

    delete(index){
        this.record = services.itemListElement.delete(this.record, index)
    }

    prepend(item){
        this.record = services.itemListElement.prepend(this.record, item)
    }

    append(item){
        this.record = services.itemListElement.append(this.record, item)
    }

    get length(){
        return services.length(this.record)
    }

    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    static get itemList(){
        return services.itemList
    }
}

