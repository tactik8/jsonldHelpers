import { BaseHelpers as h } from "../baseHelpers/baseHelpers.models.js";

export const services = {
    post: postRecord,
    get: getRecord,
    search: searchRecords,
    delete: deleteRecord,
};

/**
 * Posts a record to the database.
 * @param {*} record
 * @param {*} db
 * @returns
 */
function postRecord(record, db) {
    
    let record_types = record["@type"];
    record_types = Array.isArray(record_types) ? record_types : [record_types];

    let record_ids = record["@id"];
    record_ids = Array.isArray(record_ids) ? record_ids : [record_ids];

    // Get db record
    let dbRecord 
    for(let t of record_types){
        for(let i of record_ids){
            dbRecord = db?.[t]?.[i];
            if(dbRecord){
                break;
            }
        }
        if(dbRecord){
            break;
        }
    }

    // If not found, create a new record and add to db for each type/id
    if(!dbRecord){
        dbRecord = _getDbRecord();

        for(let t of record_types){
            for(let i of record_ids){
                db[t] = db[t] || {};
                db[t][i] = dbRecord;
            }
        }    
    }
    

    // Update db record
    dbRecord.value = record;
    dbRecord.dateCreated = dbRecord?.dateCreated || new Date();
    dbRecord.dateModified = new Date();
    dbRecord.dateDeleted = undefined;
    dbRecord.accessCount = dbRecord?.accessCount || 0;
    dbRecord.lastAccessed = new Date();
    dbRecord.accessCount++;

    return db;
    
}

/**
 * Gets a record from the database.
 * @param {*} ref
 * @param {*} db
 * @returns
 */
function getRecord(ref, db) {


    ref = { "@type": ref?.["@type"], "@id": ref?.["@id"]}
    
    let record_types = ref["@type"];
    record_types = Array.isArray(record_types) ? record_types : [record_types];

    let record_ids = ref["@id"];
    record_ids = Array.isArray(record_ids) ? record_ids : [record_ids];

    // Get db record
    let dbRecord
    for(let t of record_types){
        for(let i of record_ids){
            dbRecord = db?.[t]?.[i];
            if(dbRecord){
                break;
            }
        }
        if(dbRecord){
            break;
        }
    }

    // if not found
    if (!dbRecord) {
        return undefined
    }

    // update access stats
    dbRecord.lastAccessed = new Date();
    dbRecord.accessCount++;

    // if deleted, return undefined
    if (dbRecord.dateDeleted) {
        return undefined;
    }

    // return the value
    return dbRecord?.value;
}

/**
 * Searches the database for records that match the filter.
 * @param {*} filter
 * @param {*} db
 * @returns
 */
function searchRecords(filter, db) {
    let records = [];
    for (let record_type in db) {
        for (let record_id in db[record_type]) {
            let record = db[record_type][record_id];
            if (record.dateDeleted) {
                continue;
            }
        }
    }

    records = h.filter(records, filter);

    records = h.dedupe(records)

    return records;
}

/**
 * Deletes a record from the database.
 * @param {*} ref
 * @param {*} db
 * @returns
 */
function deleteRecord(ref, db) {
    
    
    let record_types = ref["@type"];
    record_types = Array.isArray(record_types) ? record_types : [record_types];

    let record_ids = ref["@id"];
    record_ids = Array.isArray(record_ids) ? record_ids : [record_ids];
    

    // Get db record
    let dbRecord
    for(let t of record_types){
        for(let i of record_ids){
            dbRecord = db?.[t]?.[i];
            if(dbRecord){
                break;
            }
        }
        if(dbRecord){
            break;
        }
    }

    if (!dbRecord) {
        return undefined;
    }

    dbRecord.dateDeleted = new Date();

    return;
}

function _getDbRecord() {
    let record = {
        value: undefined,
        dateCreated: undefined,
        dateModified: undefined,
        dateDeleted: undefined,
        lastAccessed: undefined,
        accessCount: 0,
    };

    return record;
}


function _purge(db){

    
}