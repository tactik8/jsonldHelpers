import { PropertyHelpers as ph } from "../propertyHelpers/propertyHelpers.models.js";
import { ArrayHelpers as ah } from "../arrayHelpers/arrayHelpers.models.js";

import { UtilHelpers as h } from "../utilHelpers/utilHelpers.models.js";
import { SchemaOrgHelpers } from "../schemaOrgHelpers/schemaOrgHelpers.models.js";

export const services = {
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
    eq_loose: isSame,
    eq_strict: eq,
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

// -----------------------------------------------------
//  Record operations and tests
// -----------------------------------------------------

/**
 * Creates a new record
 * @param {String} record_type - The type of the record
 * @param {String} record_id - The id of the record
 * @returns {Object} - The new record
 * @example thing("Person", "John Doe") // {name: "John Doe", "@id": "1234567890"}
 * @example thing("Person") // {name: "John Doe", "@id": "1234567890"}
 */

function thing(record_type = "Thing", record_id) {
    let record = {
        "@context": "https://schema.org/",
        "@type": record_type,
        "@id": record_id || h.uuid.new(),
    };

    return record;
}

/**
 * Sets the ID of an object if it does not have one
 * @param {Object} obj - The object to set the ID of
 * @returns {Object} - The object with the ID set
 * @example setID({name: "John Doe"}) // {name: "John Doe", "@id": "1234567890"}
 */
function setID(obj, defaultValue) {
    // Deal with array
    if (Array.isArray(obj)) {
        return obj.map((x) => setID(x, defaultValue));
    }

    // Deal with non-object
    if (isJsonldObject(obj) === false) {
        if (defaultValue) {
            return defaultValue;
        } else {
            throw "Invalid object";
        }
    }

    // Deal with object
    let record_type = obj?.["@type"];
    record_type = Array.isArray(record_type) ? record_type[0] : record_type
    
    let record_id = obj?.["@id"];

    if (!record_id || record_id === null) {
        obj["@id"] = "_" + h.uuid.new() + "#" + String(record_type);
    }

    return obj;
}

/**
 * Checks if an object is a JSON-LD object
 * @param {Object} obj - The object to check
 * @returns {Boolean} - True if the object is a JSON-LD object, false otherwise
 * @example isJsonldObject({@id: "John Doe", name: "John Doe"}) // true
 * @example isJsonldObject({name: "John Doe"}) // false
 */
function isJsonldObject(obj) {
    // Deal with non-object
    if (typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    }

    let record_type = obj?.["@type"];
    let record_id = obj?.["@id"];
    if (!record_type || record_type === null) {
        return false;
    }

    return true;
}

/**
 * Checks if an object contains another object
 * @param {Object} obj1 - The object to check
 * @param {Object} obj2 - The object to check for
 * @returns {Boolean} - True if the object contains the other object, false otherwise
 * @example contains({name: "John Doe", address: {street: "123 Main St", city: "Anytown"}}, {street: "123 Main St", city: "Anytown"}) // true
 *
 */
function valueContains(values, value) {
    values = Array.isArray(values) ? values : [values];
    for (let v of values) {
        if (isSame(v, value)) {
            return true;
        }
    }
    return false;
}

/**
 * Gets the reference object of an object
 * @param {Object} obj - The object to get the reference object of
 * @returns {Object} - The reference object
 * @example getRef({name: "John Doe", "@id": "1234567890"}) // {@id: "1234567890"}
 * @example getRef({name: "John Doe"}) // undefined
 */
function getRef(obj) {
    // Deal with array
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

/**
 * Sets the reference object of an object
 * @param {Object} obj - The object to set the reference object of
 * @param {Object} ref - The reference object
 * @returns {Object} - The object with the reference object set
 * @example setRef({name: "John Doe"}, {@id: "1234567890"}) // {name: "John Doe", "@id": "1234567890"}
 */
function setRef(obj, ref) {
    obj["@type"] = ref?.["@type"];
    obj["@id"] = ref?.["@id"];

    return obj;
}

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
function valueMeetsFilterParams(value, param, strict = true) {

    let conditions = [];

    // Deal with array of values
    if (Array.isArray(value)) {
        let results = value.map((x) =>
            valueMeetsFilterParams(x, param, strict),
        );

        return results.some((x) => x === true);
    }

    // Deal with array of params
    if (Array.isArray(param) && strict == false) {
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
        console.log('ppppp')
        let result = valueContains(value, param["$contains"]);
        console.log('ll', result, value, param["$contains"])
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
function meetsFilterParams(
    record,
    filterParams,
    negativeFilterParams,
    strict = true,
) {
    if (isJsonldObject(record) === false) {
        return false;
    }

    // Handle filterParams
    if (filterParams && filterParams != {}) {
        if (valueMeetsFilterParams(record, filterParams, strict) === false) {
            return false;
        }
    }

    // Handle filterParams
    if (negativeFilterParams && negativeFilterParams != {}) {
        if (valueMeetsFilterParams(record, negativeFilterParams, strict) === true) {
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

/**
 * Checks if two objects are equal
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the objects are equal, false otherwise
 * @example eq({name: "John Doe"}, {name: "John Doe"}) // true
 * @example eq({name: "John Doe"}, {name: "Jane Doe"}) // false
 */
function eq(obj1, obj2) {
    // Deal with undefined
    if ((!obj1 || obj1 === null) && (!obj2 || obj2 === null)) {
        return obj1 === obj2;
    }

    // Deal with null
    if ((!obj1 && obj2) || (obj1 && !obj2)) {
        return false;
    }

    // Deal with non-object
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

    // Deal with object
    let diff1 = diff(obj1, obj2);
    let diff2 = diff(obj2, obj1);
    if (Object.keys(diff1).length === 0 && Object.keys(diff2).length === 0) {
        return true;
    }
    return false;
}

/**
 * Checks if the first object is less than or equal to the second object
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the first object is less than or equal to the second object, false otherwise
 */
function le(obj1, obj2) {
    return isSame(obj1, obj2) || lt(obj1, obj2);
}

/**
 * Checks if the first object is more than or equal to the second object
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the first object is more than or equal to the second object, false otherwise
 */
function ge(obj1, obj2) {
    return isSame(obj1, obj2) || gt(obj1, obj2);
}

/**
 * Checks if the first object is less than the second object
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the first object is less than the second object, false otherwise
 * @example lt({name: "John Doe"}, {name: "Jane Doe"}) // true
 * @example lt({name: "John Doe"}, {name: "John Doe"}) // false
 *
 */
function lt(obj1, obj2) {
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

/**
 * Checks if the first object is greater than the second object
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the first object is greater than the second object, false otherwise
 * @example gt({name: "John Doe"}, {name: "Jane Doe"}) // false
 * @example gt({name: "John Doe"}, {name: "John Doe"}) // false
 */
function gt(obj1, obj2) {
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

/**
 * Checks if two objects are the same (type and id or value) or same for non jsonld objects
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Boolean} - True if the objects are the same, false otherwise
 * @example isSame({@id: "John Doe"}, {@id: "John Doe"}) // true
 * @example isSame({name: "John Doe"}, {name: "Jane Doe"}) // false
 *
 */
function isSame(obj1, obj2) {
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

    // Compare record_types
    let types1 = obj1?.["@type"];
    let types2 = obj2?.["@type"];

    types1 = Array.isArray(types1) ? types1 : [types1];
    types2 = Array.isArray(types2) ? types2 : [types2];

    const intersectTypes = types1.filter((value) => types2.includes(value));

    if (intersectTypes.length === 0) {
        return false;
    }

    // Compare record_ids
    let ids1 = obj1?.["@id"];
    let ids2 = obj2?.["@id"];

    ids1 = Array.isArray(ids1) ? ids1 : [ids1];
    ids2 = Array.isArray(ids2) ? ids2 : [ids2];

    const intersectIds = ids1.filter((value) => ids2.includes(value));

    if (intersectIds.length === 0) {
        return false;
    }

    // Return true, all conditions met
    return true;
}

/**
 * Gets the sameAs hash of an object
 * @param {Object} obj - The object to get the sameAs hash of
 * @returns {String} - The sameAs hash of the object
 * A valid identifier is a string or an object with a @type and @id
 */
function getIdentifiers(obj1) {
    // Get sameAs
    let sameAs1 = Array.isArray(obj1?.["sameAs"])
        ? obj1?.["sameAs"]
        : [obj1?.["sameAs"]];
    sameAs1 = sameAs1.filter((x) => x !== undefined);

    // Add self
    sameAs1.push(getRef(obj1));

    // Process identifiers

    let record_types = ph.types.get(obj1);

    let newSameAs = [];
    for (let x of sameAs1) {
        let types = ph.types.get(x);
        let ids = ph.ids.get(x);

        if (types !== undefined && ids !== undefined) {
            for (let t of types) {
                for (let i of ids) {
                    newSameAs.push(`${t}/${i}`);
                }
            }
        } else {
            // If not object, add record_type to identifier
            for (let t of record_types) {
                newSameAs.push(`${t}/${x}`);
            }
        }
    }

    return newSameAs;
}

/**
 * Checks if an object is null
 * @param {Object} obj - The object to check
 * @returns {Boolean} - True if the object is null, false otherwise
 * @example isNull(null) // true
 * @description an object is null if it has no properties or if it is an array with no elements
 */
function isNull(obj) {
    // Deal with array
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }

    // Deal with non-object
    if (isJsonldObject(obj) === false) {
        return (obj === null || obj === undefined) && obj !== 0;
    }

    // Deal with object
    obj = clean(obj);

    let keys = Object.keys(obj) || [];
    keys = keys.filter((x) => x.startsWith("@") === false);

    let result = keys.length === 0;

    return result;
}

/**
 * Returns values in Obj1 not present in Obj2
 * @param {Object} obj1 - The first object
 * @param {Object} obj2 - The second object
 * @returns {Object} - The difference between the two objects
 * @example diff({name: "John Doe", age: 30}, {name: "John Doe", age: 25}) // {age: 30}
 *
 */
function diff(obj1, obj2) {
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

    // Deal with object
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

/**
 * Merges two records
 * @description Merges two records with same type and id into one record
 * @param {Object} record1 - The first record
 * @param {Object} record2 - The second record
 * @returns {Object} - The merged record
 * @example mergeRecords({name: "John Doe"}, {age: 30}) // {name: "John Doe", age: 30}
 *
 */
function mergeRecords(record1, record2) {
    // Deal with non-object
    if (
        isJsonldObject(record1) === false ||
        isJsonldObject(record2) === false
    ) {
        return undefined;
    }

    // Deal with non-same
    if (isSame(record1, record2) === false) {
        return undefined;
    }

    // Deal with object
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

/**
 * Cleans a record
 * @description Removes empty arrays, arrays on one and undefined values
 * @param {Object} record - The record to clean
 * @returns {Object} - The cleaned record
 *
 */
function clean(record, deepClean = true) {
    // Deal with array
    if (Array.isArray(record)) {

        record = record.map((x) => x !== undefined);
        
        if (record.length === 0) {
            return undefined;
        }
        if (record.length === 1) {
            return clean(record[0]);
        }
        return record.map((x) => clean(x));
    }

    // Deal with non-object
    if (isJsonldObject(record) === false) {
        return record;
    }

    // Deal with object
    if(deepClean === true){
        record = _cleanRecordIds(record)
        record = SchemaOrgHelpers.parentChild.set(record)
    }

    // Clean type and id
    let record_types = ph.record_types.get(record)
    if(record_types.length === 1){
        record["@type"] = record_types[0]
    }

    let record_ids = ph.record_ids.get(record)
    if(record_ids.length === 1){
        record["@id"] = record_ids[0]
    }

    // Clean values
    let newRecord = {}
    for (let k of Object.keys(record)) {

        // Skip @ keys
        if(k.startsWith('@')){
            newRecord[k] = record[k]
            continue;
        }
        
        let values = clean(record?.[k]);
        if (values !== undefined) {
            newRecord[k] = values;
        }
    }

    return newRecord;
}


function _cleanRecordIds(record){

    // Deal with array
    if(Array.isArray(record)){
        return record.map((x) => _cleanRecordIds(x))
    }

    // Deal with non-object
    if (isJsonldObject(record) === false){
        return record
    }
    
    // Deal with record
    let old_record_ids = ph.record_ids.get(record)
    let record_types = ph.record_types.get(record)
    let new_record_id = SchemaOrgHelpers.record_id.get(record)

    // Change record_id if new id doesn't tart with "_"
    if(new_record_id.startsWith('_') === false){

        if(old_record_ids.includes(new_record_id) === false){
            for(let old_record_id of old_record_ids){
                record = ph.record_id.replace(record, record_types, old_record_id, new_record_id)
            }
        }
    }
    
    // Clean values
    for(let k of Object.keys(record)){
            record[k] = _cleanRecordIds(record[k])
    }
    

    
    return record

}


// -----------------------------------------------------
//  Nested values
// -----------------------------------------------------

/**
 * Gets all nested records from an object
 * @param {Object} obj - The object to get the nested records from
 * @returns {Array} - The nested records
 * @example getNestedRecords({name: "John Doe", address: {street: "123 Main St", city: "Anytown"}}) // [{street: "123 Main St", city: "Anytown"}]
 * @example getNestedRecords({name: "John Doe", address: [{street: "123 Main St", city: "Anytown"}, {street: "456 Main St", city: "Anytown"}]})
 */
function getNestedRecords(obj) {
    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return [];
    }

    // Deal with array
    if (Array.isArray(obj)) {
        let records = [];
        for (let record of obj) {
            // Recurse
            let nestedRecords = getNestedRecords(record);

            // Remove undefined and empty arrays
            nestedRecords = nestedRecords.filter(
                (x) => x !== undefined && x != [],
            );

            // Add nested records to list
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
            // Add vali jsonld values to list
            if (isJsonldObject(value) === true) {
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

/**
 * Changes all nested records to references
 * @param {Object} obj - The object to change the nested records to references
 * @returns {Object} - The object with the nested records changed to references
 * @example changeNestedRecordsToRef({name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "1234567890"}}) //
 * {name: "John Doe", address: {@id: "1234567890"}}
 */
function changeNestedRecordsToRef(obj, skipUtilityClasses = true) {
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
            // If valid record and not utility class, change to ref
            if (
                isJsonldObject(value) === true &&
                SchemaOrgHelpers.flatten.isExceptionClass(value) === false
            ) {
                newValues.push(getRef(value));
            } else {
                newValues.push(changeNestedRecordsToRef(value));
            }
        }

        // Clean up values
        if (newValues.length === 0) {
            newValues = undefined;
        } else if (newValues.length === 1) {
            newValues = newValues[0];
        }

        // Assign values
        newRecord[key] = newValues;
    }
    return newRecord;
}

/**
 * Flattens an object into a list of records, replacing nested objects with their refs
 * @param {Object} obj - The object to flatten
 * @returns {Array} - The flattened object
 * @example flattenObject({name: "John Doe", address: {street: "123 Main St", city: "Anytown", "@id": "1234567890"}})
 * @description Flattens an object into a list of records, replacing nested objects with their refs. Does not flatten utility classes.
 */

function flattenObject(obj, skipUtilityClasses = true) {
    // Deal with null or undefined
    if (obj === undefined || obj === null) {
        return obj;
    }

    // set id
    obj = setID(obj)

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

    // Get nested records (childs)
    let nestedRecords = getNestedRecords(obj);

    // Remove undefined and empty arrays
    nestedRecords = nestedRecords.filter((x) => x !== undefined && x != []);

    // Remove utility classes
    if (skipUtilityClasses === true) {
        nestedRecords = nestedRecords.filter(
            (x) => SchemaOrgHelpers.flatten.isExceptionClass(x) === false,
        );
    }

    // Add nested records to list
    nestedRecords.map((x) => (records = ah.add(x, records, true)));

    // Change child records to ref
    records = records.map((x) =>
        changeNestedRecordsToRef(x, skipUtilityClasses),
    );

    return records;
}

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
function unFlattenObject(obj, records, previousRecords = [], count = 0) {
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
                    newValues.push(value);
                    continue;
                }

                // Assign from list if already donen ( to avoid infinite recursion)
                if (ah.contains(value, previousRecords) === true) {
                    newValues.push(value);
                    continue;
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
                    unFlattenObject(value, records, previousRecords, count),
                );
                newRecord[key] = newValues;
            }
        }

        // Clean up values
        if (newValues.length === 0) {
            newValues = undefined;
        } else if (newValues.length === 1) {
            newValues = newValues[0];
        }

        // Assign values
        newRecord[key] = newValues;
    }

    return newRecord;
}


