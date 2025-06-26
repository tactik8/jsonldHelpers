import { propertyHelpers as ph } from "./propertyHelpers.js";
import { arrayHelpers as ah } from "./arrayHelpers.js";
import { valueHelpers as vh } from "./valueHelpers.js";

export const objectHelpers = {
    uuid: {
        new: generateUUIDv4,
    },
    new: thing,
    setID: setID,
    clean: clean,
    isValid: isJsonldObject,
    ref: {
        get: getRef,
        set: setRef,
    },
    test: meetsFilterParams,
    eq: eq,
    lt: lt,
    le: le,
    gt: gt,
    ge: ge,
    isSame: isSame,
    isNull: isNull,
    diff: diff,
    merge: mergeRecords,
    flatten: flattenObject,
    unFlatten: unFlattenObject,
    children: {
        get: getNestedRecords,
        toRefs: changeNestedRecordsToRef,
    },
};

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function generateUUIDv4() {
    // Use crypto.getRandomValues for better randomness if available,
    // otherwise fallback to Math.random (less secure but still functional).
    // This approach ensures compatibility with various environments.

    const randomBytes = new Uint8Array(16);

    let c1 = false;
    try {
        c1 = window.crypto && window.crypto.getRandomValues;
    } catch (error) {}

    if (c1 === true) {
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
    let uuid = "";
    for (let i = 0; i < 16; i++) {
        // Convert each byte to its two-digit hexadecimal representation
        const hex = randomBytes[i].toString(16).padStart(2, "0");
        uuid += hex;

        // Add hyphens at the standard UUID positions
        if (i === 3 || i === 5 || i === 7 || i === 9) {
            uuid += "-";
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
    };

    return record;
}

function setID(obj, defaultValue) {
    /**
     * Sets the ID of an object if it does not have one
     * @param {Object} obj - The object to set the ID of
     * @returns {Object} - The object with the ID set
     * @example setID({name: "John Doe"}) // {name: "John Doe", "@id": "1234567890"}
     */

    if (Array.isArray(obj)) {
        return obj.map((x) => setID(x, defaultValue));
    }

    if (isJsonldObject(obj) === false) {
        if (defaultValue) {
            return defaultValue;
        } else {
            throw "Invalid object";
        }
    }

    let record_type = obj?.["@type"];
    let record_id = obj?.["@id"];

    if (!record_id || record_id === null) {
        obj["@id"] = generateUUIDv4();
    }

    return obj;
}

function isJsonldObject(obj) {
    /**
     * Checks if an object is a JSON-LD object
     * @param {Object} obj - The object to check
     * @returns {Boolean} - True if the object is a JSON-LD object, false otherwise
     * @example isJsonldObject({@id: "John Doe", name: "John Doe"}) // true
     * @example isJsonldObject({name: "John Doe"}) // false
     */

    if (typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    }

    let record_type = obj?.["@type"];
    let record_id = obj?.["@id"];
    if (!record_type || record_type === null) {
        return false;
    }
    //if (!record_id || record_id === null) { return false }
    return true;
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

    values = Array.isArray(values) ? values : [values];
    for (let v of values) {
        if (isSame(v, value)) {
            return true;
        }
    }
    return false;
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
        return obj.map((x) => getRef(x));
    }

    let record_type = obj?.["@type"];
    let record_id = obj?.["@id"];

    if (!record_type || record_type === null) {
        return undefined;
    }
    if (!record_id || record_id === null) {
        return undefined;
    }

    let ref = {
        "@type": obj?.["@type"],
        "@id": obj?.["@id"],
    };
    return ref;
}

function setRef(obj, ref) {
    /**
     * Sets the reference object of an object
     * @param {Object} obj - The object to set the reference object of
     * @param {Object} ref - The reference object
     * @returns {Object} - The object with the reference object set
     * @example setRef({name: "John Doe"}, {@id: "1234567890"}) // {name: "John Doe", "@id": "1234567890"}
     */
    obj["@type"] = ref?.["@type"];
    obj["@id"] = ref?.["@id"];

    return obj;
}

function valueMeetsFilterParams(value, param) {
    /**
     *  Tests if a value meets the filter parameters
     * @param {*} value - The value to test
     * @param {*} param - The filter parameters
     * @param {Boolean} strict - If true, the value must match the filter parameters exactly, else checks that filter parameters are a subset of the value
     * @returns {Boolean} - True if the value meets the filter parameters, false otherwise
     * @example valueMeetsFilterParams(30, 30) // true
     * @example valueMeetsFilterParams(30, { lt: 35}) // true
     *
     */

    let strict = false;
    let conditions = [];

    // Deal with array of values
    if (Array.isArray(value)) {
        let results = value.map((x) =>
            valueMeetsFilterParams(x, param, strict),
        );

        return results.every((x) => x === true);
    }

    // Deal with array of params
    if (Array.isArray(param)) {
        let results = param.map((x) =>
            valueMeetsFilterParams(value, x, strict),
        );

        return results.every((x) => x === true);
    }

    // Eval no filter params adjustments
    if (typeof param !== "object") {
        param = { $eq: param };
    }

    // Eval and
    if (param?.["$and"]) {
        let results = param["$and"].map((x) =>
            valueMeetsFilterParams(value, x, strict),
        );
        conditions.push(results.every((x) => x === true));
    }

    // Eval or
    if (param?.["$or"]) {
        let results = param["$or"].map((x) =>
            valueMeetsFilterParams(value, x, strict),
        );
        conditions.push(results.some((x) => x === true));
    }

    // Eval not
    if (param?.["$not"]) {
        let result = !valueMeetsFilterParams(value, param?.["$not"], strict);
        conditions.push(result);
    }

    // Eval eq
    if (param?.["$eq"]) {
        let result = isSame(value, param["$eq"]);
        conditions.push(result);
    }

    // Eval ne
    if (param?.["$ne"]) {
        let result = false && isSame(value, param["$ne"]);
        conditions.push(result);
    }

    // Eval lt
    if (param?.["$lt"]) {
        let result = lt(value, param["$lt"]);
        conditions.push(result);
    }

    // Eval le
    if (param?.["$le"]) {
        let result = le(value, param["$le"]);
        conditions.push(result);
    }

    // Eval gt
    if (param?.["$gt"]) {
        let result = gt(value, param["$gt"]);
        conditions.push(result);
    }

    // Eval ge
    if (param?.["$ge"]) {
        let result = ge(value, param["$ge"]);
        conditions.push(result);
    }

    // Eval contains
    if (param?.["$contains"]) {
        let result = valueContains(value, param["$contains"]);
        conditions.push(result);
    }

    // Eval inclludes
    if (param?.["$includes"]) {
        let result =
            typeof value === "string" && value.includes(param["$includes"]);
        conditions.push(result);
    }

    // Eval startsWith
    if (param?.["$startsWith"]) {
        let result = value.startsWith(param["$startsWith"]);
        conditions.push(result);
    }

    // Eval endsWith
    if (param?.["$endsWith"]) {
        let result = value.endsWith(param["$endsWith"]);
        conditions.push(result);
    }

    // Eval any key
    if (param?.["$*"]) {
        let results = [];

        if (typeof value === "object") {
            results.push(valueMeetsFilterParams(value, param["$*"]));
            let keys = Object.keys(value);
            let subResults = keys.map((x) =>
                valueMeetsFilterParams(value[x], param),
            );
            results.push(subResults.some((x) => x === true));
        } else {
            results.push(valueMeetsFilterParams(value, param["$*"]));
        }

        conditions.push(results.some((x) => x === true));
    }

    // Eval regex
    if (param?.["$regex"]) {
        const dynamicPattern = param?.["$regex"];
        const dynamicFlags = "gi"; // Global and case-insensitive
        const regexExp = new RegExp(dynamicPattern, dynamicFlags);

        const regex = new RegExp(regexExp);
        let result = typeof value === "string" && regex.test(value);
        conditions.push(result);
    }

    // Eval normal keys
    let keys = Object.keys(param).filter((x) => !x.startsWith("$"));
    for (let k of keys) {
        let result = valueMeetsFilterParams(value?.[k], param[k]);
        conditions.push(result);
    }

    if (conditions.length === 0) {
        return true;
    }

    return conditions.every((x) => x === true);
}

function meetsFilterParams(
    record,
    filterParams,
    negativeFilterParams,
    strict = false,
) {
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
        return false;
    }

    // Handle filterParams
    if (filterParams && filterParams != {}) {
        if (valueMeetsFilterParams(record, filterParams) === false) {
            return false;
        }
    }

    // Handle filterParams
    if (negativeFilterParams && negativeFilterParams != {}) {
        if (valueMeetsFilterParams(record, negativeFilterParams) === true) {
            return false;
        }
    }

    return true;
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

    if ((!obj1 || obj1 === null) && (!obj2 || obj2 === null)) {
        return obj1 === obj2;
    }

    if ((!obj1 && obj2) || (obj1 && !obj2)) {
        return false;
    }

    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        obj1 =
            typeof obj1 === "object"
                ? JSON.stringify(obj1, Object.keys(obj1).sort())
                : obj1;
        obj2 =
            typeof obj2 === "object"
                ? JSON.stringify(obj2, Object.keys(obj2).sort())
                : obj2;
        return obj1 === obj2;
    }

    let diff1 = diff(obj1, obj2);
    let diff2 = diff(obj2, obj1);
    if (Object.keys(diff1).length === 0 && Object.keys(diff2).length === 0) {
        return true;
    }
    return false;
}

