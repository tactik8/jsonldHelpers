

export const objectHelpers = {
    uuid: {
        new: generateUUIDv4
    },
    new: thing,
    setID: setID,
    isValid: isJsonldObject,
    ref: {
        get: getRef,
        set: setRef
    },
    test: meetsFilterParams,
    eq: eq,
    lt: lt,
    gt: gt,
    isSame: isSame,
    diff: diff,
    merge: mergeRecords,
    flatten: flattenObject,
    unFlatten: unFlattenObject,
    children: {
        get: getNestedRecords,
        toRefs: changeNestedRecordsToRef
    }
    
}

// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------

function generateUUIDv4() {
    // Use crypto.getRandomValues for better randomness if available,
    // otherwise fallback to Math.random (less secure but still functional).
    // This approach ensures compatibility with various environments.
    const randomBytes = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
    } else {
        // Fallback for environments without window.crypto (e.g., older browsers)
        for (let i = 0; i < 16; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }

    // Set the four most significant bits of the 7th byte to 0100'B (version 4)
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    // Set the two most significant bits of the 9th byte to 10'B (variant 1, RFC 4122)
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    // Convert the byte array to a hexadecimal string representation of the UUID
    let uuid = '';
    for (let i = 0; i < 16; i++) {
        // Convert each byte to its two-digit hexadecimal representation
        const hex = randomBytes[i].toString(16).padStart(2, '0');
        uuid += hex;

        // Add hyphens at the standard UUID positions
        if (i === 3 || i === 5 || i === 7 || i === 9) {
            uuid += '-';
        }
    }

    return uuid;
}

// -----------------------------------------------------
//  Record operations and tests 
// -----------------------------------------------------


function thing(record_type = "Thing", record_id) {
    /**
     * Creates a new record
     * @param {String} record_type - The type of the record
     * @param {String} record_id - The id of the record
     * @returns {Object} - The new record
     * @example thing("Person", "John Doe") // {name: "John Doe", "@id": "1234567890"}
     * @example thing("Person") // {name: "John Doe", "@id": "1234567890"}
     */

    let record = {
        "@context": "https://schema.org/",
        "@type": record_type,
        "@id": record_id || generateUUIDv4(),

    }


    return record

}


function setID(obj) {
    /**
     * Sets the ID of an object if it does not have one
     * @param {Object} obj - The object to set the ID of
     * @returns {Object} - The object with the ID set
     * @example setID({name: "John Doe"}) // {name: "John Doe", "@id": "1234567890"}
     */

    if (typeof obj !== 'object' && obj !== null && Array.isArray(obj)) {

        return obj.map(x => flattenObject(x))

    }

    let record_type = obj?.['@type']
    let record_id = obj?.['@id']

    if (!record_type || record_type === null) { return undefined }
    if (!record_id || record_id === null) {

        obj['@id'] = generateUUIDv4()

    }

    return obj

}

function isJsonldObject(obj) {
    /**
     * Checks if an object is a JSON-LD object
     * @param {Object} obj - The object to check
     * @returns {Boolean} - True if the object is a JSON-LD object, false otherwise
     * @example isJsonldObject({@id: "John Doe", name: "John Doe"}) // true
     * @example isJsonldObject({name: "John Doe"}) // false
     */
    let record_type = obj?.['@type']
    let record_id = obj?.['@id']
    if (!record_type || record_type === null) { return false }
    if (!record_id || record_id === null) { return false }
    return true
}




function valueContains(values, value) {
    /**
     * Checks if an object contains another object
     * @param {Object} obj1 - The object to check
     * @param {Object} obj2 - The object to check for
     * @returns {Boolean} - True if the object contains the other object, false otherwise
     * @example contains({name: "John Doe", address: {street: "123 Main St", city: "Anytown"}}, {street: "123 Main St", city: "Anytown"}) // true
     * 
     */

    values = Array.isArray(values) ? values : [values]
    for (let v of values) {
        if (isSame(v, value)) {
            return true
        }
    }
    return false


}

function getRef(obj) {
    /**
     * Gets the reference object of an object
     * @param {Object} obj - The object to get the reference object of
     * @returns {Object} - The reference object
     * @example getRef({name: "John Doe", "@id": "1234567890"}) // {@id: "1234567890"}
     * @example getRef({name: "John Doe"}) // undefined
     */

    if (Array.isArray(obj)) {
        return obj.map(x => getRef(x))
    }

    let record_type = obj?.['@type']
    let record_id = obj?.['@id']

    if (!record_type || record_type === null) { return undefined }
    if (!record_id || record_id === null) { return undefined }

    let ref = {
        '@type': obj?.['@type'],
        '@id': obj?.['@id']
    }
    return ref

}

