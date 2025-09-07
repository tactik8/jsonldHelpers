import { ObjectHelpers as h } from "../objectHelpers/objectHelpers.models.js";


/**
 * Property helpers
 * @module propertyHelpers
 * @description Property helpers for JSON-LD objects
 * @Properties
 * - keys: get keys of an object
 */


/**
 * Property helpers
 * 
 */
export const services = {
    keys: {
        get: getProperties
    },
    id: {
        get: getRecordId,
        set: setRecordId,
        replace: replaceRecordId,
    },
    ids: {
        get: getRecordIds,
        set: setRecordId,
        replace: replaceRecordId,
    },
    record_id: {
        get: getRecordId,
        set: setRecordId,
        replace: replaceRecordId,
    },
    record_ids: {
        get: getRecordIds,
        set: setRecordId,
        replace: replaceRecordId,
    },
    type: {
        get: getRecordType,
        set: setRecordType,
    },
    types: {
        get: getRecordTypes,
        set: setRecordTypes,
    },
    record_type: {
        get: getRecordTypes,
        set: setRecordTypes,
    },
    record_types: {
        get: getRecordTypes,
        set: setRecordTypes,
    },
    value: {
        get: getValue,
        set: setValue,
        add: addValue,
        delete: deleteValue,
        replace: replacePropertyValue
    },
    values: {
        get: getValues,
        set: setValue,
        add: addValue,
        delete: deleteValue,
        replace: replacePropertyValue
    },
};

let STRUCTURED_CLONE_EXISTS = false;
try {
    STRUCTURED_CLONE_EXISTS = structuredClone !== undefined;
} catch (error) {}

// -----------------------------------------------------
//  Property operations:
//  getProperties,
//  getRecordType,
//  setRecordType
//  getRecordId,
//  setRecordId,
//  getValue,
//  getValues,
//  setValue,
//  addValue,
//  deleteValue
// -----------------------------------------------------

function getProperties(obj) {
    /**
     * Gets the properties of an object
     * @param {Object} obj - The object to get the properties of
     * @returns {Array} - The properties of the object
     * @example getProperties({name: "John Doe", age: 30}) // ["name", "age"]
     *
     */

    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return [];
    }

    if (h.isValid(obj) === false) {
        return [];
    }

    let properties = Object.keys(obj);
    properties = properties.filter(
        (x) => x !== "@type" && x !== "@id" && x !== "@context",
    );
    properties.sort();
    return properties;
}

function getRecordType(record) {
    /**
     * Gets the type of a record
     * @param {Object} record - The record to get the type of
     * @returns {String} - The type of the record
     * @example getRecordType({@type: "Person", name: "John Doe"}) // "Person"
     *
     */
    if (h.isValid(record) === false) {
        return undefined;
    }
    return getValue(record, "@type");
}

function getRecordTypes(record) {
    /**
     * Gets the type of a record
     * @param {Object} record - The record to get the type of
     * @returns {String} - The type of the record
     * @example getRecordType({@type: "Person", name: "John Doe"}) // "Person"
     *
     */
    if (h.isValid(record) === false) {
        return undefined;
    }
    return getValues(record, "@type");
}

function setRecordType(record, record_type) {
    /**
     * Sets the type of a record
     * @param {Object} record - The record to set the type of
     * @param {String} record_type - The type to set
     * @returns {Object} - The record with the type set
     * @example setRecordType({@type: "Person", name: "John Doe"}, "Animal") // {@type: "Animal", name: "John Doe"}
     */

    

    return setValue(record, "@type", record_type);
}

function setRecordTypes(record, record_type) {
    /**
     * Sets the type of a record
     * @param {Object} record - The record to set the type of
     * @param {String} record_type - The type to set
     * @returns {Object} - The record with the type set
     * @example setRecordType({@type: "Person", name: "John Doe"}, "Animal") // {@type: "Animal", name: "John Doe"}
     */

    
    record_type = Array.isArray(record_type) ? record_type : [record_type];

    return setValue(record, "@type", record_type);
}

function getRecordId(record) {
    /**
     * Gets the id of a record
     * @param {Object} record - The record to get the type of
     * @returns {String} - The type of the record
     * @example getRecordType({@type: "Person", name: "John Doe"}) // "Person"
     *
     */
    if (h.isValid(record) === false) {
        return undefined;
    }
    return getValue(record, "@id");
}

function getRecordIds(record) {
    /**
     * Gets the id of a record
     * @param {Object} record - The record to get the type of
     * @returns {String} - The type of the record
     * @example getRecordType({@type: "Person", name: "John Doe"}) // "Person"
     *
     */
    if (h.isValid(record) === false) {
        return undefined;
    }
    return getValues(record, "@id");
}

function setRecordId(record, record_id) {
    /**
     * Sets the id of a record
     * @param {Object} record - The record to set the id of
     * @param {String} record_id - The id to set
     * @returns {Object} - The record with the id set
     * @example setRecordId({@type: "Person", name: "John Doe"}, "1234567890") // {@type: "Person", name: "John Doe", @id: "1234567890"}
     */
    return setValue(record, "@id", record_id);
}