function le(obj1, obj2) {
    /**
     * Checks if the first object is less than or equal to the second object
     * @param {Object} obj1 - The first object
     */
    return isSame(obj1, obj2) || lt(obj1, obj2);
}

function ge(obj1, obj2) {
    /**
     * Checks if the first object is more than or equal to the second object
     * @param {Object} obj1 - The first object
     */
    return isSame(obj1, obj2) || gt(obj1, obj2);
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

    // Deal with undefined
    let c1 = obj1 === undefined || obj1 === null;
    let c2 = obj2 === undefined || obj2 === null;
    if (c1 && !c2) {
        return true;
    }
    if (!c1 && c2) {
        return false;
    }
    if (c1 && c2) {
        return false;
    }

    // Deal with non object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        if (typeof obj1.getMonth !== "function" && typeof obj1 !== "number") {
            obj1 = JSON.stringify(obj1, Object.keys(obj1).sort());
        }

        if (typeof obj2.getMonth !== "function" && typeof obj2 !== "number") {
            obj2 = JSON.stringify(obj2, Object.keys(obj2).sort());
        }

        return obj1 < obj2;
    }

    // Deal with  object
    if (obj1["@type"] !== obj2["@type"]) {
        return obj1["@type"] < obj2["@type"];
    }
    if (obj1["@id"] !== obj2["@id"]) {
        return obj1["@id"] < obj2["@id"];
    }
    return false;
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

    // Deal with undefined
    let c1 = obj1 === undefined || obj1 === null;
    let c2 = obj2 === undefined || obj2 === null;
    if (!c1 && c2) {
        return true;
    }
    if (c1 && !c2) {
        return false;
    }
    if (c1 && c2) {
        return false;
    }

    // Deal with non object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        if (typeof obj1.getMonth !== "function" && typeof obj1 !== "number") {
            obj1 = JSON.stringify(obj1, Object.keys(obj1).sort());
        }

        if (typeof obj2.getMonth !== "function" && typeof obj2 !== "number") {
            obj2 = JSON.stringify(obj2, Object.keys(obj2).sort());
        }

        return obj1 > obj2;
    }

    // Deal with object
    if (obj1["@type"] !== obj2["@type"]) {
        return obj1["@type"] > obj2["@type"];
    }
    if (obj1["@id"] !== obj2["@id"]) {
        return obj1["@id"] > obj2["@id"];
    }

    return false;
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

    // Deal with undefined
    if (obj1 === undefined || obj2 === undefined) {
        return obj1 === obj2;
    }
    // Deal with null
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    // Deal with array
    if (Array.isArray(obj1) || Array.isArray(obj2)) {
        obj1 = Array.isArray(obj1) ? obj1 : [obj1];
        obj2 = Array.isArray(obj2) ? obj2 : [obj2];
        if (obj1.length !== obj2.length) {
            return false;
        }

        for (let o1 of obj1) {
            if (valueContains(obj2, o1) === false) {
                return false;
            }
        }
        for (let o2 of obj2) {
            if (valueContains(obj1, o2) === false) {
                return false;
            }
        }
        return true;
    }

    // Deal with non-object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        return obj1 == obj2;
    }

    // Deal with object
    let ref1 = getRef(obj1);
    let ref2 = getRef(obj2);

    if (ref1?.["@type"] === undefined || ref2?.["@type"] === undefined) {
        return false;
    }
    if (ref1?.["@id"] === undefined || ref2?.["@id"] === undefined) {
        return false;
    }

    if (ref1?.["@type"] !== ref2?.["@type"]) {
        return false;
    }
    if (ref1?.["@id"] !== ref2?.["@id"]) {
        return false;
    }

    return true;
}

