/**
 * @fileoverview This file contains the arrayHelpers services.
 * @module arrayHelpers
 * @description This file contains the arrayHelpers services.
 * 
 */


import { ObjectHelpers as h} from '../objectHelpers/objectHelpers.models.js'

export const services = {
    isArray: isArray,
    toArray: toArray,
    get: getRecord,
    set: setRecord,
    replace: setRecord,
    delete: deleteRecord,
    add: addRecord,
    filter: filter,
    sort: sortRecords,
    getUniqueRefs: getUniqueRefs,
    deduplicate: deduplicate,
    diff: diffLists,
    concat: concat,
    contains: contains
}


/**
 * Checks if a value is an array
 * @param {*} value - The value to check
 * @returns {Boolean} - True if the value is an array, false otherwise
 * @description Checks if a value is an array. Returns false if the value is a string.
 */
function isArray(value){
    return Array.isArray(value) && typeof value != "string"
}

/**
 * Converts a value to an array
 * @param {*} value - The value to convert
 * @returns {Array} - The value as an array
 * @description Converts a value to an array. If the value is already an array, returns the value. If the value is a string, returns an array with the string as the only element. If the value is undefined, returns an empty array
 */
function toArray(value){
    if(isArray(value)){
        return value
    }

    value = [value]
    value = value.filter(x => x !== undefined)
    return value
}



/**
 * Gets a record from a list of records
 * @param {Object} ref - The reference object
 * @param {Array} records - The list of records
 * @returns {Object} - The record that matches the reference object
 * 
 */
function getRecord(ref, records, processNested = true) {


    if (h.isValid(ref) === false) {
        return undefined
    }

    // Ensure records is array
    records = Array.isArray(records) ? records : [records]

    // Search for record
    let record = undefined
    for (let r of records) {
        if (h.isSame(r, ref) === true) {
            record = r
        }
    }

    // Process nested (replace refs with child records)
    if(record && processNested === true){
        record = h.unFlatten(record, records)
    }

    // Return
    return record
}

/**
 * Deletes a record from a list of records
 * @param {Object} ref - The reference object
 * @param {Array} records - The list of records
 * @returns {Array} - The list of records with the record deleted
 */
function deleteRecord(ref, records, processNested=false) {



    // Deal with array
    if(Array.isArray(ref)){
        for(let r of ref){
            records = deleteRecord(r, records, processNested)
        }
        return records
    }

    // Deal with non-object
    if (h.isValid(ref) === false) {
        return records
    }

    // Ensure records is array
    records = Array.isArray(records) ? records : [records]


    // Process nested
    if(processNested === true){
        let flatRecords = h.flatten(ref)
        flatRecords = flatRecords.filter(x => !h.isNull(x))        
        flatRecords.map(x => records = deleteRecord(h.ref.get(x), records, false))
        return records
    }

    // Copy records
    let newRecords = records.map(x => x)
    records = newRecords

    // Filter records
    let results = records.filter(x => !h.isSame(x, ref))

    // Return
    return results


}


/**
 * Sets a record in a list of records
 * @param {Object} record - The record to set
 * @param {Array} records - The list of records
 * @returns {Array} - The list of records with the record set
 */
function setRecord(record, records, processNested = true){


    // Deal with array
    if(Array.isArray(record)){
        for(let r of record){
            records = setRecord(r, records)
        }
        return records
    }

    // Deal with non-object
    if (h.isValid(record) === false){
        return records
    }

    // Process nested
    if(processNested === true){
        let flattenedRecords = h.flatten(record)
        flattenedRecords = flattenedRecords.filter(x => !h.isNull(x))        
        flattenedRecords.map(x => records = setRecord(x, records, false))
        return records
    }

    // Process main record
    records = deleteRecord(record, records)
    records = addRecord(record, records)

    // Return
    return records

}

/**
 * Adds a record to a list of records
 * @param {Object} record - The record to add
 * @param {Array} records - The list of records
 * @param {Boolean} mergeIfExist - If true, merges the record if it already exists
 * @returns {Array} - The list of records with the new record added
 * 
 */
function addRecord(record, records, mergeIfExist = true, processNested = true) {


    if (h.isValid(record) === false) {
        return records
    }

    records = Array.isArray(records) ? records : [records]

    // Copy records
    let newRecords = records.map(x => x)
    records = newRecords


    // Process nested
    if(processNested === true){
        let flatRecords = h.flatten(record)
        flatRecords = flatRecords.filter(x => !h.isNull(x))            
        flatRecords.map(x => records = addRecord(x, records, mergeIfExist, false))
        return records
    }


    // Process main record

    // Check if record already exists
    let existingRecord = getRecord(record, records)
    if (existingRecord !== undefined) {

        // Delete if exist
        records = deleteRecord(record, records)

        // Merge if exist
        if (mergeIfExist === true) {
            record = h.merge(record, existingRecord)
        }
    }

    records.push(record)

    return records

}

