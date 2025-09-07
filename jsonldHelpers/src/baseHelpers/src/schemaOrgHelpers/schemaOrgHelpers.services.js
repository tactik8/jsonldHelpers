import { UtilHelpers as h } from "../utilHelpers/utilHelpers.models.js";

/**
 * @module schemaOrgHelpers/services
 * @description Provides services for schema.org helpers.
 * @exports services
 * record_id:
 *     - get: get record id from record
 *     - set: set record id for record
 * flatten:
 *     - isExceptionClass: check if record should not be flattened
 *     - exceptionClasses: list of classes that should not be flattened
 *     - getExceptionProperty: check if property should not be flattened
 *     - exceptionProperties: list of properties that should not be flattened
 */

export const services = {
    record_id: {
        get: getRecordId,
        set: setRecordId,
    },
    flatten: {
        isExceptionClass: isflattenClassException,
        exceptionClasses: flattenClassExceptions,
        isExceptionProperty: isFlattenPropertyException,
        exceptionProperties: flattenPropertyExceptions,
        property: {
            isException: isFlattenPropertyException,
            exceptions: flattenPropertyExceptions,
        },
        class: {
            isException: isflattenClassException,
            exceptions: flattenClassExceptions,
        },
    },
    parentChild: {
        getException: isParentChildException,
        isException: parentChildExceptions,
        exceptions: parentChildExceptions,
        set: setParentChildExceptions
    },
};

/**
 * @function setRecordId
 * @description Sets the record id for a record
 * @param {Object} record - The record to set the id for
 * @returns {Object} - The record with the id set
 *
 */
function setRecordId(record) {
    let record_id = getRecordId(record);
    record["@id"] = record_id;
    return record;
}

/**
 * @function getRecordId
 * @description Gets the computed record id for a record
 * @param {Object} record - The record to get the id for
 * @returns {String} - The record id
 */
function getRecordId(record) {
    // Get record_types
    let record_types = _getRecordTypes(record);

    if (!record_types) {
        return undefined;
    }

    let record_id;

    // Get id method
    let m = _getIdMethod(record);

    // assign method
    if (m == "url") {
        record_id = _getRecordIdFromUrl(record);
    }

    if (m == "uuid") {
        record_id = _getRecordIdFromUuid(record);
    }

    if (m == "email") {
        record_id = _getRecordIdFromEmail(record);
    }

    return record_id || _getRecordIdFromUuid(record);
}

/**
 * @function _getRecordIdFromUrl
 * @description Gets the record id from the url
 * @param {Object} record - The record to get the id for
 * @returns {String} - The record id
 */
function _getRecordIdFromUrl(record) {
    let record_types = _getRecordTypes(record);
    let record_type = record_types?.[0]

    let prefix = h.url.base.get(record?.url?.["0"] || record?.url); 
    prefix = Array.isArray(prefix) ? prefix[0] : prefix;
    prefix = prefix || '_' + h.uuid.get() 
    
    prefix = prefix || '_' + h.uuid.get() 

    let suffix = String(record_type);

    let record_id = prefix + "#" + suffix

    return record_id;
}

/**
 * @function _getRecordIdFromUuid
 * @description Gets the record id from the uuid
 * @param {Object} record - The record to get the id for
 * @returns {String} - The record id
 */
function _getRecordIdFromUuid(record) {
    let record_types = _getRecordTypes(record);
    let record_type = record_types?.[0]


    let prefix = "_" + h.uuid.get() 
    let suffix = String(record_type);
    
    let record_id = prefix + "#" + suffix
    
    return record_id
}

/**
 * @function _getRecordIdFromEmail
 * @description Gets the record id from the email
 * @param {Object} record - The record to get the id for
 * @returns {String} - The record id
 */
function _getRecordIdFromEmail(record) {

    let record_types = _getRecordTypes(record);
    let record_type = record_types?.[0]
    
    let prefix = record?.email;    
    prefix = Array.isArray(prefix) ? prefix[0] : prefix;
    prefix = prefix || '_' + h.uuid.get() 


    let suffix = String(record_type);

    let record_id = prefix + "#" + suffix
    
    return record_id
}