function isNull(obj) {
    /**
     * Checks if an object is null
     * @param {Object} obj - The object to check
     * @returns {Boolean} - True if the object is null, false otherwise
     * @example isNull(null) // true
     */

    if (Array.isArray(obj)) {
        return obj.length === 0;
    }

    if (isJsonldObject(obj) === false) {
        return (obj === null || obj === undefined) && obj !== 0;
    }

    obj = clean(obj);

    let keys = Object.keys(obj) || [];
    keys = keys.filter((x) => x.startsWith("@") === false);

    let result = keys.length === 0;

    return result;
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

    // Deal with undefined
    if (
        obj1 === undefined ||
        obj1 === null ||
        obj2 === undefined ||
        obj2 === null
    ) {
        return obj1;
    }

    // Deal with non object
    if (isJsonldObject(obj1) === false || isJsonldObject(obj2) === false) {
        return undefined;
    }

    let diff = {};
    for (let k of Object.keys(obj1)) {
        let values = obj1?.[k];
        values = Array.isArray(values) ? values : [values];
        for (let v of values) {
            if (valueContains(obj2?.[k], v) === false) {
                diff[k] = diff[k] || [];
                diff[k].push(v);
            }
        }
    }

    return diff;
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

    if (
        isJsonldObject(record1) === false ||
        isJsonldObject(record2) === false
    ) {
        return undefined;
    }

    if (isSame(record1, record2) === false) {
        return undefined;
    }

    let mergedRecord = getRef(record1);

    for (let k of Object.keys(record1)) {
        let values1 = ph.values.get(record1, k, []);
        mergedRecord = ph.value.add(mergedRecord, k, values1, true);
    }

    for (let k of Object.keys(record2)) {
        let values2 = ph.values.get(record2, k, []);
        mergedRecord = ph.value.add(mergedRecord, k, values2, true);
    }

    // Clean the record
    mergedRecord = clean(mergedRecord);

    return mergedRecord;
}