function setRecordIds(record, record_id, defaultValue) {
    /**
     * Sets the id of a record
     * @param {Object} record - The record to set the id of
     * @param {String} record_id - The id to set
     * @returns {Object} - The record with the id set
     * @example setRecordId({@type: "Person", name: "John Doe"}, "1234567890") // {@type: "Person", name: "John Doe", @id: "1234567890"}
     */

    record_id = Array.isArray(record_id) ? record_id : [record_id];

    return setValue(record, "@id", [record_id], defaultValue);
}

function _dotValueGetKey(path, n = 0) {
    /**
     * Gets the first key from a dot notation path
     * @param {String} path - The path to get the key from
     * @returns {String} - The key
     */

    n = n || 0;

    let key;
    try {
        // Split up items
        let items = path.split(".");

        // Get specific item
        n = n < 0 ? items.length + n : n;
        let item = items?.[n] || undefined;

        key = item.split("[")?.[0] || key;
    } catch (error) {}
    return key;
}

function _dotValueGetPosition(path, n = 0) {
    /**
     * Gets the first key from a dot notation path
     * @param {String} path - The path to get the key from
     * @param {Number} n - The position to get the key from (negative to go from right)
     * @returns {String} - The key
     */

    n = n || 0;
    let position;
    try {
        // Split up items
        let items = path.split(".");

        // Get specific item
        n = n < 0 ? items.length + n : n;
        let item = items?.[n] || undefined;

        if (item === undefined) {
            return undefined;
        }

        position = item.split("[")[1] || undefined;
        position = position?.replace("]", "");
        position = position?.trim();
        position = Number(position);
        position = isNaN(position) ? undefined : position;
    } catch (error) {}

    return position;
}

function getValue(obj, path, defaultValue) {
    /**
     * Gets a value from a property of an object
     * @param {Object} obj - The object to get the value from
     * @param {String} path - The path to the property
     * @param {*} defaultValue - The default value to return if the property does not exist
     * @returns {*} - The value of the property
     */

    let values = getValues(obj, path, defaultValue);
    values = Array.isArray(values) ? values : [values];
    return values?.[0];
}

/**
 * Gets a value from a property of an object
 * @param {Object} obj - The object to get the value from
 * @param {String} path - The path to the property
 * @param {*} defaultValue - The default value to return if the property does not exist
 * @returns {*} - The value of the property
 */
function getValues(obj, path, defaultValue) {


    // If empty path
    if(path ===""){
        return obj
    }
    if (
        path === undefined ||
        path === null ||
        typeof path !== "string"
    ) {
        return defaultValue;
    }

    // If the object is null or undefined,
    if (obj === null || typeof obj === "undefined") {
        return defaultValue;
    }

    // Get key and position of 1st element
    let key = _dotValueGetKey(path);
    let position = _dotValueGetPosition(path);

    // Get value
    let values = obj?.[key] || undefined;

    if (position !== undefined) {
        values = Array.isArray(values) ? values : [values];
        values = values?.[position] || undefined;
    }

    // Get remaining path
    let pathElements = path.split(".");
    if (values !== undefined && pathElements.length > 1) {
        let remainingPath = pathElements.slice(1).join(".");
        values = getValues(values, remainingPath, defaultValue);
    }

    // Get nested value

    // Return
    values = values || defaultValue;

    values = Array.isArray(values) ? values : [values];

    values = values.filter((x) => x !== undefined)

    if(values.length === 0){
        values = defaultValue || []
    }

    
    return values;
}

function setValue(obj, path, value, defaultValue) {
    /**
     * Sets a value to a property of an object
     * @param {Object} obj - The object to set the value of
     * @param {String} property - The property to set the value of
     * @param {*} value - The value to set
     * @returns {Object} - The object with the value set
     * @example setvalueToProperty({name: "John Doe"}, "age", 30) // {name: "John Doe", age: 30}
     * @example setvalueToProperty({name: "John Doe"}, "name", "Jane Doe") // {name: "Jane Doe"}
     */

    // Deal with null obj

    if(Array.isArray(obj)){
        return defaultValue
    }
    
    if (obj === undefined || obj === null) {
        obj = {};
    }

    // Handle invalid obj
    if (typeof obj !== "object") {
        return defaultValue;
    }

    // Clone obj
    if (STRUCTURED_CLONE_EXISTS) {
        obj = structuredClone(obj);
    } else {
        obj = JSON.parse(JSON.stringify(obj));
    }

    // If empty path
    if (path === undefined || path === null || path === "" || typeof path != "string") {
        return defaultValue;
    }

    // Get current value
    let key = _dotValueGetKey(path);
    let position = _dotValueGetPosition(path);

    
    let currentValue = obj?.[key] || undefined;

    if (position !== undefined) {
        
        currentValue = Array.isArray(currentValue)
            ? currentValue
            : [currentValue];

        while(currentValue.length <= position){
            currentValue.push(undefined)
        }
        
        currentValue = currentValue?.[position] || undefined;
    }

    // if array, get first value
    if (Array.isArray(currentValue)) {
        currentValue = currentValue?.[0];
    }

    // Get remaining path
    let pathElements = path.split(".");
    if (pathElements.length > 1) {
        let remainingPath = pathElements.slice(1).join(".");
        value = setValue(currentValue, remainingPath, value, defaultValue);
    }

    if(position !== undefined){
        obj[key] = obj[key] || []
        obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]]
        while(obj[key].length <= position){
            obj[key].push(undefined)
        }
        obj[key][position] = value
    } else {
        obj[key] = value;
    }

    // Return
    return obj;
}

