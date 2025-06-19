
import { objectHelpers as h} from './objectHelpers.js'


export const propertyHelpers = {
    keys: getProperties,
    type: {
        get: getRecordType,
        set: setRecordType
    },
    id: {
        get: getRecordId,
        set: setRecordId
    },
    value: {
        get: getValue,
        set: setValue,
        add: addValue,
        delete: deleteValue
    },
    values: {
        get: getValues,
        set: setValue,
    }
}







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
    if (h.isValid(obj) === false) {
        return undefined
    }

    let properties = Object.keys(obj)
    properties = properties.filter(x => x !== '@type' && x !== '@id' && x !== '@context')
    properties.sort()
    return properties

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
        return undefined
    }
    return getValue(record, '@type')
}

function setRecordType(record, record_type){
    /**
     * Sets the type of a record
     * @param {Object} record - The record to set the type of
     * @param {String} record_type - The type to set
     * @returns {Object} - The record with the type set
     * @example setRecordType({@type: "Person", name: "John Doe"}, "Animal") // {@type: "Animal", name: "John Doe"}
     */
    return setValue(record, '@type', record_type)
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
        return undefined
    }
    return getValue(record, '@id')
}

function setRecordId(record, record_id){
    /**
     * Sets the id of a record
     * @param {Object} record - The record to set the id of
     * @param {String} record_id - The id to set
     * @returns {Object} - The record with the id set
     * @example setRecordId({@type: "Person", name: "John Doe"}, "1234567890") // {@type: "Person", name: "John Doe", @id: "1234567890"}
     */
    return setValue(record, '@id', record_id)
}

function getValue(obj, path, defaultValue) {
    /**
     * Gets a value from a property of an object
     * @param {Object} obj - The object to get the value from
     * @param {String} path - The path to the property
     * @param {*} defaultValue - The default value to return if the property does not exist
     * @returns {*} - The value of the property
     */

    let value = getValues(obj, path, defaultValue)
    return value?.[0]

}