// -----------------------------------------------------
//  Hygiene
// -----------------------------------------------------

function clean(record) {
    /**
     * Cleans a record
     * @param {Object} record - The record to clean
     * @returns {Object} - The cleaned record
     *
     */
    if (Array.isArray(record)) {
        if (record.length === 0) {
            return undefined;
        }
        if (record.length === 1) {
            return clean(record[0]);
        }
        return record.map((x) => clean(x));
    }

    if (isJsonldObject(record) === false) {
        return record;
    }

    let newRecord = getRef(record);
    for (let k of Object.keys(record)) {
        let values = clean(record?.[k]);
        if (values !== undefined) {
            newRecord[k] = values;
        }
    }

    return newRecord;
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
        return [];
    }

    // Deal with array
    if (Array.isArray(obj)) {
        let records = [];
        for (let record of obj) {
            let nestedRecords = getNestedRecords(record);
            nestedRecords = nestedRecords.filter(
                (x) => x !== undefined && x != [],
            );
            nestedRecords.map((x) => records.push(x));
        }

        return records;
    }

    // Deal with non-object
    if (typeof obj !== "object") {
        return [];
    }

    // Deal with non-array
    obj = setID(obj);

    let records = [];

    for (let key in obj) {
        let values = obj[key] || [];

        values = Array.isArray(values) ? values : [values];

        for (let value of values) {
            if (value?.["@type"] !== undefined && value?.["@type"] !== null) {
                records.push(value);
            }

            let nestedRecords = getNestedRecords(value);
            nestedRecords.map((x) => records.push(x));
        }
    }

    // Return the final flattened result object
    records = records.filter((x) => x !== undefined && x !== null);
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
        return obj;
    }

    // Deal with array
    if (Array.isArray(obj)) {
        return obj.map((x) => changeNestedRecordsToRef(x));
    }

    // Deal with non-object
    if (typeof obj !== "object" && !Array.isArray(obj)) {
        return obj;
    }

    // Deal with object
    let newRecord = {};

    for (let key in obj) {
        let values = obj[key];
        values = Array.isArray(values) ? values : [values];

        let newValues = [];
        for (let value of values) {
            if (value?.["@type"] !== undefined && value?.["@type"] !== null)
                newValues.push(getRef(value));
            else newValues.push(changeNestedRecordsToRef(value));
        }
        if (newValues.length === 0) {
            newValues = undefined;
        } else if (newValues.length === 1) {
            newValues = newValues[0];
        }
        newRecord[key] = newValues;
    }
    return newRecord;
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
        return obj;
    }

    // Deal with array
    if (Array.isArray(obj)) {
        let records = [];
        for (let record of obj) {
            let nestedRecords = flattenObject(record);
            nestedRecords = nestedRecords.filter(
                (x) => x !== undefined && x != [],
            );
            nestedRecords.map((x) => records.push(x));
        }
        return records;
    }

    // Deal with non-object
    if (typeof obj !== "object" && !Array.isArray(obj)) {
        return obj;
    }

    // Deal with object
    let records = [obj];
    let nestedRecords = getNestedRecords(obj);
    nestedRecords = nestedRecords.filter((x) => x !== undefined && x != []);
    nestedRecords.map((x) => (records = ah.add(x, records, true)));
    records = records.map((x) => changeNestedRecordsToRef(x));
    return records;
}

