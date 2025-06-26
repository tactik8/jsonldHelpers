
import { objectHelpers as h} from './objectHelpers.js'

export const arrayHelpers = {
    get: getRecord,
    set: setRecord,
    delete: deleteRecord,
    add: addRecord,
    filter: filter,
    sort: sortRecords,
    getUniqueRefs: getUniqueRefs,
    deduplicate: deduplicate,
    diff: diffLists,
    merge: mergeLists,
    contains: contains
}



// -----------------------------------------------------
//  List CRUD :
//  getRecord,  
//. deleteRecord,  
//. addRecord,  
//. filter,  
//. sortRecords,  
//. getUniqueRefs,  
//. deduplicate,  
//. diffLists,  
//. mergeLists
// -----------------------------------------------------


function getRecord(ref, records, processNested = true) {
    /**
     * Gets a record from a list of records
     * @param {Object} ref - The reference object
     * @param {Array} records - The list of records
     * @returns {Object} - The record that matches the reference object
     * @example getRecord({@id: "John Doe"}, [{@id: "John Doe", name: "John Doe"}]) // {name: "John Doe", "@id": "John Doe"}
     * 
     */

    if (h.isValid(ref) === false) {
        return undefined
    }

    // Ensure records is array
    records = Array.isArray(records) ? records : [records]

    // Search for record
    let record = undefined
    for (let r of records) {
        if (h.isSame(record, ref) === true) {
            record = r
        }
    }

    // Process nested (replace refs with child records)
    if(r && processNested === true){
        record = h.unFlatten(record, records)
    }

    // Return
    return record
}

function deleteRecord(ref, records, processNested=false) {
    /**
     * Deletes a record from a list of records
     * @param {Object} ref - The reference object
     * @param {Array} records - The list of records
     * @returns {Array} - The list of records with the record deleted
     * @example deleteRecord({@id: "John Doe"}, [{@id: "John Doe", name: "John Doe"}]) // []
     * 
     */


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

    // Ensure reocrds is array
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


function setRecord(record, records, processNested = true){
    /**
     * Sets a record in a list of records
     * @param {Object} record - The record to set
     * @param {Array} records - The list of records
     * @returns {Array} - The list of records with the record set
     * 
     */

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


function addRecord(record, records, mergeIfExist = true, processNested = true) {
    /**
     * Adds a record to a list of records
     * @param {Object} record - The record to add
     * @param {Array} records - The list of records
     * @param {Boolean} mergeIfExist - If true, merges the record if it already exists
     * @returns {Array} - The list of records with the new record added
     */

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


function filter(records, filterParams, negativeFilterParams, strict = false) {
    /**
     * Filters a list of records
     * @param {Array} records - The list of records
     * @param {Object} filterParams - The filter parameters
     * @returns {Array} - The filtered list of records
     * @example filter([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}], {age: 30}) // [{name: "John Doe", age: 30
     * }]
     */

    records = Array.isArray(records) ? records : [records]

    let filteredRecords = records.filter(x =>
        h.test(x, filterParams, negativeFilterParams, strict) === true
    )

    return filteredRecords

}


function contains(array, value){
    /**
     * Checks if an array includes a value
     * @param {Array} array - The array to check
     * @param {Object} value - The value to check for
     * @returns {Boolean} - True if the array includes the value, false otherwise
     */
    return array.some(x => h.isSame(x, value))
}


function sortRecords(records, reverse = false) {
    /**
     * Sorts a list of records
     * @param {Array} records - The list of records
     * @returns {Array} - The sorted list of records
     * @example sortRecords([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}]) // [{name: "Jane Doe", age: 25}, {name: "John
     * 
     */

    records = Array.isArray(records) ? records : [records]
    let sortedRecords = []

    if (reverse === true) {
        sortedRecords = records.toSorted((a, b) => h.gt(a, b))
    } else {
        sortedRecords = records.toSorted((a, b) => h.lt(a, b))
    }

    return sortedRecords

}



function getUniqueRefs(records) {
    /**
     * Gets unique references from a list of records
     * @param {Array} records - The list of records
     * @returns {Array} - The list of unique references
     * @example getUniqueRefs([{name: "John Doe", age: 30}, {name: "John Doe", age: 30}]) // [{name: "John Doe", age: 30}]
     * 
     */

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

function deduplicate(records) {
    /**
     * Deduplicates a list of records
     * @param {Array} records - The list of records
     * @returns {Array} - The deduplicated list of records
     * @example deduplicate([{name: "John Doe", age: 30}, {name: "John Doe", age: 30}]) // [{name: "John Doe", age: 30}]
     */

    records = Array.isArray(records) ? records : [records]
    let deduplicatedRecords = []

    if(records.length === 0){
        return records
    }

    // Deduplicate non-JSONLD objects
    let nonJsonRecords = records.filter(x => h.isValid(x) === false)
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

function diffLists(records1, records2) {
    /**
     * Returns values in records1 not present in records2
     * @param {Array} records1 - The first list of records
     * @param {Array} records2 - The second list of records
     * @returns {Array} - The difference between the two lists of records
     * @example diffrecords([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}], [{name: "John Doe", age: 30}]) // [{name:
     * "Jane Doe", age: 25}]
     * 
     */

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

function mergeLists(records1, records2, mergeIfExist = false) {
    /**
     * Merges two lists of records
     * @param {Array} records1 - The first list of records
     * @param {Array} records2 - The second list of records
     * @returns {Array} - The merged list of records
     * @example mergeRecords([{name: "John Doe", age: 30}, {name: "Jane Doe", age: 25}], [{name: "John Doe", age: 30}]) // [{name:
     * "John Doe", age: 30}, {name: "Jane Doe", age: 25}]
     * */
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