function setRef(obj, ref){
    /**
     * Sets the reference object of an object
     * @param {Object} obj - The object to set the reference object of
     * @param {Object} ref - The reference object
     * @returns {Object} - The object with the reference object set
     * @example setRef({name: "John Doe"}, {@id: "1234567890"}) // {name: "John Doe", "@id": "1234567890"}
     */
    obj['@type'] = ref?.['@type']
    obj['@id'] = ref?.['@id']

    return obj
}


function meetsFilterParams(record, filterParams, negativeFilterParams, strict = false) {
    /**
     * Checks if a record meets the filter parameters
     * @param {Object} record - The record to check
     * @param {Object} filterParams - The filter parameters
     * @param {Object} negativeFilterParams - The negative filter parameters
     * @param {Boolean} strict - If true, the record must match the filter parameters exactly, else checks that filter parameters are a subset of the record
     * @returns {Boolean} - True if the record meets the filter parameters, false otherwise
     * @example meetsFilterParams({name: "John Doe", age: 30}, {age: 30}) // true
     * @example meetsFilterParams({name: "John Doe", age: 30}, {age: 25}) // false
     */
    if (isJsonldObject(record) === false) {
        return false
    }
    if (filterParams === undefined || filterParams === null) {
        return true
    }

    // Handle filterParams
    for (let k of Object.keys(filterParams)) {

        if (strict === false) {
            if (valueContains(record?.[k], filterParams?.[k]) === false) {
                return false
            }

        } else {
            if (isSame(record?.[k], filterParams?.[k]) === false) {
                return false
            }
        }
    }


    // Handle negativeFilterParams
    for (let k of Object.keys(negativeFilterParams)) {

        if (strict === false) {
            if (valueContains(record?.[k], negativeFilterParams?.[k]) === true) {
                return false
            }

        } else {
            if (isSame(record?.[k], negativeFilterParams?.[k]) === true) {
                return false
            }
        }
    }


    return true
}



// -----------------------------------------------------
//  Records comparisons and operations:
//  eq, 
//  lt, 
//  gt, 
//  isSame, 
//  diff, 
//  mergeRecords
// -----------------------------------------------------

function eq(obj1, obj2) {
    /**
     * Checks if two objects are equal
     * @param {Object} obj1 - The first object
     * @param {Object} obj2 - The second object
     * @returns {Boolean} - True if the objects are equal, false otherwise
     * @example eq({name: "John Doe"}, {name: "John Doe"}) // true
     * @example eq({name: "John Doe"}, {name: "Jane Doe"}) // false
     */

    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        return JSON.stringify(obj1, Object.keys(obj1).sort()) == JSON.stringify(obj2, Object.keys(obj2).sort())
    }

    let diff1 = diff(obj1, obj2)
    let diff2 = diff(obj2, obj1)
    if (Object.keys(diff1).length === 0 && Object.keys(diff2).length === 0) {
        return true
    }
    return false
}

function lt(obj1, obj2) {
    /**
     * Checks if the first object is less than the second object
     * @param {Object} obj1 - The first object
     * @param {Object} obj2 - The second object
     * @returns {Boolean} - True if the first object is less than the second object, false otherwise
     * @example lt({name: "John Doe"}, {name: "Jane Doe"}) // true
     * @example lt({name: "John Doe"}, {name: "John Doe"}) // false
     * 
     */

    // Deal with non object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {

        if (typeof obj1.getMonth !== 'function' && typeof obj1 === "number") {
            obj1 = JSON.stringify(obj1, Object.keys(obj1).sort())
        }

        if (typeof obj2.getMonth !== 'function' && typeof obj2 === "number") {
            obj2 = JSON.stringify(obj2, Object.keys(obj2).sort())
        }

        return obj1 < obj2
    }


    // Deal with  object
    if (obj1['@type'] !== obj2['@type']) {
        return obj1['@type'] < obj2['@type']
    }
    if (obj1['@id'] !== obj2['@id']) {
        return obj1['@id'] < obj2['@id']
    }
    return false
}

