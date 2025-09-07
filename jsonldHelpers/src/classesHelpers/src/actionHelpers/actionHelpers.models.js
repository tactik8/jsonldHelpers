

import { services } from './actionHelpers.services.js'

// -----------------------------------------------------
//  Class objects 
// -----------------------------------------------------



export class Action {
    constructor(record){

        if(isValid(record)){
            this.record = record
        } else {
            this.record = services.newAction()
            this.record["name"] = record
        }
    }

    get record_type(){
        return this.record?.["@type"]
    }
    set record_type(record_type){
        this.record["@type"] = record_type
    }
    get record_id(){
        return this.record?.["@id"]
    }
    set record_id(record_id){
        this.record["@id"] = record_id
    }
    get name(){
        return this.record?.["name"]
    }
    set name(name){
        this.record["name"] = name
    }
    get actionStatus(){
        return this.record?.["actionStatus"]
    }
    set actionStatus(actionStatus){
        this.record["actionStatus"] = actionStatus
    }
    get startTime(){
        return this.record?.["startTime"]
    }
    set startTime(startTime){
        this.record["startTime"] = startTime
    }
    get endTime(){
        return this.record?.["endTime"]
    }
    set endTime(endTime){
        this.record["endTime"] = endTime
    }
    get object(){
        return this.record?.["object"]
    }
    set object(object){
        this.record["object"] = object
    }
    get result(){
        return this.record?.["result"]
    }
    set result(result){
        this.record["result"] = result
    }
    get instrument(){
        return this.record?.["instrument"]
    }
    set instrument(instrument){
        this.record["instrument"] = instrument
    }
    get url(){
        return this.record?.["url"]
    }
    set url(url){
        this.record["url"] = url
    }
    get error(){
        return this.record?.["error"]
    }
    set error(error){
        this.record["error"] = error
    }
    get duration(){
        return getDuration(this.record)
    }
    set duration(duration){
        this.record["duration"] = duration
    }
    get human(){
        return toHuman(this.record)
    }

    setPotential(){
        this.record = setPotential(this.record)
    }
    setActive(){
        this.record = setActive(this.record)
    }
    setCompleted(){
        this.record = setCompleted(this.record)
    }
    setFailed(error){
        this.record = setFailed(this.record, error)
    }
    toString(){
        return toString(this.record)
    }
    toHuman(){
        return toHuman(this.record)
    }
    isValid(){
        return isValid(this.record)
    }
    isPotential(){
        return isPotential(this.record)
    }
    isActive(){
        return isActive(this.record)
    }
    isCompleted(){
        return isCompleted(this.record)
    }
    isFailed(){
        return isFailed(this.record)
    }


    // -----------------------------------------------------
    //  Static 
    // -----------------------------------------------------
    
    

    
}


class Actions {
    constructor(actions){
        this.actions = []
        if(actions){
            this.add(actions)
        }
    }

    get records(){
        let records = this.actions.map(x => x.record)
        return records
    }

    add(action){

        if(action === undefined){
            return
        }
        if(Array.isArray(action)){
            return action.map(x => this.add(x))
        }
        if(!(action instanceof Action )){
            action = new Action(action)
        }
        this.actions.push(action)
    }
    get(ref_or_record_type, record_id){
        if(Array.isArray(ref_or_record_type)){
            return ref_or_record_type.map(x => this.get(x))
        }
        let ref = objectHelpers.ref.get(ref_or_record_type, record_id)
        let results = arrayHelpers.filter(this.records, ref)
        return results?.[0] || undefined
    }
    getPotential(){
        return new Actions(this.actions.map(x => x.isPotential()))
    }
    getActive(){
        return new Actions(this.actions.map(x => x.isActive()))
    }
    getCompleted(){
        return new Actions(this.actions.map(x => x.isCompleted()))
    }
    getFailed(){
        return new Actions(this.actions.map(x => x.isFailed()))
    }
    toString(){
        return toString(this.records)
    }
    toHuman(){
        return toHuman(this.records)
    }
    filter(filterParams, negativeFilterParams){
        let filteredRefs = arrayHelpers.filter(this.records, filterParams, negativeFilterParams)
        let filteredActions = this.get(filteredRefs)
        return new Actions(filteredActions)
    }
}