function getValues(obj, path, defaultValue) {
    /**
     * Gets a value from a property of an object
     * @param {Object} obj - The object to get the value from
     * @param {String} property - The property to get the value from
     * @param {*} defaultValue - The default value to return if the property does not exist
     * @returns {*} - The value of the property
     * @example getValue({name: "John Doe"}, "name") // "John Doe"
     * @example getValue({name: "John Doe"}, "age") // undefined
     * @example getValue({name: "John Doe", age: 30}, "age") // 30
     */



    // If empty path
    if (path === undefined || path === null || path === ''){
        return obj
    }
    
    // If the object is null or undefined, or the path is not a string, return undefined immediately.
    if (obj === null || typeof obj === 'undefined' || typeof path !== 'string') {
        if (defaultValue !== undefined) {
            return defaultValue
        }
        return undefined;
    }

    // Split the path into individual keys, handling both dot notation and array bracket notation.
    // Example: "data[0].name" becomes ["data", "0", "name"]
    // Example: "user.address.street" becomes ["user", "address", "street"]
    const keys = path.split('.').flatMap(key => {
        // Check if the key contains array bracket notation (e.g., "items[0]")
        const arrayMatch = key.match(/^(.*?)\[(\d+)\]$/);
        if (arrayMatch) {
            // If it's an array, return the key part and the index as separate parts
            // e.g., "items[0]" -> ["items", "0"]
            const [, baseKey, index] = arrayMatch;
            return baseKey ? [baseKey, index] : [index]; // Handle cases like "[0].name"
        }
        return key; // Otherwise, return the key as is
    }).filter(Boolean); // Remove any empty strings that might result from splitting

    let current = obj; // Start traversal from the root object/array

    // Iterate through each key in the path
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        // Check if the current value is an object or an array before attempting to access its property/index.
        if (typeof current !== 'object' || current === null) {
            if (defaultValue !== undefined) {
                return defaultValue
            }
            return undefined; // Path does not exist or structure is not as expected
        }

        // Check if the current key is an array index (a string containing only digits)
        if (String(Number(key)) === key && Array.isArray(current)) {
            const index = Number(key);
            if (index >= 0 && index < current.length) {
                current = current[index]; // Access array element
            } else {
                if (defaultValue !== undefined) {
                    return defaultValue
                }
                return undefined; // Index out of bounds
            }
        } else if (typeof current === 'object' && current !== null && current.hasOwnProperty(key)) {
            current = current[key]; // Access object property
        } else {
            // If the property/index does not exist at the current level, return undefined.
            if (defaultValue !== undefined) {
                return defaultValue
            }
            return undefined;
        }
    }

    current = Array.isArray(current) ? current : [current]
    return current; // Return the final value found at the specified path

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


    // Validate input parameters
    if (obj === null || typeof obj === 'undefined' || typeof path !== 'string') {
        if (defaultValue !== undefined) {
            return defaultValue
        }
        return false;
    }


    // Skip if already same
    let newValues = Array.isArray(value) ? value : [value]
    if (h.eq(getValues(obj, path), newValues)){
        return obj
    }

    // Clone obj
    obj = structuredClone(obj);


    // Split the path into individual keys, handling both dot notation and array bracket notation.
    const keys = path.split('.').flatMap(key => {
        const arrayMatch = key.match(/^(.*?)\[(\d+)\]$/);
        if (arrayMatch) {
            const [, baseKey, index] = arrayMatch;
            return baseKey ? [baseKey, index] : [index];
        }
        return key;
    }).filter(Boolean);

    let current = obj;
    // Traverse the path, creating intermediate objects or arrays as needed
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isLastKey = (i === keys.length - 1);

        // If the current segment is an array index
        if (String(Number(key)) === key) { // This checks if key is a valid number string
            const index = Number(key);

            if (!Array.isArray(current)) {
                // If it's not an array, but we expect an array (e.g., path was "a.b[0]" and "b" was not an array)
                if (typeof current === 'object' && current !== null && keys[i - 1]) {
                    // If the previous key was an object property, it means `current[key]` should be an array
                    // For example if `path` is `a.b[0]`, then `b` should be an array.
                    // If `b` is `null` or `{}` at this point, we initialize it as an array.
                    current = [];
                    // Update the parent object/array with the newly created array
                    if (i > 0) {
                        const prevKey = keys[i - 1];
                        if (String(Number(prevKey)) === prevKey && Array.isArray(objAtPreviousLevel)) {
                            objAtPreviousLevel[Number(prevKey)] = current;
                        } else if (typeof objAtPreviousLevel === 'object' && objAtPreviousLevel !== null) {
                            objAtPreviousLevel[prevKey] = current;
                        }
                    }
                } else {
                    if (defaultValue !== undefined) {
                        return defaultValue
                    }

                    return false;
                }
            }

            // If it's the last key, set the value directly
            if (isLastKey) {
                // Ensure array has enough capacity
                if (index >= current.length) {
                    // Fill missing elements with null or undefined (or desired default)
                    for (let j = current.length; j < index; j++) {
                        current.push(undefined);
                    }
                }
                current[index] = value;
            } else {
                // If intermediate array element does not exist or is not an object/array, initialize it.
                if (index >= current.length || typeof current[index] !== 'object' || current[index] === null) {
                    const nextKeyIsArray = String(Number(keys[i + 1])) === keys[i + 1];
                    current[index] = nextKeyIsArray ? [] : {};
                }
                current = current[index];
            }
        } else { // Current segment is an object property
            if (typeof current !== 'object' || current === null) {
                if (defaultValue !== undefined) {
                    return defaultValue
                }

                return false;
            }

            // If the property doesn't exist or is not an object/array, initialize it.
            if (!current.hasOwnProperty(key) || typeof current[key] !== 'object' || current[key] === null) {
                if (!isLastKey) { // Only initialize if it's not the last key
                    const nextKeyIsArray = String(Number(keys[i + 1])) === keys[i + 1];
                    current[key] = nextKeyIsArray ? [] : {};
                }
            }

            if (isLastKey) {
                current[key] = value;
            } else {
                current = current[key];
            }
        }
    }
    return obj;

}

function addValue(obj, path, value, noDuplicates = false) {
    /**
     * Adds a value to a property of an object
     */

    // Check if obj is a JSON-LD object
    if (h.isValid(obj) === false) {
        console.log("Invalid object", obj, path, value)
        return false
    }

    // Deal with lists
    if (Array.isArray(value)) {
        for (let v of value) {
            addValue(obj, path, v, noDuplicates)
        }
        return true
    }


    // Clone obj
    obj = structuredClone(obj);
    
    // 
    let values = getValues(obj, path, [])
    values = Array.isArray(values) ? values : [values]

    if (noDuplicates) {
        values = values.filter(x => x !== value)
    }

    values.push(value)
    

    let result = setValue(obj, path, values)
    
    return result

}

function deleteValue(obj, path, value) {
    /**
     * Deletes a value from a property of an object
     * @param {Object} obj - The object to delete the value from
     * @param {String} path - The path to the property
     * @param {*} value - The value to delete
     * @returns {Object} - The object with the value deleted
     * @example deleteValue({name: "John Doe", age: 30}, "age", 30) // {name: "John Doe"}
     */
    if (h.isValid(obj) === false) {
        return undefined
    }

    // Clone obj
    obj = structuredClone(obj);

    
    let values = getValues(obj, path, [])
    values = Array.isArray(values) ? values : [values]
    values = values.filter(x => h.isSame(x, value) === false)
    setValue(obj, path, values)
    return obj
}