function gt(obj1, obj2) {
    /**
     * Checks if the first object is greater than the second object
     * @param {Object} obj1 - The first object
     * @param {Object} obj2 - The second object
     * @returns {Boolean} - True if the first object is greater than the second object, false otherwise
     * @example gt({name: "John Doe"}, {name: "Jane Doe"}) // false
     * @example gt({name: "John Doe"}, {name: "John Doe"}) // false
     */

    // Deal with non object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        if (typeof obj1.getMonth !== 'function' && typeof obj1 === "number") {
            obj1 = JSON.stringify(obj1, Object.keys(obj1).sort())
        }

        if (typeof obj2.getMonth !== 'function' && typeof obj2 === "number") {
            obj2 = JSON.stringify(obj2, Object.keys(obj2).sort())
        }

        return obj1 > obj2
    }


    // Deal with object
    if (obj1['@type'] !== obj2['@type']) {
        return obj1['@type'] > obj2['@type']
    }
    if (obj1['@id'] !== obj2['@id']) {
        return obj1['@id'] > obj2['@id']
    }

    return false

}

function isSame(obj1, obj2) {
    /**
     * Checks if two objects are the same (type and id or value)
     * @param {Object} obj1 - The first object
     * @param {Object} obj2 - The second object
     * @returns {Boolean} - True if the objects are the same, false otherwise
     * @example isSame({@id: "John Doe"}, {@id: "John Doe"}) // true
     * @example isSame({name: "John Doe"}, {name: "Jane Doe"}) // false
     * 
     */


    // Deal with array
    if (Array.isArray(obj1) || Array.isArray(obj2)) {

        obj1 = Array.isArray(obj1) ? obj1 : [obj1]
        obj2 = Array.isArray(obj2) ? obj2 : [obj2]
        if (obj1.length !== obj2.length) {
            return false
        }

        for (let o1 of obj1) {
            if (valueContains(obj2, o1) === false) {
                return false
            }
        }
        for (let o2 of obj2) {
            if (valueContains(obj1, o2) === false) {
                return false
            }
        }
        return true

    }

    // Deal with non-object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        return obj1 == obj2
    }

    // Deal with object
    let ref1 = getRef(obj1)
    let ref2 = getRef(obj2)

    if (ref1?.["@type"] === undefined || ref2?.["@type"] === undefined) { return false }
    if (ref1?.["@id"] === undefined || ref2?.["@id"] === undefined) { return false }

    if (ref1?.["@type"] !== ref2?.["@type"]) { return false }
    if (ref1?.["@id"] !== ref2?.["@id"]) { return false }

    return true

}

function diff(obj1, obj2) {
    /**
     * Returns values in Obj1 not present in Obj2
     * @param {Object} obj1 - The first object
     * @param {Object} obj2 - The second object
     * @returns {Object} - The difference between the two objects
     * @example diff({name: "John Doe", age: 30}, {name: "John Doe", age: 25}) // {age: 30}
     * 
     */

    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        return undefined
    }

    let diff = {}
    for (let k of Object.keys(obj1)) {

        let values = obj1?.[k]
        values = Array.isArray(values) ? values : [values]
        for (let v of values) {
            if (valueContains(obj2?.[k], v) === false) {
                diff[k] = diff[k] || []
                diff[k].push(v)
            }
        }
    }

    return diff

}

function mergeRecords(record1, record2) {
    /**
     * Merges two records
     * @param {Object} record1 - The first record
     * @param {Object} record2 - The second record
     * @returns {Object} - The merged record
     * @example mergeRecords({name: "John Doe"}, {age: 30}) // {name: "John Doe", age: 30}
     *
     */

    if (isJsonldObject(record1) === false || isJsonldObject(record2) === false) {
        return undefined
    }

    if (isSame(record1, record2) === false) {
        return undefined
    }


    let mergedRecord = {}

    for (let k of Object.keys(record1)) {

        let values1 = getValues(record1, k, [])
        addValue(mergedRecord, k, values1, true)

        let values2 = getValues(record2, k, [])
        addValue(mergedRecord, k, values2, true)

    }

    return mergedRecord

}


// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------




export const objectNestingHelpers = {
    childs: {
        get: getNestedRecords,
        changeToRef: changeNestedRecordsToRef
    },
    toRef: changeNestedRecordsToRef,
    flatten: flattenObject,
}




// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------