function addValue(obj, path, value, noDuplicates = true) {
    /**
     * Adds a value to a property of an object
     */

    // Deal with lists
    if (Array.isArray(value)) {
        for (let v of value) {
            obj = addValue(obj, path, v, noDuplicates);
        }
        return obj;
    }

    // Check if obj is a JSON-LD object
    if (typeof obj !== "object") {
        return false;
    }

    //
    let currentValues = getValues(obj, path, []);
    currentValues = Array.isArray(currentValues)
        ? currentValues
        : [currentValues];

    if (noDuplicates === true) {
        currentValues = currentValues.filter(
            (x) => h.isSame(x, value) === false,
        );
    }

    currentValues.push(value);

    if(currentValues.length === 1){
        currentValues = currentValues?.[0]
    }
    
    let result = setValue(obj, path, currentValues);

    return result;
}

function deleteValue(obj, path, value, defaultValue) {
    /**
     * Deletes a value from a property of an object
     * @param {Object} obj - The object to delete the value from
     * @param {String} path - The path to the property
     * @param {*} value - The value to delete
     * @returns {Object} - The object with the value deleted
     * @example deleteValue({name: "John Doe", age: 30}, "age", 30) // {name: "John Doe"}
     */

    // Handle empty object
    if (obj === undefined || obj === null) {
        return defaultValue;
    }

    

    // Handle empty path
    if (path === undefined || path === null || path === "") {
        return defaultValue;
    }
    
    if (typeof path !== "string") {
        return defaultValue;
    }

    // Check if obj is a JSON-LD object
    if (h.isValid(obj) === false) {
        return defaultValue;
    }

    // Get values
    let values = getValues(obj, path, []);

    // Skip if no values present
    if (values.length === 0) {
        return obj;
    }
    values = values.filter((x) => h.isSame(x, value) === false);

    let result = setValue(obj, path, values);

    return result;
}



// -----------------------------------------------------
//  Nested records 
// -----------------------------------------------------




/**
 * Changes the ID of a record in itself and all child values
 * @param {Object} record - The record to change the ID of
 * @param {String} oldId - The old ID
 * @param {String} newId - The new ID
 * @returns {Object} - The record with the new ID
 * @example changeRecordId({name: "John Doe", "@id": "1234567890"}, "1234567890", "0987654321"}
 *
 */
function replaceRecordId(record, record_type, old_record_id, new_record_id) {

    //
    let ref = h.ref.get({ "@type": {"$contains": record_type}, "@id": { "$contains": old_record_id} });

    

    
    record = replacePropertyValue(record, "@id", old_record_id, new_record_id, ref)

    return record
}

/**
 * Checks if a value is included in a list of values
 * @param {Array} values - The list of values
 * @param {*} value - The value to check
 * @returns {Boolean} - True if the value is included in the list of values
 */
function includesValue(values, value){

    values = Array.isArray(values) ? values : [values]

    for(let v of values){
        if(h.isSame(v, value)){
            return true
        }
    }

    return false
    
}

/**
 * Changes the ID of a record in itself and all child values
 * @param {Object} record - The record to change the ID of
 * @param {String} propertyID or "*"
 * @param {String} oldValue or "*" 
 * @param {String} newValue
 * @param {Object} filter Additional requirements to meet
 * @returns {Object} - The record with the new ID
 * @description Changes the ID of a record in itself and all child values, but only if the value is a reference to the old ID or * 
 */
function replacePropertyValue(record, propertyID, oldValue, newValue, filter) {


    // Deal with array
    if (Array.isArray(record)) {
        return record.map((x) => replacePropertyValue(x, oldValue, newValue));
    }

    // Deal with non-object
    if (typeof record !== "object") {
        return record;
    }

    
    // Change value
    for(let k of Object.keys(record)){

        if(k == propertyID || propertyID == "*"){
            
            let values = getValues(record, propertyID, [])

            if(h.test(record, filter) === false){
                continue
            }

            // Overwrite value if "*"
            if(oldValue == "*"){
                record = setValue(record, propertyID, newValue);
                continue
            }

            // Replace value if oldValue is present
            if(includesValue(values, oldValue)){
                record = deleteValue(record, propertyID, oldValue);
                record = addValue(record, propertyID, newValue, true);
            }
            
        } 

        record[k] = replacePropertyValue(record[k], propertyID, oldValue, newValue, filter)
        
    }

   return record
}