function unFlattenObject(obj, records, previousRecords = [], count = 0) {
    /**
     * Unflattens an object from a list of records
     * Only adds records on existing attributes. Does not add new attributes
     * @param {Object} obj - The object to unflatten
     * @param {Array} records - The list of records
     * @returns {Object} - The unflattened object
     * @example unFlattenObject({name: "John Doe", address: {@id: "1234567890"}}, [{@id: "1234567890", street: "1
     * 23 Main St", city: "Anytown"}]) // {name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "123456
     * 7890"}}
     *
     */
    // Rebuilds the object from the flattened representation


    // Arbitrary catch all
    if (count > 500) {
        return obj;
    }

    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return obj;
    }

    // Deal with array
    if (Array.isArray(obj)) {
        return obj.map((x) =>
            unFlattenObject(x, records, previousRecords, (count += 1)),
        );
    }

    // Deal with non-object
    if (typeof obj !== "object" && !Array.isArray(obj)) {
        return obj;
    }

    // Ensure records is array
    records = Array.isArray(records) ? records : [records];

    // Deal with object
    let newRecord = {};
    for (let key in obj) {
        
        let values = obj[key];
        
        values = Array.isArray(values) ? values : [values];
        
        let newValues = [];
        
        for (let value of values) {
            if (isJsonldObject(value)) {
                
                // Auto-assign if self-reference
                if (isSame(value, obj)) {
                    newValues.push(value)
                    continue
                }

                // Assign from list if already done
                if (ah.contains(value, previousRecords) === true) {
                    newValues.push(value)
                    continue
                }

                // Process
                previousRecords.push(value);
                let record = ah.get(value, records);
                newValues.push(
                    unFlattenObject(
                        record,
                        records,
                        previousRecords,
                        (count += 1),
                    ) || value,
                );
            } else {
                newValues.push(
                    unFlattenObject(value, records, previousRecords, count)
                );
                newRecord[key] = newValues;
            }
        }
        if (newValues.length === 0) {
            newValues = undefined;
        } else if (newValues.length === 1) {
            newValues = newValues[0];
        }
        newRecord[key] = newValues;
    }
    return newRecord;
}