function getNestedRecords(obj) {
    /**
     * Gets all nested records from an object
     * @param {Object} obj - The object to get the nested records from
     * @returns {Array} - The nested records
     * @example getNestedRecords({name: "John Doe", address: {street: "123 Main St", city: "Anytown"}}) // [{street: "123 Main St", city: "Anytown"}]
     * @example getNestedRecords({name: "John Doe", address: [{street: "123 Main St", city: "Anytown"}, {street: "456 Main St", city: "Anytown"}]})
     */

    if (obj === undefined || obj === null) {
        return []
    }

    // Deal with array
    if (Array.isArray(obj)) {
        let records = []
        for (let record of obj) {
            let nestedRecords = getNestedRecords(record)
            nestedRecords = nestedRecords.filter(x => x !== undefined && x != [])
            nestedRecords.map(x => records.push(x))
        }

        return records
    }

    // Deal with non-object
    if (typeof obj !== 'object') {
        return []
    }

    // Deal with non-array
    obj = setID(obj)

    let records = []

    for (let key in obj) {
        let values = obj[key] || []

        values = Array.isArray(values) ? values : [values]

        for (let value of values) {
            if (value?.['@type'] !== undefined && value?.['@type'] !== null) {
                records.push(value)
            }

            let nestedRecords = getNestedRecords(value)
            nestedRecords.map(x => records.push(x))

        }
    }

    // Return the final flattened result object
    records = records.filter(x => x !== undefined && x !== null)
    return records;

}


function changeNestedRecordsToRef(obj) {
    /**
     * Changes all nested records to references
     * @param {Object} obj - The object to change the nested records to references
     * @returns {Object} - The object with the nested records changed to references
     * @example changeNestedRecordsToRef({name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "1234567890"}}) //
     * {name: "John Doe", address: {@id: "1234567890"}}
     */

    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return obj
    }

    // Deal with array
    if (Array.isArray(obj)) {
        return obj.map(x => changeNestedRecordsToRef(x))
    }

    // Deal with non-object
    if (typeof obj !== 'object' && !Array.isArray(obj)) {
        return obj
    }

    // Deal with object
    let newRecord = {}

    for (let key in obj) {
        let values = obj[key]
        values = Array.isArray(values) ? values : [values]

        let newValues = []
        for (let value of values) {
            if (value?.['@type'] !== undefined && value?.['@type'] !== null)
                newValues.push(getRef(value))
            else
                newValues.push(changeNestedRecordsToRef(value))
        }
        if (newValues.length === 0) {
            newValues = undefined
        } else if (newValues.length === 1) {
            newValues = newValues[0]
        }
        newRecord[key] = newValues
    }
    return newRecord
}


function flattenObject(obj) {
    /**
     * Flattens an object into a list of records, replacing nested objects with their refs
     * @param {Object} obj - The object to flatten
     * @returns {Array} - The flattened object
     * @example flattenObject({name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "1234567890"}})
     */

    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return obj
    }

    // Deal with array
    if (Array.isArray(obj)) {
        let records = []
        for (let record of obj) {
            let nestedRecords = flattenObject(record)
            nestedRecords = nestedRecords.filter(x => x !== undefined && x != [])
            nestedRecords.map(x => records.push(x))
        }
        return records
    }

    // Deal with non-object
    if (typeof obj !== 'object' && !Array.isArray(obj)) {
        return obj
    }

    // Deal with object
    let records = [obj]
    let nestedRecords = getNestedRecords(obj)
    nestedRecords = nestedRecords.filter(x => x !== undefined && x != [])
    nestedRecords.map(x => addRecord(x, records, true))
    records = records.map(x => changeNestedRecordsToRef(x))
    return records

}


function unFlattenObject(obj, records) {
    /**
     * Unflattens an object from a list of records
     * @param {Object} obj - The object to unflatten
     * @param {Array} records - The list of records
     * @returns {Object} - The unflattened object
     * @example unFlattenObject({name: "John Doe", address: {@id: "1234567890"}}, [{@id: "1234567890", street: "1
     * 23 Main St", city: "Anytown"}]) // {name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "123456
     * 7890"}}
     * 
     */
    // Rebuilds the object from the flattened representation

    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return obj
    }

    // Deal with array
    if (Array.isArray(obj)) {
        return obj.map(x => unFlattenObject(x, records))
    }

    // Deal with non-object
    if (typeof obj !== 'object' && !Array.isArray(obj)) {
        return obj
    }

    // Deal with object
    let newRecord = {}
    for (let key in obj) {
        let values = obj[key]
        values = Array.isArray(values) ? values : [values]
        let newValues = []
        for (let value of values) {
            if (isJsonldObject(value)) {
                let record = getRecord(value, records)
                newValues.push(unFlattenObject(record, records) || value)
            } else {
                newValues.push(unFlattenObject(value, records))
                newRecord[key] = newValues
            }
        }
        if (newValues.length === 0) {
            newValues = undefined
        } else if (newValues.length === 1) {
            newValues = newValues[0]
        }
        newRecord[key] = newValues
    }
    return newRecord

}