/**
 * Filters a list of records
 * @param {Array} records - The list of records
 * @param {Object} filterParams - The filter parameters
 * @returns {Array} - The filtered list of records
 * 
 */
function filter(records, filterParams, negativeFilterParams, strict = false) {


    records = Array.isArray(records) ? records : [records]

    let filteredRecords = records.filter(x =>
        h.test(x, filterParams, negativeFilterParams, strict) === true
    )

    return filteredRecords

}


/**
 * Checks if an array includes a value
 * @param {Array} array - The array to check
 * @param {Object} value - The value to check for
 * @returns {Boolean} - True if the array includes the value, false otherwise
 * 
 */
function contains(array, value){

    // Inverse values if user made error
    if(!Array.isArray(array) && Array.isArray(value)){
        [array, value] = [value, array]
    }
    
    return array.some(x => h.isSame(x, value))
}


/**
 * Sorts a list of records
 * @param {Array} records - The list of records
 * @returns {Array} - The sorted list of records
 * 
 */
function sortRecords(records, reverse = false) {


    records = Array.isArray(records) ? records : [records]
    let sortedRecords = []

    if (reverse === true) {
        sortedRecords = records.toSorted((a, b) => h.gt(a, b))
    } else {
        sortedRecords = records.toSorted((a, b) => h.lt(a, b))
    }

    return sortedRecords

}


/**
 * Gets unique references from a list of records
 * @param {Array} records - The list of records
 * @returns {Array} - The list of unique references
 * 
 */
function getUniqueRefs(records) {

    records = Array.isArray(records) ? records : [records]
    records = records.filter(x => h.isValid(x))

    let uniqueRefs = []
    for (let record of records) {
        let ref = h.ref.get(record)
        if (getRecord(ref, uniqueRefs) === undefined) {
            uniqueRefs.push(ref)
        }
    }
    return uniqueRefs

}

/**
 * Deduplicates a list of records
 * @param {Array} records - The list of records
 * @returns {Array} - The deduplicated list of records
 * @example deduplicate([{name: "John Doe", age: 30}, {name: "John Doe", age: 30}]) // [{name: "John Doe", age: 30}]
 */
function deduplicate(records) {
    

    records = Array.isArray(records) ? records : [records]
    let deduplicatedRecords = []

    if(records.length === 0){
        return records
    }

    // Deduplicate non-JSONLD objects
    let nonJsonRecords = records.filter(x => h.isValid(x) === false)
    nonJsonRecords = nonJsonRecords.filter(x => x !== undefined && x !== null)
    for (let r of nonJsonRecords) {
        if (deduplicatedRecords.includes(r) === false) {
            deduplicatedRecords.push(r)
        }
    }


    // Deduplicate JSONLD objects
    let jsonRecords = records.filter(x => h.isValid(x))
    let uniqueRefs = getUniqueRefs(jsonRecords)

    for (let ref of uniqueRefs) {
        let duplicates = filter(jsonRecords, ref, undefined)

        if (duplicates > 1) {
            let newRecord = h.merge(duplicates)
            deduplicatedRecords.push(newRecord)
        } else {
            deduplicatedRecords.push(duplicates[0])
        }
    }


    return deduplicatedRecords
}

// -----------------------------------------------------
//  Multiple lists operations:
//  diffLists,
//  mergeLists
//
// -----------------------------------------------------

/**
 * Returns values in records1 not present in records2
 * @param {Array} records1 - The first list of records
 * @param {Array} records2 - The second list of records
 * @returns {Array} - The difference between the two lists of records
 * @example diffrecords([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}], [{name: "John Doe", age: 30}]) // [{name:
 * "Jane Doe", age: 25}]
 * 
 */
function diffLists(records1, records2) {
   

    records1 = Array.isArray(records1) ? records1 : [records1]
    records2 = Array.isArray(records2) ? records2 : [records2]

    let diffRecords = []
    for (let record1 of records1) {
        if (getRecord(record1, records2) === undefined) {
            diffRecords.push(record1)
        }
    }

    diffRecords = diffRecords.filter(x => x !== undefined && x !== null)
    return diffRecords

}

/**
 * Merges two lists of records
 * @param {Array} records1 - The first list of records
 * @param {Array} records2 - The second list of records
 * @returns {Array} - The merged list of records
 * @example mergeRecords([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}], [{name: "John Doe", age: 30}]) // [{name:
 * "John Doe", age: 30}, {name: "Jane Doe", age: 25}]
 * */
function concat(records1, records2, mergeIfExist = false) {
    
    records1 = Array.isArray(records1) ? records1 : [records1]
    records2 = Array.isArray(records2) ? records2 : [records2]

    let mergedRecords = []

    for (let record2 of records2) {
        mergedRecords = addRecord(record2, mergedRecords, mergeIfExist)
    }


    for (let record1 of records1) {
        mergedRecords = addRecord(record1, mergedRecords, mergeIfExist)
    }


    return mergedRecords

}