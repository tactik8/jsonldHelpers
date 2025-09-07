
/**
 * @module stateManagerHelpers/services
 * @description Provides services for stateManagerHelpers.
 */

import { BaseHelpers as h} from '../baseHelpers/baseHelpers.models.js'

export const services = {

    get: getRecord,
    post: postRecord,
    search: searchRecords,
    eventListener: {
        add: addEventListener,
        get: getEventListeners,
        remove: removeEventListener,
        send: sendEvent
    }
}



// -----------------------------------------------------
//  Record 
// -----------------------------------------------------

function getRecord(db, ref_or_record_types, record_ids){

    let o = h.ObservationHelpers

    let observations = _getObservations(db, ref_or_record_types, record_ids)

    let record = o.toRecord(observations)

    // While childrens not done yet
    let records = []
    let missingRecords = [record]

    while(missingRecords.length > 0){

        let newRecords = []
        for(let m of missingRecords){
            let obs = _getObservations(db, m)
            let r = o.toRecord(obs)
            records.push(r) 
            newRecords.push(r)
        }

        missingRecords = []

        for(let r of newRecords){
            let children = h.children.get(r)
            missingRecords = missingRecords.concat(children)
        }

        missingRecords = h.dedupe(missingRecords)
        missingRecords = h.diff(missingRecords, records)

    }

    record = h.unFlatten(record, records)

    return record

}


function searchRecords(db){

    let refs = []
    for(let k of Object.keys(db)){
        for(let i of Object.keys(db[k])){
            let ref ={
                "@type": k,
                "@id": i
            }
            refs.push(ref)
        }
    }
    return refs
}

function postRecord(db, record, metadata){

    let o = h.ObservationHelpers
    
    if(Array.isArray(record)){
        for(let r of record){
            db = postRecord(db, r, metadata)
        }
        return db
    }

    
    let records = h.flatten(record)

    for(let r of records){


        // Get old record from db 
        let oldObs = _getObservations(db, r)
        let oldRecord = o.toRecord(oldObs)
        
        // Post new observations
        let observations = o.toObservations(r, metadata)
        db = _postObservations(db, observations)


        // Get new record from db
        let newObs = _getObservations(db, r)
        let newRecord = o.toRecord(newObs)
        
        // Check for change, send event if changed
        if(oldRecord == {}){
            let event = {
                "@type": "CreateAction",
                "@id": h.uuid.get(),
                "object": newRecord
            }
            db = sendEvent(db, r, undefined, event)
        } else if (h.eq(oldRecord, r) === false){
            let event = {
                "@type": "UpdateAction",
                "@id": h.uuid.get(),
                "object": newRecord
            }
            db = sendEvent(db, r, undefined, event)
        }
        
           
    }


    

    return db
}


// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------



function _postObservations(db, observations){

    let o = h.ObservationHelpers
    
    observations = h.toArray(observations)


    for(let o of observations){

        let record_types = h.toArray(o?.targetCollection?.["@type"])
        let record_ids =  h.toArray(o?.targetCollection?.["@id"])

        if(record_types.length === 0 || record_ids.length === 0){
            continue
        }


        for(let t of record_types){

            for(let i of record_ids){

                db[t] = db?.[t] || {}
                db[t][i] = db[t]?.[i] || {"@type": t, "@id": i }

                db[t][i].observations = db[t][i]?.observations || []
                db[t][i].observations.push(o)     
                db[t][i].observations = h.dedupe(db[t][i].observations)
            }
        }
    }
    return db
}

function _getObservations(db, ref_or_record_types, record_ids){

    let o = h.ObservationHelpers

    
    let record_types = h.toArray(ref_or_record_types?.["@type"] || ref_or_record_types)
    record_ids = h.toArray(ref_or_record_types?.["@id"] || record_ids)

    let observations = []
    for(let t of record_types){
        for(let i of record_ids){
            let record = db?.[t]?.[i]
            if(record){
                observations = observations.concat(record.observations || [])
            }
        }
    }

    // dedupe
    observations = h.dedupe(observations)

    return observations

}



// -----------------------------------------------------
//  eventListener 
// -----------------------------------------------------

function addEventListener(db, ref_or_record_types, record_ids, eventListener){

    let record_types = h.toArray(ref_or_record_types?.['@type'] || ref_or_record_types)
    record_ids =  h.toArray(ref_or_record_types?.["@id"] || record_ids)

    if(record_types.length === 0 || record_ids.length === 0){
        return
    }


    for(let t of record_types){

        for(let i of record_ids){

            db[t] = db?.[t] || {}
            db[t][i] = db[t]?.[i] || {"@type": t, "@id": i }

            db[t][i].eventListeners = db[t][i]?.eventListeners || []
            db[t][i].eventListeners.push(eventListener)      
        }
    }

    return
}

function removeEventListener(db, ref_or_record_types, record_ids, eventListener){

    let record_types = h.toArray(ref_or_record_types?.['@type'] || ref_or_record_types)
     record_ids =  h.toArray(ref_or_record_types?.["@id"] || record_ids)

    if(record_types.length === 0 || record_ids.length === 0){
        return
    }

    for(let t of record_types){

        for(let i of record_ids){

            if(!db?.[t]?.[i]?.eventListeners){
                continue
            }

            db[t][i].eventListeners = db[t][i].eventListeners.filter(x => x !== eventListener)
            
        }
    }
    return db
    
}

function getEventListeners(db, ref_or_record_types, record_ids){

    let record_types = h.toArray(ref_or_record_types?.['@type'] || ref_or_record_types)
     record_ids =  h.toArray(ref_or_record_types?.["@id"] || record_ids)

    if(record_types.length === 0 || record_ids.length === 0){
        return
    }


    let listeners = []
    for(let t of record_types){

        for(let i of record_ids){

        
            listeners = listeners.concat(db?.[t]?.[i]?.eventListeners || [])
        }
    }

    return listeners
}


function sendEvent(db, ref_or_record_types, record_ids, event){

    let listeners = getEventListeners(db, ref_or_record_types, record_ids)

    console.log('event', event)
    
    for(let l of listeners){

        try {
            l(event)
        } catch(err){
            db = removeEventListener(db, ref_or_record_types, record_ids,)
        }
    }

    return db
}