/**
 * @function _getRecordTypes
 * @description Gets the record types for a record
 * @param {Object} record - The record to get the types for
 * @returns {Array} - The record types
 */
function _getRecordTypes(record) {
    let record_types = record?.["@type"];

    if (!record_types) {
        return undefined;
    }

    record_types = Array.isArray(record_types) ? record_types : [record_types];
    record_types = record_types.map((x) => x.toLowerCase());

    return record_types;
}

/**
 * @function _getIdMethod
 * @description Gets the id method for a record
 * @param {Object} record - The record to get the id method for
 * @returns {String} - The id method
 */
function _getIdMethod(record) {
    let record_types = _getRecordTypes(record);

    for (let t of record_types) {
        if (t.includes("web")) {
            return "url";
        }

        if (t.includes("action")) {
            return "uuid";
        }

        if (t.includes("person")) {
            return "email";
        }

        if (t.includes("organization")) {
            return "url";
        }
    }

    return "uuid";
}

/**
 * @function isFlattenPropertyException
 * @description Checks if a property should not be flattened
 * @param {Object} record - The record to check
 * @param {String} property - The property to check
 * @returns {Boolean} - True if the property should not be flattened, false otherwise
 *
 */
function isFlattenPropertyException(record_type_or_record, property) {
    let record_types =
        record_type_or_record?.["@type"] || record_type_or_record;
    record_types = Array.isArray(record_types) ? record_types : [record_types];
    record_types = record_types.map((x) => x.toLowerCase());

    let exceptions = flattenPropertyExceptions();

    for (let t of record_types) {
        // Check in All

        let eAll = exceptions[t] || exceptions["All"];
        if (eAll.includes(property)) {
            return true;
        }

        // Check for specific record type
        let eType = exceptions[t] || [];
        if (eType.includes(property)) {
            return true;
        }
    }

    return false;
}

/**
 * @function flattenPropertyExceptions
 * @description Gets the list of properties that should not be flattened
 * @returns {Object} - The list of properties that should not be flattened
 */
function flattenPropertyExceptions() {
    let exceptions = {
        All: [
            "propertyValue",
            "value",
            "valueReference",
            "unitCode",
            "unitText",
            "minValue",
            "maxValue",
        ],
        Offer: ["itemOffered"],
    };

    return exceptions;
}

/**
 * @function isflattenClassException
 * @description Checks if a child record should not be flattened
 * @param {Object} record - The record to check
 * @returns {Boolean} - True if the record is a utility object, false otherwise
 */
function isflattenClassException(record) {

    let record_types = record?.["@type"] || [];
    record_types = Array.isArray(record_types) ? record_types : [record_types];

    let utility_classes = flattenClassExceptions();

    for (let t of record_types) {
        t = t.toLowerCase();
        utility_classes = utility_classes.map((x) => x.toLowerCase());

        if (utility_classes.includes(t)) {
            return true;
        }
    }
    return false;
}

/**
 * @function flattenClassExceptions
 * @description Gets the list of children classes that should not be flattened
 * @returns {Array} - The list of classes that should not be flattened
 * @description Gets the list of classes that should not be flattened
 */
function flattenClassExceptions() {
    let c = [
        "AggregateRating",
        "ImageObject",
        "QuantitativeValue",
        "MonetaryAmount",
        "PropertyValue",
        "UnitPriceSpecification",
        "Offer",
        "AggregateOffer",
        "AggregateDemand",
        "PriceSpecification",
        "OfferItem",
        "DemandItem",
    ];

    return c;
}




/**
 * @function setParentChildExceptions
 * @description Sets the parent child exceptions for a record. For example, will set the itemReviewed property for a review record under a product record to maintain two way references.
 * @param {Object} record - The record to set the parent child exceptions for
 * @returns {Object} - The record with the parent child exceptions set
 */

function setParentChildExceptions(record){

    if(!record){
        return record
    }

    if(Array.isArray(record)){
        return record.map(x => setParentChildExceptions(x))
    }

    if(typeof record !== 'object'){
        return record
    }

    
    for(let k of Object.keys(record)){

        let v = record?.[k]

        if(Array.isArray(v)){
            for(let i = 0; i < v.length; i++){
                let v1 = v[i]
                let inverseProperty = isParentChildException(record, k, v1)
                if(inverseProperty){
                    v1[inverseProperty] = _setValue(record, inverseProperty, _getRef(record))
                } else {
                    v[i] = setParentChildExceptions(v1)
                }
            }
        } else {
            let inverseProperty = isParentChildException(record, k, v)
            if(inverseProperty){
                v[inverseProperty] = _setValue(record, inverseProperty, _getRef(record))
            } else {
                record[k] = setParentChildExceptions(v)
            }
        }
    }

    return record
    
}

/**
 * @function getParentChildException
 * @description Checks if a child record should add a reference to its parent record
 * @param {Object} parentRecord - The parent record to check
 * @param {String} property - The property to check
 * @param {Object} childRecord - The child record to check
 * @returns {String} - The inverse property to use for the reference or undefined if not an exception
 * 
 *
 */
function isParentChildException(parentRecord, property, childRecord) {
    let parentRecord_types = parentRecord?.["@type"] || [];
    parentRecord_types = Array.isArray(parentRecord_types)
        ? parentRecord_types
        : [parentRecord_types];
    parentRecord_types = parentRecord_types.map((x) => x.toLowerCase());

    let exceptions = parentChildExceptions();

    for (let t of parentRecord_types) {
        
        let e = exceptions?.[t] || [];

        let childrenClasses = _getRecordTypes(childRecord)
        
        let e1 = e.filter((x) => x.property == property && x?.childrenClass && childrenClasses.includes(x?.childrenClass))

        if (e1.length > 0){
            return e1?.inverseProperty;
        }
        
    }

    return undefined;
}

/**
 * @function parentChildExceptions
 * @description Gets the list of properties that should not add a reference to their parent record
 * @returns {Object} - The list of properties that should not add a reference to their parent record
 *
 */
function parentChildExceptions() {
    let exceptions = {
        product: [
            {
                property: "review",
                childrenClass: "Review",
                inverseProperty: "itemReviewed",
            },
            {
                property: "aggregateRating",
                childrenClass: "AggregateRating",
                inverseProperty: "itemReviewed"
            },
            {
                property: "offers",
                childrenClass: "Offer",
                inverseProperty: "itemOffered"
            }
        ],
        All: [
            {
                property: "review",
                childrenClass: "Review",
                inverseProperty: "itemReviewed",
            },
            {
                property: "aggregateRating",
                childrenClass: "AggregateRating",
                inverseProperty: "itemReviewed"
            },
            {
                property: "offers",
                childrenClass: "Offer",
                inverseProperty: "itemOffered"
            }
        ]
    };

    return exceptions;
}


/**
 * @function _getRef
 * @description Gets the reference for a record
 * @param {Object} record - The record to get the reference for
 * @returns {Object} - The reference for the record
 * @description Gets the reference for a record
 */
function _getRef(record){
    let ref = {
        "@type": record?.["@type"],
        "@id": record?.["@id"],
    }

    if(!ref["@type"] || !ref["@id"]){
        return undefined
    }

    return ref
}


/**
 * @function _addValue
 * @description Adds a value to a record
 * @param {Object} record - The record to add the value to
 * @param {String} property - The property to add the value to
 * @param {*} value - The value to add
 * @returns {Object} - The record with the value added
 * 
 */
function _addValue(record, property, value){

    let v = record?.[property]

    if(!v){
        record[property] = value
        return record
    }

    if(Array.isArray(v)){
        record[property].push(value)
        return record
    }

    record[property] = [v, value]
    return record

    
}